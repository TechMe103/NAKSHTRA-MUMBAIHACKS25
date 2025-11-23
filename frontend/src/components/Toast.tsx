import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Toast({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const icons = {
    success: <FaCheckCircle className="text-success" />,
    error: <FaExclamationCircle className="text-destructive" />,
    info: <FaInfoCircle className="text-primary" />,
  };

  const bgColors = {
    success: 'bg-success/10 border-success/20',
    error: 'bg-destructive/10 border-destructive/20',
    info: 'bg-primary/10 border-primary/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: 100 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-elevated ${bgColors[toast.type]} min-w-[300px]`}
    >
      {icons[toast.type]}
      <p className="text-sm text-foreground flex-1">{toast.message}</p>
      <button onClick={() => onRemove(toast.id)} className="text-muted-foreground hover:text-foreground">
        ×
      </button>
    </motion.div>
  );
}
