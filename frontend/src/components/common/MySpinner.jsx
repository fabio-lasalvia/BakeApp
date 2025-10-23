import { Spinner, Container } from "react-bootstrap";

function MySpinner({ message = "Loading...", variant = "primary", size = "md" }) {
    return (
        <Container
            fluid
            className="d-flex flex-column justify-content-center align-items-center py-5"
            style={{ minHeight: "50vh" }}
        >
            <Spinner animation="border" role="status" variant={variant} size={size}>
                <span className="visually-hidden">{message}</span>
            </Spinner>
            <p className="mt-3 text-muted">{message}</p>
        </Container>
    );
}

export default MySpinner;
