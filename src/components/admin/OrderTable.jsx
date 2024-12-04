import React, { useEffect, useState, useRef } from "react";
import { Table, Input, Button, Space, Tag, Modal, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import OrderForm from "./OrderForm"; // Create a form similar to ProductForm
import { useAuth } from "../../hooks/useAuth";

const OrderTable = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    filters: {},
  });

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
      title: "User",
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
    },
    {
      width:100,
      align: "center",
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
      render: (status) => {
        let color;
        switch (status) {
          case "Pending":
            color = "blue";
            break;
          case "Preparing":
            color = "geekblue";
            break;
          case "Delivering":
            color = "orange";
            break;
          case "Delivered":
            color = "green";
            break;
          case "Returned":
            color = "red";
            break;
          default:
            color = "red";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      width:30,
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      render: (price) => `$${price.toFixed(2)}`,
    },

    {
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
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => handleEditOrder(record)}>
          <Tag color="black">Edit</Tag>
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table
        size="small"
        bordered
        columns={columns}
        dataSource={orders}
        loading={loading}
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
    </>
  );
};

export default OrderTable;
