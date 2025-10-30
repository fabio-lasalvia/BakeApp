import { Toast, ToastContainer } from "react-bootstrap";
import { useEffect } from "react";

function SuccessToast({ show, message = "Operation completed successfully.", onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <ToastContainer position="bottom-end" className="p-3">
      <Toast bg="success" onClose={onClose} show={show}>
        <Toast.Header closeButton={false} className="text-white bg-success">
          <i className="bi bi-check-circle-fill me-2"></i>
          <strong className="me-auto text-white">Success</strong>
        </Toast.Header>
        <Toast.Body className="text-white fw-semibold">{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default SuccessToast;
