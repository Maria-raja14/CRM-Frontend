


// import { useState, useEffect } from "react";
// import AddUserModal from "./UserTop";
// import CreateRoleModal from "./CreateRoleModal";
// import axios from "axios";
// import { toast } from "react-toastify";

// export default function UserManagement() {
//   const [roles, setRoles] = useState([]);
//   const [users, setUsers] = useState([]);

//   const fetchRoles = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const { data } = await axios.get("http://localhost:5000/api/roles", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setRoles(data);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load roles");
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const { data } = await axios.get("http://localhost:5000/api/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(data);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load users");
//     }
//   };

//   // Initial data fetch
//   useEffect(() => {
//     fetchRoles();
//     fetchUsers();
//   }, []);

//   return (
//     <div className="space-y-6">
//       <div className="flex gap-3">
//         <AddUserModal
//           roles={roles}
//           onUserCreated={fetchUsers}
//           onRolesUpdated={fetchRoles}
//         />
//         <CreateRoleModal onRoleCreated={fetchRoles} />
//       </div>

//       {/* Users Table - Outside the modal */}
//       <div className="mt-6">
//         <h2 className="text-xl font-bold mb-4">Users List</h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full border-collapse border border-gray-300">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="border p-3 text-left">Name</th>
//                 <th className="border p-3 text-left">Email</th>
//                 <th className="border p-3 text-left">Role</th>
//                 <th className="border p-3 text-left">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.length > 0 ? (
//                 users.map((user) => (
//                   <tr key={user._id} className="hover:bg-gray-50">
//                     <td className="border p-3">{user.firstName} {user.lastName}</td>
//                     <td className="border p-3">{user.email}</td>
//                     <td className="border p-3">{user.role?.name || 'N/A'}</td>
//                     <td className="border p-3">
//                       <span className={`px-2 py-1 rounded-full text-xs ${
//                         user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                       }`}>
//                         {user.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="4" className="text-center p-3">No users found</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect } from 'react';
// import { Table, Space, Button, Modal, Form, Input, Select, message, Popconfirm, Checkbox, Pagination } from 'antd';
// import { EllipsisOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
// import axios from 'axios';

// const { Option } = Select;

// const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [isUserModalVisible, setIsUserModalVisible] = useState(false);
//   const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [currentRole, setCurrentRole] = useState(null);
//   const [userForm] = Form.useForm();
//   const [roleForm] = Form.useForm();
//   const [selectedUserIds, setSelectedUserIds] = useState([]);
//   const [selectedRoleIds, setSelectedRoleIds] = useState([]);
//   const [userPagination, setUserPagination] = useState({ current: 1, pageSize: 5 });
//   const [rolePagination, setRolePagination] = useState({ current: 1, pageSize: 5 });

//   // Fetch users and roles
//   useEffect(() => {
//     fetchUsers();
//     fetchRoles();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/users', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setUsers(response.data);
//     } catch (error) {
//       message.error('Failed to fetch users');
//     }
//   };

//   const fetchRoles = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/roles', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setRoles(response.data);
//     } catch (error) {
//       message.error('Failed to fetch roles');
//     }
//   };

//   // User CRUD operations
//   const handleUserCreate = () => {
//     setCurrentUser(null);
//     userForm.resetFields();
//     setIsUserModalVisible(true);
//   };

//   const handleUserEdit = (user) => {
//     setCurrentUser(user);
//     userForm.setFieldsValue({
//       ...user,
//       role: user.role?._id
//     });
//     setIsUserModalVisible(true);
//   };

//   const handleUserDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/users/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       message.success('User deleted successfully');
//       fetchUsers();
//     } catch (error) {
//       message.error('Failed to delete user');
//     }
//   };

//   const handleUserBulkDelete = async () => {
//     if (selectedUserIds.length === 0) {
//       message.warning('Please select users to delete');
//       return;
//     }

//     // try {
//     //   await axios.post('/api/users/bulk-delete', { ids: selectedUserIds }, {
//     //     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//     //   });
//     //   message.success(`${selectedUserIds.length} users deleted successfully`);
//     //   setSelectedUserIds([]);
//     //   fetchUsers();
//     // } catch (error) {
//     //   message.error('Failed to delete users');
//     // }
//   };

//   const handleUserSubmit = async () => {
//     try {
//       const values = await userForm.validateFields();
      
