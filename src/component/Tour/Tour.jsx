// import React from 'react';

// import { useTour } from './TourContext';
// import TourTooltip from './TourTooltip';

// const Tour = () => {
//   const { isTourOpen, tourStep, tourSteps, nextStep, prevStep, closeTour } = useTour();

//   if (!isTourOpen || tourSteps.length === 0) return null;

//   const currentStep = {
//     ...tourSteps[tourStep],
//     index: tourStep,
//   };

//   return (
//     <TourTooltip
//       step={currentStep}
//       isOpen={isTourOpen}
//       onClose={closeTour}
//       onNext={nextStep}
//       onPrev={prevStep}
//       totalSteps={tourSteps.length}
//     />
//   );
// };

// export default Tour;



// import React, { useState, useEffect } from 'react';

// const Tour = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [tourSteps, setTourSteps] = useState([]);

//   useEffect(() => {
//     // Initialize tour steps with detailed content
//     const steps = [
//       {
//         target: '#sidebar-dashboard',
//         title: "Dashboard Overview",
//         content: (
//           <div className="space-y-2">
//             <p>Your central hub for all business metrics and performance indicators:</p>
//             <ul className="list-disc pl-5 space-y-1">
//               <li><strong>Total Deals:</strong> Track all active opportunities in your pipeline</li>
//               <li><strong>Deals Won:</strong> Monitor successfully closed deals</li>
//               <li><strong>Revenue:</strong> View total revenue generated</li>
//               <li><strong>Pending Invoices:</strong> Keep track of outstanding payments</li>
//               <li><strong>Sales Pipeline:</strong> Visual representation of deals across stages</li>
//               <li><strong>Revenue Overview:</strong> Monthly/quarterly revenue trends</li>
//               <li><strong>Deals Performance:</strong> Analyze win rates and conversion metrics</li>
//               <li><strong>Deal Distribution:</strong> See how deals are spread across categories</li>
//             </ul>
//           </div>
//         ),
//         placement: "right",
//         disableBeacon: true,
//       },
//       {
//         target: '#sidebar-leads',
//         title: "Leads Management",
//         content: (
//           <div className="space-y-2">
//             <p>Comprehensive lead management system to convert prospects into customers:</p>
//             <ul className="list-disc pl-5 space-y-1">
//               <li><strong>Create Lead:</strong> Add new leads with detailed contact information</li>
//               <li><strong>Advanced Filtering:</strong> Segment leads by status, source, or custom criteria</li>
//               <li><strong>Convert to Deal:</strong> Transform qualified leads into deals with one click</li>
//               <li><strong>Edit & Delete:</strong> Modify lead details or remove outdated entries</li>
//               <li><strong>Update Information:</strong> Keep lead records current with interaction history</li>
//               <li><strong>Complete Details:</strong> Access all lead information including notes, activities, and communication history</li>
//             </ul>
//           </div>
//         ),
//         placement: "right"
//       },
//       {
//         target: '#sidebar-deals',
//         title: "Deals Management",
//         content: (
//           <div className="space-y-2">
//             <p>End-to-end deal management to drive your sales process:</p>
//             <ul className="list-disc pl-5 space-y-1">
//               <li><strong>Create Deals:</strong> Set up new deals with customized parameters</li>
//               <li><strong>Edit & Delete:</strong> Modify deal terms or remove deals as needed</li>
//               <li><strong>Update Progress:</strong> Change deal stages and update probabilities</li>
//               <li><strong>Deal Information:</strong> View comprehensive details including value, timeline, and stakeholders</li>
//               <li><strong>Advanced Filtering:</strong> Organize deals by size, stage, owner, or custom fields</li>
//               <li><strong>Conversion Tracking:</strong> Monitor which leads successfully convert to deals</li>
//             </ul>
//           </div>
//         ),
//         placement: "right"
//       },
//       {
//         target: '#sidebar-pipeline',
//         title: "Pipeline Visualization",
//         content: (
//           <div className="space-y-2">
//             <p>Visual pipeline with 5 key stages to manage your sales process:</p>
//             <ul className="list-disc pl-5 space-y-1">
//               <li><strong>Qualification:</strong> Initial stage where potential deals are evaluated</li>
//               <li><strong>Negotiation:</strong> Terms and pricing discussions with prospects</li>
//               <li><strong>Proposal Sent:</strong> Formal offers delivered to clients</li>
//               <li><strong>Closed Won:</strong> Successfully secured deals</li>
//               <li><strong>Closed Lost:</strong> Unsuccessful deals with reason tracking</li>
//             </ul>
//             <p>Easily drag and drop deals between stages, click on any deal to view complete information including attachments, creation date, last update, and related activities. Add new deals directly from the pipeline view.</p>
//           </div>
//         ),
//         placement: "right"
//       },
//       {
//         target: '#sidebar-invoices',
//         title: "Invoice Management",
//         content: (
//           <div className="space-y-2">
//             <p>Comprehensive billing and invoice tracking system:</p>
//             <ul className="list-disc pl-5 space-y-1">
//               <li><strong>Total Paid:</strong> Track all received payments</li>
//               <li><strong>Total Amount:</strong> Monitor overall invoice values</li>
//               <li><strong>Total Due:</strong> Identify outstanding payments</li>
//               <li><strong>Create Invoices:</strong> Generate professional invoices quickly</li>
//               <li><strong>Advanced Filters:</strong> Sort invoices by status, date, client, or amount</li>
//               <li><strong>Edit & Delete:</strong> Modify invoice details or remove incorrect entries</li>
//               <li><strong>Update Status:</strong> Mark invoices as paid, pending, or overdue</li>
//               <li><strong>Email Integration:</strong> Send invoices directly to clients</li>
//               <li><strong>PDF Export:</strong> Download invoices for records or physical mailing</li>
//             </ul>
//           </div>
//         ),
//         placement: "right"
//       },
//       {
//         target: '#sidebar-activities',
//         title: "Activities & Calendar",
//         content: (
//           <div className="space-y-2">
//             <p>Complete activity management with multiple viewing options:</p>
//             <ul className="list-disc pl-5 space-y-1">
//               <li><strong>Calendar Integration:</strong> Automatically generated meetings and events</li>
//               <li><strong>Add Activities:</strong> Schedule calls, meetings, tasks, and reminders</li>
//               <li><strong>Multiple Views:</strong> Switch between month, week, and day perspectives</li>
//               <li><strong>Yearly Overview:</strong> Plan long-term activities and milestones</li>
//               <li><strong>Meeting Details:</strong> Access complete information for all scheduled activities</li>
//               <li><strong>Visual Scheduling:</strong> Color-coded events based on type and priority</li>
//             </ul>
//           </div>
//         ),
//         placement: "right"
//       },
//       {
//         target: '#sidebar-activityList',
//         title: "Activity List Management",
//         content: (
//           <div className="space-y-2">
//             <p>Detailed list view for all your activities and tasks:</p>
//             <ul className="list-disc pl-5 space-y-1">
//               <li><strong>Add Activities:</strong> Create new tasks, calls, or meetings with detailed parameters</li>
//               <li><strong>Advanced Filtering:</strong> Sort activities by type, date, priority, or assigned person</li>
//               <li><strong>Schedule Management:</strong> Plan and organize meetings and calls efficiently</li>
//               <li><strong>Email Integration:</strong> Track and log email communications</li>
//               <li><strong>Edit & Delete:</strong> Modify activity details or remove completed items</li>
//               <li><strong>Update Progress:</strong> Change status and add follow-up notes</li>
//               <li><strong>Completion Tracking:</strong> Monitor finished versus pending activities</li>
//             </ul>
//           </div>
//         ),
//         placement: "right"
//       },
//       {
//         target: '#sidebar-users',
//         title: "User & Role Management",
//         content: (
//           <div className="space-y-2">
//             <p>Comprehensive system administration and access control:</p>
//             <ul className="list-disc pl-5 space-y-1">
//               <li><strong>Add Users:</strong> Create new user accounts with appropriate permissions</li>
//               <li><strong>Create Roles:</strong> Define custom roles with specific access rights</li>
//               <li><strong>Advanced Filtering:</strong> Organize users by role, department, or status</li>
//               <li><strong>Add/Edit Permissions:</strong> Fine-tune what each user can access and modify</li>
//               <li><strong>Update Details:</strong> Modify user information and access levels</li>
//               <li><strong>Delete Users:</strong> Remove former employees or inactive accounts</li>
//               <li><strong>Access Logs:</strong> Track user activity and system changes</li>
//             </ul>
//           </div>
//         ),
//         placement: "right"
//       },
//       {
//         target: '#sidebar-tourButton',
//         title: "Need Additional Help?",
//         content: (
//           <div className="space-y-2">
//             <p>You can always restart this guided tour by clicking the help button in the sidebar.</p>
//             <p>For additional support:</p>
//             <ul className="list-disc pl-5 space-y-1">
//               <li>Check our knowledge base for detailed articles</li>
//               <li>Contact our support team during business hours</li>
//               <li>Join our weekly training webinars</li>
//             </ul>
//           </div>
//         ),
//         placement: "right"
//       }
//     ];
    
