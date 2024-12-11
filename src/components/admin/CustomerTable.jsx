import React, { useEffect, useState, useRef } from "react";
import { Table, Input, Button, Space, Tag, Modal, message } from "antd";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

const CustomerTable = () => {
  const { token } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        "https://sl36qhn5-3000.asse.devtunnels.ms/api/auth/all?role=user",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
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
            size="small"
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
          >
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

  const columns = [
    {
      title: "Customer ID",
      dataIndex: "_id",
      key: "_id",
      ...getColumnSearchProps("_id"),
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      ...getColumnSearchProps("fullName"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phoneNumber) => phoneNumber || "N/A",
      ...getColumnSearchProps("email"),

    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      filters: [
        { text: "Male", value: "male" },
        { text: "Female", value: "female" },
        { text: "Other", value: "other" },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: "Birth Date",
      dataIndex: "birthDate",
      key: "birthDate",
      render: (birthDate) =>
        birthDate
          ? new Intl.DateTimeFormat("vi", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }).format(new Date(birthDate))
          : "N/A",
          filters: Array.from({length: 50}, (_, i) => ({ 
            text: `${new Date().getFullYear() - i}`,
            value: `${new Date().getFullYear() - i}`
          })),
          onFilter: (value, record) => {
            if (!record.birthDate) return false;
            return new Date(record.birthDate).getFullYear().toString() === value;
          }
    },
    //createAt
    {
      title: "Registered At",     
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (createdAt) =>
        createdAt
          ? new Intl.DateTimeFormat("vi", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }).format(new Date(createdAt))
          : "N/A",
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status) => {
    //     let color;
    //     switch (status) {
    //       case "Active":
    //         color = "green";
    //         break;
    //       case "Inactive":
    //         color = "red";
    //         break;
    //       default:
    //         color = "gray";
    //     }
    //     return <Tag color={color}>{status}</Tag>;
    //   },
    //   filters: [
    //     { text: "Active", value: "Active" },
    //     { text: "Inactive", value: "Inactive" },
    //   ],
    //   onFilter: (value, record) => record.status === value,
    // },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Button type="link" onClick={() => handleEditCustomer(record)}>
    //       <Tag color="black">Edit</Tag>
    //     </Button>
    //   ),
    // },
  
  ];

  return (
    <Table
      title={() => (
        <span style={{ fontWeight: "bold", fontSize: "1.5em" }}>
          Customers Table
        </span>
      )}
      size="small"
      bordered
      columns={columns}
      dataSource={customers}
      loading={loading}
      rowKey="_id"
      pagination={{ position: ["bottomCenter"] }}
    />
  );
};

export default CustomerTable;
