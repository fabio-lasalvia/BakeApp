import { useState } from "react";
import { updateUserRole } from "../../data/users";

export default function useUpdateUserRole() {
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);


const updateRole = async (id, role) => {
try {
setLoading(true);
const data = await updateUserRole(id, role);
return data;
} catch (error) {
console.error("Error updating user role:", error);
setError(error);
throw error;
} finally {
setLoading(false);
}
};


return { updateRole, loading, error };
}
