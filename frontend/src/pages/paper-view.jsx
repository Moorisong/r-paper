import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageContainer } from '@/components/layout/page-container';
import { MessageList } from '@/components/paper/message-list';
import { MessageForm } from '@/components/paper/message-form';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { LinkCopyModal } from '@/components/paper/link-copy-modal';
import { LinkWarningBanner } from '@/components/paper/link-warning-banner';
import { usePaper } from '@/hooks/use-paper';
import { useMessages } from '@/hooks/use-messages';
import { MESSAGES } from '@/constants';
import { formatDday, copyToClipboard, cn } from '@/lib/utils';

const PaperView = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const { paper, isLoading: isPaperLoading, error: paperError } = usePaper(slug);
  const { messages, isLoading: isMessagesLoading, isLoadingMore, isSending, sendMessage, hasMore, totalCount, loadMore } = useMessages(slug);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 생성자 여부 확인 (creatorToken 존재 시 생성자)
  const [isCreator, setIsCreator] = useState(false);

  // 링크 복사 UX 상태
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [showLinkWarningBanner, setShowLinkWarningBanner] = useState(false);

  // creatorToken 확인
  useEffect(() => {
    if (slug) {
      const creatorToken = localStorage.getItem(`creator_token_${slug}`);
      setIsCreator(!!creatorToken);
    }
  }, [slug]);

  // 새로 생성된 롤링페이퍼인지 확인 (URL 쿼리 파라미터)
  useEffect(() => {
    const isNew = searchParams.get('new') === 'true';
    if (isNew && paper) {
      setIsLinkModalOpen(true);
      // URL에서 쿼리 파라미터 제거 (히스토리 정리)
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams, paper]);

  const handleShare = async () => {
    const url = window.location.href;
    await copyToClipboard(url);
  };

  const handleMessageSubmit = async (content) => {
    await sendMessage(content);
    setIsModalOpen(false);
  };

  // 링크 복사 모달 핸들러
  const handleLinkCopySuccess = () => {
    setShowLinkWarningBanner(false);
  };

  const handleLinkModalClose = () => {
    setIsLinkModalOpen(false);
  };

  const handleDismissWithoutCopy = () => {
    setShowLinkWarningBanner(true);
  };

  // 배너 핸들러
  const handleBannerCopySuccess = () => {
    setShowLinkWarningBanner(false);
  };

  const handleBannerClose = () => {
    setShowLinkWarningBanner(false);
  };

  if (isPaperLoading) {
    return (
      <PageContainer centered className="py-10 sm:py-12">
        <LoadingSpinner size="lg" />
      </PageContainer>
    );
  }

  if (paperError || !paper) {
    return (
      <PageContainer centered className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full mx-auto px-4"
          style={{ maxWidth: '448px' }}
        >
          <div 
            className="bg-white text-center border border-gray-100 flex flex-col items-center"
            style={{ 
              borderRadius: '32px', 
              padding: '60px 32px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
            }}
          >
            
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm text-5xl"
              style={{
                width: '96px',
                height: '96px',
                borderRadius: '28px',
                marginBottom: '40px'
              }}
            >
              😢
            </motion.div>
            
            <h2 
              className="text-2xl font-extrabold text-gray-900 tracking-tight"
              style={{ marginBottom: '16px' }}
            >
              페이지를 찾을 수 없어요
            </h2>
            
            <p 
              className="text-gray-500 text-[15px] leading-relaxed mx-auto break-keep"
              style={{ 
                marginBottom: '48px',
                maxWidth: '240px'
              }}
            >
              {paperError || '롤링페이퍼가 삭제되었거나 존재하지 않습니다'}
            </p>
            
            <Link to="/" className="w-full">
              <Button size="lg" className="w-full text-base font-bold shadow-sm" style={{ height: '56px' }}>
                새 롤링페이퍼 만들기
              </Button>
            </Link>
          </div>
        </motion.div>
      </PageContainer>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-700 bg-slate-50">
      {/* 플로팅 버튼 컨테이너 - 컨텐츠 영역 기준으로 위치 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[448px] px-4 pointer-events-none z-50">
        <div className="relative w-full">
          {/* 메시지 남기기 버튼 - 생성자가 아닐 때만 표시 */}
          {!isCreator && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="absolute bottom-[130px] right-3 pointer-events-auto w-10 h-10 bg-purple-600/20 hover:bg-purple-700/40 backdrop-blur-sm text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-base active:scale-95"
              aria-label="메시지 남기기"
            >
              ✍️
            </button>
          )}

          {/* 새 롤링페이퍼 만들기 버튼 */}
          <Link
            to="/"
            className="absolute bottom-[80px] right-3 pointer-events-auto w-10 h-10 bg-purple-600/20 hover:bg-purple-700/40 backdrop-blur-sm text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-base active:scale-95"
            aria-label="새 롤링페이퍼 만들기"
          >
            ➕
          </Link>
        </div>
      </div>

      {/* 상단 경고 배너 */}
      <LinkWarningBanner
        isVisible={showLinkWarningBanner}
        onCopySuccess={handleBannerCopySuccess}
        onClose={handleBannerClose}
      />

      <PageContainer className={cn(
        "relative z-10 pb-32 flex flex-col items-center"
      )}
        style={{
          paddingTop: showLinkWarningBanner ? '240px' : '160px' // 강제 적용 (기존 pt-40=160px, pt-60=240px)
        }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full mx-auto"
          style={{
            paddingLeft: '10px',
            paddingRight: '10px',
            maxWidth: '448px',
            paddingTop: '80px',
            paddingBottom: '80px',
            marginTop: showLinkWarningBanner ? '40px' : '0px'
          }}
        >
          {/* Main Card */}
          <div className="bg-white rounded-3xl px-8 py-10 sm:px-12 sm:py-12 min-h-[60vh] flex flex-col overflow-visible border border-gray-100 shadow-sm">

            {/* Header Section */}
            <div className="flex flex-col items-center">
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-white border border-gray-100 shadow-sm"
                style={{
                  marginTop: '-30px'
                }}
              >
                <span className="text-2xl">💌</span>
              </div>

              {paper.title && (
                <h1
                  className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight mb-6 text-center px-4 sm:px-6 w-full"
                  style={{ marginTop: '10px', wordBreak: 'keep-all', overflowWrap: 'break-word' }}
                >
                  {paper.title}
                </h1>
              )}

              <div
                className="inline-flex items-center justify-center gap-2 text-purple-600 font-bold text-sm mb-4"
                style={{ marginTop: '10px' }}
              >
                <span>📅</span>
                <span>{formatDday(paper.expiresAt)}</span>
              </div>

              <Button
                onClick={handleShare}
                variant="ghost"
                size="sm"
                className="w-auto text-xs font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                style={{ marginTop: '8px' }}
              >
                🔗 링크 복사하기
              </Button>

              {/* Spacer 10px */}
              <div className="h-2.5"></div>
            </div>

            {/* Spacer (Before Messages) */}
            <div className={cn(
              "transition-all duration-500",
              messages.length > 0 ? "h-10" : "h-0"
            )}></div>

            {/* Message List */}
            <div className={cn(
              "flex-1 flex flex-col items-center w-full transition-all duration-500",
              messages.length === 0 ? "justify-center pb-20" : "justify-start"
            )}>
              <div
                className="flex items-center justify-center gap-2 px-1 pb-1"
                style={{ marginBottom: messages.length > 0 ? '12px' : '0px' }}
              >
                <h2 className="text-base font-bold text-gray-900">
                  도착한 메시지
                </h2>
                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                  {totalCount}
                </span>
              </div>

              <MessageList
                messages={messages}
                isLoading={isMessagesLoading}
                cardClass="shadow-sm hover:shadow transition-shadow"
                gridClass="grid-cols-1 gap-4"
              />

              {/* 더 보기 버튼 */}
              {hasMore && (
                <div style={{ marginTop: '24px', marginBottom: '8px' }}>
                  <button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:cursor-not-allowed flex justify-center w-full"
                  >
                    {isLoadingMore ? (
                      <span className="flex justify-center w-full">
                        <LoadingSpinner size="sm" />
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        더 보기 <span className="text-xs">▼</span>
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Spacer (Before Button) */}
            <div style={{ height: messages.length > 0 ? '20px' : '4px' }}></div>

            {/* Write Message Button - 생성자는 메시지 작성 불가 */}
            {!isCreator ? (
              <div className="text-center">
                <Button
                  onClick={() => setIsModalOpen(true)}
                  variant="primary"
                  size="md"
                  className="w-[80%] max-w-xs mx-auto font-bold text-sm shadow-sm h-12"
                >
                  ✍️ 메시지 남기기
                </Button>
              </div>
            ) : (
              <div 
                className="text-center py-4 px-6 bg-gray-50 rounded-2xl"
                style={{ marginTop: '30px', marginBottom: '30px' }}
              >
                <p className="text-sm text-gray-500">
                  💌 롤링페이퍼 주인은 메시지를 작성할 수 없어요
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  링크를 공유해서 메시지를 받아보세요!
                </p>
              </div>
            )}

            {/* Spacer 20px (Before Footer) */}
            <div className="h-5"></div>

            {/* Footer Text */}
            <div className="pt-8 text-center mt-6">
              <Link to="/" className="block">
                <Button
                  variant="outline"
                  size="md"
                  className="w-[80%] max-w-xs mx-auto border-2 border-dashed border-gray-200 text-gray-500 hover:text-purple-600 hover:border-purple-200 hover:bg-purple-50 font-bold text-sm h-12 rounded-2xl transition-all duration-300"
                >
                  {isCreator ? '+ 새로운 롤링페이퍼 만들기' : '✨ 나도 롤링페이퍼 만들기'}
                </Button>
              </Link>
            </div>

            {/* Bottom Spacer */}
            <div className="h-10"></div>
          </div>



          {/* Message Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="마음 남기기"
            className="max-w-[360px]"
          >
            <MessageForm
              onSubmit={handleMessageSubmit}
              isLoading={isSending}
              buttonClass=""
              inputClass="bg-gray-50 focus:bg-white"
            />
          </Modal>

          {/* 링크 복사 모달 */}
          <LinkCopyModal
            isOpen={isLinkModalOpen}
            onClose={handleLinkModalClose}
            onCopySuccess={handleLinkCopySuccess}
            onDismissWithoutCopy={handleDismissWithoutCopy}
          />

        </motion.div>
      </PageContainer>
    </div>
  );
};

export default PaperView;

