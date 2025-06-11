import React, { useState } from "react";
import LeadGroupsTable from "./LeadGroupTable";
import AddLeadGroup from "./AddLeadGroup";

const LeadsGroup = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadGroups, setLeadGroups] = useState([]); 

  return (
    <div>
      <LeadGroupsTable onOpen={() => setIsModalOpen(true)} leadGroups={leadGroups} setLeadGroups={setLeadGroups} />
      {isModalOpen && <AddLeadGroup onClose={() => setIsModalOpen(false)} onAdd={(newLeadGroup) => {
        setLeadGroups((prev) => [...prev, newLeadGroup]); 
        setIsModalOpen(false);
      }} />}
      
    </div>
  );
};

export default LeadsGroup;
