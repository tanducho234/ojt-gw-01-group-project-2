import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Select,
  Modal,
  message,
  Space,
  Table,
  List,
} from "antd";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import EditSingleColorForm from "./EditColorsForm";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { Option } = Select;

const ManageProductVariant = () => {
  const [isEditMode, setIsEditMode] = useState(false); // Flag to check if it's edit or add mode

  const { token } = useAuth();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [color, setColor] = useState("");
  const [sizes, setSizes] = useState([]);
  const [imgLinks, setImgLinks] = useState([]);
  const [currentSize, setCurrentSize] = useState("");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null); // Store selected color for editing

  // Fetch product details on load
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://ojt-gw-01-final-project-back-end.vercel.app/api/products/${productId}`
        );
        if (response.status !== 200)
          throw new Error("Failed to fetch product.");
        setProduct(response.data);
        loadingMessage();
      } catch (error) {
        loadingMessage();
        message.error(error.message);
      }
    };
    let loadingMessage = message.loading("Loading variants", 0);
    fetchProduct();
  }, [productId]);

  const handleEditClick = (color) => {
    console.log("color", color);
    setSelectedColor(color);
    setIsEditMode(true); // Set to edit mode
    setIsModalVisible(true); // Open the modal
  };

  const handleAddClick = () => {
    setSelectedColor(null); // No color selected, it's a new addition
    setIsEditMode(false); // Set to add mode
    setIsModalVisible(true); // Open the modal
  };

  const handleUpdateColors = async (updatedColor) => {
    let loadingMessage = message.loading("Updating variant", 0);
    try {
      const response = await axios.put(
        `https://ojt-gw-01-final-project-back-end.vercel.app/api/products/${productId}/colors`,
        updatedColor,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProduct(response.data);
      loadingMessage();
      message.success("Variant added successfully!");
      setIsModalVisible(false);
    } catch (error) {
      loadingMessage();
      message.error("Failed to add variant.");
    }
  };

  const handleAddNewColor = async (newColor) => {
    let loadingMessage = message.loading("Adding new variant", 0);
    try {
      const response = await axios.put(
        `https://ojt-gw-01-final-project-back-end.vercel.app/api/products/${productId}/colors`,
        newColor,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProduct(response.data);
      loadingMessage();
      message.success("Variant added successfully!");
      setIsModalVisible(false);
    } catch (error) {
      loadingMessage();
      message.error("Failed to add variant.");
    }
  };
  return (
    <div className="min-h-[100vh]">
      <Button
        onClick={handleAddClick}
        type="primary"
        style={{ marginBottom: 16, float: "right", backgroundColor: "black" }}>
        Add New Color
      </Button>
      <Modal
        title={isEditMode ? "Edit Color" : "Add Color"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}>
        <EditSingleColorForm
          initialColor={selectedColor} // Pass the selected color (null for add mode)
          onSubmit={isEditMode ? handleUpdateColors : handleAddNewColor} // Call the respective function
          existingColors={product?.colors}
        />
      </Modal>
      <div style={{ marginTop: "20px" }}>
        {product?.colors?.map((colorVariant, index) => (
          <Table
            key={`table-${colorVariant.color.toLowerCase()}-${index}`} // Ensure unique key for each Table
            bordered
            title={() => (
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "1.5em",
                  textAlign: "left",
                  color:
                    colorVariant.color.toLowerCase() === "white"
                      ? "#000"
                      : colorVariant.color.toLowerCase(),
                }}>
                {colorVariant.color}
                {/* <Button
                  style={{ marginLeft: "8px", float: "right" }}
                  icon={<DeleteOutlined />}
                  danger
                /> */}
                <Button
                  style={{ marginLeft: "8px", float: "right" }}
                  color="default"
                  icon={<EditOutlined />}
                  onClick={() => handleEditClick(colorVariant)}></Button>
              </div>
            )}
            dataSource={colorVariant.sizes.map((size, sizeIndex) => ({
              ...size,
              key: `${colorVariant.color.toLowerCase()}-${sizeIndex}`, // Ensure each size item has a unique key
            }))}
            columns={[
              {
                title: "Size",
                dataIndex: "size",
                key: "size",
                width: 80,
                align: "center",
              },
              {
                width: 80,
                align: "center",
                title: "Price",
                dataIndex: "price",
                key: "price",
                render: (price) => `$${price}`,
              },
              {
                width: 80,
                align: "center",
                title: "Quantity",
                dataIndex: "quantity",
                key: "quantity",
              },
              {
                align: "center",
                title: "Images",
                render: (_, record) => (
                  <div className="flex flex-row justify-evenly">
                    {colorVariant.imgLinks.map((link, imgIndex) => (
                      <img
                        key={`img-${colorVariant.color.toLowerCase()}-${imgIndex}`} // Ensure unique key for each image
                        src={link}
                        alt={`Image ${imgIndex + 1}`}
                        className="w-[150px] object-cover m-0.5"
                      />
                    ))}
                  </div>
                ),
                onCell: (record, index) => ({
                  rowSpan: index % 10 === 0 ? 10 : 0,
                }),
              },
            ]}
            pagination={false}
            size="small"
          />
        ))}
      </div>
    </div>
  );
};

export default ManageProductVariant;
