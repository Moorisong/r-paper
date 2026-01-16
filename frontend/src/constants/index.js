export * from './api';
export * from './routes';
export * from './themes';

export const APP_NAME = 'RollingPaper';
export const APP_DESCRIPTION = '소중한 마음을 전하는 특별한 롤링페이퍼';

export const LIMITS = {
  titleMaxLength: 40,
  messageMaxLength: 500,
};

export const MESSAGES = {
  titlePlaceholder: '롤링페이퍼 제목 (선택사항)',
  messagePlaceholder: '따뜻한 메시지를 남겨주세요...',
  createButton: '롤링페이퍼 만들기',
  sendButton: '메시지 보내기',
  copySuccess: '링크가 복사되었습니다!',
  copyFail: '복사에 실패했습니다.',
  loading: '로딩 중...',
  noMessages: '아직 메시지가 없어요. 첫 번째 메시지를 남겨보세요!',
  notFound: '페이지를 찾을 수 없습니다.',
  goHome: '홈으로 돌아가기',
  legalNotice: '본 서비스는 로그인 없이 이용 가능하며, 작성된 모든 메시지는 생성 시점 기준 10일 후 자동 삭제됩니다. 개인정보는 수집·저장하지 않습니다.',
  // 링크 복사 모달
  linkCopyModalTitle: '🎉 롤링페이퍼가 만들어졌어요!',
  linkCopyModalWarning: '⚠️ 이 링크를 꼭 저장하세요!',
  linkCopyModalSubtext: '링크를 잃어버리면 다시 찾을 수 없어요',
  linkCopyButton: '📋 링크 복사하기',
  linkCopyLater: '나중에 복사할게요',
  // 2차 경고
  secondWarningTitle: '정말로 닫으시겠어요?',
  secondWarningMessage: '링크를 복사하지 않으면 이 롤링페이퍼를 다시 찾을 수 없어요 😢',
  closeAnyway: '그래도 닫기',
  copyNow: '복사하기',
  // 상단 배너
  linkWarningBanner: '⚠️  링크를 저장하세요! 나중에 찾을 수 없어요',
};
