import { Container } from "react-bootstrap";

function MyFooter({ role }) {
    if (role !== "CUSTOMER") return null; // visibile solo ai clienti

    return (
        <footer className="bg-light border-top py-3 mt-auto">
            <Container className="text-center">
                <small className="text-muted">
                    © {new Date().getFullYear()} BakeApp — All rights reserved.
                </small>
            </Container>
        </footer>
    );
}

export default MyFooter;
