import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { MESSAGES } from '@/constants';
import { copyToClipboard } from '@/lib/utils';

export const LinkCopyModal = ({
    isOpen,
    onClose,
    onCopySuccess,
    onDismissWithoutCopy,
}) => {
    const [isCopied, setIsCopied] = useState(false);

    const currentUrl = window.location.href.replace('?new=true', '').replace('&new=true', '');

    const handleCopy = async () => {
        const success = await copyToClipboard(currentUrl);
        if (success) {
            setIsCopied(true);
            setTimeout(() => {
                onCopySuccess();
                onClose();
            }, 400);
        }
    };

    const handleLater = () => {
        onDismissWithoutCopy();
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 25 }}
                            className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl pointer-events-auto border border-gray-100"
                        >
                            <div className="flex flex-col items-center" style={{ padding: '40px 40px' }}>
                                {/* 아이콘 */}
                                <div className="text-4xl mb-4">
                                    🎉
                                </div>

                                <h2 className="text-lg font-bold text-gray-900 mb-3">
                                    {MESSAGES.linkCopyModalTitle.replace('🎉 ', '')}
                                </h2>

                                <p className="text-gray-500 text-sm mb-8 text-center">
                                    이 링크를 잃어버리면 다시 찾을 수 없어요!
                                </p>

                                {/* 복사 버튼 */}
                                <Button
                                    onClick={handleCopy}
                                    size="lg"
                                    className="w-full mb-2 font-semibold text-sm bg-gray-900 hover:bg-gray-800 text-white shadow-none"
                                    style={{ height: '44px', marginTop: '32px' }}
                                    disabled={isCopied}
                                >
                                    {isCopied ? '복사 완료' : MESSAGES.linkCopyButton}
                                </Button>

                                {/* 나중에 버튼 */}
                                <button
                                    onClick={handleLater}
                                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors mt-2"
                                    style={{ paddingTop: '16px', paddingBottom: '16px', display: 'block', width: '100%' }}
                                >
                                    {MESSAGES.linkCopyLater}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};
