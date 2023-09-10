"use client";

import { useState } from "react";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Alert, Button, Form, Input } from "antd";
import NextLink from "next/link";

type FieldType = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const onFinish = async (values: FieldType) => {
    try {
      setLoading(true);

      //do login to next auth based on email and password
      const res = await signIn("credentials", {
        redirect: false,
        username: values.email,
        password: values.password,
        callbackUrl,
      });

      //if there is no error, redirect to dashboard or previous page
      if (!res?.error) {
        router.push(callbackUrl);
      } else {
        throw Error(res?.error);
      }
    } catch (error: any) {
      if (error) setError(error?.message);
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
    >
      {error && (
        <Form.Item>
          <Alert message={error} type="error" showIcon />
        </Form.Item>
      )}
      <p className="text-2xl font-bold">Hello, Welcome Back</p>
      <p className="text-md mb-10 text-gray-500">
        Happy to see you again, login here
      </p>
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

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="w-full mt-4"
          size="large"
        >
          Login
        </Button>
      </Form.Item>

      <p className="text-md">
        Don't have account?{" "}
        <NextLink href="/register">
          <span className="text-blue-600 hover:cursor-pointer">
            Register Now!
          </span>
        </NextLink>
      </p>
    </Form>
  );
};

export default LoginForm;
