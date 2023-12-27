import codeMessage from "./codeMessage";

interface IResponse {
  status: keyof typeof codeMessage;
  data: {
    message: string;
    success: boolean;
  };
}

const successHandler = (
  response: IResponse,
  options = { notifyOnSuccess: false, notifyOnFailed: true }
) => {
  const { data } = response;
  if (data && data.success === true) {
    const message = response.data && data.message;
    const successText = message || codeMessage[response.status];

    if (options.notifyOnSuccess) {
      // notification.config({
      //   duration: 5,
      // });
      // notification.success({
      //   message: `Request success`,
      //   description: successText,
      // });
    }
  } else {
    const message = response.data && data.message;
    const errorText = message || codeMessage[response.status];
    const { status } = response;
    if (options.notifyOnFailed) {
      // notification.config({
      //   duration: 5,
      // });
      // notification.error({
      //   message: `Request error ${status}`,
      //   description: errorText,
      // });
    }
  }
};

export default successHandler;
