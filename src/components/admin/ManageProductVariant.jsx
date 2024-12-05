import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Form, Input, Button, Select, Modal, message, Space } from "antd";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

const { Option } = Select;

const ManageProductVariant = () => {
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
        message.success("Product loaded successfully!");
      } catch (error) {
        message.error(error.message);
      }
    };
    fetchProduct();
  }, [productId]);

  const addSize = () => {
    if (currentSize && currentPrice > 0 && currentQuantity > 0) {
      setSizes([
        ...sizes,
        { size: currentSize, price: currentPrice, quantity: currentQuantity },
      ]);
      setCurrentSize("");
      setCurrentPrice(0);
      setCurrentQuantity(0);
    } else {
      message.warning("Please fill out all size fields.");
    }
  };

  const handleAddVariant = async () => {
    const variantData = {
      color,
      sizes,
      imgLinks: imgLinks.split(",").map((link) => link.trim()),
    };
    try {
      const response = await axios.put(
        `https://ojt-gw-01-final-project-back-end.vercel.app/api/products/${productId}/colors`,
        variantData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) throw new Error("Failed to update variant.");
      setProduct(response.data.product);
      message.success("Variant added successfully!");
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to add variant.");
    }
  };

  const showModal = () => {
    setColor("");
    setSizes([]);
    setImgLinks("");
    setIsModalVisible(true);
  };

  const handleCancel = () => setIsModalVisible(false);

  return (
    <div>
      <h2>Manage Product Variant for {product?.name || "Loading..."}</h2>
      <Button type="primary" onClick={showModal}>
        Add Variant
      </Button>
      <Modal
        title="Add Variant"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleAddVariant}>
            Submit
          </Button>,
        ]}>
        <Form layout="vertical">
          <Form.Item label="Color" rules={[{ required: true }]}>
            <Select onChange={setColor} value={color}>
              {[
                "Green",
                "Red",
                "Yellow",
                "Orange",
                "Blue",
                "Purple",
                "Pink",
                "White",
                "Black",
                "Brown",
                "Gray",
                "HotPink",
              ].map((c) => (
                <Option key={c} value={c}>
                  {c}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Sizes">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Space>
                <Select
                  placeholder="Select Size"
                  value={currentSize}
                  onChange={setCurrentSize}
                  style={{ width: "100px" }}>
                  {["S", "M", "L", "XL"].map((size) => (
                    <Option key={size} value={size}>
                      {size}
                    </Option>
                  ))}
                </Select>
                <Input
                  placeholder="Price"
                  type="number"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(Number(e.target.value))}
                  style={{ width: "100px" }}
                />
                <Input
                  placeholder="Quantity"
                  type="number"
                  value={currentQuantity}
                  onChange={(e) => setCurrentQuantity(Number(e.target.value))}
                  style={{ width: "100px" }}
                />
                <Button onClick={addSize}>Add Size</Button>
              </Space>
              {sizes.map((size, index) => (
                <div key={index}>
                  <strong>{size.size}</strong> - Price: ${size.price} - Qty:
                  {size.quantity}
                </div>
              ))}
            </Space>
          </Form.Item>

          <Form.Item label="Image Links">
            <Input.TextArea
              placeholder="Comma separated image URLs"
              value={imgLinks}
              onChange={(e) => setImgLinks(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>

      <div style={{ marginTop: "20px" }}>
        <h3>Current Variants</h3>
        {product?.colors?.map((colorVariant, index) => (
          <div key={index}>
            <strong>Color:</strong> {colorVariant.color}
            <br />
            <strong>Sizes:</strong>
            {colorVariant.sizes.map(
              (s) => `${s.size} (Price: $${s.price}, Qty: ${s.quantity})`
            )}
            <br />
            <strong>Images:</strong>
            {colorVariant.imgLinks.map((link, idx) => (
              <a
                href={link}
                key={idx}
                target="_blank"
                rel="noopener noreferrer">
                View {idx + 1}
              </a>
            ))}
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProductVariant;
