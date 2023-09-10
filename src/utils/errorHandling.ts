import axios from "axios";

type AxiosErrorResponse = {
  //make sure to sync it with your BE if you want to use this in the future
  message: string;
};

export const axiosErrorHandler = (error: unknown): string => {
  //check if error is part of axios error
  if (axios.isAxiosError(error) && error.response) {
    return (error.response?.data as AxiosErrorResponse).message;
  }

  return "::CODE/RUNTIME ERROR =>" + error;
};
