#!/bin/bash
#===============================================================================
# R-Paper 프론트엔드 배포 스크립트
# 
# 용도: 프론트엔드를 빌드하고 홈서버(/srv/r-paper-web)에 배포
# 대상: Ubuntu 서버 (Nginx + Let's Encrypt)
# 
# 사용법:
#   로컬에서 빌드 후 서버로 전송:  ./deploy-frontend.sh --build-and-upload
#   서버에서 직접 배포:            ./deploy-frontend.sh --deploy-local
#   전체 과정 (빌드+업로드+배포):  ./deploy-frontend.sh --full
#
# 주의: 
#   - 기존 데이터는 절대 삭제하지 않음 (백업 후 교체)
#   - Nginx 설정이 이미 존재해야 함
#===============================================================================

set -e  # 에러 발생 시 스크립트 중단

#-------------------------------------------------------------------------------
# 설정 변수 (필요시 수정)
#-------------------------------------------------------------------------------

# 프로젝트 경로 (로컬)
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="${PROJECT_ROOT}/frontend"
BUILD_OUTPUT_DIR="${FRONTEND_DIR}/dist"

# 서버 설정
SERVER_USER="ksh"                          # SSH 사용자명 (수정 필요)
SERVER_HOST="192.168.0.6"       # 서버 호스트 (수정 필요)
SERVER_PORT="22"                           # SSH 포트

# 서버 경로
DEPLOY_BASE="/srv/r-paper-web"
DEPLOY_DIR="${DEPLOY_BASE}/dist"
BACKUP_DIR="${DEPLOY_BASE}/backups"

# Nginx 설정
NGINX_CONF="/etc/nginx/sites-available/r-paper.haroo.site"
NGINX_ENABLED="/etc/nginx/sites-enabled/r-paper.haroo.site"

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

#-------------------------------------------------------------------------------
# 유틸리티 함수
#-------------------------------------------------------------------------------

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo ""
    echo "========================================"
    echo " $1"
    echo "========================================"
    echo ""
}

#-------------------------------------------------------------------------------
# Step 1: 프론트엔드 빌드 (로컬)
#-------------------------------------------------------------------------------
build_frontend() {
    print_header "Step 1: 프론트엔드 빌드"
    
    # 프론트엔드 디렉토리 확인
    if [ ! -d "$FRONTEND_DIR" ]; then
        log_error "프론트엔드 디렉토리를 찾을 수 없습니다: $FRONTEND_DIR"
        exit 1
    fi
    
    cd "$FRONTEND_DIR"
    
    # node_modules 확인 및 설치
    if [ ! -d "node_modules" ]; then
        log_info "의존성 설치 중 (npm install)..."
        npm install
    fi
    
    # 기존 빌드 결과물 정리
    if [ -d "$BUILD_OUTPUT_DIR" ]; then
        log_info "기존 빌드 결과물 정리 중..."
        rm -rf "$BUILD_OUTPUT_DIR"
    fi
    
    # 빌드 실행
    log_info "프로덕션 빌드 실행 중 (npm run build)..."
    npm run build
    
    # 빌드 결과 확인
    if [ ! -d "$BUILD_OUTPUT_DIR" ]; then
        log_error "빌드 실패: dist 디렉토리가 생성되지 않았습니다."
        exit 1
    fi
    
    log_success "빌드 완료! 결과물: $BUILD_OUTPUT_DIR"
    ls -la "$BUILD_OUTPUT_DIR"
}

