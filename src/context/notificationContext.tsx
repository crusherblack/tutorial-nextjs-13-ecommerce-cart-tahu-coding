"use client";

import { notification } from "antd";
import React, { createContext } from "react";

export const notificationContext = createContext<{
  openNotification: ({}: openNotificationParams) => void;
}>({
  openNotification: ({}) => {},
});

type NotificationType = "success" | "info" | "warning" | "error";

type openNotificationParams = {
  type: NotificationType;
  options: {
    message: string;
    description?: string;
  };
};

const NotificationContext = ({ children }: { children: React.ReactNode }) => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = ({
    type = "success",
    options,
  }: openNotificationParams) => {
    api[type]({
      message: options.message,
      description: options.description,
    });
  };

  return (
    <notificationContext.Provider
      value={{
        openNotification,
      }}
    >
      {children}
      {contextHolder}
    </notificationContext.Provider>
  );
};

export default NotificationContext;
