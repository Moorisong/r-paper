import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { MESSAGES, ROUTES } from '@/constants';

const NotFound = () => {
  return (
    <PageContainer centered>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
          className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent"
        >
          404
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-xl text-gray-600"
        >
          {MESSAGES.notFound}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Link to={ROUTES.home}>
            <Button size="lg">
              {MESSAGES.goHome}
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
};

export default NotFound;
