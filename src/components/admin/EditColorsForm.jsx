import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Space,
  InputNumber,
  Upload,
  message,
} from "antd";
import {
  UploadOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useFetchData } from "../../hooks/useFetchData";

const { Option } = Select;

const EditSingleColorForm = ({
  initialColor,
  existingColors = [],
  onSubmit,
}) => {
  const { colors } = useFetchData();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const formatFileList = (images) => {
    return images.map((url, index) => ({
      uid: `-${index + 1}`, // Unique ID for each image
      //   name: index === 0 ? "front.png" : index === 1 ? "back.png" : "side.png", // Name based on position
      name: `Image ${index + 1}.png`,
      status: "done", // These images are already uploaded
      url: url, // URL of the uploaded image
    }));
  };

  useEffect(() => {
    if (initialColor) {
      form.setFieldsValue({
        color: initialColor.color,
        sizes: initialColor.sizes || [],
        imgLinks: initialColor.imgLinks || [],
      });
      setFileList(formatFileList(initialColor.imgLinks));
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [initialColor, existingColors]);

  const handleFinish = (values) => {
    const imgLinks = fileList.map((file) => file.url || file.response);
    if (imgLinks.length !== 3) {
      message.error("Please upload exactly 3 images before submitting.");
      return;
    }

    if (!values.sizes || values.sizes.length < 1) {
      message.error("Please add at least one size before submitting.");
      return;
    }
    const colorData = {
      color: values.color,
      sizes: values.sizes || [],
      imgLinks: imgLinks, // Use uploaded image URLs
    };

    onSubmit(colorData); // Pass updated color data to parent
  };

  const validateUniqueColor = (_, value) => {
    const isDuplicate = existingColors.some(
      (c) =>
        c.color === value && (!initialColor || c.color !== initialColor.color)
    );
    if (isDuplicate) {
      return Promise.reject(new Error("This color already exists."));
    }
    return Promise.resolve();
  };

  const handleChange = ({ fileList: newFileList }) => {
    console.log("handleChange fileList:", newFileList);
    setFileList(newFileList);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      style={{ marginTop: 20 }}>
      <Form.Item
        label="Color"
        name="color"
        rules={[
          { required: true, message: "Please select a color." },
          { validator: validateUniqueColor },
        ]}>
        <Select placeholder="Select a color" disabled={initialColor?.color}>
          {colors.map((c) => (
            <Option key={c} value={c}>
              {c}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Image Upload */}
      <Form.Item
        label="Upload Images"
        required
        validateStatus={fileList.length !== 3 ? "error" : ""}
        help={fileList.length !== 3 ? "Please upload exactly 3 images." : ""}>
        <Upload
          name="image"
          action="https://ojt-gw-01-final-project-back-end.vercel.app/api/upload-images/single"
          listType="picture"
          maxCount={3}
          multiple
          fileList={fileList}
          onChange={handleChange}

          //   onChange={handleUploadChange}
        >
          <Button icon={<UploadOutlined />}>Upload Images (Max: 3)</Button>
        </Upload>
      </Form.Item>

      {/* Sizes Management */}
      <Form.List name="sizes">
        {(fields, { add, remove }) => {
          // Track selected sizes
          const selectedSizes = fields.map((field) =>
            form.getFieldValue(["sizes", field.name, "size"])
          );

          // Function to handle adding a new size with a default size
          const handleAdd = () => {
            const newSize = selectedSizes.length
              ? ["S", "M", "L", "XL"].find(
                  (size) => !selectedSizes.includes(size)
                )
              : "S";
            add({ size: newSize, price: 20, quantity: 20 }); // Adding a new size with default value
          };

          return (
            <>
              {fields.map((field, index) => (
                <Space
                  key={field.key}
                  align="baseline"
                  style={{ display: "flex", marginBottom: 8 }}>
                  <Form.Item
                    name={[field.name, "size"]}
                    label="Size"
                    rules={[{ required: true, message: "Missing size" }]}>
                    <Select
                      placeholder="Select Size"
                      value={form.getFieldValue(["sizes", field.name, "size"])}
                      style={{ minWidth: "100px" }}
                      onChange={(value) =>
                        form.setFieldsValue({
                          sizes: { [field.name]: { size: value } },
                        })
                      }>
                      {["S", "M", "L", "XL"].map((size) => (
                        <Option
                          key={size}
                          value={size}
                          disabled={
                            selectedSizes.includes(size) &&
                            form.getFieldValue([
                              "sizes",
                              field.name,
                              "size",
                            ]) !== size
                          }>
                          {size}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name={[field.name, "price"]}
                    label="Price"
                    rules={[
                      { required: true, message: "Missing price" },
                      {
                        type: "number",
                        min: 0.01,
                        message: "Price must be greater than 0",
                      },
                    ]}>
                    <InputNumber style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item
                    name={[field.name, "quantity"]}
                    label="Quantity"
                    rules={[
                      { required: true, message: "Missing quantity" },
                      {
                        type: "number",
                        min: 1,
                        message: "Quantity must be greater than 0",
                      },
                    ]}>
                    <InputNumber precision={0} style={{ width: "100%" }} />
                  </Form.Item>

                  <MinusCircleOutlined
                    className="text-red-500"
                    onClick={() => remove(field.name)}
                  />
                </Space>
              ))}

              <Button
                type="dashed"
                onClick={handleAdd} // Call handleAdd instead of just add()
                block
                disabled={fields.length >= 4}
                icon={<PlusOutlined />}>
                Add Size
              </Button>
            </>
          );
        }}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="bg-black mt-2">
          {initialColor ? "Save Changes" : "Add Color"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditSingleColorForm;
