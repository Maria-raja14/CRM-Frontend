// import React, { useState, useEffect } from 'react';
// import { Modal, Form, Input, Select, Upload, Button, Avatar, message } from 'antd';
// import { UserOutlined, UploadOutlined } from '@ant-design/icons';
// import axios from 'axios';

// const { Option } = Select;

// const UserModal = ({ visible, onCancel, onSuccess, roles, currentUser }) => {
//   const [form] = Form.useForm();
//   const [fileList, setFileList] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (currentUser) {
//       form.setFieldsValue({
//         ...currentUser,
//         role: currentUser.role?._id
//       });
//       if (currentUser.profileImage) {
//         setFileList([{
//           uid: '-1',
//           name: 'profileImage',
//           status: 'done',
//           url: `http://localhost:5000/${currentUser.profileImage}`,
//         }]);
//       }
//     } else {
//       form.resetFields();
//       setFileList([]);
//     }
//   }, [currentUser, form]);

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       const values = await form.validateFields();
//       const formData = new FormData();

//       Object.keys(values).forEach(key => {
//         if (key !== 'profileImage') {
//           formData.append(key, values[key]);
//         }
//       });

//       if (fileList.length > 0 && fileList[0].originFileObj) {
//         formData.append('profileImage', fileList[0].originFileObj);
//       }

//       if (currentUser) {
//         await axios.put(`http://localhost:5000/api/users/${currentUser._id}`, formData, {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'multipart/form-data',
//           }
//         });
//         message.success('User updated successfully');
//       } else {
//         await axios.post('http://localhost:5000/api/users/create', formData, {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'multipart/form-data',
//           }
//         });
//         message.success('User created successfully');
//       }

//       onSuccess();
//       onCancel();
//     } catch (error) {
//       message.error(error.response?.data?.message || 'Operation failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const uploadProps = {
//     onRemove: () => {
//       setFileList([]);
//     },
//     beforeUpload: (file) => {
//       setFileList([file]);
//       return false;
//     },
//     fileList,
//   };

//   return (
//     <Modal
//       title={currentUser ? "Edit User" : "Create User"}
//       visible={visible}
//       onOk={handleSubmit}
//       onCancel={onCancel}
//       confirmLoading={loading}
//       width={700}
//     >
//       <Form form={form} layout="vertical">
//         <div className="flex justify-center mb-6">
//           <Upload {...uploadProps} showUploadList={false}>
//             <Avatar
//               size={100}
//               src={fileList.length > 0 ?
//                 (fileList[0].url || URL.createObjectURL(fileList[0].originFileObj)) :
//                 <UserOutlined />}
//               className="cursor-pointer"
//             />
//           </Upload>
//         </div>
//         <Upload {...uploadProps}>
//           <Button icon={<UploadOutlined />} className="mb-6">Upload Profile Image</Button>
//         </Upload>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item name="mobileNumber" label="Mobile Number" rules={[{ required: true }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
//             <Select>
//               <Option value="Male">Male</Option>
//               <Option value="Female">Female</Option>
//               <Option value="Other">Other</Option>
//             </Select>
//           </Form.Item>
//           <Form.Item name="dateOfBirth" label="Date of Birth">
//             <Input type="date" />
//           </Form.Item>
//           {!currentUser && (
//             <Form.Item name="password" label="Password" rules={[{ required: true }]}>
//               <Input.Password />
//             </Form.Item>
//           )}
//           <Form.Item name="role" label="Role" rules={[{ required: true }]}>
//             <Select>
//               {roles.map(role => (
//                 <Option key={role._id} value={role._id}>{role.name}</Option>
//               ))}
//             </Select>
//           </Form.Item>
//           <Form.Item name="status" label="Status" initialValue="Active">
//             <Select>
//               <Option value="Active">Active</Option>
//               <Option value="Inactive">Inactive</Option>
//             </Select>
//           </Form.Item>
//           <Form.Item name="address" label="Address">
//             <Input.TextArea />
//           </Form.Item>
//         </div>
//       </Form>
//     </Modal>
//   );
// };

// export default UserModal;



// import React, { useState, useEffect } from 'react';
// import { Modal, Form, Input, Select, Upload, Button, Avatar, message } from 'antd';
// import { UserOutlined, UploadOutlined } from '@ant-design/icons';
// import axios from 'axios';

// const { Option } = Select;

// const UserModal = ({ visible, onCancel, onSuccess, roles, currentUser }) => {
//   const [form] = Form.useForm();
//   const [fileList, setFileList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [imagePreview, setImagePreview] = useState(null);

