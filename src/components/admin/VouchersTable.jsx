import React, { useEffect, useState, useRef } from "react";
import { Table, Input, Button, Space, Tag, Modal, message } from "antd";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import VoucherForm from "./VoucherForm";

const VoucherTable = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recordEditing, setRecordEditing] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const fetchVouchers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/vouchers/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setVouchers(response.data);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleAddVoucher = async (voucherData) => {
    try {
      await axios.post("https://ojt-gw-01-final-project-back-end.vercel.app/api/vouchers", voucherData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Voucher added successfully!");
      setIsModalVisible(false);
      fetchVouchers(); // Refresh table
    } catch (error) {
      console.error("Error adding voucher:", error);
      message.error("Failed to add voucher!");
    }
  };

  const handleUpdateVoucher = async (updatedVoucher) => {
    try {
      await axios.put(
        `https://ojt-gw-01-final-project-back-end.vercel.app/api/vouchers/${editingVoucher._id}`,
        updatedVoucher,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success("Voucher updated successfully!");
      setIsModalVisible(false);
      setEditingVoucher(null); // Reset state
      fetchVouchers(); // Refresh table
    } catch (error) {
      console.error("Error updating voucher:", error);
      message.error("Failed to update voucher!");
    }
  };

  const handleEditVoucher = (voucher) => {
    setEditingVoucher(voucher); // Set voucher data to be edited
    setIsModalVisible(true); // Open the modal
  };

  const handleToggleActive = async (record) => {
    setRecordEditing((prev) => [...prev, record]);
    try {
      await axios.put(
        `https://ojt-gw-01-final-project-back-end.vercel.app/api/vouchers/${record._id}`,
        {
          isActive: !record.isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update local state
      setVouchers((prevVouchers) =>
        prevVouchers.map((voucher) =>
          voucher._id === record._id
            ? { ...voucher, isActive: !voucher.isActive }
            : voucher
        )
      );
    } catch (error) {
      console.error("Error toggling voucher status:", error);
    } finally {
      setRecordEditing((prev) =>
        prev.filter((item) => item._id !== record._id)
      );
    }
  };

  const handleSendEmail = async (voucher) => {
    try {
      const email = prompt("Enter user email:");
      if (!email) return;
      let loadingMessage = message.loading("Sending email...", 0);
      await axios.post(
        "https://ojt-gw-01-final-project-back-end.vercel.app/api/emails/send-email", // Replace with your endpoint
        {
          to: email,
          subject: `Your Voucher Code: ${voucher.code}`, // Subject line includes voucher code
          html: `
          <h2>🎉 Congratulations! You've received a voucher! 🎉</h2>
          <p><b>Voucher Code:</b> ${voucher.code}</p>
          <p><b>Discount:</b> ${
            voucher.discountPercentage
              ? `${voucher.discountPercentage}%`
              : `$${voucher.discountAmount}`
          }</p>
          <p><b>Minimum Order Value:</b> $${voucher.minOrderValue || "None"}</p>
          <p><b>Maximum Usage:</b> ${voucher.maxUsage} times</p>
          <p><b>Expiration Date:</b> ${
            voucher.expirationDate
              ? new Date(voucher.expirationDate).toLocaleDateString("vi-VN")
              : "No expiration"
          }</p>
          <br />
          <p>Use this voucher at checkout to enjoy your discount!</p>
          <p>Thank you for shopping with us!</p>
        `,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      loadingMessage();
      message.success("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      message.error("Failed to send email!");
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}>
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}>
            Reset
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      width: 150,
      title: "Code",
      dataIndex: "code",
      key: "code",
      ...getColumnSearchProps("code"),
      fixed: "left",
    },
    {
      align: "center",
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 120,
      filters: [
        { text: "Public", value: "public" },
        { text: "Restricted", value: "restricted" },
      ],
      onFilter: (value, record) => record.type === value,
      render: (type) => (
        <span style={{ color: type === "public" ? "#87d068" : "#f50" }}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      ),
    },
    {
      align: "center",
      title: "Discount Amount",
      dataIndex: "discountAmount",
      key: "discountAmount",
      sorter: (a, b) => a.discountAmount - b.discountAmount,
    },
    {
      align: "center",
      title: "Discount %",
      dataIndex: "discountPercentage",
      key: "discountPercentage",
      sorter: (a, b) => a.discountPercentage - b.discountPercentage,
    },
    {
      align: "center",
      title: "Min Order Value",
      dataIndex: "minOrderValue",
      key: "minOrderValue",
      sorter: (a, b) => a.minOrderValue - b.minOrderValue,
    },
    {
      align: "center",
      title: "Max Usage",
      dataIndex: "maxUsage",
      key: "maxUsage",
      sorter: (a, b) => a.maxUsage - b.maxUsage,
    },
    {
      align: "center",
      title: "Usage Count",
      dataIndex: "usageCount",
      key: "usageCount",
      sorter: (a, b) => a.usageCount - b.usageCount,
    },
    {
      align: "center",
      title: "Expiration Date",
      dataIndex: "expirationDate",
      key: "expirationDate",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "N/A",
    },
    {
      align: "center",
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "N/A",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      fixed: "right",
      align: "center",
      title: "Is Active",
      dataIndex: "isActive",
      width: 120,
      key: "isActive",
      render: (isActive, record) => {
        return recordEditing.some((item) => item._id === record._id) ? (
          <Tag icon={<SyncOutlined spin />} color="processing">
            Updating
          </Tag>
        ) : (
          <Tag
            color={isActive ? "green" : "red"}
            style={{ cursor: "pointer" }}
            onClick={() => handleToggleActive(record)}>
            {isActive ? "Active" : "Inactive"}
          </Tag>
        );
      },
    },
    {
      align: "center",
      title: "Action",
      key: "operation",
      fixed: "right",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEditVoucher(record)}>
            <Tag color="black" style={{ marginRight: 5 }}>
              Edit
            </Tag>
          </Button>
          <Button type="link" onClick={() => handleSendEmail(record)}>
            <Tag color="blue">Send Voucher</Tag>
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 16, float: "left", backgroundColor: "black" }}>
        Add Voucher
      </Button>
      <Table
        size="small"
        columns={columns}
        dataSource={vouchers}
        loading={loading}
        bordered
        scroll={{ x: "max-content" }}
        rowKey="_id"
        className="min-h-[80vh]"
        pagination={{
          ...tableParams.pagination,
          position: ["bottomCenter"], // Set pagination at the bottom center
        }}
        onChange={(pagination, filters, sorter) => {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            setTableParams({ pagination, filters, sorter });
          }, 300);
        }}
      />
      <Modal
        title={editingVoucher ? "Edit Voucher" : "Add New Voucher"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingVoucher(null); // Reset after closing modal
        }}
        footer={null}>
        <VoucherForm
          initialValues={editingVoucher}
          onSubmit={editingVoucher ? handleUpdateVoucher : handleAddVoucher}
        />
      </Modal>
    </>
  );
};

export default VoucherTable;
