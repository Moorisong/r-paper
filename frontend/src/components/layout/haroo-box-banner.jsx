import { EXTERNAL_LINKS } from '@/constants/routes';

export const HarooBoxBanner = ({ className = '' }) => {
  return (
    <a
      href={EXTERNAL_LINKS.harooBox}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center justify-between w-full max-w-[448px] glass-card rounded-3xl transition-all duration-300 ${className}`}
      style={{ padding: '14px 24px' }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex flex-col min-w-0 text-left">
          <span className="text-xs font-bold text-gray-800 tracking-tight flex items-center gap-1.5">
            하루상자 놀러가기
          </span>
          <span className="text-[11px] text-gray-500 truncate mt-0.5">
            오늘 뭐 하고 놀지? 구경하러 가볼까?
          </span>
        </div>
      </div>
      <div 
        className="flex items-center text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-2xl border border-purple-100 shadow-sm group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0 ml-4"
        style={{ padding: '6px 18px' }}
      >
        이동 <span className="ml-1">&rarr;</span>
      </div>
    </a>
  );
};

export const HarooBoxButton = ({ className = '' }) => {
  return (
    <a
      href={EXTERNAL_LINKS.harooBox}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-gray-200 hover:border-purple-300 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 group ${className}`}
    >
      <span className="text-sm group-hover:scale-110 transition-transform duration-200">
        🎁
      </span>
      <span className="text-xs font-bold text-purple-700 tracking-tight">
        하루상자 놀러가기
      </span>
      <span className="text-xs text-purple-500 font-bold group-hover:translate-x-0.5 transition-transform duration-200">
        &rarr;
      </span>
    </a>
  );
};



