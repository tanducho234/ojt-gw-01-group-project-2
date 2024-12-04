import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Upload,
  message,
} from "antd";
import { useFetchData } from "../../hooks/useFetchData";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";

const ProductForm = ({ initialValues, onSubmit }) => {
  const { categories, styles, brands } = useFetchData();
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setImageUrl(initialValues.generalImgLink || ""); // Set initial image URL if available
    } else {
      form.resetFields();
      setImageUrl("");
    }
  }, [initialValues, form]);

  const handleFinish = (values) => {
    const formattedValues = {
      ...values,
      generalImgLink: imageUrl,
    };
    onSubmit(formattedValues);
  };
  const handleUploadChange = async (info) => {
    console.log("handleUploadChange", info);
    if (info.file.status === "uploading") {
      message.loading({ content: "Uploading image...", key: "upload" });
    } else if (info.file.status === "done") {
      const response = info.file.response; // Ensure response returns image URL
      if (response) {
        setImageUrl(response);
        message.success({
          content: "Image uploaded successfully!",
          key: "upload",
        });
      } else {
        message.error({ content: "Failed to upload image!", key: "upload" });
      }
    } else if (info.file.status === "error") {
      message.error({
        content: `${info.file.name} file upload failed.`,
        key: "upload",
      });
    }
  };
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        price: 0,
        salePercentage: 0,
        ...initialValues,
      }}>
      <Form.Item
        name="name"
        label="Product Name"
        rules={[
          { required: true, message: "Please enter the product name" },
          { max: 100, message: "Product name cannot exceed 100 characters" },
        ]}>
        <Input placeholder="Enter product name" />
      </Form.Item>

      <Form.Item
        name="gender"
        label="Gender"
        rules={[{ required: true, message: "Please select a gender" }]}>
        <Select placeholder="Select gender">
          <Select.Option value="male">Male</Select.Option>
          <Select.Option value="female">Female</Select.Option>
          <Select.Option value="unisex">Unisex</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="price"
        label="Price"
        rules={[{ required: true, message: "Please enter the product price" }]}>
        <InputNumber
          min={0}
          formatter={(value) => `$ ${value}`}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item
        name="salePercentage"
        label="Sale Percentage"
        rules={[
          {
            type: "number",
            min: 0,
            max: 100,
            message: "Sale percentage must be between 0 and 100",
          },
        ]}>
        <InputNumber
          min={0}
          max={100}
          formatter={(value) => `${value}%`}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item
        name="categoryId"
        label="Category"
        rules={[{ required: true, message: "Please select a category" }]}>
        <Select placeholder="Select category">
          {categories.map((category) => (
            <Select.Option key={category._id} value={category._id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="brandId"
        label="Brand"
        rules={[{ required: true, message: "Please select a brand" }]}>
        <Select placeholder="Select brand">
          {brands.map((brand) => (
            <Select.Option key={brand._id} value={brand._id}>
              {brand.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="styleId"
        label="Style"
        rules={[{ required: true, message: "Please select a style" }]}>
        <Select placeholder="Select style">
          {styles.map((style) => (
            <Select.Option key={style._id} value={style._id}>
              {style.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Upload Image">
        <Upload
          name="image"
          action="https://ojt-gw-01-final-project-back-end.vercel.app/api/upload-images/single"
          headers={{}}
          onChange={handleUploadChange}
          showUploadList={false} // Hide file list to show only button
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
        {imageUrl && (
          <div style={{ marginTop: 16 }}>
            <img src={imageUrl} alt="Brand" style={{ maxHeight: 200 }} />
          </div>
        )}
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ background: "black" }}>
          {initialValues ? "Update Product" : "Create Product"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProductForm;
