import React from 'react';

const TourTooltip = ({ step, isOpen, onClose, onNext, onPrev, totalSteps }) => {
  if (!isOpen || !step) return null;

  const { target, title, content, position = 'bottom' } = step;

  const targetElement = document.querySelector(target);
  if (!targetElement) return null;

  const rect = targetElement.getBoundingClientRect();
  
  const tooltipStyle = {
    position: 'fixed',
    left: rect.left + rect.width / 2,
    top: position === 'bottom' 
      ? rect.bottom + 10 
      : rect.top - 200,
    transform: 'translateX(-50%)',
    zIndex: 10000,
  };

  return (
    <div className="fixed inset-0   z-9999">
      <div 
        className="absolute bg-white p-4 rounded-lg shadow-xl max-w-xs z-10000"
        style={tooltipStyle}
      >
        <div className="mb-2 font-semibold">{title}</div>
        <div className="mb-4 text-sm">{content}</div>
        <div className="flex justify-between items-center">
          <div>
            {step.index > 0 && (
              <button 
                onClick={onPrev}
                className="px-3 py-1 bg-gray-200 rounded mr-2"
              >
                Previous
              </button>
            )}
          </div>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-3">
              {step.index + 1} of {totalSteps}
            </span>
            <button 
              onClick={onClose}
              className="px-3 py-1 bg-gray-200 rounded mr-2"
            >
              Close
            </button>
            <button 
              onClick={onNext}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              {step.index === totalSteps - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourTooltip;