import { useState } from "react";
import { createCustomerOrder } from "../../data/customerOrders";

export default function useCreateCustomerOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function create(data) {
    try {
      setLoading(true);
      const response = await createCustomerOrder(data);
      return response;
    } catch (error) {
      console.error("Error creating order:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return { create, loading, error };
}
