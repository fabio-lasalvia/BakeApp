import { useState, useEffect } from "react";
import { showUser } from "../../data/users";

export default function useShowUser(id) {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);


useEffect(() => {
if (!id) return;
const fetchUser = async () => {
try {
const data = await showUser(id);
setUser(data);
} catch (error) {
console.error("Error fetching user:", error);
setError(error);
} finally {
setLoading(false);
}
};
fetchUser();
}, [id]);


return { user, loading, error };
}
