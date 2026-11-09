import React from 'react';

export default function MessageError({ message, type = 'error', onClose }) {
  if (!message) return null;

  const isSuccess = type === 'success';

  const currentStyle = isSuccess
    ? {
        cardBorder: 'border-emerald-200 shadow-emerald-100',
        text: 'text-emerald-900',
        strokeColor: '#10b981',
      }
    : {
        cardBorder: 'border-red-200 shadow-red-100',
        text: 'text-red-900',
        strokeColor: '#ef4444',
      };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      onClick={handleOutsideClick}
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/10 p-4 backdrop-blur-[1px] animate-in fade-in duration-200"
      role="alertdialog"
      aria-live="polite"
    >
      {/* Message Card */}
      <div
        className={`relative flex aspect-square w-full max-w-[240px] flex-col items-center justify-center gap-3 rounded-3xl border bg-white p-4 text-center shadow-2xl sm:max-w-[260px] sm:gap-4 sm:p-6 ${currentStyle.cardBorder}`}
        style={{
          animation: 'popOut 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        }}
      >
        {/* Icon */}
        <div className="flex h-20 w-20 shrink-0 items-center justify-center sm:h-28 sm:w-28">
          <svg
            className="h-full w-full"
            fill="none"
            viewBox="0 0 52 52"
            aria-hidden="true"
          >
            <circle
              cx="26"
              cy="26"
              r="23"
              stroke={currentStyle.strokeColor}
              strokeWidth="4"
              strokeLinecap="round"
              style={{
                strokeDasharray: 145,
                strokeDashoffset: 145,
                animation: 'drawCircle 0.4s ease-in-out forwards',
                transform: 'rotate(-90deg)',
                transformOrigin: 'center',
              }}
            />

            {isSuccess ? (
              <path
                stroke={currentStyle.strokeColor}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
                style={{
                  strokeDasharray: 40,
                  strokeDashoffset: 40,
                  animation: 'drawCheck 0.3s ease-in-out 0.3s forwards',
                }}
              />
            ) : (
              <path
                stroke={currentStyle.strokeColor}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18l16 16M34 18L18 34"
                style={{
                  strokeDasharray: 45,
                  strokeDashoffset: 45,
                  animation: 'drawCheck 0.3s ease-in-out 0.3s forwards',
                }}
              />
            )}
          </svg>
        </div>

        {/* Message */}
        <p
          className={`max-h-24 w-full overflow-y-auto break-words text-sm font-semibold leading-relaxed sm:text-base ${currentStyle.text}`}
        >
          {message}
        </p>

        {/* Close Button (Mobile Friendly) */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pesan"
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            ✕
          </button>
        )}
      </div>

      <style>{`
        @keyframes popOut {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          70% {
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes drawCircle {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes drawCheck {
          to {
            stroke-dashoffset: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}