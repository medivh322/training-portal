import { notification } from "antd";
import codeMessage from "./codeMessage";
import { customQueryErrorValue } from "../types/models";

const errorHandler = (errorRes: customQueryErrorValue) => {
  const { data } = errorRes;
  if (data && errorRes.status) {
    const errorText =
      data.message ||
      (typeof errorRes.status === "number" && codeMessage[errorRes.status]);
    const { status } = errorRes;
    notification.config({
      duration: 5,
    });
    notification.error({
      message: `Ошибка ${status}`,
      description: errorText,
    });
    return errorRes.data;
  } else {
    notification.config({
      duration: 5,
    });
    notification.error({
      message: "No internet connection",
      description: "Cannot connect to the server, Check your internet network",
    });
    return {
      success: false,
      message: "Cannot connect to the server, Check your internet network",
    };
  }
};

export default errorHandler;
