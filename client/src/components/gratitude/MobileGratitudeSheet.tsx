import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Gratitude } from "../../features/gratitude/gratitudeTypes";

interface MobileGratitudeSheetProps {
  gratitude: Gratitude | null;
  onClose: () => void;
  onSave: (id: string, text: string) => void;
  loading?: boolean;
}

const MobileGratitudeSheet = ({
  gratitude,
  onClose,
  onSave,
  loading = false,
}: MobileGratitudeSheetProps) => {
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (gratitude) {
      setEditText(gratitude.text);
    }
  }, [gratitude]);

  const handleSave = () => {
    if (gratitude && editText.trim() && !loading) {
      onSave(gratitude._id, editText);
      onClose();
    }
  };

  if (!gratitude) return null;

  const formattedDate = new Date(gratitude.createdAt).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = new Date(gratitude.createdAt).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <AnimatePresence>
      {gratitude && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Sheet - Increased height to full screen */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
className="
  fixed bottom-0 left-0 right-0 z-50 lg:hidden
  rounded-t-3xl bg-white/95 backdrop-blur-xl
  border-t border-teal-200/60 shadow-2xl
  flex flex-col
  h-[80vh] max-h-[80vh]
"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-teal-300/50" />
            </div>

            {/* Header - flex-shrink-0 prevents scrolling */}
            <div className="px-5 pt-3 pb-4 border-b border-teal-200/40 flex-shrink-0">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-teal-100 border border-teal-300 text-teal-700">
                  ✨ Gratitude
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-slate-500">
                    {formattedTime}
                  </span>
                  <span className="font-mono text-xs font-semibold text-teal-600">
                    {formattedDate}
                  </span>
                </div>
              </div>
              <h3 className="font-serif italic font-light text-teal-800 text-lg leading-snug">
                Edit your grateful moment
              </h3>
            </div>

            {/* Scrollable content - Textarea for editing with no scrollbar */}
            <div className="flex-1 px-5 py-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              <div className="relative">
                {/* Decorative quote marks */}
                <div className="absolute -top-2 -left-2 text-3xl text-teal-300/30 font-serif">"</div>
                <div className="absolute -bottom-2 -right-2 text-3xl text-teal-300/30 font-serif">"</div>
                
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={10}
                  className="w-full p-4 bg-teal-50/40 border border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent font-serif italic text-slate-700 text-base leading-relaxed resize-none"
                  placeholder="Edit your gratitude..."
                  autoFocus
                />
              </div>

              {/* Character count */}
              <div className="mt-2 text-right">
                <span className="text-[10px] font-mono text-slate-400">
                  {editText.length} characters
                </span>
              </div>
            </div>

            {/* Action buttons - Sticky at bottom with flex-shrink-0 */}
            <div className="flex-shrink-0 px-5 pt-3 pb-6 flex gap-3 border-t border-teal-200/40 bg-white/80 backdrop-blur-sm">
              <button
                onClick={onClose}
                className="flex-1 rounded-full border border-slate-300/60 bg-white/50 py-3 text-sm font-light text-slate-700 hover:bg-white/70 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!editText.trim() || loading}
                className="flex-[2] rounded-full border border-teal-400/60 bg-teal-500/20 py-3 text-sm font-medium text-teal-900
                  hover:bg-teal-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-3 h-3 rounded-full border border-teal-700/50 border-t-teal-700 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>✨ Save Changes</>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileGratitudeSheet;