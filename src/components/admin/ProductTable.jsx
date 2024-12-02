import React, { useEffect, useState, useRef } from "react";
import { Table, Input, Button, Space, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import axios from "axios"; // Sử dụng axios để fetch API
import { useFetchData } from "../../hooks/useFetchData";
import { useNavigate } from "react-router-dom";

const ProductTable = () => {
  const navigate = useNavigate();

  const { categories, styles, brands, colors, sizes } = useFetchData();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

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

  useEffect(() => {
    // Fetch dữ liệu từ API
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

    fetchProducts();
  }, []);

  // const scroll = { x: "100vw" };
  const scroll = { x: "max-content" };

  const handleTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    const order = sorter.order === 'ascend' ? 'asc' : 'desc';
    const sortBy = sorter.field;
    console.log('sortBy', sortBy)
    console.log('order', order)
    console.log('current', current)
    
  
    // fetchProducts({
    //   ...filters,
    //   sortBy,
    //   order,
    //   page: current,
    //   limit: pageSize,
    // });
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
      title: "Name",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps("name"),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      filters: [
        { text: "Male", value: "male" },
        { text: "Female", value: "female" },
        { text: "Unisex", value: "unisex" },
      ],
      onFilter: (value, record) => record.gender === value,
    },
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
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: "auto",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => navigate(`${record._id}/edit`)} // Use navigate here
        >
          <Tag color={"#1677ff"} style={{ marginRight: 5 }}>
            Edit
          </Tag>
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={products}
      loading={loading}
      rowKey="_id"
      scroll={scroll}
      expandable={expandable}
      onChange={handleTableChange}
    />
  );
};

export default ProductTable;
