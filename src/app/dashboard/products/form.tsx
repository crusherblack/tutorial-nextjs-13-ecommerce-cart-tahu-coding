"use client";

import {
  Modal,
  Form,
  Input,
  Button,
  FormInstance,
  Upload,
  UploadFile,
  Select,
  InputNumber,
} from "antd";
import React, { useState } from "react";
import type { Product } from "@prisma/client";
import { PlusOutlined } from "@ant-design/icons";
import useNotification from "@/hooks/useNotification";

type FieldType = Product;

type Props = {
  form: FormInstance<FieldType>;
  isFormVisible: boolean;
  handleCloseModal: () => void;
};

const ProductForm = ({
  form,
  isFormVisible,
  handleCloseModal = () => {},
}: Props) => {
  const { openNotification } = useNotification();

  const [image, setImage] = useState<File | null>(null);

  const onFinish = async (values: FieldType) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      if (image) {
        formData.append("image", image);
      }

      const headers = {
        "Content-Type": "multipart/form-data", // Set the content type to support form data
      };

      // const { data } = await api.post("/api/dashboard/products", formData, {
      //   headers,
      // });

      openNotification({
        type: "success",
        options: {
          message: "Product Create Succesfully",
        },
      });

      // return console.log(data);

      form.resetFields();
    } catch (error) {
      //handle error based on axios instance or not
    } finally {
    }
  };

  const validateFileType = ({ type }: UploadFile, allowedTypes?: string) => {
    if (!allowedTypes) {
      return true;
    }

    if (type) {
      return allowedTypes.includes(type);
    }
  };

  return (
    <Modal
      title="Create New Product"
      open={isFormVisible}
      footer={() => <div />}
      onCancel={handleCloseModal}
    >
      <div className="mt-6" />
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        form={form}
      >
        <Form.Item<FieldType>
          label="Name"
          name="name"
          rules={[
            {
              message: "Please input your Name!",
              min: 3,
              max: 50,
              required: true,
            },
          ]}
        >
          <Input placeholder="Input your Name" size="large" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: "Please input product description!",
            },
          ]}
        >
          <Input placeholder="Input product description" size="large" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Category"
          name="categoryId"
          rules={[
            {
              required: true,
              message: "Please input product category!",
            },
          ]}
        >
          <Select placeholder="Select your Category" size="large">
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item<FieldType>
          label="Price"
          name="price"
          rules={[
            {
              required: true,
              message: "Please input product price!",
            },
          ]}
        >
          <InputNumber
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            }
            parser={(value) => value!.replace(/\./g, "")}
            placeholder="Input product price"
            size="large"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item<FieldType>
          label="Qty"
          name="qty"
          rules={[
            {
              required: true,
              message: "Please input product qty!",
            },
          ]}
        >
          <InputNumber
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            }
            parser={(value) => value!.replace(/\./g, "")}
            placeholder="Input your Price"
            size="large"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item<FieldType> label="Image">
          <Upload
            listType="picture-card"
            maxCount={1}
            beforeUpload={(file) => {
              setImage(file);
              return false;
            }}
            onPreview={() => false}
            onRemove={() => {
              setImage(null);
            }}
            accept="image/png, image/jpeg"
          >
            {!image && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full mt-4"
            size="large"
          >
            Save Product
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductForm;
