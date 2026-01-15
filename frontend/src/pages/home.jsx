import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreatePaper } from '@/hooks/use-create-paper';
import { APP_NAME, APP_DESCRIPTION, LIMITS, MESSAGES } from '@/constants';

const Home = () => {
  const [title, setTitle] = useState('');
  const { createPaper, isLoading, error } = useCreatePaper();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPaper(title);
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (value.length <= LIMITS.titleMaxLength) {
      setTitle(value);
    }
  };

  return (
    <PageContainer centered className="py-10 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full mx-auto"
        style={{ paddingLeft: '10px', paddingRight: '10px', maxWidth: '448px' }}
      >
        {/* Main Card */}
        <div className="glass-card rounded-3xl px-8 py-8 sm:px-10 sm:py-10">
          {/* Header */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-6"
          >
            {/* Icon */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl"
              style={{ marginBottom: '20px', marginTop: '-10px', background: 'linear-gradient(135deg, #ffe4e6, #f3e8ff)', boxShadow: '0 8px 16px -4px rgba(254, 205, 211, 0.4)' }}
            >
              <span className="text-2xl">💌</span>
            </motion.div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {APP_NAME}
            </h1>
            <p className="mt-1 text-gray-500 text-xs">
              {APP_DESCRIPTION}
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', marginTop: '20px' }}
          >
            <div style={{ width: '90%' }}>
              <Input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder={MESSAGES.titlePlaceholder}
                maxLength={LIMITS.titleMaxLength}
                currentLength={title.length}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-red-600 text-sm bg-red-50 py-3 px-4 rounded-xl"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              style={{ width: '90%', marginBottom: '30px', fontSize: '12px', fontWeight: 'bold', paddingTop: '5px', paddingBottom: '5px' }}
            >
              만들기
            </Button>
          </motion.form>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center text-xs text-gray-400"
          style={{ marginTop: '24px' }}
        >
          {MESSAGES.legalNotice}
        </motion.p>
      </motion.div>
    </PageContainer>
  );
};

export default Home;
