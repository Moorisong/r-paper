import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { KakaoAdFit } from '@/components/ad/kakao-adfit';

export const PageContainer = ({
  children,
  className = '',
  backgroundClass = '',
  centered = false,
  showAd = true,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'min-h-screen w-full',
        backgroundClass
      )}
      style={{ background: '#f9fafb' }}
    >
      <div
        className={cn(
          'relative min-h-screen w-full py-12 sm:py-20',
          centered && 'flex flex-col items-center justify-center',
          className
        )}
        style={{
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingBottom: showAd ? '70px' : undefined
        }}
      >
        {children}
      </div>

      {/* 하단 고정 광고 배너 */}
      {showAd && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '448px',
              padding: '8px 0',
              background: 'rgba(249, 250, 251, 0.95)',
            }}
          >
            <KakaoAdFit
              unit="DAN-CO9B3C1kNlSWapzN"
              width={320}
              height={50}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};
