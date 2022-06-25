import { message } from "antd";

export const SuccessMessage = (msg) => {
  message.success({
    content: msg,
    className: 'custom-class',
    style: {
      position: 'absolute',
      top: '15vh',
      right: '0px'
    },
  });
};
export const ErrorMessage = (msg) => {
  message.error({
    content: msg,
    className: 'custom-class',
    style: {
      position: 'absolute',
      top: '15vh',
      right: '0px'
    },
  });
};