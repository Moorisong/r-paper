import { useEffect, useRef } from 'react';

export const KakaoAdFit = ({
    unit = 'DAN-CO9B3C1kNlSWapzN',
    width = 320,
    height = 50,
    className = ''
}) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // 기존 내용 정리
        container.innerHTML = '';

        // ins 요소 생성
        const ins = document.createElement('ins');
        ins.className = 'kakao_ad_area';
        ins.style.display = 'none';
        ins.setAttribute('data-ad-unit', unit);
        ins.setAttribute('data-ad-width', String(width));
        ins.setAttribute('data-ad-height', String(height));
        container.appendChild(ins);

        // 스크립트 동적 로드
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
        script.async = true;
        container.appendChild(script);

        return () => {
            // 컴포넌트 언마운트 시 정리
            container.innerHTML = '';
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
