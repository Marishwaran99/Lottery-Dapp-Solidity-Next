import { useContext } from "react";
import ReactDOM from "react-dom";
import { AppContext } from "../context/AppContext";

const isBrowser = () => typeof window !== "undefined";
const toastRoot = isBrowser() ? document.getElementById("portal") : null;
const Toast = () => {
  const { toast, setToast } = useContext(AppContext);
  const ToastComp = () => {
    return (
      <div
        onClick={() => setToast({ title: "", description: "" })}
        className={`toast ${toast.description ? "active" : ""}`}
      >
        <div className={`toast-content ${toast.title}`}>
          {/* <p className="toast-title">{toast.title}</p> */}
          <div className="toast-description">{toast.description}</div>
          <button
            className="dismiss-btn"
            onClick={() => setToast({ title: "", description: "" })}
          >
            &times;
          </button>
        </div>
      </div>
    );
  };
  return toastRoot ? (
    ReactDOM.createPortal(<ToastComp />, toastRoot)
  ) : (
    <ToastComp />
  );
};

export default Toast;
