import React, { useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
  Switch,
} from "antd";
import moment from "moment";

const { Option } = Select;

const VoucherForm = ({ initialValues, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        expirationDate: initialValues.expirationDate
          ? moment(initialValues.expirationDate)
          : null,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = (values) => {
    const formattedValues = {
      ...values,
      expirationDate: values.expirationDate
        ? values.expirationDate.toISOString()
        : null,
    };
    console.log("aaa", formattedValues);

    onSubmit(formattedValues);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        type: "public",
        discountAmount: 0,
        minOrderValue: 0,
        isActive: false,
      }}>
      <Form.Item
        name="code"
        label="Voucher Code"
        rules={[
          { required: true, message: "Please enter the voucher code" },
          { max: 15, message: "Code cannot exceed 15 characters" },
        ]}>
        <Input placeholder="Enter voucher code" />
      </Form.Item>

      <Form.Item
        name="type"
        label="Voucher Type"
        rules={[{ required: true, message: "Please select the voucher type" }]}>
        <Select>
          <Option value="public">Public</Option>
          <Option value="restricted">Restricted</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="discountAmount"
        label="Discount Amount ($)"
        rules={[
          { required: true, message: "Please enter the discount amount" },
          { type: "number", min: 0, message: "Must be a positive value" },
        ]}>
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="discountPercentage"
        label="Discount Percentage (%)"
        rules={[
          {
            type: "number",
            min: 0,
            max: 100,
            message: "Must be between 0-100",
          },
        ]}>
        <InputNumber min={0} max={100} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="minOrderValue"
        label="Minimum Order Value ($)"
        rules={[
          { type: "number", min: 0, message: "Must be a positive value" },
        ]}>
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="maxUsage" label="Max Usage">
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="expirationDate" label="Expiration Date">
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item label="Active" name="isActive" valuePropName="checked">
        <Switch
          defaultChecked={true}
          // checkedChildren="Active" unCheckedChildren="Inactive"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ background: "black" }}>
          {initialValues ? "Update Voucher" : "Create Voucher"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default VoucherForm;
