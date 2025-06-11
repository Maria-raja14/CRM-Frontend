import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"; // update this path if needed

const Useredit = ({ openEditModal, setOpenEditModal, user, onUpdate }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (user) {
      setSelectedUser({ ...user });
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedUser((prev) => ({ ...prev, profilePreview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    const formData = new FormData();
    for (const key in selectedUser) {
      if (key !== 'profilePreview') {
        formData.append(key, selectedUser[key]);
      }
    }

    if (profileImage) {
      formData.append('profilePhoto', profileImage);
    }

    try {
      const res = await fetch(`http://localhost:3004/api/users/${selectedUser._id}`, {
        method: 'PUT',
        body: formData,
      });

      if (res.ok) {
        const updated = await res.json();
        console.log('User updated:', updated);
        onUpdate && onUpdate(updated); // Callback to refresh list if needed
        setOpenEditModal(false);
      } else {
        console.error('Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  return (
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
                src={
                  selectedUser?.profilePreview ||
                  'https://static.vecteezy.com/system/resources/previews/020/429/953/non_2x/admin-icon-vector.jpg'
                }
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
                  value={selectedUser?.firstName || ''}
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
                  value={selectedUser?.lastName || ''}
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
                  value={selectedUser?.gender || ''}
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
                  value={selectedUser?.DateOB || ''}
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
                  value={selectedUser?.mobileNumber || ''}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, mobileNumber: e.target.value })
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
                  value={selectedUser?.email || ''}
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
                  value={selectedUser?.address || ''}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, address: e.target.value })
                  }
                  className="p-2 border rounded-md w-full"
                  required
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
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
  );
};

export default Useredit;
