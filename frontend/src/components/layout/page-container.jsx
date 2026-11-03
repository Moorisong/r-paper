import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { KakaoAdFit } from '@/components/ad/kakao-adfit';

export const PageContainer = ({
  children,
  className = '',
  backgroundClass = '',
  centered = false,
  showAd = true,
  showHarooBanner = true,
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
          'relative min-h-screen w-full py-4 sm:py-10 flex flex-col items-center',
          centered && 'justify-center',
          className
        )}
        style={{
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingBottom: showAd ? '120px' : undefined
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
              unit="DAN-h9fTzTVbw87MPKma"
              width={320}
              height={100}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};