//       if (currentUser) {
//         await axios.put(`http://localhost:5000/api/users/${currentUser._id}`, values, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         message.success('User updated successfully');
//       } else {
//         await axios.post('http://localhost:5000/api/users/create', values, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         message.success('User created successfully');
//       }
      
//       setIsUserModalVisible(false);
//       fetchUsers();
//     } catch (error) {
//       message.error(error.response?.data?.message || 'Operation failed');
//     }
//   };

//   // Role CRUD operations
//   const handleRoleCreate = () => {
//     setCurrentRole(null);
//     roleForm.resetFields();
//     setIsRoleModalVisible(true);
//   };

//   const handleRoleEdit = (role) => {
//     setCurrentRole(role);
//     roleForm.setFieldsValue(role);
//     setIsRoleModalVisible(true);
//   };

//   const handleRoleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/roles/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       message.success('Role deleted successfully');
//       fetchRoles();
//     } catch (error) {
//       message.error('Failed to delete role');
//     }
//   };

//   const handleRoleBulkDelete = async () => {
//     if (selectedRoleIds.length === 0) {
//       message.warning('Please select roles to delete');
//       return;
//     }

//     // try {
//     //   await axios.post('http://localhost:5000/api/roles/bulk-delete', { ids: selectedRoleIds }, {
//     //     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//     //   });
//     //   message.success(`${selectedRoleIds.length} roles deleted successfully`);
//     //   setSelectedRoleIds([]);
//     //   fetchRoles();
//     // } catch (error) {
//     //   message.error('Failed to delete roles');
//     // }
//   };

//   const handleRoleSubmit = async () => {
//     try {
//       const values = await roleForm.validateFields();
      
//       if (currentRole) {
//         await axios.put(`http://localhost:5000/api/roles/${currentRole._id}`, values, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         message.success('Role updated successfully');
//       } else {
//         await axios.post('http://localhost:5000/api/roles', values, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         message.success('Role created successfully');
//       }
      
//       setIsRoleModalVisible(false);
//       fetchRoles();
//     } catch (error) {
//       message.error(error.response?.data?.message || 'Operation failed');
//     }
//   };

//   // Table columns
//   const userColumns = [
//     {
//       title: 'Select',
//       dataIndex: '_id',
//       render: (id) => (
//         <Checkbox
//           checked={selectedUserIds.includes(id)}
//           onChange={(e) => {
//             if (e.target.checked) {
//               setSelectedUserIds([...selectedUserIds, id]);
//             } else {
//               setSelectedUserIds(selectedUserIds.filter(item => item !== id));
//             }
//           }}
//         />
//       ),
//     },
//     { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
//     { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
//     { title: 'Email', dataIndex: 'email', key: 'email' },
//     {
//       title: 'Role',
//       dataIndex: 'role',
//       key: 'role',
//       render: (role) => role?.name || 'N/A'
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <Space size="middle">
//           <Button
//             type="text"
//             icon={<EditOutlined />}
//             onClick={() => handleUserEdit(record)}
//           />
//           <Popconfirm
//             title="Are you sure to delete this user?"
//             onConfirm={() => handleUserDelete(record._id)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button type="text" danger icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   const roleColumns = [
//     {
//       title: 'Select',
//       dataIndex: '_id',
//       render: (id) => (
//         <Checkbox
//           checked={selectedRoleIds.includes(id)}
//           onChange={(e) => {
//             if (e.target.checked) {
//               setSelectedRoleIds([...selectedRoleIds, id]);
//             } else {
//               setSelectedRoleIds(selectedRoleIds.filter(item => item !== id));
//             }
//           }}
//         />
//       ),
//     },
//     { title: 'Name', dataIndex: 'name', key: 'name' },
//     { title: 'Description', dataIndex: 'description', key: 'description' },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <Space size="middle">
//           <Button
//             type="text"
//             icon={<EditOutlined />}
//             onClick={() => handleRoleEdit(record)}
//           />
//           <Popconfirm
//             title="Are you sure to delete this role?"
//             onConfirm={() => handleRoleDelete(record._id)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button type="text" danger icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div style={{ padding: '20px' }}>
//       <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
//         <div style={{ flex: 1 }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
//             <h2>User Management</h2>
//             <div>
//               <Button
//                 type="primary"
//                 onClick={handleUserCreate}
//                 style={{ marginRight: '8px' }}
//               >
//                 Add User
//               </Button>
//               <Button
//                 danger
//                 onClick={handleUserBulkDelete}
//                 disabled={selectedUserIds.length === 0}
//               >
//                 Bulk Delete
//               </Button>
//             </div>
//           </div>
//           <Table
//             columns={userColumns}
//             dataSource={users}
//             rowKey="_id"
//             pagination={{
//               current: userPagination.current,
//               pageSize: userPagination.pageSize,
//               onChange: (page, pageSize) => setUserPagination({ current: page, pageSize }),
//               showSizeChanger: true,
//               pageSizeOptions: ['5', '10', '20', '50']
//             }}
//           />
//         </div>

