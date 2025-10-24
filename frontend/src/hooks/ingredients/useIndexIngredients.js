import { useEffect, useState } from "react";
import { indexIngredients } from "../../data/ingredients";

function useIndexIngredients() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      const data = await indexIngredients();
      setIngredients(data);
    } catch (error) {
      setError(error.response?.data?.message || "Error loading ingredients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  return { ingredients, loading, error, refetch: fetchIngredients };
}

export default useIndexIngredients;
