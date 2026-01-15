import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContainer } from '@/components/layout/page-container';
import { MessageList } from '@/components/paper/message-list';
import { MessageForm } from '@/components/paper/message-form';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { usePaper } from '@/hooks/use-paper';
import { useMessages } from '@/hooks/use-messages';
import { MESSAGES } from '@/constants';
import { formatDday, copyToClipboard, cn } from '@/lib/utils';

const PaperView = () => {
  const { slug } = useParams();
  const { paper, isLoading: isPaperLoading, error: paperError } = usePaper(slug);
  const { messages, isLoading: isMessagesLoading, isSending, sendMessage } = useMessages(slug);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const success = await copyToClipboard(url);

    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleMessageSubmit = async (content) => {
    await sendMessage(content);
    setIsModalOpen(false);
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
      <PageContainer centered className="py-10 sm:py-12">
        <div className="w-full mx-auto" style={{ paddingLeft: '10px', paddingRight: '10px', maxWidth: '448px' }}>
          <div className="glass-card rounded-3xl px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 bg-red-50 text-2xl">
              😢
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              페이지를 찾을 수 없어요
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              {paperError || '롤링페이퍼가 삭제되었거나 존재하지 않습니다'}
            </p>
            <Link to="/">
              <Button size="lg" className="w-full">
                새 롤링페이퍼 만들기
              </Button>
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-700 bg-slate-50">
      <PageContainer className="relative z-10 pt-40 pb-32 sm:pt-48 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full mx-auto"
          style={{ paddingLeft: '10px', paddingRight: '10px', maxWidth: '448px', paddingTop: '80px', paddingBottom: '80px' }}
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
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight mt-8 mb-6">
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

              <div className="relative">
                <Button
                  onClick={handleShare}
                  variant="ghost"
                  size="sm"
                  className="w-auto text-xs font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                >
                  🔗 링크 복사하기
                </Button>

                <AnimatePresence>
                  {copySuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 bg-gray-900/95 text-white text-sm rounded-xl whitespace-nowrap font-bold shadow-xl z-50 backdrop-blur-sm sm:absolute sm:top-full sm:left-1/2 sm:-translate-x-1/2 sm:translate-y-0 sm:mt-2 sm:px-4 sm:py-2 sm:text-xs sm:rounded-lg"
                    >
                      ✨ 링크 복사 완료!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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
                  {messages.length}
                </span>
              </div>

              <MessageList
                messages={messages}
                isLoading={isMessagesLoading}
                cardClass="shadow-sm hover:shadow transition-shadow"
                gridClass="grid-cols-1 gap-4"
              />
            </div>

            {/* Spacer (Before Button) */}
            <div style={{ height: messages.length > 0 ? '20px' : '4px' }}></div>

            {/* Write Message Button */}
            <div className="text-center">
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="primary"
                size="md"
                className="w-[80%] max-w-xs mx-auto font-bold text-sm shadow-sm hover:shadow h-12"
              >
                ✍️ 메시지 남기기
              </Button>
            </div>

            {/* Spacer 20px (Before Footer) */}
            <div className="h-5"></div>

            {/* Footer Text */}
            <div className="py-2 border-t border-gray-100 text-center mt-5">
              <Link to="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-gray-400 hover:text-gray-600 hover:bg-transparent font-normal"
                >
                  + 나도 롤링페이퍼 만들기
                </Button>
              </Link>
            </div>
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

        </motion.div>
      </PageContainer>
    </div>
  );
};

export default PaperView;
