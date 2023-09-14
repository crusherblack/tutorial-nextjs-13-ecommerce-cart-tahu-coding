import { fallBackImage } from "@/constant";
import convertToRupiah from "@/utils/rupiah";
import { Product } from "@prisma/client";
import { Image } from "antd";
import { ColumnsType } from "antd/es/table";

export const columns: ColumnsType<Product> = [
  {
    title: "Product Name",
    render: (value) => value.name,
  },
  {
    title: "Description",
    render: (value) => value.description,
    width: "30%",
  },
  {
    title: "Category",
    render: (value) => value.category.name,
  },
  {
    title: "Price",
    render: (value) => convertToRupiah(value.price),
  },
  {
    title: "Image",
    width: "20%",
    render: (value) => (
      <Image
        width={120}
        height={80}
        src={value.image}
        style={{
          objectFit: "cover",
          borderRadius: 5,
        }}
        fallback={fallBackImage}
      />
    ),
  },
];
