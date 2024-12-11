import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  Tabs,
  Input,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

const { TabPane } = Tabs;

const UserTable = () => {
  const { token } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [loadingShippers, setLoadingShippers] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState(null);

  const fetchUsers = async (role, setUsers, setLoading) => {
    try {
      const response = await axios.get(
        `https://sl36qhn5-3000.asse.devtunnels.ms/api/auth/all?role=${role}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error(`Error fetching ${role}s:`, error);
      message.error(`Failed to fetch ${role}s.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers("admin", setAdmins, setLoadingAdmins);
    fetchUsers("shipper", setShippers, setLoadingShippers);
  }, []);

  const handleEdit = (record, role) => {
    setEditingRecord(record);
    setCurrentRole(role);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id, role) => {
    try {
      await axios.delete(
        `https://sl36qhn5-3000.asse.devtunnels.ms/api/auth/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success(`${role} deleted successfully.`);
      if (role === "admin") fetchUsers("admin", setAdmins, setLoadingAdmins);
      if (role === "shipper")
        fetchUsers("shipper", setShippers, setLoadingShippers);
    } catch (error) {
      console.error(`Error deleting ${role}:`, error);
      message.error(`Failed to delete ${role}.`);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingRecord) {
        // Update existing record
        await axios.put(
          `https://sl36qhn5-3000.asse.devtunnels.ms/api/auth/${editingRecord._id}`,
          { ...values, role: currentRole },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success(`${currentRole} updated successfully.`);
      } else {
        // Create new record
        await axios.post(
          `https://sl36qhn5-3000.asse.devtunnels.ms/api/auth`,
          { ...values, role: currentRole },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success(`${currentRole} created successfully.`);
      }
      fetchUsers(
        currentRole,
        currentRole === "admin" ? setAdmins : setShippers,
        currentRole === "admin" ? setLoadingAdmins : setLoadingShippers
      );
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error(`Error saving ${currentRole}:`, error);
      message.error(`Failed to save ${currentRole}.`);
    }
  };

  const columns = (role) => [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phoneNumber) => phoneNumber || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record, role)}>
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record._id, role)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Tabs defaultActiveKey="1" style={{ margin: "20px" }}>
        <TabPane tab="Admins" key="1">
          <Button
            type="primary"
            style={{
              marginBottom: 16,
              float: "right",
              backgroundColor: "black",
            }}
            onClick={() => {
              setModalVisible(true);
              setCurrentRole("admin");
              setEditingRecord(null);
            }}>
            Add Admin
          </Button>
          <Table
            title={() => (
              <span style={{ fontWeight: "bold", fontSize: "1.5em" }}>
                Admins Table
              </span>
            )}
            size="small"
            bordered
            columns={columns("admin")}
            dataSource={admins}
            loading={loadingAdmins}
            rowKey="_id"
            pagination={{ position: ["bottomCenter"] }}
          />
        </TabPane>
        <TabPane
          tab="Shippers"
          key="2"
          extra={
            <Button
              onClick={() => {
                setModalVisible(true);
                setCurrentRole("shipper");
              }}>
              Add Shipper
            </Button>
          }>
          <Table
            title={() => (
              <span style={{ fontWeight: "bold", fontSize: "1.5em" }}>
                Shippers Table
              </span>
            )}
            size="small"
            bordered
            columns={columns("shipper")}
            dataSource={shippers}
            loading={loadingShippers}
            rowKey="_id"
            pagination={{ position: ["bottomCenter"] }}
          />
        </TabPane>
      </Tabs>

      <Modal
        open={modalVisible}
        title={editingRecord ? `Edit ${currentRole}` : `Add ${currentRole}`}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}>
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[
              { required: true, message: "Please enter the full name." },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter the email." }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Phone Number">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingRecord ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserTable;
