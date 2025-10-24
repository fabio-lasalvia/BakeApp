import { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  PeopleFill,
  BoxFill,
  FolderFill,
  BagFill,
  Receipt,
  ClipboardDataFill,
  Person,
  Gear,
} from "react-bootstrap-icons";

export default function Home() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Recupera nome utente dal localStorage o dal JWT
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    } else if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded?.name || "User");
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const cards = [
    {
      title: "Users",
      text: "Manage your team, employees, and customers.",
      icon: <PeopleFill size={32} />,
      link: "/users",
    },    
    {
      title: "Catalogs",
      text: "Configure catalogs and seasonal offerings.",
      icon: <FolderFill size={32} />,
      link: "/catalogs",
    },
    {
      title: "Products",
      text: "View and organize your pastry products.",
      icon: <BoxFill size={32} />,
      link: "/products",
    },
    {
      title: "Ingredients",
      text: "View supplier's products.",
      icon: <BoxFill size={32} />,
      link: "/ingredients",
    },
    {
      title: "Customer Orders",
      text: "Track orders from customers.",
      icon: <BagFill size={32} />,
      link: "/customer-orders",
    },
    {
      title: "Purchase Orders",
      text: "Manage supplier purchases and inventory.",
      icon: <ClipboardDataFill size={32} />,
      link: "/purchase-orders",
    },
    {
      title: "Invoices",
      text: "Generate and check all issued invoices.",
      icon: <Receipt size={32} />,
      link: "/invoices",
    },
    {
      title: "Settings",
      text: "Generate and check all issued invoices.",
      icon: <Gear size={32} />,
      link: "/settings",
    },
    {
      title: "Profile",
      text: "Generate and check all issued invoices.",
      icon: <Person size={32} />,
      link: "/me",
    },
  ];

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="fw-bold text-primary">Welcome, {userName || "User"}</h2>
        <p className="text-muted">Here's an overview of your BakeApp dashboard</p>
      </div>

      <Row xs={1} sm={2} md={3} lg={3} className="g-4">
        {cards.map((card, index) => (
          <Col key={index}>
            <Card
              as={Link}
              to={card.link}
              className="h-100 text-decoration-none shadow-sm border-0 dashboard-card"
            >
              <Card.Body className="d-flex flex-column justify-content-between p-4">
                <div className="d-flex align-items-center mb-3 text-primary">
                  {card.icon}
                  <Card.Title className="ms-3 mb-0 fw-semibold fs-5 text-dark">
                    {card.title}
                  </Card.Title>
                </div>
                <Card.Text className="text-muted small mb-0">{card.text}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
