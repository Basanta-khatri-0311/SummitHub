import React from 'react';
import { TriangleAlert, X } from 'lucide-react';

export function AlertModal({ isOpen, onClose, title, message, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm transition-colors"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-200 transition-colors">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 bg-rose-100 dark:bg-rose-500/10 rounded-full flex items-center justify-center mb-4 transition-colors">
             <TriangleAlert className="h-6 w-6 text-rose-600 dark:text-rose-500" />
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors mb-6">
            {message}
          </p>
          
          <div className="flex gap-3 w-full">
             <button 
               onClick={onClose} 
               className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium py-2.5 rounded-lg transition-colors"
             >
               Cancel
             </button>
             <button 
               onClick={() => { onConfirm(); onClose(); }} 
               className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-[0_0_15px_rgba(225,29,72,0.3)]"
             >
               Confirm
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
