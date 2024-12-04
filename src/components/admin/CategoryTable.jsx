import React, { useEffect, useState, useRef } from "react";
import { Table, Input, Button, Space, Tag, Modal, message } from "antd";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import CategoryForm from "./BrandForm";
import { useFetchData } from "../../hooks/useFetchData";
// Import your CategoryForm here when available
// import CategoryForm from "./CategoryForm";

const CategoryTable = () => {
  const { token } = useAuth();
  const { refetchData } = useFetchData();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recordEditing, setRecordEditing] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://ojt-gw-01-final-project-back-end.vercel.app/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
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

  const handleAddCategory = async (categoryData) => {
    let loadingMessage = message.loading("Adding category", 0);

    try {
      await axios.post("https://ojt-gw-01-final-project-back-end.vercel.app/api/categories", categoryData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadingMessage();
      message.success("Category added successfully!");
      setIsModalVisible(false);
      fetchCategories(); // Refresh table
      refetchData();
    } catch (error) {
      loadingMessage();
      console.error("Error adding category:", error);
      message.error("Failed to add category!");
    }
  };

  const handleUpdateCategory = async (updatedCategory) => {
    let loadingMessage = message.loading("Updating product", 0);

    try {
      const response = await axios.put(
        `https://ojt-gw-01-final-project-back-end.vercel.app/api/categories/${editingCategory._id}`,
        updatedCategory,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success("Category updated successfully!");
      setIsModalVisible(false);
      setEditingCategory(null);
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === editingCategory._id ? response.data : category
        )
      );
      refetchData();
      loadingMessage();
    } catch (error) {
      message.error("Failed to update category!");
      console.log(error);
      loadingMessage();
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
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
      title: "Category Name",
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
        link ? (
          <img
            src={link}
            alt="Category"
            style={{ maxHeight: "50px", display: "block", margin: "0 auto" }}
          />
        ) : (
          "No Image"
        ),
    },
    {
      align: "center",
      title: "Action",
      key: "operation",
      fixed: "right",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEditCategory(record)}>
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
        Add Category
      </Button>
      <Table
        size="small"
        columns={columns}
        dataSource={categories}
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
        title={editingCategory ? "Edit Category" : "Add New Category"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingCategory(null);
        }}
        footer={null}>
        <CategoryForm
          initialValues={editingCategory}
          onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
        />
      </Modal>
    </>
  );
};

export default CategoryTable;