//         <div style={{ flex: 1 }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
//             <h2>Role Management</h2>
//             <div>
//               <Button
//                 type="primary"
//                 onClick={handleRoleCreate}
//                 style={{ marginRight: '8px' }}
//               >
//                 Add Role
//               </Button>
//               <Button
//                 danger
//                 onClick={handleRoleBulkDelete}
//                 disabled={selectedRoleIds.length === 0}
//               >
//                 Bulk Delete
//               </Button>
//             </div>
//           </div>
//           <Table
//             columns={roleColumns}
//             dataSource={roles}
//             rowKey="_id"
//             pagination={{
//               current: rolePagination.current,
//               pageSize: rolePagination.pageSize,
//               onChange: (page, pageSize) => setRolePagination({ current: page, pageSize }),
//               showSizeChanger: true,
//               pageSizeOptions: ['5', '10', '20', '50']
//             }}
//           />
//         </div>
//       </div>

//       {/* User Modal */}
//       <Modal
//         title={currentUser ? "Edit User" : "Create User"}
//         visible={isUserModalVisible}
//         onOk={handleUserSubmit}
//         onCancel={() => setIsUserModalVisible(false)}
//       >
//         <Form form={userForm} layout="vertical">
//           <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
//             <Input />
//           </Form.Item>
//           {!currentUser && (
//             <Form.Item name="password" label="Password" rules={[{ required: true }]}>
//               <Input.Password />
//             </Form.Item>
//           )}
//           <Form.Item name="mobileNumber" label="Mobile Number">
//             <Input />
//           </Form.Item>
//           <Form.Item name="role" label="Role" rules={[{ required: true }]}>
//             <Select>
//               {roles.map(role => (
//                 <Option key={role._id} value={role._id}>{role.name}</Option>
//               ))}
//             </Select>
//           </Form.Item>
//           <Form.Item name="status" label="Status" initialValue="active">
//             <Select>
//               <Option value="active">Active</Option>
//               <Option value="inactive">Inactive</Option>
//             </Select>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Role Modal */}
//       <Modal
//         title={currentRole ? "Edit Role" : "Create Role"}
//         visible={isRoleModalVisible}
//         onOk={handleRoleSubmit}
//         onCancel={() => setIsRoleModalVisible(false)}
//       >
//         <Form form={roleForm} layout="vertical">
//           <Form.Item name="name" label="Name" rules={[{ required: true }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item name="description" label="Description">
//             <Input.TextArea />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default UserManagement;


// import React, { useState, useEffect } from 'react';
// import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Card, Space, Avatar } from 'antd';
// import { EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
// import axios from 'axios';
// import UserModal from './UserModal';
// import RoleModal from './RoleModal';

// const { Option } = Select;

// const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [isUserModalVisible, setIsUserModalVisible] = useState(false);
//   const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [currentRole, setCurrentRole] = useState(null);
//   const [userPagination, setUserPagination] = useState({ current: 1, pageSize: 5 });
//   const [rolePagination, setRolePagination] = useState({ current: 1, pageSize: 5 });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [usersRes, rolesRes] = await Promise.all([
//         axios.get('http://localhost:5000/api/users', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         }),
//         axios.get('http://localhost:5000/api/roles', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         })
//       ]);
//       setUsers(usersRes.data);
//       setRoles(rolesRes.data);
//     } catch (error) {
//       message.error('Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUserCreate = () => {
//     setCurrentUser(null);
//     setIsUserModalVisible(true);
//   };

//   const handleUserEdit = (user) => {
//     setCurrentUser(user);
//     setIsUserModalVisible(true);
//   };

