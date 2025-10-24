import { useState } from "react";
import { updateIngredient } from "../../data/ingredients";

function useUpdateIngredient() {
  const [loading, setLoading] = useState(false);

  const update = async (id, formData) => {
    setLoading(true);
    try {
      const data = await updateIngredient(id, formData);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading };
}

export default useUpdateIngredient;
