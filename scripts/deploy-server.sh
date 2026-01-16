#!/bin/bash
#===============================================================================
# R-Paper 서버 배포 스크립트 (서버에서 직접 실행)
# 
# 용도: 이미 업로드된 dist.tar.gz를 배포하거나, Git에서 직접 빌드 후 배포
# 위치: 서버의 /srv/r-paper-web/deploy.sh 또는 원하는 위치
#
# 사용법:
#   ./deploy-server.sh              # /tmp/dist.tar.gz에서 배포
#   ./deploy-server.sh --from-git   # Git에서 최신 코드 pull 후 빌드 및 배포
#   ./deploy-server.sh --rollback   # 이전 버전으로 롤백
#
# 주의: 
#   - sudo 권한 필요
#   - 기존 데이터는 절대 삭제하지 않음 (백업 후 교체)
#===============================================================================

set -e

#-------------------------------------------------------------------------------
# 설정 변수
#-------------------------------------------------------------------------------
DEPLOY_BASE="/srv/r-paper-web"
DEPLOY_DIR="${DEPLOY_BASE}/dist"
BACKUP_DIR="${DEPLOY_BASE}/backups"
GIT_REPO_DIR="/home/shkim/repos/r-paper"  # Git 저장소 경로 (수정 필요)

NGINX_CONF="/etc/nginx/sites-available/r-paper.haroo.site"
NGINX_ENABLED="/etc/nginx/sites-enabled/r-paper.haroo.site"

# 색상
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

#-------------------------------------------------------------------------------
# 공통: 백업 생성
#-------------------------------------------------------------------------------
create_backup() {
    log_info "기존 배포본 백업 중..."
    
    mkdir -p "$BACKUP_DIR"
    
    if [ -d "$DEPLOY_DIR" ]; then
        TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
        BACKUP_NAME="dist_backup_${TIMESTAMP}"
        sudo mv "$DEPLOY_DIR" "$BACKUP_DIR/$BACKUP_NAME"
        log_success "백업 완료: $BACKUP_DIR/$BACKUP_NAME"
        
        # 오래된 백업 정리 (최근 5개만 유지)
        log_info "오래된 백업 정리 중..."
        cd "$BACKUP_DIR"
        ls -dt dist_backup_* 2>/dev/null | tail -n +6 | xargs -r sudo rm -rf
    else
        log_info "기존 배포본 없음 (최초 배포)"
    fi
}

#-------------------------------------------------------------------------------
# 공통: 배포 후 처리
#-------------------------------------------------------------------------------
finalize_deploy() {
    log_info "파일 권한 설정 중..."
    sudo chown -R www-data:www-data "$DEPLOY_DIR"
    sudo chmod -R 755 "$DEPLOY_DIR"
    
    log_info "Nginx 설정 검증 중..."
    if sudo nginx -t; then
        log_info "Nginx 재로드 중..."
        sudo systemctl reload nginx
        log_success "Nginx 재로드 완료!"
    else
        log_error "Nginx 설정에 오류가 있습니다!"
        exit 1
    fi
    
    log_info "배포 검증 중..."
    sleep 2
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:80 | grep -qE "200|301|302"; then
        log_success "헬스체크 통과!"
    else
        log_warning "헬스체크 실패 (Nginx 설정 확인 필요)"
    fi
    
    echo ""
    log_success "========================================"
    log_success " 배포 완료!"
    log_success "========================================"
    echo ""
    echo " 접속 URL: https://r-paper.haroo.site"
    echo " 배포 경로: $DEPLOY_DIR"
    echo ""
}

