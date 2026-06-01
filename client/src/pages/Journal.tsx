import { useEffect, useState } from "react";
import JournalForm from "../components/journal/JournalForm";
import JournalSidebar from "../components/journal/JournalSidebar";
import { DeleteModal } from "../components/common/DeleteModal";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getJournals, updateJournal, deleteJournal, clearError } from "../features/journal/journalSlice";
import type { Journal as JournalType } from "../features/journal/journalTypes";
import { useLocation } from "react-router-dom";
import ReadView from "../components/journal/ReadView";
import EditView from "../components/journal/EditView";
import BackgroundImage from "../components/common/BackgroundImage";
import toast from "react-hot-toast";

type ViewMode = "read" | "edit" | "new";

const Journal = () => {
  const dispatch = useAppDispatch();

  const { journals, loading, error } = useAppSelector((state) => state.journal);

  const [activeJournal, setActiveJournal] = useState<JournalType | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("new");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const location = useLocation();

  // fetch journals on mount
  useEffect(() => {
    dispatch(getJournals());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    const entryId = location.state?.entryId;
    if (entryId && journals.length > 0) {
      const match = journals.find((j: JournalType) => j._id === entryId);
      if (match) {
        setActiveJournal(match);
        setViewMode("read");
      }
    }
  }, [journals, location.state]);

  useEffect(() => {
    if (activeJournal) {
      const updated = journals.find((j: JournalType) => j._id === activeJournal._id);
      if (updated) setActiveJournal(updated);
    }
  }, [journals]);

  const handleEntryClick = (journal: JournalType) => {
    setActiveJournal(journal);
    setViewMode("read");
    setIsSidebarOpen(false);
  };

  const handleBack = () => {
    setActiveJournal(null);
    setViewMode("new");
  };

  const handleDeleteConfirm = async () => {
    if (!activeJournal) return;
    const result = await dispatch(deleteJournal(activeJournal._id));
    if (deleteJournal.fulfilled.match(result)) {
      toast.success("Journal deleted");
      setShowDeleteModal(false);
      setActiveJournal(null);
      setViewMode("new");
    }
  };

  const handleSave = async (data: { title: string; content: string; mood: string }) => {
    if (!activeJournal) return;
    const result = await dispatch(updateJournal({ id: activeJournal._id, ...data }));
    if (updateJournal.fulfilled.match(result)) {
      toast.success("Journal updated");
      setViewMode("read");
    }
  };

  return (
    <>
      <BackgroundImage />
      <div className="w-full min-h-screen font-serif">
        <div className="flex w-full min-h-screen">
          <JournalSidebar
            journals={journals}
            activeJournalId={activeJournal?._id || null}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onEntryClick={handleEntryClick}
          />

          <div className="flex-1 flex flex-col bg-transparent min-h-screen">
            {activeJournal && viewMode === "read" && (
              <ReadView
                journal={activeJournal}
                onBack={handleBack}
                onEdit={() => setViewMode("edit")}
                onDelete={() => setShowDeleteModal(true)}
              />
            )}

            {activeJournal && viewMode === "edit" && (
              <EditView
                journal={activeJournal}
                onCancel={() => setViewMode("read")}
                onSave={handleSave}
                saving={loading}
              />
            )}

            {(!activeJournal || viewMode === "new") && (
              <JournalForm
                journalsCount={journals.length}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              />
            )}
          </div>
        </div>
      </div>

      {showDeleteModal && (
       <DeleteModal
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  onConfirm={handleDeleteConfirm}
  loading={loading}
/>
      )}
    </>
  );
};

export default Journal;