//   useEffect(() => {
//     if (currentUser) {
//       form.setFieldsValue({
//         ...currentUser,
//         role: currentUser.role?._id
//       });
//       if (currentUser.profileImage) {
//         setFileList([{
//           uid: '-1',
//           name: 'profileImage',
//           status: 'done',
//           url: `http://localhost:5000/${currentUser.profileImage}`,
//         }]);
//         setImagePreview(`http://localhost:5000/${currentUser.profileImage}`);
//       }
//     } else {
//       form.resetFields();
//       setFileList([]);
//       setImagePreview(null);
//     }
//   }, [currentUser, form]);

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       const values = await form.validateFields();
//       const formData = new FormData();

//       Object.keys(values).forEach(key => {
//         if (key !== 'profileImage') {
//           formData.append(key, values[key]);
//         }
//       });

//       if (fileList.length > 0 && fileList[0].originFileObj) {
//         formData.append('profileImage', fileList[0].originFileObj);
//       }

//       const config = {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'multipart/form-data',
//         }
//       };

//       if (currentUser) {
//         await axios.put(`http://localhost:5000/api/users/${currentUser._id}`, formData, config);
//         message.success('User updated successfully');
//       } else {
//         await axios.post('http://localhost:5000/api/users/create', formData, config);
//         message.success('User created successfully');
//       }

//       onSuccess();
//       onCancel();
//     } catch (error) {
//       console.error('Error:', error);
//       message.error(error.response?.data?.message || 'Operation failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const beforeUpload = (file) => {
//     const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
//     if (!isImage) {
//       message.error('You can only upload JPG/PNG files!');
//       return false;
//     }
    
//     const isLt20M = file.size / 1024 / 1024 < 20;
//     if (!isLt20M) {
//       message.error('Image must be smaller than 20MB!');
//       return false;
//     }
    
//     return true;
//   };

//   const handleChange = (info) => {
//     if (info.file.status === 'removed') {
//       setFileList([]);
//       setImagePreview(null);
//       return;
//     }

//     if (info.file.status === 'done') {
//       const file = info.file.originFileObj;
//       const reader = new FileReader();
//       reader.onload = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }

//     setFileList([info.file]);
//   };

//   const uploadProps = {
//     accept: 'image/jpeg,image/png',
//     beforeUpload,
//     onChange: handleChange,
//     fileList,
//     showUploadList: false,
//     customRequest: ({ file, onSuccess }) => {
//       setTimeout(() => {
//         onSuccess("ok");
//       }, 0);
//     }
//   };

