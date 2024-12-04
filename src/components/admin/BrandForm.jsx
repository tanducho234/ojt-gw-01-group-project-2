import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const BrandForm = ({ initialValues, onSubmit }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setImageUrl(initialValues.imgLink || ""); // Set initial image URL if available
    } else {
      form.resetFields();
      setImageUrl("");
    }
  }, [initialValues, form]);

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

  const handleFinish = (values) => {
    const formattedValues = {
      ...values,
      imgLink: imageUrl,
    };
    onSubmit(formattedValues);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item
        name="name"
        label="Brand Name"
        rules={[
          { required: true, message: "Please enter the brand name" },
          { max: 50, message: "Brand name cannot exceed 50 characters" },
        ]}>
        <Input placeholder="Enter brand name" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Brand Description"
        rules={[
          { required: true, message: "Please enter a description" },
          { max: 500, message: "Description cannot exceed 500 characters" },
        ]}>
        <Input.TextArea placeholder="Enter brand description" rows={4} />
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
          {initialValues ? "Update" : "Create"}
          {/* {initialValues ? "Update Brand" : "Create Brand"} */}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BrandForm;
