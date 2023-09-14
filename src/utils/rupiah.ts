const convertToRupiah = (num: number) => {
  return num
    ? new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(num)
    : "-";
};

export default convertToRupiah;