//   return (
//     <Modal
//       title={currentUser ? "Edit User" : "Create User"}
//       visible={visible}
//       onOk={handleSubmit}
//       onCancel={onCancel}
//       confirmLoading={loading}
//       width={700}
//       destroyOnClose
//     >
//       <Form form={form} layout="vertical">
//         <div className="flex justify-center mb-6">
//           <Upload {...uploadProps}>
//             <Avatar
//               size={100}
//               src={imagePreview || <UserOutlined />}
//               className="cursor-pointer"
//             />
//           </Upload>
//         </div>
//         <div className="text-center mb-6">
//           <Upload {...uploadProps}>
//             <Button icon={<UploadOutlined />}>Upload Profile Image</Button>
//           </Upload>
//           <div className="text-xs text-gray-500 mt-2">
//             JPG, PNG up to 20MB
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item name="mobileNumber" label="Mobile Number" rules={[{ required: true }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
//             <Select>
//               <Option value="Male">Male</Option>
//               <Option value="Female">Female</Option>
//               <Option value="Other">Other</Option>
//             </Select>
//           </Form.Item>
//           <Form.Item name="dateOfBirth" label="Date of Birth">
//             <Input type="date" />
//           </Form.Item>
//           {!currentUser && (
//             <Form.Item name="password" label="Password" rules={[{ required: true }]}>
//               <Input.Password />
//             </Form.Item>
//           )}
//           <Form.Item name="role" label="Role" rules={[{ required: true }]}>
//             <Select loading={!roles.length}>
//               {roles.map(role => (
//                 <Option key={role._id} value={role._id}>{role.name}</Option>
//               ))}
//             </Select>
//           </Form.Item>
//           <Form.Item name="status" label="Status" initialValue="Active">
//             <Select>
//               <Option value="Active">Active</Option>
//               <Option value="Inactive">Inactive</Option>
//             </Select>
//           </Form.Item>
//           <Form.Item name="address" label="Address">
//             <Input.TextArea />
//           </Form.Item>
//         </div>
//       </Form>
//     </Modal>
//   );
// };

// export default UserModal;


// import React, { useState, useEffect } from 'react';
// import { Modal, Form, Input, Select, Upload, Button, Avatar, message } from 'antd';
// import { UserOutlined, UploadOutlined, CameraOutlined } from '@ant-design/icons';
// import axios from 'axios';

// const { Option } = Select;

// const UserModal = ({ visible, onCancel, onSuccess, roles, currentUser }) => {
//   const [form] = Form.useForm();
//   const [fileList, setFileList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [imagePreview, setImagePreview] = useState(null);

//   useEffect(() => {
//     if (currentUser) {
//       form.setFieldsValue({
//         ...currentUser,
//         role: currentUser.role?._id
//       });
//       if (currentUser.profileImage) {
//         setFileList([{
//           uid: '-1',
//           name: 'profileImage',
//           status: 'done',
//           url: `http://localhost:5000/${currentUser.profileImage}`,
//         }]);
//         setImagePreview(`http://localhost:5000/${currentUser.profileImage}`);
//       }
//     } else {
//       form.resetFields();
//       setFileList([]);
//       setImagePreview(null);
//     }
//   }, [currentUser, form]);

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       const values = await form.validateFields();
//       const formData = new FormData();

//       Object.keys(values).forEach(key => {
//         if (key !== 'profileImage') {
//           formData.append(key, values[key]);
//         }
//       });

//       if (fileList.length > 0 && fileList[0].originFileObj) {
//         formData.append('profileImage', fileList[0].originFileObj);
//       }

//       const config = {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'multipart/form-data',
//         }
//       };

//       if (currentUser) {
//         await axios.put(`http://localhost:5000/api/users/${currentUser._id}`, formData, config);
//         message.success('User updated successfully');
//       } else {
//         await axios.post('http://localhost:5000/api/users/create', formData, config);
//         message.success('User created successfully');
//       }

//       onSuccess();
//       onCancel();
//     } catch (error) {
//       console.error('Error:', error);
//       message.error(error.response?.data?.message || 'Operation failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const beforeUpload = (file) => {
//     const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
//     if (!isImage) {
//       message.error('You can only upload JPG/PNG files!');
//       return false;
//     }
    
//     const isLt20M = file.size / 1024 / 1024 < 20;
//     if (!isLt20M) {
//       message.error('Image must be smaller than 20MB!');
//       return false;
//     }
    
//     return true;
//   };

//   const handleChange = (info) => {
//     if (info.file.status === 'removed') {
//       setFileList([]);
//       setImagePreview(null);
//       return;
//     }

//     if (info.file.status === 'done') {
//       const file = info.file.originFileObj;
//       const reader = new FileReader();
//       reader.onload = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }

//     setFileList([info.file]);
//   };

//   const uploadProps = {
//     accept: 'image/jpeg,image/png',
//     beforeUpload,
//     onChange: handleChange,
//     fileList,
//     showUploadList: false,
//     customRequest: ({ file, onSuccess }) => {
//       setTimeout(() => {
//         onSuccess("ok");
//       }, 0);
//     }
//   };

//   return (
//     <Modal
//       title={currentUser ? "Edit User" : "Create User"}
//       visible={visible}
//       onOk={handleSubmit}
//       onCancel={onCancel}
//       confirmLoading={loading}
//       width={700}
//       destroyOnClose
//     >
//       <Form form={form} layout="vertical">
//         {/* Rounded Profile Image Upload */}
//         <div className="flex flex-col items-center mb-6">
//           <div className="relative">
//             <Avatar
//               size={120}
//               src={imagePreview}
//               icon={<UserOutlined />}
//               className="border-2 border-gray-200 shadow-md"
//               style={{ borderRadius: '50%' }}
//             />
//             <Upload {...uploadProps} className="absolute bottom-0 right-0">
//               <Button
//                 shape="circle"
//                 icon={<CameraOutlined />}
//                 className="bg-blue-500 text-white border-none"
//                 style={{ width: '40px', height: '40px' }}
//               />
//             </Upload>
//           </div>
//           <div className="mt-3 text-sm text-gray-500">
//             JPG or PNG, max 20MB
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Form.Item name="FirstName" label="First Name" rules={[{ required: true }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item name="LastName" label="Last Name" rules={[{ required: true }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item name="Email" label="Email" rules={[{ required: true, type: 'email' }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item name="MobileNumber" label="Mobile Number" rules={[{ required: true }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item name="Gender" label="Gender" rules={[{ required: true }]}>
//             <Select>
//               <Option value="Male">Male</Option>
//               <Option value="Female">Female</Option>
//               <Option value="Other">Other</Option>
//             </Select>
//           </Form.Item>
//           <Form.Item name="dateOfBirth" label="Date of Birth">
//             <Input type="date" />
//           </Form.Item>
//           {!currentUser && (
//             <Form.Item name="Password" label="Password" rules={[{ required: true }]}>
//               <Input.Password />
//             </Form.Item>
//           )}
//           <Form.Item name="Role" label="Role" rules={[{ required: true }]}>
//             <Select loading={!roles.length}>
//               {roles.map(role => (
//                 <Option key={role._id} value={role._id}>{role.name}</Option>
//               ))}
//             </Select>
//           </Form.Item>
//           <Form.Item name="Status" label="Status" initialValue="Active">
//             <Select>
//               <Option value="Active">Active</Option>
//               <Option value="Inactive">Inactive</Option>
//             </Select>
//           </Form.Item>
//           <Form.Item name="address" label="Address">
//             <Input.TextArea />
//           </Form.Item>
//         </div>
//       </Form>
//     </Modal>
//   );
// };

// export default UserModal;


// import React, { useState, useEffect } from 'react';
// import { Modal, Form, Input, Select, Upload, Button, Avatar } from 'antd';
// import { UserOutlined, UploadOutlined, CameraOutlined } from '@ant-design/icons';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const { Option } = Select;

// const UserModal = ({ visible, onCancel, onSuccess, roles, currentUser }) => {
//   const [form] = Form.useForm();
//   const [fileList, setFileList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [imagePreview, setImagePreview] = useState(null);

//   useEffect(() => {
//     if (currentUser) {
//       form.setFieldsValue({
//         ...currentUser,
//         role: currentUser.role?._id
//       });
//       if (currentUser.profileImage) {
//         setFileList([{
//           uid: '-1',
//           name: 'profileImage',
//           status: 'done',
//           url: `http://localhost:5000/${currentUser.profileImage}`,
//         }]);
//         setImagePreview(`http://localhost:5000/${currentUser.profileImage}`);
//       }
//     } else {
//       form.resetFields();
//       setFileList([]);
//       setImagePreview(null);
//     }
//   }, [currentUser, form]);

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       const values = await form.validateFields();
//       const formData = new FormData();

//       Object.keys(values).forEach(key => {
//         if (key !== 'profileImage') {
//           formData.append(key, values[key]);
//         }
//       });

//       if (fileList.length > 0 && fileList[0].originFileObj) {
//         formData.append('profileImage', fileList[0].originFileObj);
//       }

//       const config = {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'multipart/form-data',
//         }
//       };

//       if (currentUser) {
//         await axios.put(`http://localhost:5000/api/users/${currentUser._id}`, formData, config);
//         toast.success('User updated successfully', {
//           position: "top-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//         });
//       } else {
//         await axios.post('http://localhost:5000/api/users/create', formData, config);
//         toast.success('User created successfully', {
//           position: "top-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//         });
//       }

//       onSuccess();
//       onCancel();
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error(error.response?.data?.message || 'Operation failed', {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const beforeUpload = (file) => {
//     const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
//     if (!isImage) {
//       toast.error('You can only upload JPG/PNG files!', {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//       return false;
//     }
    
//     const isLt20M = file.size / 1024 / 1024 < 20;
//     if (!isLt20M) {
//       toast.error('Image must be smaller than 20MB!', {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//       return false;
//     }
    
//     return true;
//   };

//   const handleChange = (info) => {
//     if (info.file.status === 'removed') {
//       setFileList([]);
//       setImagePreview(null);
//       return;
//     }

//     if (info.file.status === 'done') {
//       const file = info.file.originFileObj;
//       const reader = new FileReader();
//       reader.onload = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }

//     setFileList([info.file]);
//   };

//   const uploadProps = {
//     accept: 'image/jpeg,image/png',
//     beforeUpload,
//     onChange: handleChange,
//     fileList,
//     showUploadList: false,
//     customRequest: ({ file, onSuccess }) => {
//       setTimeout(() => {
//         onSuccess("ok");
//       }, 0);
//     }
//   };

//   return (
//     <Modal
//       title={currentUser ? "Edit User" : "Create User"}
//       visible={visible}
//       onOk={handleSubmit}
//       onCancel={onCancel}
//       confirmLoading={loading}
//       width={700}
//       destroyOnClose
//     >
//       <Form form={form} layout="vertical">
//         {/* Rounded Profile Image Upload */}
//         <div className="flex flex-col items-center mb-6">
//           <div className="relative">
//             <Avatar
//               size={120}
//               src={imagePreview}
//               icon={<UserOutlined />}
//               className="border-2 border-gray-200 shadow-md"
//               style={{ borderRadius: '50%' }}
//             />
//             <Upload {...uploadProps} className="absolute bottom-0 right-0">
//               <Button
//                 shape="circle"
//                 icon={<CameraOutlined />}
//                 className="bg-blue-500 text-white border-none"
//                 style={{ width: '40px', height: '40px' }}
//               />
//             </Upload>
//           </div>
//           <div className="mt-3 text-sm text-gray-500">
//             JPG or PNG, max 20MB
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
//             <Input placeholder="Enter first name" />
//           </Form.Item>
//           <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
//             <Input placeholder="Enter last name" />
//           </Form.Item>
//           <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
//             <Input placeholder="Enter email address" />
//           </Form.Item>
//           <Form.Item name="mobileNumber" label="Mobile Number" rules={[{ required: true }]}>
//             <Input placeholder="Enter mobile number" />
//           </Form.Item>
//           <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
//             <Select placeholder="Select gender">
//               <Option value="Male">Male</Option>
//               <Option value="Female">Female</Option>
//               <Option value="Other">Other</Option>
//             </Select>
//           </Form.Item>
//           <Form.Item name="dateOfBirth" label="Date of Birth">
//             <Input type="date" placeholder="Select date of birth" />
//           </Form.Item>
//           {!currentUser && (
//             <Form.Item name="password" label="Password" rules={[{ required: true }]}>
//               <Input.Password placeholder="Enter password" />
//             </Form.Item>
//           )}
//           <Form.Item name="role" label="Role" rules={[{ required: true }]}>
//             <Select placeholder="Select role" loading={!roles.length}>
//               {roles.map(role => (
//                 <Option key={role._id} value={role._id}>{role.name}</Option>
//               ))}
//             </Select>
//           </Form.Item>
//           <Form.Item name="status" label="Status" initialValue="Active">
//             <Select placeholder="Select status">
//               <Option value="Active">Active</Option>
//               <Option value="Inactive">Inactive</Option>
//             </Select>
//           </Form.Item>
//           <Form.Item name="address" label="Address">
//             <Input.TextArea
//               placeholder="Enter full address"
//               style={{ height: '120px' }}
//               rows={4}
//             />
//           </Form.Item>
//         </div>
//       </Form>
//     </Modal>
//   );
// };

// export default UserModal;


// import React, { useState, useEffect } from 'react';
// import { Modal, Form, Input, Select, Upload, Button, Avatar, DatePicker } from 'antd';
// import { UserOutlined, CameraOutlined } from '@ant-design/icons';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const { Option } = Select;

// const UserModal = ({ visible, onCancel, onSuccess, roles, currentUser }) => {
//   const [form] = Form.useForm();
//   const [fileList, setFileList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [imagePreview, setImagePreview] = useState(null);

//   useEffect(() => {
//     if (visible) {
//       if (currentUser) {
//         form.setFieldsValue({
//           ...currentUser,
//           role: currentUser.role?._id,
//           dateOfBirth: currentUser.dateOfBirth ? moment(currentUser.dateOfBirth) : null
//         });
//         if (currentUser.profileImage) {
//           setFileList([{
//             uid: '-1',
//             name: 'profileImage',
//             status: 'done',
//             url: `${process.env.REACT_APP_API_BASE_URL}/${currentUser.profileImage}`,
//           }]);
//           setImagePreview(`${process.env.REACT_APP_API_BASE_URL}/${currentUser.profileImage}`);
//         }
//       } else {
//         form.resetFields();
//         setFileList([]);
//         setImagePreview(null);
//       }
//     }
//   }, [currentUser, form, visible]);

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       const values = await form.validateFields();
//       const formData = new FormData();

//       Object.keys(values).forEach(key => {
//         if (key !== 'profileImage' && values[key] !== undefined) {
//           formData.append(key, values[key]);
//         }
//       });

//       if (fileList.length > 0 && fileList[0].originFileObj) {
//         formData.append('profileImage', fileList[0].originFileObj);
//       }

//       const config = {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'multipart/form-data',
//         }
//       };

//       if (currentUser) {
//         await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/users/${currentUser._id}`, formData, config);
//         toast.success('User updated successfully');
//       } else {
//         await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users/create`, formData, config);
//         toast.success('User created successfully');
//       }

//       onSuccess();
//       onCancel();
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error(error.response?.data?.message || 'Operation failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const beforeUpload = (file) => {
//     const isImage = file.type.startsWith('image/');
//     if (!isImage) {
//       toast.error('You can only upload image files!');
//       return false;
//     }
    
//     const isLt20M = file.size / 1024 / 1024 < 20;
//     if (!isLt20M) {
//       toast.error('Image must be smaller than 20MB!');
//       return false;
//     }
    
//     return true;
//   };

//   const handleChange = (info) => {
//     if (info.file.status === 'removed') {
//       setFileList([]);
//       setImagePreview(null);
//       return;
//     }

//     let newFileList = [...info.fileList];
//     newFileList = newFileList.slice(-1); // Only allow single file
    
//     if (info.file.status === 'done') {
//       const file = info.file.originFileObj;
//       const reader = new FileReader();
//       reader.onload = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }

//     setFileList(newFileList);
//   };

//   const uploadProps = {
//     accept: 'image/*',
//     beforeUpload,
//     onChange: handleChange,
//     fileList,
//     showUploadList: false,
//     maxCount: 1,
//     customRequest: ({ file, onSuccess }) => {
//       setTimeout(() => {
//         onSuccess("ok");
//       }, 0);
//     }
//   };

//   return (
//     <Modal
//       title={currentUser ? "Edit User" : "Create User"}
//       visible={visible}
//       onOk={handleSubmit}
//       onCancel={onCancel}
//       confirmLoading={loading}
//       width={700}
//       destroyOnClose
//     >
//       <Form form={form} layout="vertical">
//         <div className="flex flex-col items-center mb-6">
//           <div className="relative">
//             <Avatar 
//               size={120}
//               src={imagePreview}
//               icon={<UserOutlined />}
//               className="border-2 border-gray-200 shadow-md"
//               style={{ borderRadius: '50%' }}
//             />
//             <Upload {...uploadProps} className="absolute bottom-0 right-0">
//               <Button
//                 shape="circle"
//                 icon={<CameraOutlined />}
//                 className="bg-blue-500 text-white border-none"
//                 style={{ width: '40px', height: '40px' }}
//               />
//             </Upload>
//           </div>
//           <div className="mt-3 text-sm text-gray-500">
//             JPG or PNG, max 20MB
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
//             <Input placeholder="Enter first name" />
//           </Form.Item>
//           <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
//             <Input placeholder="Enter last name" />
//           </Form.Item>
//           <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
//             <Input placeholder="Enter email address" />
//           </Form.Item>
//           <Form.Item name="mobileNumber" label="Mobile Number" rules={[{ required: true }]}>
//             <Input placeholder="Enter mobile number" />
//           </Form.Item>
//           <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
//             <Select placeholder="Select gender">
//               <Option value="Male">Male</Option>
//               <Option value="Female">Female</Option>
//               <Option value="Other">Other</Option>
//             </Select>
//           </Form.Item>
//           <Form.Item name="dateOfBirth" label="Date of Birth">
//             <DatePicker style={{ width: '100%' }} />
//           </Form.Item>
//           {!currentUser && (
//             <Form.Item 
//               name="password" 
//               label="Password" 
//               rules={[{ required: true, min: 6 }]}
//             >
//               <Input.Password placeholder="Enter password" />
//             </Form.Item>
//           )}
//           <Form.Item name="role" label="Role" rules={[{ required: true }]}>
//             <Select placeholder="Select role" loading={!roles.length}>
//               {roles.map(role => (
//                 <Option key={role._id} value={role._id}>{role.name}</Option>
//               ))}
//             </Select>
//           </Form.Item>
//           <Form.Item name="status" label="Status" initialValue="Active">
//             <Select placeholder="Select status">
//               <Option value="Active">Active</Option>
//               <Option value="Inactive">Inactive</Option>
//             </Select>
//           </Form.Item>
//           <Form.Item name="address" label="Address">
//             <Input.TextArea 
//               placeholder="Enter full address" 
//               style={{ height: '120px' }} 
//               rows={4}
//             />
//           </Form.Item>
//         </div>
//       </Form>
//     </Modal>
//   );
// };

// export default UserModal;