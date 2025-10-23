import { Modal, Button } from "react-bootstrap";

function ConfirmModal({ isOpen, closeModal, onConfirm, title = "Confirm Deletion", message = "Are you sure you want to proceed? This action is irreversible." }) {
    return (
        <Modal show={isOpen} onHide={closeModal} centered>
            <Modal.Header closeButton className="bg-danger text-white">
                <Modal.Title>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-danger text-white">
                {message}
            </Modal.Body>
            <Modal.Footer className="bg-danger">
                <Button variant="light" onClick={closeModal}>
                    Cancel
                </Button>
                <Button variant="dark" onClick={() => { onConfirm(); closeModal(); }}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmModal;