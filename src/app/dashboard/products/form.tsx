"use client";

import {
  Modal,
  Form,
  Input,
  Button,
  FormInstance,
  Upload,
  Select,
  InputNumber,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useNotification from "@/hooks/useNotification";
import {
  ProductFields,
  useAddProductMutation,
  useUpdateProductMutation,
} from "@/services/product";
import { useWatch } from "antd/es/form/Form";
import { useGetCategoriesQuery } from "@/services/category";
import { useMemo } from "react";

type FieldType = ProductFields;

type Props = {
  form: FormInstance<FieldType>;
  isFormVisible: boolean;
  handleCloseModal: () => void;
  refetch: () => void;
};

const ProductForm = ({
  form,
  isFormVisible,
  handleCloseModal = () => {},
  refetch = () => {},
}: Props) => {
  const { openNotification } = useNotification();
  const { data } = useGetCategoriesQuery(null);

  const categories = useMemo(() => data?.data.categories || [], [data]);

  const [addProduct, { isLoading }] = useAddProductMutation();
  const [updateProduct, { isLoading: updateLoading }] =
    useUpdateProductMutation();

  const imageField = useWatch("image", form);
  const isEdit = !!useWatch("id", form);

  const onFinish = async (values: FieldType) => {
    try {
      if (!isEdit) {
        await addProduct({ ...values, image: imageField }).unwrap();
      } else {
        await updateProduct({ ...values, image: imageField }).unwrap();
      }

      openNotification({
        type: "success",
        options: {
          message: `Product ${isEdit ? "Updated" : "Created"} Succesfully`,
        },
      });

      form.resetFields();
      refetch();
      handleCloseModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      title={`${isEdit ? "Edit" : "Create New"} Product`}
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
        <div className="hidden">
          <Form.Item<FieldType> name="id">
            <Input type="hidden" />
          </Form.Item>
          <Form.Item<FieldType> name="image">
            <Input type="hidden" />
          </Form.Item>
        </div>

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
          <Select placeholder="Select your Category" size="large" showSearch>
            {categories.map((category) => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
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
            accept="image/png, image/jpeg"
            listType="picture-card"
            maxCount={1}
            beforeUpload={(file) => {
              form.setFieldValue("image", file);

              return false;
            }}
            onPreview={() => false}
            onRemove={() => {
              form.setFieldValue("image", null);
            }}
            fileList={
              imageField
                ? [
                    {
                      uid: "local-image",
                      name: "local-image.png",
                      url:
                        typeof imageField === "string"
                          ? imageField
                          : URL.createObjectURL(imageField),
                    },
                  ]
                : []
            }
          >
            {!imageField && (
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
            loading={isLoading || updateLoading}
          >
            Save Product
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductForm;
