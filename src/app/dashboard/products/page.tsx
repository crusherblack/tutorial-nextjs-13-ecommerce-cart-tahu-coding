"use client";

import { Button, Form, Table, Input, Popconfirm } from "antd";
import { useEffect, useMemo, useState } from "react";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { PlusOutlined } from "@ant-design/icons";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import ProductForm from "./form";
import { columns } from "./column";

import {
  ProductFields,
  useDeleteProductMutation,
  useGetProductsQuery,
} from "@/services/product";
import { addSearchParams } from "@/utils/url";
import { Product } from "@prisma/client";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const Products = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") as string) || DEFAULT_PAGE;
  const limit = parseInt(searchParams.get("limit") as string) || DEFAULT_LIMIT;
  const searchName = searchParams.get("name") || "";

  const [deleteProduct, { isLoading }] = useDeleteProductMutation();

  // need to init this on the page level to easily handle form when edit and save
  const [form] = Form.useForm<ProductFields>();

  const { data, isFetching, refetch } = useGetProductsQuery({
    page,
    limit,
    filter: {
      name: searchName,
    },
  });

  const dataSource = useMemo(() => data?.data.products || [], [data]);
  const totalDataCount = useMemo(() => data?.data.totalCount || 0, [data]);

  useEffect(() => {
    // Fetch todos when the page, limit or filter changes
    refetch();
  }, [page, limit, searchName, refetch]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    router.push(
      pathname +
        addSearchParams([
          { name: "page", value: pagination.current?.toString() },
          { name: "limit", value: pagination.pageSize?.toString() },
          { name: "name", value: searchName },
        ])
    );
  };

  const handleShowModal = () => {
    setIsFormVisible(true);

    form.resetFields();
  };

  const handleCloseModal = () => {
    setIsFormVisible(false);
  };

  const handleEditProduct = (product: Product) => {
    form.setFieldsValue({
      id: product.id,
      name: product.name,
      description: product.description,
      qty: product.qty,
      price: product.price,
      categoryId: product.categoryId,
      image: product.image,
    });

    setIsFormVisible(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    await deleteProduct(product.id).unwrap();

    refetch();
  };

  const actionColumns: ColumnsType<Product> = [
    {
      title: "Action",
      render: (value: Product) => (
        <div className="flex justify-center items-center gap-2">
          <Button
            type="dashed"
            icon={<EditOutlined />}
            onClick={() => handleEditProduct(value)}
          />
          <Popconfirm
            title="Delete the Product"
            description="Are you sure to delete this product?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteProduct(value)}
            okButtonProps={{ loading: isLoading }}
          >
            <Button type="dashed" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Button
          type="primary"
          onClick={handleShowModal}
          size="large"
          icon={<PlusOutlined />}
        >
          Create Product
        </Button>
        <div>
          <Input.Search
            defaultValue={searchName}
            size="large"
            placeholder="Search Product..."
            onSearch={(value) =>
              router.push(
                pathname +
                  `?page=${DEFAULT_PAGE}&limit=${DEFAULT_LIMIT}&name=${value}`
              )
            }
          />
        </div>
      </div>
      <Table
        columns={[...columns, ...actionColumns]}
        rowKey={(record) => record.id}
        dataSource={dataSource}
        pagination={{
          current: page,
          pageSize: limit,
          total: totalDataCount,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          showTotal: (total, [num1, num2]) => {
            return `Showing: ${num1} to ${num2} from ${total} rows`;
          },
        }}
        loading={isFetching}
        onChange={handleTableChange}
      />
      <ProductForm
        form={form}
        isFormVisible={isFormVisible}
        handleCloseModal={handleCloseModal}
        refetch={refetch}
      />
    </div>
  );
};

export default Products;
