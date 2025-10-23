import { Container, Row, Col } from "react-bootstrap";
import LoginForm from "../components/login/LoginForm";

function Login() {
    return (
        <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Row className="w-100 justify-content-center">
                <Col xs={12} sm={10} md={6} lg={4}>
                    <LoginForm />
                </Col>
            </Row>
        </Container>
    );
}

export default Login;