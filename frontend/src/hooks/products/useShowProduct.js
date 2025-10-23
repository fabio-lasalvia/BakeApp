import { useState, useEffect } from "react";
import { showProduct } from "../../data/products";

export default function useShowProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchProduct() {
    if (!id) return;
    try {
      setLoading(true);
      const data = await showProduct(id);
      setProduct(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProduct();
  }, [id]);

  return { product, loading, error, refetch: fetchProduct };
}
