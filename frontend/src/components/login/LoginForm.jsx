import { useState, useEffect } from "react";
import { Form, Button, Alert, Image, Card, Container, Spinner } from "react-bootstrap";
import axios from "../../data/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import RegisterModal from "./RegisterModal";
import { jwtDecode } from "jwt-decode";

function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const jwt = searchParams.get("jwt");
    if (jwt) {
      try {
        const decoded = jwtDecode(jwt);
        const name = decoded?.name || "User";
        login(jwt, name);
        localStorage.setItem("userName", name);
        navigate("/home");
      } catch (err) {
        console.error("Error decoding JWT from Google login:", err);
      }
    }
  }, [searchParams, login, navigate]);

  ///// LOGIN LOCALE /////
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("/auth/login", { email, password });
      const token = response.data.token;
      const name = response.data.user?.name || "User";
      login(token, name);
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  ///// LOGIN GOOGLE /////
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/login-google`;
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
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
                disabled={loading}
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
                disabled={loading} 
              />
            </Form.Group>

            {/* LOGIN BUTTON */}
            <Button
              variant="primary"
              type="submit"
              className="w-100 mb-3 d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span> Logging in...</span>
                </>
              ) : (
                "Login"
              )}
            </Button>

            {/* GOOGLE LOGIN */}
            <Button
              variant="outline-secondary"
              className="w-100 d-flex align-items-center justify-content-center gap-2 mb-2"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <Image
                src="/img/logo/logoGoogleLogin.webp"
                alt="Google Logo"
                style={{ maxWidth: 24 }}
              />
              Login with Google
            </Button>

            <div className="text-center mt-3">
              <small>Don't have an account?</small>
              <br />
              <Button
                variant="link"
                className="p-0 text-decoration-none"
                onClick={() => setShowRegisterModal(true)}
                disabled={loading}
              >
                Register now
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Register Modal */}
      <RegisterModal
        show={showRegisterModal}
        onHide={() => setShowRegisterModal(false)}
      />
    </Container>
  );
}

export default LoginForm;
