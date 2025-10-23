import { useState, useEffect } from "react";
import { Form, Button, Alert, Image, Card, Container } from "react-bootstrap";
import axios from "../../data/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";

function LoginForm() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const jwt = searchParams.get("jwt");
        if (jwt) {
            login(jwt);
            navigate("/home");
        }
    }, [searchParams, login, navigate]);

    ///// LOGIN LOCALE /////
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        try {
            const response = await axios.post("/auth/login", { email, password });
            login(response.data.jwt);
            navigate("/home");
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            setError(error.response?.data?.message || "Invalid email or password");
        }
    };

    ///// LOGIN GOOGLE /////
    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/login-google`;
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Card className="shadow p-4" style={{ maxWidth: "400px" }}>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <div className="text-center mb-4">
                        <Image
                            src="/img/logo/logoBakeApp.png"
                            className="w-75 mb-3 rounded"
                            alt="BakeApp Logo"
                        />
                        <h3 className="fw-bold text-primary">Welcome to BakeApp</h3>
                    </div>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 mb-3">
                            Login
                        </Button>

                        <Button
                            variant="outline-secondary"
                            className="w-100 d-flex align-items-center justify-content-center gap-2"
                            onClick={handleGoogleLogin}
                        >
                            <Image
                                src="/img/logo/logoGoogleLogin.webp"
                                alt="Google Logo"
                                style={{ maxWidth: 24 }}
                            />
                            Login with Google
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default LoginForm;
