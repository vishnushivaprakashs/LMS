import { createContext, useContext, useState, useCallback } from 'react';
import Toast from './Toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const MAX_TOASTS = 3;

  const showToast = useCallback((message, type = 'success', duration) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };

    setToasts((prev) => {
      // Limit to MAX_TOASTS
      const updated = [...prev, newToast];
      return updated.slice(-MAX_TOASTS);
    });

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed top-24 right-6 z-[9999] space-y-3">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{
              transform: `translateY(${index * 4}px)`,
              transition: 'transform 150ms ease-out'
            }}
          >
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
