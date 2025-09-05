// import React, { createContext, useContext, useState } from 'react';

// const TourContext = createContext();

// export const useTour = () => {
//   const context = useContext(TourContext);
//   if (!context) {
//     throw new Error('useTour must be used within a TourProvider');
//   }
//   return context;
// };

// export const TourProvider = ({ children }) => {
//   const [isTourOpen, setIsTourOpen] = useState(false);
//   const [tourStep, setTourStep] = useState(0);
//   const [tourSteps, setTourSteps] = useState([]);

//   const startTour = (steps) => {
//     setTourSteps(steps);
//     setTourStep(0);
//     setIsTourOpen(true);
//   };

//   const nextStep = () => {
//     if (tourStep < tourSteps.length - 1) {
//       setTourStep(tourStep + 1);
//     } else {
//       setIsTourOpen(false);
//     }
//   };

//   const prevStep = () => {
//     if (tourStep > 0) {
//       setTourStep(tourStep - 1);
//     }
//   };

//   const closeTour = () => {
//     setIsTourOpen(false);
//     setTourStep(0);
//   };

//   const value = {
//     isTourOpen,
//     tourStep,
//     tourSteps,
//     startTour,
//     nextStep,
//     prevStep,
//     closeTour,
//   };

//   return (
//     <TourContext.Provider value={value}>
//       {children}
//     </TourContext.Provider>
//   );
// };

// TourContext.js
// import React, { createContext, useContext, useState } from 'react';

// const TourContext = createContext();

// export const useTour = () => {
//   const context = useContext(TourContext);
//   if (!context) {
//     throw new Error('useTour must be used within a TourProvider');
//   }
//   return context;
// };

// export const TourProvider = ({ children }) => {
//   const [isTourOpen, setIsTourOpen] = useState(false);
//   const [tourSteps, setTourSteps] = useState([]);
//   const [currentStep, setCurrentStep] = useState(0);

//   const startTour = (steps) => {
//     setTourSteps(steps);
//     setCurrentStep(0);
//     setIsTourOpen(true);
    
//     // Execute the first step's action
//     if (steps.length > 0 && steps[0].action) {
//       steps[0].action();
//     }
//   };

//   const nextStep = () => {
//     if (currentStep < tourSteps.length - 1) {
//       const nextStepIndex = currentStep + 1;
//       setCurrentStep(nextStepIndex);
      
//       // Execute the action for the next step
//       if (tourSteps[nextStepIndex].action) {
//         tourSteps[nextStepIndex].action();
//       }
//     } else {
//       endTour();
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 0) {
//       const prevStepIndex = currentStep - 1;
//       setCurrentStep(prevStepIndex);
      
//       // Execute the action for the previous step
//       if (tourSteps[prevStepIndex].action) {
//         tourSteps[prevStepIndex].action();
//       }
//     }
//   };

//   const endTour = () => {
//     setIsTourOpen(false);
//     setCurrentStep(0);
//     setTourSteps([]);
//   };

//   const value = {
//     isTourOpen,
//     currentStep,
//     tourSteps,
//     startTour,
//     nextStep,
//     prevStep,
//     endTour,
//   };

//   return (
//     <TourContext.Provider value={value}>
//       {children}
//     </TourContext.Provider>
//   );
// };


import React, { createContext, useContext, useState } from 'react';

const TourContext = createContext();

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

export const TourProvider = ({ children }) => {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tourSteps, setTourSteps] = useState([]);

  const startTour = (steps) => {
    setTourSteps(steps);
    setCurrentStep(0);
    setIsTourOpen(true);
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsTourOpen(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const endTour = () => {
    setIsTourOpen(false);
    setCurrentStep(0);
  };

  const value = {
    isTourOpen,
    currentStep,
    tourSteps,
    startTour,
    nextStep,
    prevStep,
    endTour,
  };

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
};