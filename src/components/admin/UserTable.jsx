import React, { useEffect, useState, useRef } from "react";
import { Table, Tabs, Input, Button, Space, Tag, message } from "antd";
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
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(
        "https://sl36qhn5-3000.asse.devtunnels.ms/api/auth/all?role=admin",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAdmins(response.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoadingAdmins(false);
    }
  };

  const fetchShippers = async () => {
    try {
      const response = await axios.get(
        "https://sl36qhn5-3000.asse.devtunnels.ms/api/auth/all?role=shipper",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShippers(response.data);
    } catch (error) {
      console.error("Error fetching shippers:", error);
    } finally {
      setLoadingShippers(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchShippers();
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
      title: "ID",
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
    },
   
  ];

  return (
    <Tabs defaultActiveKey="1" style={{ margin: "20px" }}>
      <TabPane tab="Admins" key="1">
        <Table
          title={() => (
            <span style={{ fontWeight: "bold", fontSize: "1.5em" }}>
              Admins Table
            </span>
          )}
          size="small"
          bordered
          columns={columns}
          dataSource={admins}
          loading={loadingAdmins}
          rowKey="_id"
          pagination={{ position: ["bottomCenter"] }}
        />
      </TabPane>
      <TabPane tab="Shippers" key="2">
        <Table
          title={() => (
            <span style={{ fontWeight: "bold", fontSize: "1.5em" }}>
              Shippers Table
            </span>
          )}
          size="small"
          bordered
          columns={columns}
          dataSource={shippers}
          loading={loadingShippers}
          rowKey="_id"
          pagination={{ position: ["bottomCenter"] }}
        />
      </TabPane>
    </Tabs>
  );
};

export default UserTable;
