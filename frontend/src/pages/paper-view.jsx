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
          className="text-center"
        >
          <p className="text-xl text-gray-600 mb-4">
            {paperError || '롤링페이퍼를 찾을 수 없습니다.'}
          </p>
          <Button
            onClick={() => window.location.href = '/'}
            variant="primary"
          >
            {MESSAGES.goHome}
          </Button>
        </motion.div>
      </PageContainer>
    );
  }

  return (
    <PageContainer backgroundClass={theme.background}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          {paper.title && (
            <h1 className={cn(
              'text-3xl md:text-4xl font-bold mb-3',
              theme.text
            )}>
              {paper.title}
            </h1>
          )}

          <p className={cn(
            'text-sm mb-4',
            theme.subtext
          )}>
            {formatDday(paper.expiresAt)}
          </p>

          {/* Share Button */}
          <div className="relative inline-block">
            <Button
              onClick={handleShare}
              variant="themed"
              themedClass={theme.button}
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
                공유하기
              </span>
            </Button>

            <AnimatePresence>
              {copySuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap"
                >
                  {MESSAGES.copySuccess}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.header>

        {/* Messages */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <MessageList
            messages={messages}
            isLoading={isMessagesLoading}
            cardClass={theme.card}
            textClass={theme.text}
            accentClass={theme.subtext}
          />
        </motion.section>

        {/* Message Form */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={cn(
            'p-5 rounded-3xl border shadow-lg',
            theme.card
          )}
        >
          <h2 className={cn(
            'text-lg font-semibold mb-4',
            theme.text
          )}>
            메시지 남기기
          </h2>
          <MessageForm
            onSubmit={sendMessage}
            isLoading={isSending}
            buttonClass={theme.button}
            inputClass={theme.input}
          />
        </motion.section>
      </div>
    </PageContainer>
  );
};

export default PaperView;
