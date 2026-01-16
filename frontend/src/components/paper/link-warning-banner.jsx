import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MESSAGES } from '@/constants';
import { copyToClipboard } from '@/lib/utils';

export const LinkWarningBanner = ({
    isVisible,
    onCopySuccess,
    onClose,
}) => {
    const [isCopied, setIsCopied] = useState(false);

    const currentUrl = window.location.href.replace('?new=true', '').replace('&new=true', '');

    const handleCopy = async () => {
        const success = await copyToClipboard(currentUrl);
        if (success) {
            setIsCopied(true);
            setTimeout(() => {
                onCopySuccess();
            }, 400);
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed top-0 left-0 right-0 z-40"
                >
                    <div className="bg-orange-50 border-b border-orange-100 shadow-sm">
                        <div className="max-w-lg mx-auto px-4 flex items-center justify-between gap-3" style={{ paddingTop: '4px', paddingBottom: '4px' }}>
                            {/* 메시지 */}
                            <p className="text-orange-800 text-xs font-medium flex-1 truncate" style={{ paddingLeft: '8px' }}>
                                ⚠️&nbsp;&nbsp;링크를 저장하세요! 나중에 찾을 수 없어요.
                            </p>

                            {/* 복사 버튼 */}
                            <button
                                onClick={handleCopy}
                                disabled={isCopied}
                                className="flex-shrink-0 bg-white border border-orange-200 text-orange-700 hover:bg-orange-50 text-xs font-bold rounded-md transition-all disabled:opacity-70"
                                style={{ paddingLeft: '7px', paddingRight: '7px', paddingTop: '2px', paddingBottom: '2px' }}
                            >
                                {isCopied ? '✓ 완료' : '복사하기'}
                            </button>

                            {/* 닫기 버튼 */}
                            <button
                                onClick={onClose}
                                className="flex-shrink-0 text-orange-400 hover:text-orange-600 transition-colors p-1"
                                style={{ paddingRight: '8px' }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