//   const handleUserDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/users/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       message.success('User deleted successfully');
//       fetchData();
//     } catch (error) {
//       message.error(error.response?.data?.message || 'Failed to delete user');
//     }
//   };

//   const handleRoleCreate = () => {
//     setCurrentRole(null);
//     setIsRoleModalVisible(true);
//   };

//   const handleRoleEdit = (role) => {
//     setCurrentRole(role);
//     setIsRoleModalVisible(true);
//   };

//   const handleRoleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/roles/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       message.success('Role deleted successfully');
//       fetchData();
//     } catch (error) {
//       message.error(error.response?.data?.message || 'Failed to delete role');
//     }
//   };

//   const userColumns = [
//     {
//       title: 'Profile',
//       dataIndex: 'profileImage',
//       key: 'profileImage',
//       render: (image, record) => (
//         <Avatar
//           src={image ? `http://localhost:5000/${image}` : null}
//           icon={<UserOutlined />}
//           size="large"
//         />
//       ),
//     },
//     {
//       title: 'Name',
//       key: 'name',
//       render: (_, record) => `${record.firstName} ${record.lastName}`,
//       sorter: (a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
//     },
//     {
//       title: 'Email',
//       dataIndex: 'email',
//       key: 'email',
//       sorter: (a, b) => a.email.localeCompare(b.email),
//     },
//     {
//       title: 'Role',
//       dataIndex: 'role',
//       key: 'role',
//       render: (role) => role?.name || 'N/A',
//       sorter: (a, b) => (a.role?.name || '').localeCompare(b.role?.name || ''),
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status) => (
//         <span className={`px-2 py-1 rounded-full text-xs ${
//           status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//         }`}>
//           {status}
//         </span>
//       ),
//       filters: [
//         { text: 'Active', value: 'Active' },
//         { text: 'Inactive', value: 'Inactive' },
//       ],
//       onFilter: (value, record) => record.status === value,
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <Space size="middle">
//           <Button
//             type="text"
//             icon={<EditOutlined />}
//             onClick={() => handleUserEdit(record)}
//           />
//           <Popconfirm
//             title="Are you sure to delete this user?"
//             onConfirm={() => handleUserDelete(record._id)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button type="text" danger icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   const roleColumns = [
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       key: 'name',
//       sorter: (a, b) => a.name.localeCompare(b.name),
//     },
//     {
//       title: 'Description',
//       dataIndex: 'description',
//       key: 'description',
//       render: (desc) => desc || 'N/A',
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <Space size="middle">
//           <Button
//             type="text"
//             icon={<EditOutlined />}
//             onClick={() => handleRoleEdit(record)}
//           />
//           <Popconfirm
//             title="Are you sure to delete this role?"
//             onConfirm={() => handleRoleDelete(record._id)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button type="text" danger icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">User & Role Management</h1>
//         <div className="space-x-3">
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             onClick={handleUserCreate}
//             className="bg-blue-600"
//           >
//             Add User
//           </Button>
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             onClick={handleRoleCreate}
//             className="bg-green-600"
//           >
//             Add Role
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Users Card */}
//         <Card
//           title="Users"
//           bordered={false}
//           className="shadow-sm"
//           loading={loading}
//         >
//           <Table
//             columns={userColumns}
//             dataSource={users}
//             rowKey="_id"
//             pagination={{
//               current: userPagination.current,
//               pageSize: userPagination.pageSize,
//               onChange: (page, pageSize) => setUserPagination({ current: page, pageSize }),
//               showSizeChanger: true,
//               pageSizeOptions: ['5', '10', '20', '50'],
//               showTotal: (total) => `Total ${total} users`,
//             }}
//           />
//         </Card>

//         {/* Roles Card */}
//         <Card
//           title="Roles"
//           bordered={false}
//           className="shadow-sm"
//           loading={loading}
//         >
//           <Table
//             columns={roleColumns}
//             dataSource={roles}
//             rowKey="_id"
//             pagination={{
//               current: rolePagination.current,
//               pageSize: rolePagination.pageSize,
//               onChange: (page, pageSize) => setRolePagination({ current: page, pageSize }),
//               showSizeChanger: true,
//               pageSizeOptions: ['5', '10', '20', '50'],
//               showTotal: (total) => `Total ${total} roles`,
//             }}
//           />
//         </Card>
//       </div>

