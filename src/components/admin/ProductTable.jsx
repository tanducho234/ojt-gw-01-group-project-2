import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Tag,
  Modal,
  message,
  Tooltip,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import axios from "axios"; // Sử dụng axios để fetch API
import { useFetchData } from "../../hooks/useFetchData";
import { Link, useNavigate } from "react-router-dom";
import ProductForm from "./ProductForm";
import { useAuth } from "../../hooks/useAuth";
const ProductTable = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { categories, styles, brands, colors, sizes, refetchData } =
    useFetchData();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // Quản lý sản phẩm đang chỉnh sửa

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    filters: {},
  });

  const defaultExpandable = {
    expandedRowRender: (record) => (
      <div className="flex">
        {record.colors.map((colorVariant, colorIndex) => (
          <div key={colorIndex} className="mr-10">
            <span style={{ color: colorVariant.color }}>
              {colorVariant.color}
            </span>
            <table style={{ width: "auto", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "left",
                    }}>
                    Size
                  </th>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "left",
                    }}>
                    Price
                  </th>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "left",
                    }}>
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody>
                {colorVariant.sizes.map((sizeVariant, sizeIndex) => (
                  <tr key={sizeIndex}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {sizeVariant.size}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      ${sizeVariant.price.toFixed(2)}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {sizeVariant.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    ),
  };

  const [expandable, setExpandable] = useState(defaultExpandable);
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://ojt-gw-01-final-project-back-end.vercel.app/api/products"
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Fetch dữ liệu từ API

    fetchProducts();
  }, []);

  // const scroll = { x: "100vw" };
  const scroll = { x: "max-content" };

  const createQueryParams = () => {
    const { pagination, filters, sortField, sortOrder } = tableParams;
    const { current: page, pageSize: limit } = pagination;

    const params = new URLSearchParams();

    // Thêm các thông số pagination và sorting
    params.append("page", page);
    params.append("limit", limit);
    if (sortField) params.append("sortBy", sortField);
    if (sortOrder)
      params.append("order", sortOrder === "ascend" ? "asc" : "desc");

    // Thêm các filters
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        const filterValue = filters[key];
        if (Array.isArray(filterValue) && filterValue.length > 0) {
          filterValue.forEach((value) => params.append(key, value));
        } else if (filterValue) {
          params.append(key, filterValue);
        }
      }
    });

    return params.toString();
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });
    console.log("createQueryParams", createQueryParams());
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

  const handleEditProduct = (product) => {
    console.log("handleEditProduct", product);
    setEditingProduct(product);
    setIsModalVisible(true);
  };

  const handleAddProduct = async (values) => {
    let loadingMessage = message.loading("Adding product", 0);
    try {
      await axios.post(
        "https://ojt-gw-01-final-project-back-end.vercel.app/api/products",
        values,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      loadingMessage();
      message.success("Product added successfully!");
      fetchProducts(); // Tải lại danh sách sản phẩm
    } catch (error) {
      loadingMessage();
      message.error("Failed to add product.");
      console.error(error);
    } finally {
      setIsModalVisible(false);
    }
  };

  const handleUpdateProduct = async (values) => {
    let loadingMessage = message.loading("Updating product", 0);

    try {
      const response = await axios.put(
        `https://ojt-gw-01-final-project-back-end.vercel.app/api/products/${editingProduct._id}`,
        values,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      loadingMessage();
      message.success("Product updated successfully!");
      // Update the product in the existing products array
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === editingProduct._id ? response.data : product
        )
      );
    } catch (error) {
      loadingMessage();
      message.error("Failed to update product.");
      console.error(error);
    } finally {
      setIsModalVisible(false);
      setEditingProduct(null);
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

  // Function to get the name by ID
  const getNameById = (id, array) => {
    const item = array.find((item) => item._id === id);
    return item ? item.name : "Unknown";
  };

  const columns = [
    {
      align: "center",
      title: "Product ID",
      dataIndex: "_id",
      key: "_id",
      fixed: "left",
      width: 50,
      ...getColumnSearchProps("_id"),
      render: (id) => (
        <Tooltip title={id}>
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              direction: "rtl", // Makes the ellipsis appear on the left side
              textAlign: "left", // Keeps the text aligned correctly
              maxWidth: "50px",
            }}>
            {id}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps("name"),
    },
    // {
    //   title: "Gender",
    //   dataIndex: "gender",
    //   key: "gender",
    //   filters: [
    //     { text: "Male", value: "male" },
    //     { text: "Female", value: "female" },
    //     { text: "Unisex", value: "unisex" },
    //   ],
    //   onFilter: (value, record) => record.gender === value,
    // },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Sale %",
      dataIndex: "salePercentage",
      key: "salePercentage",
      sorter: (a, b) => a.salePercentage - b.salePercentage,
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      key: "categoryId",
      filters: categories.map((category) => ({
        text: category.name,
        value: category._id,
      })),
      onFilter: (value, record) => record.categoryId === value,
      render: (categoryId) => getNameById(categoryId, categories),
    },
    {
      title: "Brand",
      dataIndex: "brandId",
      key: "brandId",
      render: (brandId) => getNameById(brandId, brands),
      filters: brands.map((brand) => ({
        text: brand.name,
        value: brand._id,
      })),
      onFilter: (value, record) => record.brandId === value,
    },
    {
      title: "Style",
      dataIndex: "styleId",
      key: "styleId",
      render: (styleId) => getNameById(styleId, styles),
      filters: styles.map((style) => ({
        text: style.name,
        value: style._id,
      })),
      onFilter: (value, record) => record.styleId === value,
    },
    ,
    {
      align: "center",

      title: "General Image",
      dataIndex: "generalImgLink",
      key: "generalImgLink",
      render: (link) =>
        link ? (
          <img
            src={link}
            alt="product"
            style={{
              maxHeight: "50px",
              display: "block",
              margin: "0 auto",
              minHeight: "50px",
            }}
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Sold Quantity",
      dataIndex: "soldQuantity",
      key: "soldQuantity",
      sorter: (a, b) => a.soldQuantity - b.soldQuantity,
    },

    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: "auto",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-between">
          <Tooltip title="Edit Product">
            <Button
              onClick={() => handleEditProduct(record)}
              color="default"
              variant="solid"
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Tooltip title="Add Product Variant">
            <Link to={`/admin/products/${record._id}`}>
              <Button
                type="primary"
                color="default"
                variant="solid"
                icon={<PlusOutlined />}
              />
            </Link>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 16, float: "right", backgroundColor: "black" }}>
        Add Product
      </Button>
      <Table
        title={() => (
          <span style={{ fontWeight: "bold", fontSize: "1.5em" }}>
            Products table
          </span>
        )}
        size="small"
        bordered
        className="min-h-[80vh]"
        columns={columns}
        dataSource={products}
        loading={loading}
        rowKey="_id"
        scroll={scroll}
        expandable={expandable}
        onChange={(pagination, filters, sorter) => {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            handleTableChange(pagination, filters, sorter);
          }, 300);
        }}
        pagination={{
          ...tableParams.pagination,
          position: ["bottomCenter"], // Set pagination at the bottom center
        }}
      />

      <Modal
        title={editingProduct ? "Edit Product" : "Add New Product"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingProduct(null);
        }}
        footer={null}>
        <ProductForm
          initialValues={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
        />
      </Modal>
    </>
  );
};

export default ProductTable;
