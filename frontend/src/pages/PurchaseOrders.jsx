import { Button } from "react-bootstrap";
import PurchaseOrdersTable from "../components/purchaseOrders/PurchaseOrdersTable";
import { ArrowLeft } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

function PurchaseOrders() {

  const navigate = useNavigate()

  return (
    <div className="container-fluid p-4">
      <Button
        variant="outline-primary"
        className="d-flex align-items-center gap-2 mb-3"
        onClick={() => navigate("/home")}
      >
        <ArrowLeft size={20} />
        Back
      </Button>
      <PurchaseOrdersTable />
    </div>
  );
}

export default PurchaseOrders;
