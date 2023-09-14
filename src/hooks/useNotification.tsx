import { useContext } from "react";

import { notificationContext } from "@/context/notificationContext";

const useNotification = () => {
  const { openNotification } = useContext(notificationContext);

  return { openNotification };
};

export default useNotification;
