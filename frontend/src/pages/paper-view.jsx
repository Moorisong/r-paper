import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContainer } from '@/components/layout/page-container';
import { MessageList } from '@/components/paper/message-list';
import { MessageForm } from '@/components/paper/message-form';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { usePaper } from '@/hooks/use-paper';
import { useMessages } from '@/hooks/use-messages';
import { getTheme, MESSAGES } from '@/constants';
import { formatDday, copyToClipboard, cn } from '@/lib/utils';

const PaperView = () => {
  const { slug } = useParams();
  const { paper, isLoading: isPaperLoading, error: paperError } = usePaper(slug);
  const { messages, isLoading: isMessagesLoading, isSending, sendMessage } = useMessages(slug);
  const [copySuccess, setCopySuccess] = useState(false);

  const theme = paper ? getTheme(paper.theme) : getTheme('theme_candy');

  const handleShare = async () => {
    const url = window.location.href;
    const success = await copyToClipboard(url);

    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  if (isPaperLoading) {
    return (
      <PageContainer centered>
        <LoadingSpinner size="lg" />
      </PageContainer>
    );
  }

  if (paperError || !paper) {
    return (
      <PageContainer centered>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8 text-center max-w-md mx-auto"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">😢</span>
          </div>
          <p className="text-xl font-bold text-gray-800 mb-2">
            페이지를 찾을 수 없어요
          </p>
          <p className="text-gray-500 mb-6">
            {paperError || '롤링페이퍼가 삭제되었거나 존재하지 않습니다'}
          </p>
          <Button
            onClick={() => window.location.href = '/'}
            variant="primary"
          >
            홈으로 돌아가기
          </Button>
        </motion.div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto">
        {/* Header Card */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-3xl p-6 sm:p-8 mb-8 text-center"
        >
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 mb-4">
            <span className="text-2xl">📜</span>
          </div>

          {paper.title && (
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
              {paper.title}
            </h1>
          )}

          <p className="text-gray-500 mb-5">
            {formatDday(paper.expiresAt)}
          </p>

          {/* Share Button */}
          <div className="relative inline-block">
            <Button
              onClick={handleShare}
              variant="secondary"
              size="sm"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                링크 복사
              </span>
            </Button>

            <AnimatePresence>
              {copySuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-xl whitespace-nowrap font-medium"
                >
                  ✓ {MESSAGES.copySuccess}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.header>

        {/* Messages Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-5 px-1">
            <h2 className="text-lg font-bold text-gray-800">
              메시지
            </h2>
            {messages.length > 0 && (
              <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-sm font-bold rounded-full">
                {messages.length}
              </span>
            )}
          </div>
          <MessageList
            messages={messages}
            isLoading={isMessagesLoading}
          />
        </motion.section>

        {/* Message Form */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card rounded-3xl p-6 sm:p-8"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            메시지 남기기
          </h2>
          <MessageForm
            onSubmit={sendMessage}
            isLoading={isSending}
          />
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-8 pb-8"
        >
          <Button
            onClick={() => window.location.href = '/'}
            variant="secondary"
            size="sm"
          >
            새 롤링페이퍼 만들기
          </Button>
        </motion.footer>
      </div>
    </PageContainer>
  );
};

export default PaperView;
