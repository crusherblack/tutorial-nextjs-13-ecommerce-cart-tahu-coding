"use client";

import { Button, Form, Table, Input } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { TablePaginationConfig } from "antd/es/table";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import ProductForm from "./form";
import { columns } from "./column";

import { useGetProductsQuery } from "@/services/product";
import { addSearchParams } from "@/utils/url";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 5;

const Products = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") as string) || DEFAULT_PAGE;
  const limit = parseInt(searchParams.get("limit") as string) || DEFAULT_LIMIT;
  const searchName = searchParams.get("name") || "";

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

  // need to init this on the page level to easily handle form when edit and save
  const [form] = Form.useForm();

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
  };

  const handleCloseModal = () => {
    setIsFormVisible(false);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Button type="primary" onClick={handleShowModal} size="large">
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
        columns={columns}
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
      />
    </div>
  );
};

export default Products;
