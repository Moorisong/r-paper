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
    <PageContainer centered>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md mx-auto text-center"
      >
        {/* Logo / Title */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            {APP_NAME}
          </h1>
          <p className="mt-3 text-gray-600 text-lg">
            {APP_DESCRIPTION}
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="mt-10 space-y-5"
        >
          <Input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder={MESSAGES.titlePlaceholder}
            maxLength={LIMITS.titleMaxLength}
            currentLength={title.length}
          />

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm"
            >
              {error}
            </motion.p>
          )}

          <Button
            type="submit"
            size="lg"
            isLoading={isLoading}
            className="w-full"
          >
            {MESSAGES.createButton}
          </Button>
        </motion.form>

        {/* Legal Notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 text-xs text-gray-400"
        >
          {MESSAGES.legalNotice}
        </motion.p>
      </motion.div>
    </PageContainer>
  );
};

export default Home;