#-------------------------------------------------------------------------------
# 방법 1: /tmp/dist.tar.gz에서 배포
#-------------------------------------------------------------------------------
deploy_from_archive() {
    log_info "압축 파일에서 배포 시작..."
    
    ARCHIVE="/tmp/dist.tar.gz"
    
    if [ ! -f "$ARCHIVE" ]; then
        log_error "압축 파일을 찾을 수 없습니다: $ARCHIVE"
        log_info "로컬에서 먼저 업로드해주세요."
        exit 1
    fi
    
    # 백업 생성
    create_backup
    
    # 압축 해제 및 배치
    log_info "압축 해제 중..."
    cd /tmp
    tar -xzf dist.tar.gz
    sudo mv dist "$DEPLOY_DIR"
    rm -f dist.tar.gz
    
    log_success "파일 배치 완료: $DEPLOY_DIR"
    ls -la "$DEPLOY_DIR"
    
    # 마무리
    finalize_deploy
}

#-------------------------------------------------------------------------------
# 방법 2: Git에서 직접 빌드 후 배포
#-------------------------------------------------------------------------------
deploy_from_git() {
    log_info "Git에서 빌드 후 배포 시작..."
    
    if [ ! -d "$GIT_REPO_DIR" ]; then
        log_error "Git 저장소를 찾을 수 없습니다: $GIT_REPO_DIR"
        log_info "저장소 경로를 확인해주세요."
        exit 1
    fi
    
    cd "$GIT_REPO_DIR"
    
    # 최신 코드 가져오기
    log_info "최신 코드 가져오는 중..."
    git fetch origin
    git pull origin main  # 또는 master
    
    # 프론트엔드 빌드
    cd frontend
    
    log_info "의존성 설치 중..."
    npm install
    
    log_info "프로덕션 빌드 중..."
    npm run build
    
    if [ ! -d "dist" ]; then
        log_error "빌드 실패: dist 디렉토리가 생성되지 않았습니다."
        exit 1
    fi
    
    # 백업 생성
    create_backup
    
    # 빌드 결과물 복사
    log_info "빌드 결과물 배치 중..."
    sudo cp -r dist "$DEPLOY_DIR"
    
    log_success "파일 배치 완료: $DEPLOY_DIR"
    ls -la "$DEPLOY_DIR"
    
    # 마무리
    finalize_deploy
}

#-------------------------------------------------------------------------------
# 롤백
#-------------------------------------------------------------------------------
rollback() {
    log_info "롤백 모드..."
    
    if [ ! -d "$BACKUP_DIR" ]; then
        log_error "백업 디렉토리가 없습니다: $BACKUP_DIR"
        exit 1
    fi
    
    echo ""
    log_info "사용 가능한 백업 목록:"
    ls -lt "$BACKUP_DIR" | head -10
    echo ""
    
    read -p "롤백할 백업 이름을 입력하세요: " BACKUP_NAME
    
    if [ -d "$BACKUP_DIR/$BACKUP_NAME" ]; then
        log_info "현재 배포본 제거 중..."
        sudo rm -rf "$DEPLOY_DIR"
        
        log_info "백업에서 복원 중..."
        sudo cp -r "$BACKUP_DIR/$BACKUP_NAME" "$DEPLOY_DIR"
        sudo chown -R www-data:www-data "$DEPLOY_DIR"
        
        log_info "Nginx 재로드 중..."
        sudo systemctl reload nginx
        
        log_success "롤백 완료: $BACKUP_NAME"
    else
        log_error "백업을 찾을 수 없습니다: $BACKUP_NAME"
        exit 1
    fi
}

#-------------------------------------------------------------------------------
# 도움말
#-------------------------------------------------------------------------------
show_help() {
    echo "R-Paper 서버 배포 스크립트"
    echo ""
    echo "사용법: $0 [옵션]"
    echo ""
    echo "옵션:"
    echo "  (없음)        /tmp/dist.tar.gz에서 배포"
    echo "  --from-git    Git 저장소에서 빌드 후 배포"
    echo "  --rollback    이전 버전으로 롤백"
    echo "  --help        도움말 표시"
}

#-------------------------------------------------------------------------------
# 메인
#-------------------------------------------------------------------------------
case "$1" in
    --from-git)
        deploy_from_git
        ;;
    --rollback)
        rollback
        ;;
    --help)
        show_help
        ;;
    *)
        deploy_from_archive
        ;;
esac
