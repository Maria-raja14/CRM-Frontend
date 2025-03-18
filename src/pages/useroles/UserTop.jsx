import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const UserTop = () => {
  // State to store form values
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Control modal state
  const [openMenu, setOpenMenu] = useState(null); // Stores the ID of the clicked user

  const [search, setSearch] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [roleName, setRoleName] = useState("");
  const [roleSearch, setRoleSearch] = useState(""); // Fix naming
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [openViewModal, setOpenViewModal] = useState(false);
  // const [selectedRole, setSelectedRole] = useState(null);

  // const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [open, setOpen] = useState(false); // Control modal visibility
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    DateOB: "",
    profilePhoto: null,
    mobileNumber: "",
    address: "",
    password: "",
    email: "",
  });
  const [openUserModal, setOpenUserModal] = useState(false);
  const [selectedRoleUsers, setSelectedRoleUsers] = useState([]);

  const handleManageUsers = (role) => {
    setSelectedRole(role); // Store the selected role
    setOpenUserModal(true); // Open the modal
  };

  const handleAddClick = (role) => {
    setSelectedRole(role);
    setSelectedRoleUsers(role.users || []);
    setOpenUserModal(true);
  };

  const toggleShowAllUsers = (roleId) => {
    setShowAllUsers((prev) => ({ ...prev, [roleId]: !prev[roleId] }));
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/roles/getrole")
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  const fetchRoles = async () => {
    const res = await axios.get("http://localhost:5000/api/auth/roles/getrole");

    setRoles(res.data);
    console.log(res);
  };

  const fetchUsers = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/auth/adduser/getUser"
    );
    setUsers(res.data);
  };

  const filteredUsers = users.filter((user) =>
    `${user.email}`.toLowerCase().includes(search.toLowerCase())
  );
  const filteredRoles =
    roles?.filter((role) =>
      role.name.toLowerCase().includes(roleSearch.toLowerCase())
    ) || [];

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setFormData({
      firstName: "",
      lastName: "",
      gender: "",
      profilePhoto: null,
      mobileNumber: "",
      address: "",
      email: "",
    });
    setIsDialogOpen(false); // Close modal
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/roles/getrole")
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePhoto: e.target.files[0] });
  };

  const handleOpenAddUserModal = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/adduser/getUser"
      );
      const data = await response.json();
      setUsers(data);
      setOpenAddUserModal(true);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/adduser/register",
        formDataToSend,
        {
          headers: {
            "Content-Type": " application/json",
          },
        }
      );
      console.log("User Added:", response.data);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
  // Handle Add Role

  const handleAddRole = async () => {
    if (!roleName) {
      alert("Role name is required");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/roles/createrole",
        {
          name: roleName, // Make sure this matches your backend model
          permissions: formData.permissions, // Ensure permissions are passed correctly
        }
      );
      setRoles((prevRoles) => [...prevRoles, res.data]);
      setRoleName("");
      alert("Role added successfully");
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add role");
    }
  };

  // Handle Delete Role
  // const handleDeleteRole = async (id) => {
  //   try {
  //     await axios.delete(`http://localhost:5000/api/auth/roles/delete/${id}`);
  //     setRoles(roles.filter((role) => role._id !== id));
  //     toast.success("Role deleted successfully");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to delete role");
  //   }
  // };

  const handleAddUserToRole = async () => {
    // if (!selectedUser || !selectedRole) {
    //   alert("Please select a user and a role.");
    //   return;
    // }

    console.log("Adding user to role...");
    console.log("Selected Role: ", selectedRole);
    console.log("Selected User: ", selectedUser);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/auth/roles/update/${selectedRole._id}`,
        { users: [selectedUser._id] }
      );

      setRoles((prevRoles) =>
        prevRoles.map((role) =>
          role._id === response.data._id ? response.data : role
        )
      );

      alert("User added to role successfully!");
    } catch (err) {
      console.error(
        "Error adding user to role:",
        err.response ? err.response.data : err
      );
      alert("Failed to add user to role");
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setOpenEditModal(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
  
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    
    // Append file only if changed
    if (selectedUser.profilePhoto instanceof File) {
      formData.append("profilePhoto", selectedUser.profilePhoto);
    }
  
    try {
      const response = await fetch(`http://localhost:3004/users/${selectedUser._id}`, {
        method: "PUT",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
  
      alert("User updated successfully!");
      setOpenEditModal(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  

  return (
    <div className="">
      <div className="flex justify-between items-center   rounded-lg">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold text-gray-800">
            Users & Roles
          </h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#4B5563"
            className="text-gray-600"
          >
            <path d="M480-480q-60 0-102-42t-42-102q0-60 42-102t102-42q60 0 102 42t42 102q0 60-42 102t-102 42ZM192-192v-96q0-23 12.5-43.5T239-366q55-32 116.29-49 61.29-17 124.5-17t124.71 17Q666-398 721-366q22 13 34.5 34t12.5 44v96H192Zm72-72h432v-24q0-5.18-3.03-9.41-3.02-4.24-7.97-6.59-46-28-98-42t-107-14q-55 0-107 14t-98 42q-5 4-8 7.72-3 3.73-3 8.28v24Zm216.21-288Q510-552 531-573.21t21-51Q552-654 530.79-675t-51-21Q450-696 429-674.79t-21 51Q408-594 429.21-573t51 21Zm-.21-72Zm0 360Z" />
          </svg>
          <span className="text-gray-500">/</span>
          <p className="text-gray-600">Users & Roles</p>
        </div>

        {/* Right Section */}
        <div className="flex flex-wrap gap-3  overflow-y-auto items-center justify-center">
          {/* Add User Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="px-4 py-2  bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add User
              </button>
            </DialogTrigger>
            <DialogContent className=" md:max-w-2xl   w-full max-w-3xl sm:max-w-xl lg:max-w-4xl  max-h-screen min-h-[400px] overflow-y-auto ">
              <DialogHeader className="p-5">
                <DialogTitle className="text-lg font-bold">
                  Add New User
                </DialogTitle>
              </DialogHeader>

              {/* Profile Photo Upload */}
              <div className="flex justify-center py-5">
                <div className="relative w-28 h-28 flex items-center justify-center rounded-full border-2">
                  <div className="w-24 h-24 flex items-center justify-center rounded-full border-2 border-gray-300 overflow-hidden">
                    {formData.profilePhoto ? (
                      <img
                        src={URL.createObjectURL(formData.profilePhoto)}
                        alt="Profile Preview"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 rounded-full">
                        <img
                          src="https://static.vecteezy.com/system/resources/previews/020/429/953/non_2x/admin-icon-vector.jpg"
                          alt="User Icon"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <label className="absolute bottom-0 right-0 bg-[#008ecc] text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 flex items-center justify-center">
                    <input
                      type="file"
                      name="profilePhoto"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="18px"
                      viewBox="0 -960 960 960"
                      width="18px"
                      fill="white"
                    >
                      <path d="M480-264q72 0 120-49t48-119q0-69-48-118.5T480-600q-72 0-120 49.5t-48 119q0 69.5 48 118.5t120 49Zm0-72q-42 0-69-28.13T384-433q0-39.9 27-67.45Q438-528 480-528t69 27.55q27 27.55 27 67.45 0 40.74-27 68.87Q522-336 480-336ZM168-144q-29 0-50.5-21.5T96-216v-432q0-29 21.5-50.5T168-720h120l72-96h240l72 96h120q29.7 0 50.85 21.5Q864-677 864-648v432q0 29-21.15 50.5T792-144H168Zm0-72h624v-432H636l-72.1-96H396l-72 96H168v432Zm312-217Z" />
                    </svg>
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5 p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                      <label className="font-medium pb-1.5">First Name:</label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="p-2 border rounded-md w-full"
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-medium pb-1.5">Last Name:</label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="p-2 border rounded-md w-full"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                      <label className="font-medium pb-1.5">Gender:</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="p-2 border rounded-md w-full"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-medium pb-1.5">
                        Date Of Birth
                      </label>
                      <input
                        type="date"
                        value={formData.DateOB}
                        onChange={(e) =>
                          setFormData({ ...formData, DateOB: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                      <label className="font-medium pb-1.5">
                        Mobile Number:
                      </label>
                      <input
                        type="text"
                        name="mobileNumber"
                        placeholder="Mobile Number"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        className="p-2 border rounded-md w-full"
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-medium pb-1.5">Email:</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="p-2 border rounded-md w-full"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                      <label className="font-medium pb-1.5">Password:</label>
                      <input
                        type="text"
                        name="password"
                        placeholder=" Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="p-2 border rounded-md w-full"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-medium pb-1.5">Address:</label>
                      <textarea
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                        className="p-2 border rounded-md w-full"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row justify-end items-center border-t-2 p-5 gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 w-full sm:w-fit bg-gray-200 hover:bg-gray-300 text-black rounded-md"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 w-full sm:w-fit bg-[#008ecc] text-white rounded-md hover:shadow-lg"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Add Role Button */}

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Add Role
              </button>
            </DialogTrigger>
            <DialogContent className="sm:w-[400px] max-h-screen min-h-[290px] overflow-y-auto">
              <DialogHeader className="p-5 flex flex-row items-center justify-between">
                <DialogTitle className="text-lg font-bold">
                  Add New Role
                </DialogTitle>
              </DialogHeader>

              {/* Input Field */}
              <div className="grid justify-center items-center">
                <label className="font-medium">Role</label>
                <input
                  type="text"
                  name="role"
                  placeholder="Enter role name"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full sm:w-[300px] h-12 rounded-md px-3 border border-gray-300 focus:ring outline-none"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="border-b-2"></div>
              <div className="flex items-center justify-end gap-5 p-2">
                <button className="px-4 h-10 bg-gray-300 text-black rounded-lg hover:bg-gray-400">
                  Cancel
                </button>
                <button
                  onClick={handleAddRole}
                  className="px-4 h-10 bg-[#008ecc] hover:bg-[#005ecc] text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </DialogContent>
          </Dialog>
          {/* Invite User Button */}
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Invite User
          </button>
        </div>
      </div>

      {/* FirstName & LastName  */}

      <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
  <DialogContent className="md:max-w-2xl w-full max-w-3xl sm:max-w-xl lg:max-w-4xl max-h-screen min-h-[400px] overflow-y-auto">
    <DialogHeader className="p-5">
      <DialogTitle className="text-lg font-bold">Edit User</DialogTitle>
    </DialogHeader>

    {/* Profile Photo Upload */}
    <div className="flex justify-center py-5">
      <div className="relative w-28 h-28 flex items-center justify-center rounded-full border-2">
        <div className="w-24 h-24 flex items-center justify-center rounded-full border-2 border-gray-300 overflow-hidden">
     
            <img
              src="https://static.vecteezy.com/system/resources/previews/020/429/953/non_2x/admin-icon-vector.jpg"
              alt="User Icon"
              className="w-full h-full object-cover rounded-full"
            />
      
        </div>

        {/* Upload Button */}
        <label className="absolute bottom-0 right-0 bg-[#008ecc] text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 flex items-center justify-center">
          <input
            type="file"
            name="profilePhoto"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="18px"
            viewBox="0 -960 960 960"
            width="18px"
            fill="white"
          >
            <path d="M480-264q72 0 120-49t48-119q0-69-48-118.5T480-600q-72 0-120 49.5t-48 119q0 69.5 48 118.5t120 49Zm0-72q-42 0-69-28.13T384-433q0-39.9 27-67.45Q438-528 480-528t69 27.55q27 27.55 27 67.45 0 40.74-27 68.87Q522-336 480-336ZM168-144q-29 0-50.5-21.5T96-216v-432q0-29 21.5-50.5T168-720h120l72-96h240l72 96h120q29.7 0 50.85 21.5Q864-677 864-648v432q0 29-21.15 50.5T792-144H168Zm0-72h624v-432H636l-72.1-96H396l-72 96H168v432Zm312-217Z" />
          </svg>
        </label>
      </div>
    </div>

    {/* Form Fields */}
    <form onSubmit={handleUpdateUser}>
      <div className="flex flex-col gap-5 p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label className="font-medium pb-1.5">First Name:</label>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={selectedUser?.firstName || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, firstName: e.target.value })
              }
              className="p-2 border rounded-md w-full"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium pb-1.5">Last Name:</label>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={selectedUser?.lastName || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, lastName: e.target.value })
              }
              className="p-2 border rounded-md w-full"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label className="font-medium pb-1.5">Gender:</label>
            <select
              name="gender"
              value={selectedUser?.gender || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, gender: e.target.value })
              }
              className="p-2 border rounded-md w-full"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
          
            </select>
          </div>

          <div>
            <label className="font-medium pb-1.5">Date Of Birth:</label>
            <input
              type="date"
              value={selectedUser?.DateOB || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, DateOB: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label className="font-medium pb-1.5">Mobile Number:</label>
            <input
              type="text"
              name="mobileNumber"
              placeholder="Mobile Number"
              value={selectedUser?.mobileNumber || ""}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  mobileNumber: e.target.value,
                })
              }
              className="p-2 border rounded-md w-full"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium pb-1.5">Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={selectedUser?.email || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
              className="p-2 border rounded-md w-full"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label className="font-medium pb-1.5">Address:</label>
            <textarea
              name="address"
              placeholder="Address"
              value={selectedUser?.address || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, address: e.target.value })
              }
              className="p-2 border rounded-md w-full"
              required
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row justify-end items-center border-t-2 p-5 gap-3">
        <button
          type="button"
          onClick={() => setOpenEditModal(false)}
          className="px-4 py-2 w-full sm:w-fit bg-gray-200 hover:bg-gray-300 text-black rounded-md"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-4 py-2 w-full sm:w-fit bg-[#008ecc] text-white rounded-md hover:shadow-lg"
        >
          Save Changes
        </button>
      </div>
    </form>
  </DialogContent>
</Dialog>


      {/* Roles selections */}

      <Dialog open={openViewModal} onOpenChange={setOpenViewModal}>
        <DialogContent className=" min-w-[650px] h-[40vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg p-5 font-semibold">
              App Admin : Permission
            </DialogTitle>
          </DialogHeader>

          {/* Divider */}
          <div className="border-b"></div>

          {/* Role Details */}
          {selectedRole && (
            <div className="p-4 text-gray-700">
              <p>
                Managers perform user-related activities for specific modules of
                the application. Managers can view and manage(add/edit/delete)
                as well as all Leads, Deals, Proposals, Activities & Reports.
                Also can view a presentation of these data in the dashboard.
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="border-b"></div>

          {/* Close Button */}
          <div className="flex justify-end p-4">
            <button
              className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
              onClick={() => setOpenViewModal(false)}
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Users in models */}
      <Dialog open={openUserModal} onOpenChange={setOpenUserModal}>
        <DialogContent className="min-w-[600px] p-5 h-[400px]">
          <DialogHeader>
            <DialogTitle>Users in {selectedRole?.name}</DialogTitle>
          </DialogHeader>

          <div className="border-b"></div>

          {/* List Existing Users */}
          <div className="p-4">
            {selectedRole?.users && selectedRole.users.length > 0 ? (
              <ul>
                {selectedRole.users.map((user) => (
                  <li
                    key={user._id}
                    className="flex items-center  space-x-3 mb-2"
                  >
                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-300 text-white font-semibold text-lg">
                      {user.firstName && user.lastName ? (
                        `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`
                      ) : (
                        <span>?</span>
                      )}
                    </div>

                    <span>
                      {user.firstName} {user.lastName}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No users assigned</p>
            )}
          </div>

          <div className="border-b"></div>

          {/* Add Users Button */}
          <div className="p-4">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              onClick={handleOpenAddUserModal}
            >
              + Add
            </button>
          </div>

          {/* Close Button */}
          <div className="flex justify-end p-4">
            <button
              className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
              onClick={() => setOpenUserModal(false)}
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Users in roles */}
      <Dialog open={openAddUserModal} onOpenChange={setOpenAddUserModal}>
        <DialogContent className="min-w-[700px] p-10">
          <DialogHeader>
            <DialogTitle>Add Users to {selectedRole?.name}</DialogTitle>
          </DialogHeader>

          <div className="border-b"></div>

          {/* Users List */}
          <div className="p-4">
            {users.length > 0 ? (
              <ul>
                {users.map((user) => (
                  <li
                    key={user._id}
                    className="flex items-center space-x-3 mb-2"
                  >
                    <img
                      src={user.profilePhoto || "/default-profile.png"}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border"
                      onError={(e) => (e.target.src = "/default-profile.png")}
                    />
                    <span>{user.lastName}</span>
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      onClick={() => handleAddUserToRole(user)}
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No users available</p>
            )}
          </div>

          <div className="border-b"></div>

          <div className="flex justify-end p-4">
            <button
              className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
              onClick={() => setOpenAddUserModal(false)}
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-[38%_62%]  gap-5 mt-10">
        {/* Users Card */}
        <Card className="bg-white rounded-sm shadow-lg">
          {/* Header Section */}
          <div className="flex justify-between pt-5 items-center px-6">
            <h2 className="text-xl font-semibold mb-3">Users</h2>

            {/* Search Input */}
            <div className="relative flex flex-row items-center ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-[22px] transform -translate-y-1/2 w-7 h-6 text-gray-500"
                viewBox="0 -960 960 960"
                fill="#1f1f1f"
              >
                <path d="M765-144 526-383q-30 22-65.79 34.5-35.79 12.5-76.18 12.5Q284-336 214-406t-70-170q0-100 70-170t170-70q100 0 170 70t70 170.03q0 40.39-12.5 76.18Q599-464 577-434l239 239-51 51ZM384-408q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[220px] pl-10 pr-3 py-2 rounded-3xl mb-4 focus:outline-none focus:ring-2 bg-[#f9f9f9] focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="border-t"></div>

          <div className="flex gap-3 px-9 text-sm">
            <p>All user</p>
            <p>Active</p>
            <p>Inactive</p>
            <p>Invited</p>
          </div>

          {/* User List Section */}
          <CardContent className="p-0">
            <ul className="list-none">
              <div className="flex flex-col px-5">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <li
                      key={user._id}
                      className="flex items-center py-5 justify-between p-3 border-b border-gray-200 gap-4 relative"
                    >
                      {/* Profile Photo or Initials */}
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-300 text-white font-bold text-lg overflow-hidden">
                        {/* Show initials if there is no profile photo */}
                        <span>
                          {user.firstName && user.lastName
                            ? `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`
                            : "?"}
                        </span>
                      </div>

                      {/* User Details */}
                      <div className="flex-1 ">
                        <h1>
                          {user.firstName} {user.lastName}
                        </h1>
                        <p className="text-sm font-semibold text-gray-500">
                          {user.email}
                        </p>
                      </div>

                      {/* Invite Button */}
                      {user ? (
                        <>
                          <p className="bg-purple-500 mr-2   text-white px-4 font-bold text-[12px] py-1 badge badge-sm rounded-xl">
                            <span
                              className={
                                user.status ? "text-white" : "text-red-600"
                              }
                            >
                              {user.status ? "Active" : "Deactivated"}
                            </span>
                          </p>
                          {!user.status && (
                            <p className="text-red-500 text-sm mt-2">
                              Your account is deactivated. Contact support.
                            </p>
                          )}
                        </>
                      ) : (
                        <p>Loading...</p>
                      )}

                      {/* More Options Button */}
                      <div className="relative hover:bg-gray-200 rounded-full">
                        {/* Three Dots Button */}
                        <svg
                          onClick={() =>
                            setOpenMenu(openMenu === user._id ? null : user._id)
                          }
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-4.5 cursor-pointer"
                          viewBox="0 -960 960 960"
                          fill="#1f1f1f"
                        >
                          <path d="M479.79-192Q450-192 429-213.21t-21-51Q408-294 429.21-315t51-21Q510-336 531-314.79t21 51Q552-234 530.79-213t-51 21Zm0-216Q450-408 429-429.21t-21-51Q408-510 429.21-531t51-21Q510-552 531-530.79t21 51Q552-450 530.79-429t-51 21Zm0-216Q450-624 429-645.21t-21-51Q408-726 429.21-747t51-21Q510-768 531-746.79t21 51Q552-666 530.79-645t-51 21Z" />
                        </svg>

                        {/* Dropdown Menu - Only visible when openMenu === user._id */}
                        {openMenu === user._id && (
                          <div className="absolute right-0 mt-2 w-32 bg-white shadow-md border rounded-lg py-1">
                            <button
                              className="block w-full px-4 py-2 text-left text-sm hover:text-[#008ecc] hover:bg-gray-100"
                              onClick={() => handleEditClick(user)}
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 text-center py-3">
                    No users found
                  </li>
                )}
              </div>
            </ul>
          </CardContent>
        </Card>

        {/* Roles Component */}

        {/* Roles */}

        <div>
          <Card className="bg-white px-1 rounded-sm shadow-lg">
            <div className="flex justify-between pt-5 items-center px-6">
              <h2 className="text-xl font-semibold mb-3">Roles</h2>

              {/* Search Input */}
              <div className="relative flex flex-row justify-between items-center ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-[22px] transform -translate-y-1/2 w-7 h-6 text-gray-500"
                  viewBox="0 -960 960 960"
                  fill="#1f1f1f"
                >
                  <path d="M765-144 526-383q-30 22-65.79 34.5-35.79 12.5-76.18 12.5Q284-336 214-406t-70-170q0-100 70-170t170-70q100 0 170 70t70 170.03q0 40.39-12.5 76.18Q599-464 577-434l239 239-51 51ZM384-408q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search"
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                  className="w-[190px] pl-10 py-2 rounded-3xl mb-4 focus:outline-none focus:ring-2 bg-[#f9f9f9] focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="border-t"></div>

            {/* Role List */}
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="text-gray-600 border-b">
                    <th className="text-left">Role Name</th>
                    <th className="text-left">Permission</th>
                    <th className="text-left">Users</th>
                    <th className="text-left">Manage Users</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoles.length > 0 ? (
                    filteredRoles.map((role) => (
                      <tr key={role._id} className="border-t">
                        <td className="p-3">{role.name}</td>
                        <td>
                          <button
                            className="bg-[#4466f2] p-1 rounded-2xl px-4 text-white"
                            onClick={() => {
                              setSelectedRole(role);
                              setOpenViewModal(true);
                            }}
                          >
                            View
                          </button>
                        </td>
                        <td className="p-3">
                          {role.users && role.users.length > 0 ? (
                            <div className="flex items-center">
                              {/* Show first 3 users */}
                              {role.users.slice(0, 3).map((user) => (
                                <div
                                  key={user._id}
                                  className="flex items-center mr-2"
                                >
                                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-white font-semibold">
                                    {user.firstName && user.lastName
                                      ? `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`
                                      : "?"}
                                  </div>
                                </div>
                              ))}

                              {/* Show remaining users count */}
                              {role.users.length > 3 &&
                                !showAllUsers[role._id] && (
                                  <button
                                    className="text-blue-500 font-semibold"
                                    onClick={() => toggleShowAllUsers(role._id)}
                                  >
                                    +{role.users.length - 3} more
                                  </button>
                                )}

                              {/* Show full list of users */}
                              {showAllUsers[role._id] && (
                                <div className="mt-2 flex flex-wrap">
                                  {role.users.slice(3).map((user) => (
                                    <div
                                      key={user._id}
                                      className="flex items-center mr-2"
                                    >
                                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-white font-semibold">
                                        {user.firstName && user.lastName
                                          ? `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`
                                          : "?"}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500">
                              No users assigned
                            </span>
                          )}
                        </td>
                        <td>
                          <button
                            className="px-4 py-1 text-white rounded-lg"
                            onClick={() => handleManageUsers(role)}
                          >
                            🔧
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-3 text-center text-gray-500">
                        No roles found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
          ;
        </div>
      </div>
    </div>
  );
};

export default UserTop;
