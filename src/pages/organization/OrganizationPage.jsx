
// import React, { useState, useEffect } from "react";
// import AddOrganization from "./AddOrganization";
// import OrganizationTable from "./OrganizationTable";
// import ModalOrganization from "./ModalOrganization";
// import axios from "axios";

// const OrganizationPage = () => {
//   const [search, setSearch] = useState("");
//   const [organizations, setOrganizations] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

//   const addNewOrganization = (newOrg) => {
//     setOrganizations((prev) => [...prev, newOrg]);
//   };

//   // ✅ Fetch organizations from API
//   const fetchOrganizations = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:5000/api/organization"
//       );
//       setOrganizations(response.data);
//     } catch (error) {
//       console.error("Error fetching organizations:", error);
//     }
//   };

//   // ✅ Run once on first mount
//   useEffect(() => {
//     fetchOrganizations();
//   }, []);

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   // Close modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <div>
//       <AddOrganization
//         search={search}
//         setSearch={setSearch}
//         refreshOrganizations={fetchOrganizations} // Pass this to modal
//         addNewOrganization={addNewOrganization}
//       />
//       <OrganizationTable
//         organizations={organizations}
//         search={search}
//         setOrganizations={setOrganizations}
//         refreshOrganizations={fetchOrganizations}
//       />

//       {isModalOpen && (
//         <ModalOrganization
//           addNewOrganization={(newOrg) => {
//             setOrganizations((prev) =>
//               prev.map((org) => (org._id === newOrg._id ? newOrg : org))
//             );
//           }}
//           closeModal={closeModal}
//         />
//       )}
//     </div>
//   );
// };

// export default OrganizationPage;


import React, { useState, useEffect } from "react";
import AddOrganization from "./AddOrganization";
import OrganizationTable from "./OrganizationTable";
import ModalOrganization from "./ModalOrganization";
import axios from "axios";

const OrganizationPage = () => {
  const [search, setSearch] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [currentOrganization, setCurrentOrganization] = useState(null); // Track the current organization being edited

  const addNewOrganization = (newOrg) => {
    setOrganizations((prev) => {
      const exists = prev.find((org) => org._id === newOrg._id);
      return exists
        ? prev.map((org) => (org._id === newOrg._id ? newOrg : org)) // Update existing organization
        : [...prev, newOrg]; // Add new organization
    });
  };

  // Fetch organizations from API
  const fetchOrganizations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/organization"
      );
      setOrganizations(response.data);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const openModal = (organization = null) => {
    setCurrentOrganization(organization); // Set organization for edit, or null for add
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentOrganization(null); // Reset the current organization when closing modal
  };

  return (
    <div>
      <AddOrganization
        search={search}
        setSearch={setSearch}
        refreshOrganizations={fetchOrganizations}
        addNewOrganization={addNewOrganization}
        openModal={openModal} // Pass openModal function to open modal
      />
      <OrganizationTable
        organizations={organizations}
        search={search}
        setOrganizations={setOrganizations}
        refreshOrganizations={fetchOrganizations}
        openModal={openModal} // Allow opening the modal to edit
      />

      {isModalOpen && (
        <ModalOrganization
          isOpen={isModalOpen}
          onClose={closeModal}
          organizationData={currentOrganization} // Pass the organization data (null for new)
          addNewOrganization={addNewOrganization}
          refreshOrganizations={fetchOrganizations}
        />
      )}
    </div>
  );
};

export default OrganizationPage;