//     setTourSteps(steps);
//     setIsOpen(true);
//   }, []);

//   const nextStep = () => {
//     if (currentStep < tourSteps.length - 1) {
//       setCurrentStep(currentStep + 1);
//     } else {
//       setIsOpen(false);
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 0) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const endTour = () => {
//     setIsOpen(false);
//     setCurrentStep(0);
//   };

//   if (tourSteps.length === 0 || !isOpen) return null;

//   const currentTourStep = tourSteps[currentStep];
//   const progressValue = (currentStep / (tourSteps.length - 1)) * 100;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//       <div className="bg-background rounded-lg max-w-md w-full mx-4 p-6 shadow-lg">
//         <div className="mb-4">
//           <h3 className="text-lg font-semibold text-foreground">{currentTourStep.title}</h3>
//           <div className="mt-2 text-muted-foreground max-h-60 overflow-y-auto">
//             {currentTourStep.content}
//           </div>
//         </div>
        
//         <div className="flex items-center justify-between mt-4">
//           <div className="text-sm text-muted-foreground">
//             Step {currentStep + 1} of {tourSteps.length}
//           </div>
//           <div className="w-1/2 bg-secondary rounded-full h-2">
//             <div
//               className="bg-primary h-2 rounded-full transition-all duration-300"
//               style={{ width: `${progressValue}%` }}
//             ></div>
//           </div>
//         </div>
        
//         <div className="flex justify-between mt-6">
//           <div>
//             <button
//               className="px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
//               onClick={prevStep}
//               disabled={currentStep === 0}
//             >
//               Previous
//             </button>
//           </div>
          
//           <div className="flex gap-2">
//             <button
//               className="px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
//               onClick={endTour}
//             >
//               Exit Tour
//             </button>
//             <button
//               className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
//               onClick={nextStep}
//             >
//               {currentStep === tourSteps.length - 1 ? 'Finish Tour' : 'Next'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Tour;


// import React, { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "../../components/ui/dialog";
// import { Progress } from "../../components/ui/progress";
// import { Button } from "../../components/ui/button";
// import { useTour } from "./TourContext";

// const Tour = () => {
//   const { isTourOpen, currentStep, tourSteps, nextStep, prevStep, endTour } = useTour();

//   if (!isTourOpen || tourSteps.length === 0) return null;

//   const currentTourStep = tourSteps[currentStep];
//   const progressValue = (currentStep / (tourSteps.length - 1)) * 100;

//   return (
//     <Dialog open={isTourOpen} onOpenChange={endTour}>
//       <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>{currentTourStep.title}</DialogTitle>
//           <DialogDescription asChild>
//             <div className="mt-2 max-h-60 overflow-y-auto">
//               {currentTourStep.content}
//             </div>
//           </DialogDescription>
//         </DialogHeader>
        
//         <div className="flex items-center justify-between mt-4">
//           <div className="text-sm text-muted-foreground">
//             Step {currentStep + 1} of {tourSteps.length}
//           </div>
//           <Progress value={progressValue} className="w-1/2" />
//         </div>
        
//         <div className="flex justify-between mt-6">
//           <div>
//             <Button
//               variant="outline"
//               onClick={prevStep}
//               disabled={currentStep === 0}
//             >
//               Previous
//             </Button>
//           </div>
          
//           <div className="flex space-x-2">
//             <Button
//               variant="outline"
//               onClick={endTour}
//             >
//               Exit Tour
//             </Button>
//             <Button
//               onClick={nextStep}
//             >
//               {currentStep === tourSteps.length - 1 ? 'Finish Tour' : 'Next'}
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default Tour;


import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { useTour } from "./TourContext";

const Tour = () => {
  const { isTourOpen, currentStep, tourSteps, nextStep, prevStep, endTour } = useTour();

  if (!isTourOpen || tourSteps.length === 0) return null;

  const currentTourStep = tourSteps[currentStep];

  return (
    <Dialog open={isTourOpen} onOpenChange={endTour}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{currentTourStep.title}</DialogTitle>
          <DialogDescription asChild>
            <div className="mt-2 max-h-60 overflow-y-auto">
              {currentTourStep.content}
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {tourSteps.length}
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <div>
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={endTour}
            >
              Exit Tour
            </Button>
            <Button 
              onClick={nextStep}
            >
              {currentStep === tourSteps.length - 1 ? 'Finish Tour' : 'Next'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Tour;