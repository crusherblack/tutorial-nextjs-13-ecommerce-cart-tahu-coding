"use client";

import { useState } from "react";

import { Alert, Button, Form, Input } from "antd";
import NextLink from "next/link";
import axios from "axios";

import { axiosErrorHandler } from "@/utils/errorHandling";

type FieldType = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form] = Form.useForm();

  const onFinish = async (values: FieldType) => {
    try {
      setError("");
      setIsRegisterSuccess(false);
      setLoading(true);

      // do register to BE
      await axios.post("/api/auth/register", values);

      // if success show success alert & reset form
      setIsRegisterSuccess(true);
      form.resetFields();
    } catch (error) {
      //handle error based on axios instance or not
      setError(axiosErrorHandler(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
      layout="vertical"
      form={form}
    >
      {error && (
        <Form.Item>
          <Alert message={error} type="error" showIcon />
        </Form.Item>
      )}
      {isRegisterSuccess && (
        <Form.Item>
          <Alert
            message="Register Success Please Login!"
            type="success"
            showIcon
          />
        </Form.Item>
      )}
      <p className="text-2xl font-bold">Welcome</p>
      <p className="text-md mb-10 text-gray-500">
        First, let's create your account
      </p>
      <Form.Item<FieldType>
        label="Fullname"
        name="name"
        rules={[
          {
            required: true,
            message: "Please input your Fullname!",
          },
        ]}
      >
        <Input placeholder="Input your Fullname" size="large" />
      </Form.Item>

      <Form.Item<FieldType>
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your Email!",
            type: "email",
          },
        ]}
      >
        <Input placeholder="Input your email" size="large" />
      </Form.Item>

      <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            min: 8,
            max: 50,
            message: "Please input your Password!",
          },
        ]}
      >
        <Input.Password placeholder="Input your password" size="large" />
      </Form.Item>

      <Form.Item<FieldType>
        label="Password Confirmation"
        name="passwordConfirmation"
        rules={[
          {
            required: true,
            min: 8,
            max: 50,
            message: "Please confirm your Password!",
          },
          ({ getFieldValue }) => ({
            // add logic to make sure passwordConfirmation and password match each time user register
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("The new password that you entered do not match!")
              );
            },
          }),
        ]}
      >
        <Input.Password placeholder="Input your password" size="large" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="w-full mt-4"
          size="large"
        >
          Register
        </Button>
      </Form.Item>

      <p className="text-md">
        Already have account?{" "}
        <NextLink href="/login">
          <span className="text-blue-600 hover:cursor-pointer">Login Now!</span>
        </NextLink>
      </p>
    </Form>
  );
};

export default RegisterForm;
