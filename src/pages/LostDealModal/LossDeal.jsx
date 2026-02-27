// LossDeal.jsx - UPDATED
import { useState, useCallback } from "react";

const LOSS_REASONS = [
  "Price too high",
  "No follow-up",
  "Competitor chosen",
  "No client decision",
  "Requirements mismatch",
  "Budget constraints",
  "Timing issues",
  "Lost to internal solution",
  "Poor product fit",
  "Communication breakdown",
];

const useLostDealModal = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [lossReason, setLossReason] = useState("");
  const [lossNotes, setLossNotes] = useState("");
  const [dealId, setDealId] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dealName, setDealName] = useState("");
  const [dealStage, setDealStage] = useState("");

  const resetModal = useCallback(() => {
    setLossReason("");
    setLossNotes("");
    setValidationError("");
    setDealId(null);
    setIsLoading(false);
    setDealName("");
    setDealStage("");
  }, []);

  const openModal = useCallback((deal) => {
    console.log("🔄 Opening modal for deal:", deal);
    setDealId(deal._id || null);
    setDealName(deal.dealName || "");
    setDealStage(deal.stage || "");
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    if (!isLoading) {
      setModalOpen(false);
      setTimeout(resetModal, 300);
    }
  }, [isLoading, resetModal]);

  const validateForm = useCallback(() => {
    // Clear previous validation error
    setValidationError("");
    
    // Validate loss reason
    if (!lossReason || lossReason.trim() === "") {
      setValidationError("Please select a loss reason to proceed");
      return false;
    }

    // Don't validate deal ID for new deals
    return true;
  }, [lossReason]);

  return {
    modalOpen,
    setModalOpen,
    lossReason,
    lossNotes,
    validationError,
    isLoading,
    dealName,
    dealId,
    dealStage,
    LOSS_REASONS,
    setLossReason,
    setLossNotes,
    openModal,
    closeModal,
    validateForm,
    resetModal,
    setIsLoading,
  };
};

export default useLostDealModal;