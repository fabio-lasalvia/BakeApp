import { useEffect } from "react";
import { Modal } from "react-bootstrap";

function SuccessModal({ isOpen, closeModal }) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(closeModal, 2000); // 2s
      return () => clearTimeout(timer);
    }
  }, [isOpen, closeModal]);

  return (
    <Modal show={isOpen} onHide={closeModal} centered>
      <Modal.Header closeButton className="bg-success text-white">
        <Modal.Title>
          <i className="bi bi-check-circle-fill me-2"></i>
          Operation Success
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-success text-white">
        The operation was completed successfully.
      </Modal.Body>
    </Modal>
  );
}

export default SuccessModal;
