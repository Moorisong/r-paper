import { useEffect, useRef } from 'react';

const ADFIT_SCRIPT_URL = 'https://t1.kakaocdn.net/kas/static/ba.min.js';

export const KakaoAdFit = ({
    unit = 'DAN-vxiP9rrS83zZspVD',
    width = 320,
    height = 50,
    className = ''
}) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let script = null;

        // React StrictMode의 개발 환경 effect 재실행이 끝난 뒤 광고를 초기화한다.
        const frameId = window.requestAnimationFrame(() => {
            container.replaceChildren();

            const ins = document.createElement('ins');
            ins.className = 'kakao_ad_area';
            ins.style.display = 'none';
            ins.setAttribute('data-ad-unit', unit);
            ins.setAttribute('data-ad-width', String(width));
            ins.setAttribute('data-ad-height', String(height));
            container.appendChild(ins);

            // AdFit SDK는 실행 시점에 DOM의 광고 영역을 탐색한다.
            // 라우트 전환으로 광고 영역이 다시 생성될 때도 새 스크립트를 실행한다.
            script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = ADFIT_SCRIPT_URL;
            script.async = true;
            script.onerror = () => {
                console.error('[AdFit] 광고 SDK를 불러오지 못했습니다.');
            };
            document.body.appendChild(script);
        });

        return () => {
            window.cancelAnimationFrame(frameId);
            if (script) {
                script.onerror = null;
                script.remove();
            }
            container.replaceChildren();
        };
    }, [unit, width, height]);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                minHeight: `${height}px`,
            }}
        />
    );
};

export default KakaoAdFit;
