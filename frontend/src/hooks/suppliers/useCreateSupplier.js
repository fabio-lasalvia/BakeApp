import { useState } from "react";
import { createSupplier } from "../../data/suppliers";

function useCreateSupplier() {
  const [loading, setLoading] = useState(false);

  const create = async (data) => {
    setLoading(true);
    try {
      return await createSupplier(data);
    } finally {
      setLoading(false);
    }
  };

  return { create, loading };
}

export default useCreateSupplier;
