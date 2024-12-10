import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Tag,
  Modal,
  message,
  Select,
  Steps,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import OrderForm from "./OrderForm"; // Create a form similar to ProductForm
import { useAuth } from "../../hooks/useAuth";
const statusOptions = [
  { value: "Pending", label: "Pending" },
  { value: "Preparing", label: "Preparing" },
  { value: "Delivering", label: "Delivering" },
  { value: "Delivered", label: "Delivered" },
  { value: "Returned", label: "Returned" },
];

const OrderTable = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [recordEditing, setRecordEditing] = useState([]);

  const searchInput = useRef(null);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    filters: {},
  });

  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsStatusModalVisible(true);
  };
  const handleSaveStatus = async () => {
    if (selectedOrder && newStatus !== selectedOrder.status) {
      try {
        setRecordEditing((prev) => [...prev, selectedOrder]);

        // Make an API call to update the order status
        const response = await axios.put(
          `https://ojt-gw-01-final-project-back-end.vercel.app/api/order-details/${selectedOrder._id}`,
          { status: newStatus },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Update the order status locally
        const updatedOrders = orders.map((order) =>
          order._id === selectedOrder._id ? response.data : order
        );
        setOrders(updatedOrders);
        message.success("Order status updated successfully!");
      } catch (error) {
        message.error("Failed to update order status.");
      } finally {
        setIsStatusModalVisible(false);
        setRecordEditing((prev) =>
          prev.filter((item) => item._id !== selectedOrder._id)
        );
      }
    } else {
      setIsStatusModalVisible(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "https://ojt-gw-01-final-project-back-end.vercel.app/api/order-details/admin",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: sorter.order,
      sortField: sorter.field,
    });
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
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
            size="small">
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small">
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "black" : undefined }} />
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

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setIsModalVisible(true);
  };

  const columns = [
    {
      width: 50,
      align: "center",
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      ...getColumnSearchProps("_id"),
      render: (id) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            direction: "rtl", // Makes the ellipsis appear on the left side
            textAlign: "left", // Keeps the text aligned correctly
            maxWidth: "50px",
          }}
          title={id}>
          {id}
        </div>
      ),
    },
    {
      width: 50,
      align: "center",
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      // render: (userId) => userId || "Unknown",
      ...getColumnSearchProps("userId"),
      render: (id) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            direction: "rtl", // Makes the ellipsis appear on the left side
            textAlign: "left", // Keeps the text aligned correctly
            maxWidth: "50px",
          }}
          title={id}>
          {id}
        </div>
      ),
    },
    {
      width: 50,
      align: "center",
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      filters: [
        { text: "COD", value: "COD" },
        { text: "Stripe", value: "Stripe" },
        { text: "VNPAY", value: "VNPAY" },
      ],
      onFilter: (value, record) => record.paymentMethod === value,
    },

    {
      width: 30,
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      render: (price) => `$${price.toFixed(2)}`,
    },

    {
      width: 120,
      align: "center",
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      filters: [
        { text: "Paid", value: "Paid" },
        { text: "Pending", value: "Pending" },
        { text: "Failed", value: "Failed" },
      ],
      onFilter: (value, record) => record.paymentStatus === value,
      render: (status) => {
        let color;
        switch (status) {
          case "Paid":
            color = "green";
            break;
          case "Pending":
            color = "orange";
            break;
          case "Failed":
            color = "red";
            break;
          default:
            color = "gray";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    //add shippingAddress
    {
      align: "left",
      title: <div style={{ textAlign: "center" }}>Shipping Address</div>,
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      children: [
        {
          title: "Recipient Name",
          dataIndex: ["shippingAddress", "recipientName"],
          key: "recipientName",
          width: 150,
          render: (recipientName) => recipientName || "N/A",
        },
        {
          title: "Phone Number",
          dataIndex: ["shippingAddress", "phoneNumber"],
          key: "phoneNumber",
          width: 150,
          render: (phoneNumber) => phoneNumber || "N/A",
        },
        {
          title: "Address",
          dataIndex: ["shippingAddress", "address"],
          key: "address",
          width: 250,
          render: (address) => address || "N/A",
        },
      ],
    },
    {
      width: 120,
      title: "Order Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Preparing", value: "Preparing" },
        { text: "Delivering", value: "Delivering" },
        { text: "Delivered", value: "Delivered" },
        { text: "Returned", value: "Returned" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status, record) => {
        return recordEditing.some((item) => item._id === record._id) ? (
          <Tag icon={<SyncOutlined spin />} color="processing">
            Updating
          </Tag>
        ) : (
          <>
            <Tag
              icon={status !== "Canceled" ? <EditOutlined /> : null}
              className={`
              ${status === "Pending" ? "bg-yellow-100 text-yellow-600" : ""}
              ${status === "Preparing" ? "bg-orange-100 text-orange-600" : ""}
              ${status === "Delivering" ? "bg-blue-100 text-blue-600" : ""} 
              ${status === "Delivered" ? "bg-green-100 text-green-600" : ""}
              ${status === "Returned" ? "bg-gray-100 text-gray-600" : ""}
              ${status === "Canceled" ? "bg-red-100 text-red-600" : ""} 
              cursor-pointer`}
              onClick={() => handleUpdateStatus(record)}>
              {status}
            </Tag>
          </>
        );
      },
    },

    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Button type="link" onClick={() => handleEditOrder(record)}>
    //       <Tag color="black">Edit</Tag>
    //     </Button>
    //   ),
    // },
  ];

  return (
    <>
      <Table
        title={() => (
          <span style={{ fontWeight: "bold", fontSize: "1.5em" }}>
            Orders table
          </span>
        )}
        size="small"
        bordered
        columns={columns}
        dataSource={orders}
        loading={loading}
        scroll={{ x: "max-content" }}
        rowKey="_id"
        pagination={{
          ...tableParams.pagination,
          position: ["bottomCenter"],
        }}
        onChange={handleTableChange}
      />
      {/* <Modal
        title={editingOrder ? "Edit Order" : "Add New Order"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <OrderForm initialValues={editingOrder} />
      </Modal> */}

      <Modal
        okButtonProps={{
          style: { backgroundColor: "black", borderColor: "black" },
        }}
        title="Update Order Status"
        open={isStatusModalVisible}
        onCancel={() => setIsStatusModalVisible(false)}
        onOk={handleSaveStatus}>
        <Steps
          direction="vertical"
          size="small"
          current={selectedOrder?.statusHistory.findIndex(
            (step) => step.status === selectedOrder.status
          )}>
          {selectedOrder?.statusHistory.map((step, index) => (
            <Steps.Step
              key={index}
              title={step.status}
              description={new Intl.DateTimeFormat("vi", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false, // 24-hour format
              }).format(new Date(step.timestamp))}
              className={step.status}
            />
          ))}
        </Steps>
        <Select
          value={newStatus}
          onChange={(value) => setNewStatus(value)}
          style={{ width: "100%" }}>
          {statusOptions
            .filter((status) => {
              if (selectedOrder?.status === "Preparing") {
                return status.value !== "Pending";
              }
              return true;
            })
            .map((status) => (
              <Select.Option key={status.value} value={status.value}>
                {status.label}
              </Select.Option>
            ))}
        </Select>
      </Modal>
    </>
  );
};

export default OrderTable;
