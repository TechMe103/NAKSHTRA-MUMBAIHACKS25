import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData, Notification } from '@/contexts/DataContext';
import { FaPlus, FaTrash, FaCheckCircle, FaCircle } from 'react-icons/fa';
import { ToastContainer, ToastMessage } from '@/components/Toast';

export default function Notifications() {
  const { state, dispatch } = useData();
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [formData, setFormData] = useState({
    message: '',
  });

  const addToast = (message: string, type: ToastMessage['type']) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const { unread, read } = useMemo(() => {
    return {
      unread: state.notifications.filter((n) => !n.read),
      read: state.notifications.filter((n) => n.read),
    };
  }, [state.notifications]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.message) {
      addToast('Please enter a message', 'error');
      return;
    }

    const notification: Notification = {
      id: Date.now().toString(),
      message: formData.message,
      date: new Date().toISOString().split('T')[0],
      read: false,
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    addToast('Notification added successfully', 'success');
    setShowModal(false);
    setFormData({ message: '' });
  };

  const handleToggleRead = (id: string) => {
    const notification = state.notifications.find((n) => n.id === id);
    if (notification) {
      dispatch({
        type: 'UPDATE_NOTIFICATION',
        payload: { ...notification, read: !notification.read },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this notification?')) {
      dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
      addToast('Notification deleted', 'success');
    }
  };

  const handleBulkMarkRead = () => {
    if (selectedIds.length === 0) return;
    dispatch({ type: 'MARK_NOTIFICATIONS_READ', payload: selectedIds });
    setSelectedIds([]);
    addToast(`${selectedIds.length} notification(s) marked as read`, 'success');
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.length} notification(s)?`)) {
      selectedIds.forEach((id) => {
        dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
      });
      setSelectedIds([]);
      addToast(`${selectedIds.length} notification(s) deleted`, 'success');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const NotificationItem = ({ notification, index }: { notification: Notification; index: number }) => {
    const isSelected = selectedIds.includes(notification.id);

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`flex items-start gap-4 p-4 border-b border-border last:border-0 hover:bg-secondary/50 transition-colors ${
          !notification.read ? 'bg-primary/5' : ''
        }`}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleSelect(notification.id)}
          className="mt-1 w-4 h-4 accent-primary"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            {!notification.read && <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />}
            <div className="flex-1">
              <p className={`text-sm ${!notification.read ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                {notification.message}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => handleToggleRead(notification.id)}
            className={`p-2 rounded-lg transition-colors ${
              notification.read
                ? 'text-muted-foreground hover:bg-secondary'
                : 'text-success hover:bg-success/10'
            }`}
            title={notification.read ? 'Mark as unread' : 'Mark as read'}
          >
            {notification.read ? <FaCircle /> : <FaCheckCircle />}
          </button>
          <button
            onClick={() => handleDelete(notification.id)}
            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <FaTrash />
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {unread.length} unread, {read.length} read
          </p>
        </div>
        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <>
              <button
                onClick={handleBulkMarkRead}
                className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors"
              >
                <FaCheckCircle /> Mark Read ({selectedIds.length})
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors"
              >
                <FaTrash /> Delete ({selectedIds.length})
              </button>
            </>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-glow transition-colors"
          >
            <FaPlus /> Add Notification
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unread */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          <div className="bg-secondary border-b border-border p-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              Unread ({unread.length})
            </h3>
          </div>
          <div className="max-h-[600px] overflow-y-auto scrollbar-thin">
            {unread.length === 0 ? (
              <p className="p-8 text-center text-muted-foreground">No unread notifications</p>
            ) : (
              unread.map((notification, index) => (
                <NotificationItem key={notification.id} notification={notification} index={index} />
              ))
            )}
          </div>
        </motion.div>

        {/* Read */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          <div className="bg-secondary border-b border-border p-4">
            <h3 className="font-semibold text-foreground">Read ({read.length})</h3>
          </div>
          <div className="max-h-[600px] overflow-y-auto scrollbar-thin">
            {read.length === 0 ? (
              <p className="p-8 text-center text-muted-foreground">No read notifications</p>
            ) : (
              read.map((notification, index) => (
                <NotificationItem key={notification.id} notification={notification} index={index} />
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Timeline View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-6">Timeline</h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
          {state.notifications.slice(0, 10).map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-10 pb-6 last:pb-0"
            >
              <div
                className={`absolute left-2.5 w-3 h-3 rounded-full border-2 border-background ${
                  notification.read ? 'bg-muted' : 'bg-primary'
                }`}
              />
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-sm text-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={() => {
              setShowModal(false);
              setFormData({ message: '' });
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-elevated"
            >
              <h3 className="text-xl font-semibold text-foreground mb-4">Add Notification</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ message: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary border border-input rounded-lg text-foreground min-h-[100px]"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setFormData({ message: '' });
                    }}
                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-glow transition-colors"
                  >
                    Add
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
