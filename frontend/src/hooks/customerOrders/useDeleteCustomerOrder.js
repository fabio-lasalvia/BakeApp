import { useState } from "react";
import { deleteCustomerOrder } from "../../data/customerOrders";

export default function useDeleteCustomerOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function remove(id) {
    try {
      setLoading(true);
      const response = await deleteCustomerOrder(id);
      return response;
    } catch (error) {
      console.error("Error deleting order:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return { remove, loading, error };
}
