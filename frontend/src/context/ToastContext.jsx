import { createContext, useContext, useState, useCallback } from 'react';
import { HiCheckCircle, HiExclamationCircle, HiInformationCircle, HiHeart, HiX } from 'react-icons/hi';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md border transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-5 ${
              toast.type === 'success'
                ? 'bg-emerald-900/90 text-emerald-100 border-emerald-500/30'
                : toast.type === 'favorite'
                ? 'bg-rose-950/90 text-rose-100 border-rose-500/30'
                : toast.type === 'error'
                ? 'bg-red-900/90 text-red-100 border-red-500/30'
                : 'bg-gray-900/90 text-gray-100 border-gray-700/50'
            }`}
            style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.35)' }}
          >
            <div className="shrink-0 text-xl">
              {toast.type === 'success' && <HiCheckCircle className="text-emerald-400" />}
              {toast.type === 'favorite' && <HiHeart className="text-rose-400 animate-pulse" />}
              {toast.type === 'error' && <HiExclamationCircle className="text-red-400" />}
              {toast.type === 'info' && <HiInformationCircle className="text-orange-400" />}
            </div>
            <p className="text-sm font-medium leading-snug flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white p-1 transition-colors rounded-lg"
              aria-label="Close"
            >
              <HiX className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
};
