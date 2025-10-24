import { useState } from "react";
import { updateCustomerOrder } from "../../data/customerOrders";

export default function useUpdateCustomerOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function update(id, data) {
    try {
      setLoading(true);
      const response = await updateCustomerOrder(id, data);
      return response;
    } catch (error) {
      console.error("Error updating order:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return { update, loading, error };
}
