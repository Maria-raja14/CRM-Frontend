// import React, { useEffect } from 'react';
// import { Modal, Form, Input, message } from 'antd';
// import axios from 'axios';

// const RoleModal = ({ visible, onCancel, onSuccess, currentRole }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = React.useState(false);

//   useEffect(() => {
//     if (currentRole) {
//       form.setFieldsValue(currentRole);
//     } else {
//       form.resetFields();
//     }
//   }, [currentRole, form]);

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       const values = await form.validateFields();
      
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
      
//       onSuccess();
//       onCancel();
//     } catch (error) {
//       message.error(error.response?.data?.message || 'Operation failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal
//       title={currentRole ? "Edit Role" : "Create Role"}
//       visible={visible}
//       onOk={handleSubmit}
//       onCancel={onCancel}
//       confirmLoading={loading}
//     >
//       <Form form={form} layout="vertical">
//         <Form.Item name="name" label="Name" rules={[{ required: true }]}>
//           <Input />
//         </Form.Item>
//         <Form.Item name="description" label="Description">
//           <Input.TextArea rows={4} />
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default RoleModal;



// import React, { useEffect } from 'react';
// import { Modal, Form, Input, message } from 'antd';
// import axios from 'axios';

// const RoleModal = ({ visible, onCancel, onSuccess, currentRole }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = React.useState(false);

//   useEffect(() => {
//     if (currentRole) {
//       form.setFieldsValue(currentRole);
//     } else {
//       form.resetFields();
//     }
//   }, [currentRole, form]);

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       const values = await form.validateFields();
      
//       const config = {
//         headers: { 
//           Authorization: `Bearer ${localStorage.getItem('token')}` 
//         }
//       };

//       if (currentRole) {
//         await axios.put(`http://localhost:5000/api/roles/${currentRole._id}`, values, config);
//         message.success('Role updated successfully');
//       } else {
//         await axios.post('http://localhost:5000/api/roles', values, config);
//         message.success('Role created successfully');
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

//   return (
//     <Modal
//       title={currentRole ? "Edit Role" : "Create Role"}
//       visible={visible}
//       onOk={handleSubmit}
//       onCancel={onCancel}
//       confirmLoading={loading}
//     >
//       <Form form={form} layout="vertical">
//         <Form.Item 
//           name="name" 
//           label="Name" 
//           rules={[
//             { required: true, message: 'Please input role name!' },
//             { min: 2, message: 'Role name must be at least 2 characters' }
//           ]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item name="description" label="Description">
//           <Input.TextArea rows={4} />
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default RoleModal;