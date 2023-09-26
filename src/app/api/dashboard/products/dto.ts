import { zfd } from "zod-form-data";
import { z } from "zod";

//data transfer object with validation using form data
export const CreateProductDto = zfd.formData({
  name: zfd.text(
    z
      .string({
        required_error: "Name is required",
      })
      .trim()
      .min(1, "Name cannot be empty")
  ),
  description: zfd.text(
    z
      .string({
        required_error: "Description is required",
      })
      .trim()
      .min(1, "Email cannot be empty")
  ),
  price: zfd.numeric(
    z.number({
      required_error: "Price is required",
    })
  ),
  qty: zfd.numeric(
    z.number({
      required_error: "Qty is required",
    })
  ),
  categoryId: zfd.text(
    z
      .string({
        required_error: "Category ID is required",
      })
      .trim()
      .min(1, "Name cannot be empty")
  ),
});

//data transfer object with validation using form data
export const UpdateProductDto = zfd.formData({
  name: zfd.text(
    z
      .string({
        required_error: "Name is required",
      })
      .trim()
      .min(1, "Name cannot be empty")
  ),
  description: zfd.text(
    z
      .string({
        required_error: "Description is required",
      })
      .trim()
      .min(1, "Email cannot be empty")
  ),
  price: zfd.numeric(
    z.number({
      required_error: "Price is required",
    })
  ),
  qty: zfd.numeric(
    z.number({
      required_error: "Qty is required",
    })
  ),
  categoryId: zfd.text(
    z
      .string({
        required_error: "Category ID is required",
      })
      .trim()
      .min(1, "Name cannot be empty")
  ),
});
