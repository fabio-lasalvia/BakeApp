import { useState } from "react";
import { createIngredient } from "../../data/ingredients";

function useCreateIngredient() {
  const [loading, setLoading] = useState(false);

  const create = async (formData) => {
    setLoading(true);
    try {
      const data = await createIngredient(formData);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading };
}

export default useCreateIngredient;
