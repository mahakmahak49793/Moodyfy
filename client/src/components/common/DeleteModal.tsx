// components/common/DeleteModal.tsx
interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  message?: string;
}

export const DeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  loading = false,
  title = "Delete entry?",
  message = "This entry will be permanently removed. This action cannot be undone."
}: DeleteModalProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full">
        <h3 className="font-serif italic text-xl text-slate-800 mb-2">{title}</h3>
        <p className="text-sm font-light text-slate-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-full border border-slate-300/60 bg-white/50 px-4 py-2 text-sm font-light text-slate-700 hover:bg-white/80 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-full bg-rose-500/90 hover:bg-rose-600 text-white px-4 py-2 text-sm font-light transition-all disabled:opacity-50"
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};