//       {/* User Modal */}
//       <UserModal
//         visible={isUserModalVisible}
//         onCancel={() => setIsUserModalVisible(false)}
//         onSuccess={fetchData}
//         roles={roles}
//         currentUser={currentUser}
//       />

//       {/* Role Modal */}
//       <RoleModal
//         visible={isRoleModalVisible}
//         onCancel={() => setIsRoleModalVisible(false)}
//         onSuccess={fetchData}
//         currentRole={currentRole}
//       />
//     </div>
//   );
// };

// export default UserManagement;


// import React, { useState, useEffect } from 'react';
// import { Table, Button, Card, Space, Avatar, message } from 'antd';
// import { EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
// import axios from 'axios';
// import UserModal from './UserModal';
// import RoleModal from './RoleModal';

// const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [isUserModalVisible, setIsUserModalVisible] = useState(false);
//   const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [currentRole, setCurrentRole] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [usersRes, rolesRes] = await Promise.all([
//         axios.get('http://localhost:5000/api/users', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         }),
//         axios.get('http://localhost:5000/api/roles', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         })
//       ]);
      
//       setUsers(usersRes.data);
//       setRoles(rolesRes.data);
//     } catch (error) {
//       message.error('Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUserCreate = () => {
//     setCurrentUser(null);
//     setIsUserModalVisible(true);
//   };

//   const handleUserEdit = (user) => {
//     setCurrentUser(user);
//     setIsUserModalVisible(true);
//   };

//   const handleUserDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/users/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       message.success('User deleted successfully');
//       fetchData();
//     } catch (error) {
//       message.error(error.response?.data?.message || 'Failed to delete user');
//     }
//   };

//   const handleRoleCreate = () => {
//     setCurrentRole(null);
//     setIsRoleModalVisible(true);
//   };

//   const handleRoleEdit = (role) => {
//     setCurrentRole(role);
//     setIsRoleModalVisible(true);
//   };

//   const handleRoleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/roles/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       message.success('Role deleted successfully');
//       fetchData();
//     } catch (error) {
//       message.error(error.response?.data?.message || 'Failed to delete role');
//     }
//   };

//   const userColumns = [
//     {
//       title: 'Profile',
//       dataIndex: 'profileImage',
//       render: (image) => (
//         <Avatar
//           src={image ? `http://localhost:5000/${image}` : null}
//           icon={<UserOutlined />}
//           size="large"
//         />
//       ),
//     },
//     {
//       title: 'Name',
//       render: (_, record) => `${record.firstName} ${record.lastName}`,
//       sorter: (a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
//     },
//     {
//       title: 'Email',
//       dataIndex: 'email',
//       sorter: (a, b) => a.email.localeCompare(b.email),
//     },
//     {
//       title: 'Role',
//       render: (_, record) => record.role?.name || 'N/A',
//       sorter: (a, b) => (a.role?.name || '').localeCompare(b.role?.name || ''),
//     },
//     {
//       title: 'Status',
//       render: (status) => (
//         <span className={`px-2 py-1 rounded-full text-xs ${
//           status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//         }`}>
//           {status}
//         </span>
//       ),
//       filters: [
//         { text: 'Active', value: 'Active' },
//         { text: 'Inactive', value: 'Inactive' },
//       ],
//       onFilter: (value, record) => record.status === value,
//     },
//     {
//       title: 'Actions',
//       render: (_, record) => (
//         <Space size="middle">
//           <Button
//             icon={<EditOutlined />}
//             onClick={() => handleUserEdit(record)}
//           />
//           <Button
//             danger
//             icon={<DeleteOutlined />}
//             onClick={() => handleUserDelete(record._id)}
//           />
//         </Space>
//       ),
//     },
//   ];

//   const roleColumns = [
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       sorter: (a, b) => a.name.localeCompare(b.name),
//     },
//     {
//       title: 'Description',
//       render: (desc) => desc || 'N/A',
//     },
//     {
//       title: 'Actions',
//       render: (_, record) => (
//         <Space size="middle">
//           <Button
//             icon={<EditOutlined />}
//             onClick={() => handleRoleEdit(record)}
//           />
//           <Button
//             danger
//             icon={<DeleteOutlined />}
//             onClick={() => handleRoleDelete(record._id)}
//           />
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">User & Role Management</h1>
//         <div className="space-x-3">
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             onClick={handleUserCreate}
//           >
//             Add User
//           </Button>
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             onClick={handleRoleCreate}
//           >
//             Add Role
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card title="Users" loading={loading}>
//           <Table
//             columns={userColumns}
//             dataSource={users}
//             rowKey="_id"
//             pagination={{ pageSize: 5 }}
//           />
//         </Card>