#-------------------------------------------------------------------------------
# Step 2: 서버로 파일 업로드
#-------------------------------------------------------------------------------
upload_to_server() {
    print_header "Step 2: 서버로 파일 업로드"
    
    # 빌드 결과물 확인
    if [ ! -d "$BUILD_OUTPUT_DIR" ]; then
        log_error "빌드 결과물이 없습니다. 먼저 빌드를 실행하세요."
        exit 1
    fi
    
    # SSH 연결 테스트
    log_info "SSH 연결 테스트 중..."
    if ! ssh -p "$SERVER_PORT" -o ConnectTimeout=10 "$SERVER_USER@$SERVER_HOST" "echo 'SSH 연결 성공'" 2>/dev/null; then
        log_error "SSH 연결 실패. 서버 설정을 확인하세요."
        log_info "SERVER_USER: $SERVER_USER"
        log_info "SERVER_HOST: $SERVER_HOST"
        log_info "SERVER_PORT: $SERVER_PORT"
        exit 1
    fi
    
    # 서버에 배포 디렉토리 생성 (없는 경우)
    log_info "서버 디렉토리 준비 중..."
    ssh -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" "
        mkdir -p $DEPLOY_BASE
        mkdir -p $BACKUP_DIR
    " 2>/dev/null || true
    
    # 빌드 결과물 압축 (Mac 메타데이터 제외)
    log_info "빌드 결과물 압축 중..."
    cd "$FRONTEND_DIR"
    COPYFILE_DISABLE=1 tar -czf dist.tar.gz dist/
    
    # 서버로 전송
    log_info "서버로 파일 전송 중..."
    scp -P "$SERVER_PORT" dist.tar.gz "$SERVER_USER@$SERVER_HOST:/tmp/"
    
    # 로컬 압축 파일 정리
    rm -f dist.tar.gz
    
    log_success "파일 업로드 완료!"
}

#-------------------------------------------------------------------------------
# Step 3: 서버에서 배포 실행
#-------------------------------------------------------------------------------
deploy_on_server() {
    print_header "Step 3: 서버 배포 실행"
    
    log_info "서버에서 배포 스크립트 실행 중..."
    log_info "sudo 비밀번호 입력이 필요할 수 있습니다."
    echo ""
    
    # -t 옵션으로 TTY 할당하여 sudo 비밀번호 입력 가능하게 함
    ssh -t -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" "cd $DEPLOY_BASE && sudo ./deploy-server.sh"
    
    log_success "서버 배포 완료!"
}

#-------------------------------------------------------------------------------
# 롤백 기능
#-------------------------------------------------------------------------------
rollback() {
    print_header "롤백 실행"
    
    ssh -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" bash -s <<REMOTE_SCRIPT
#!/bin/bash
set -e

DEPLOY_DIR="$DEPLOY_DIR"
BACKUP_DIR="$BACKUP_DIR"

echo "[INFO] 사용 가능한 백업 목록:"
ls -lt "\$BACKUP_DIR" | head -10

echo ""
read -p "롤백할 백업 이름을 입력하세요: " BACKUP_NAME

if [ -d "\$BACKUP_DIR/\$BACKUP_NAME" ]; then
    echo "[INFO] 현재 배포본 제거 중..."
    sudo rm -rf "\$DEPLOY_DIR"
    
    echo "[INFO] 백업에서 복원 중..."
    sudo cp -r "\$BACKUP_DIR/\$BACKUP_NAME" "\$DEPLOY_DIR"
    sudo chown -R www-data:www-data "\$DEPLOY_DIR"
    
    echo "[INFO] Nginx 재로드 중..."
    sudo systemctl reload nginx
    
    echo "[SUCCESS] 롤백 완료: \$BACKUP_NAME"
else
    echo "[ERROR] 백업을 찾을 수 없습니다: \$BACKUP_NAME"
    exit 1
fi
REMOTE_SCRIPT
}

#-------------------------------------------------------------------------------
# 메인 실행
#-------------------------------------------------------------------------------
show_help() {
    echo "R-Paper 프론트엔드 배포 스크립트"
    echo ""
    echo "사용법: $0 [옵션]"
    echo ""
    echo "옵션:"
    echo "  --build           로컬에서 빌드만 실행"
    echo "  --upload          빌드된 파일을 서버로 업로드"
    echo "  --deploy          서버에서 배포 실행"
    echo "  --build-and-upload 빌드 후 서버로 업로드"
    echo "  --full            전체 과정 (빌드 → 업로드 → 배포)"
    echo "  --rollback        이전 버전으로 롤백"
    echo "  --help            도움말 표시"
    echo ""
    echo "예시:"
    echo "  $0 --full         # 전체 배포 프로세스 실행"
    echo "  $0 --rollback     # 이전 버전으로 롤백"
}

case "$1" in
    --build)
        build_frontend
        ;;
    --upload)
        upload_to_server
        ;;
    --deploy)
        deploy_on_server
        ;;
    --full)
        build_frontend
        upload_to_server
        deploy_on_server
        ;;
    --rollback)
        rollback
        ;;
    --help)
        show_help
        ;;
    *)
        # 기본 동작: 빌드 + 업로드 + 서버 배포
        build_frontend
        upload_to_server
        deploy_on_server
        ;;
esac
