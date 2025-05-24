import { Bounce, toast } from "react-toastify";

const toastConfig = {
  theme: "light",
  autoClose: 5000,
  draggable: true,
  transition: Bounce,
  pauseOnHover: true,
  closeOnClick: true,
  progress: undefined,
  position: "top-center",
  hideProgressBar: false,
};

const notify = {
  info: (message) => toast.info(message, toastConfig),
  error: (message) => toast.error(message, toastConfig),
  success: (message) => toast.success(message, toastConfig),
  warning: (message) => toast.warning(message, toastConfig),
};

export default notify;
