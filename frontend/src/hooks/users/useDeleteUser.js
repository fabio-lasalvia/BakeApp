import { useState } from "react";
import { deleteUser } from "../../data/users";

export default function useDeleteUser() {
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);


const remove = async (id) => {
try {
setLoading(true);
const data = await deleteUser(id);
return data;
} catch (error) {
console.error("Error deleting user:", error);
setError(error);
throw error;
} finally {
setLoading(false);
}
};


return { remove, loading, error };
}
