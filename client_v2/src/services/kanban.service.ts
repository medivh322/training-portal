import axios from "axios";
import { API_BASE_URL } from "../config/serverApiConfig";
import successHandler from "../request/successHandler";
import errorHandler from "../request/errorHundler";

export const fetchUploadFile = async (
  taskId: string | undefined,
  file: any
) => {
  try {
    const { data, status } = await axios.post(
      `${API_BASE_URL}upload/${taskId}`,
      {
        file,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    successHandler(
      { data, status },
      {
        notifyOnSuccess: false,
        notifyOnFailed: true,
      }
    );
    return data;
  } catch (error: any) {
    return errorHandler(error);
  }
};
