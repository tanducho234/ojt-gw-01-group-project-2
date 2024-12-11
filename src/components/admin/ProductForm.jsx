import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Upload,
  message,
  Col,
  Row,
} from "antd";
const { Option } = Select;
import { useFetchData } from "../../hooks/useFetchData";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";

const ProductForm = ({ initialValues, onSubmit }) => {
  const { categories, styles, brands } = useFetchData();
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);

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
    onSubmit(values);
  };
  const handleUploadChange = async (info) => {
    console.log("handleUploadChange", info);
    if (info.file.status === "uploading") {
      message.loading({ content: "Uploading image...", key: "upload" });
    } else if (info.file.status === "done") {
      const response = info.file.response; // Ensure response returns image URL
      if (response) {
        setImageUrl(response);
        form.setFieldValue("generalImgLink", response);
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
        <Input
          placeholder="Enter product name"
          count={{
            show: true,
            max: 100,
          }}
        />
      </Form.Item>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Please select a gender" }]}>
            <Select>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="unisex">Unisex</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="price"
            label="Price"
            rules={[
              { required: true, message: "Please enter the product price" },
            ]}>
            <InputNumber
              min={0}
              formatter={(value) => `$ ${value}`}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
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
        </Col>
        <Col span={12}>
          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}>
            <Select placeholder="Select category">
              {categories.map((category) => (
                <Option key={category._id} value={category._id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="brandId"
            label="Brand"
            rules={[{ required: true, message: "Please select a brand" }]}>
            <Select placeholder="Select brand">
              {brands.map((brand) => (
                <Option key={brand._id} value={brand._id}>
                  {brand.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="styleId"
            label="Style"
            rules={[{ required: true, message: "Please select a style" }]}>
            <Select placeholder="Select style">
              {styles.map((style) => (
                <Option key={style._id} value={style._id}>
                  {style.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="description"
        label="Description"
        rules={[
          { required: true, message: "Please enter the product description" },
        ]}>
        <Input.TextArea
          placeholder="Enter product description"
          autoSize={{ minRows: 3, maxRows: 6 }}
        />
      </Form.Item>
      <Form.Item
        label="General Image"
        name="generalImgLink"
        rules={[{ required: true, message: "Please upload an image" }]}>
        <div>
          <Upload
            name="image"
            action="https://ojt-gw-01-final-project-back-end.vercel.app/api/upload-images/single"
            headers={{}}
            onChange={handleUploadChange}
            showUploadList={false} // Hide file list to show only button
            // You can manage the uploaded file list here if needed
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
          {imageUrl && (
            <div style={{ marginTop: 16 }}>
              <img src={imageUrl} alt="Brand" style={{ maxHeight: 200 }} />
            </div>
          )}
        </div>
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
