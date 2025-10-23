import { useState } from "react";
import { createProduct } from "../../data/products";

export default function useCreateProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function create(data) {
    try {
      setLoading(true);
      const result = await createProduct(data);
      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return { create, loading, error };
}
