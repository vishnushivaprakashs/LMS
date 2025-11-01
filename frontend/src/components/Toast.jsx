import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration }) => {
  // Set duration based on type if not explicitly provided
  const autoDismissDuration = duration || (type === 'error' ? 5000 : 3000);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, autoDismissDuration);

    return () => clearTimeout(timer);
  }, [autoDismissDuration, onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />
  };

  const styles = {
    success: 'bg-blue-600 text-white shadow-lg',
    error: 'bg-slate-900 text-white shadow-lg',
    warning: 'bg-yellow-500 text-white shadow-lg'
  };

  const iconColors = {
    success: 'text-white',
    error: 'text-red-400',
    warning: 'text-white'
  };

  return (
    <div className="fixed top-24 right-6 z-[9999] animate-slide-down">
      <div className={`${styles[type]} rounded-xl shadow-2xl p-4 pr-10 min-w-[320px] max-w-md backdrop-blur-sm`}>
        <div className="flex items-start space-x-3">
          <div className={iconColors[type]}>
            {icons[type]}
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm leading-relaxed">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
