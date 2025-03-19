import React, { useState } from "react";
import AddOrganization from "./addOrganization";
import OrganizationTable from "./OrganizationTable";

const OrganizationPage = () => {
  const [search,setSearch]=useState("");
  const [organizations, setOrganizations] = useState([]);
  
  const addNewOrganization =  (newOrg) => {
    setOrganizations((prev) => [...prev, newOrg]); // Update state without refresh
    // await fetchOrganizations();
  };
  return (
    <div>
      <AddOrganization /* setIsModalOpen={setIsModalOpen} */ addNewOrganization={addNewOrganization}search={search} setSearch={setSearch} />
      <OrganizationTable organizations={organizations} search={search}  setOrganizations={setOrganizations} />
    </div>
  );
};

export default OrganizationPage;
