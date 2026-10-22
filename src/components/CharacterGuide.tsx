import React from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';

interface CharacterGuideProps {
  message: string;
  title?: string;
  tip?: string;
  mood?: 'happy' | 'thinking' | 'excited' | 'warning';
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export const CharacterGuide: React.FC<CharacterGuideProps> = ({
  message,
  title = 'Kak Rimba (Pemandu Penjaga Ekosistem)',
  tip,
  mood = 'happy',
  actionButton,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-400/40 bg-gradient-to-r from-emerald-900/90 via-teal-900/90 to-emerald-950/90 p-4 md:p-5 shadow-xl backdrop-blur-md transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Character Avatar */}
        <div className="relative shrink-0">
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-400 p-1 shadow-lg ring-4 ring-emerald-500/30">
            <div className="h-full w-full rounded-xl bg-emerald-950 flex items-center justify-center text-3xl sm:text-4xl select-none">
              {mood === 'happy' && '🤠'}
              {mood === 'thinking' && '🧐'}
              {mood === 'excited' && '🌟'}
              {mood === 'warning' && '🌾'}
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold shadow">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
        </div>

        {/* Message Content */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-base font-bold text-emerald-300 flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4 text-emerald-400" />
              {title}
            </h4>
          </div>
          <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
            {message}
          </p>
          {tip && (
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-950/80 px-2.5 py-1 text-xs text-emerald-200 border border-emerald-500/30">
              <span className="font-bold text-amber-300">💡 Petunjuk:</span> {tip}
            </div>
          )}
        </div>

        {/* Optional Action Button */}
        {actionButton && (
          <button
            onClick={actionButton.onClick}
            className="shrink-0 self-end sm:self-center px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            {actionButton.label}
          </button>
        )}
      </div>
    </div>
  );
};