//         <Card title="Roles" loading={loading}>
//           <Table
//             columns={roleColumns}
//             dataSource={roles}
//             rowKey="_id"
//             pagination={{ pageSize: 5 }}
//           />
//         </Card>
//       </div>

//       <UserModal
//         visible={isUserModalVisible}
//         onCancel={() => setIsUserModalVisible(false)}
//         onSuccess={fetchData}
//         roles={roles}
//         currentUser={currentUser}
//       />

//       <RoleModal
//         visible={isRoleModalVisible}
//         onCancel={() => setIsRoleModalVisible(false)}
//         onSuccess={fetchData}
//         currentRole={currentRole}
//       />
//     </div>
//   );
// };

// export default UserManagement;


import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Space, Avatar, message, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import UserModal from './UserModal';
import RoleModal from './RoleModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);

  const fetchData = async () => {
    setFetching(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/roles`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      
      setUsers(usersRes.data);
      setRoles(rolesRes.data);
    } catch (error) {
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUserCreate = () => {
    setCurrentUser(null);
    setIsUserModalVisible(true);
  };

  const handleUserEdit = (user) => {
    setCurrentUser(user);
    setIsUserModalVisible(true);
  };

  const handleUserDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      message.success('User deleted successfully');
      fetchData();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleRoleCreate = () => {
    setCurrentRole(null);
    setIsRoleModalVisible(true);
  };

  const handleRoleEdit = (role) => {
    setCurrentRole(role);
    setIsRoleModalVisible(true);
  };

  const handleRoleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/roles/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      message.success('Role deleted successfully');
      fetchData();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete role');
    }
  };

  const userColumns = [
    {
      title: 'Profile',
      dataIndex: 'profileImage',
      render: (image) => (
        <Avatar 
          src={image ? `${process.env.REACT_APP_API_BASE_URL}/${image}` : null} 
          icon={<UserOutlined />} 
          size="large"
        />
      ),
    },
    { 
      title: 'Name', 
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      sorter: (a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
    },
    { 
      title: 'Email', 
      dataIndex: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    { 
      title: 'Role', 
      render: (_, record) => record.role?.name || 'N/A',
      sorter: (a, b) => (a.role?.name || '').localeCompare(b.role?.name || ''),
    },
    { 
      title: 'Status', 
      dataIndex: 'status',
      render: (status) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {status}
        </span>
      ),
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Inactive', value: 'Inactive' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleUserEdit(record)}
          />
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleUserDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  const roleColumns = [
    { 
      title: 'Name', 
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    { 
      title: 'Description', 
      dataIndex: 'description',
      render: (desc) => desc || 'N/A',
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleRoleEdit(record)}
          />
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleRoleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User & Role Management</h1>
        <div className="space-x-3">
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleUserCreate}
          >
            Add User
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleRoleCreate}
          >
            Add Role
          </Button>
        </div>
      </div>

      <Spin spinning={loading} tip="Loading...">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card 
            title="Users" 
            loading={fetching}
            extra={<span className="text-sm">Total: {users.length}</span>}
          >
            <Table
              columns={userColumns}
              dataSource={users}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
              loading={fetching}
            />
          </Card>

          <Card 
            title="Roles" 
            loading={fetching}
            extra={<span className="text-sm">Total: {roles.length}</span>}
          >
            <Table
              columns={roleColumns}
              dataSource={roles}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
              loading={fetching}
            />
          </Card>
        </div>
      </Spin>

      <UserModal
        visible={isUserModalVisible}
        onCancel={() => setIsUserModalVisible(false)}
        onSuccess={fetchData}
        roles={roles}
        currentUser={currentUser}
      />

      <RoleModal
        visible={isRoleModalVisible}
        onCancel={() => setIsRoleModalVisible(false)}
        onSuccess={fetchData}
        currentRole={currentRole}
      />
    </div>
  );
};

export default UserManagement;