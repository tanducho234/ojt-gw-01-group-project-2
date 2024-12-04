import React, { useEffect, useState, useRef } from "react";
import { Table, Input, Button, Space, Tag, Modal, message } from "antd";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import BrandForm from "./BrandForm";
// Import your BrandForm here when available
// import BrandForm from "./BrandForm";

const BrandTable = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recordEditing, setRecordEditing] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const fetchBrands = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/brands", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
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

  const handleAddBrand = async (brandData) => {
    try {
      await axios.post("http://localhost:3000/api/brands", brandData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Brand added successfully!");
      setIsModalVisible(false);
      fetchBrands(); // Refresh table
    } catch (error) {
      console.error("Error adding brand:", error);
      message.error("Failed to add brand!");
    }
  };

  const handleUpdateBrand = async (updatedBrand) => {
    try {
        console.log("updatedBrand",updatedBrand)
        console.log("editingBrand",editingBrand)

      await axios.put(
        `http://localhost:3000/api/brands/${editingBrand._id}`,
        updatedBrand,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success("Brand updated successfully!");
      setIsModalVisible(false);
      setEditingBrand(null);
      fetchBrands(); // Refresh table
    } catch (error) {
      console.error("Error updating brand:", error);
      message.error("Failed to update brand!");
    }
  };

  const handleEditBrand = (brand) => {
    setEditingBrand(brand);
    setIsModalVisible(true);
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
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
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
      width: 200,
      title: "Brand Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      fixed: "left",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <span>{text || "N/A"}</span>,
    },
    {
      align: "center",
      
      title: "Image",
      dataIndex: "imgLink",
      key: "imgLink",
      render: (link) =>
        link ? <img src={link} alt="Brand" style={{maxHeight: "50px", display: "block", margin: "0 auto"}} /> : "No Image",     },
    {
      align: "center",
      title: "Action",
      key: "operation",
      fixed: "right",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEditBrand(record)}>
            <Tag color="black" style={{ marginRight: 5 }}>
              Edit
            </Tag>
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
        Add Brand
      </Button>
      <Table
        size="small"
        columns={columns}
        dataSource={brands}
        loading={loading}
        bordered
        scroll={{ x: "max-content" }}
        rowKey="_id"
        className="min-h-[80vh]"
        pagination={{
          ...tableParams.pagination,
          position: ["bottomCenter"],
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
        title={editingBrand ? "Edit Brand" : "Add New Brand"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingBrand(null);
        }}
        footer={null}>
        {/* Replace with your BrandForm component */}
        <BrandForm
          initialValues={editingBrand}
          onSubmit={editingBrand ? handleUpdateBrand : handleAddBrand}
        />
      </Modal>
    </>
  );
};

export default BrandTable;
