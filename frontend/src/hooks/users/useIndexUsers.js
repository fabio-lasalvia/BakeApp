import { useState, useEffect } from "react";
import { indexUsers } from "../../data/users";

export default function useIndexUsers() {
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);


const fetchUsers = async () => {
try {
setLoading(true);
const data = await indexUsers();
setUsers(data);
} catch (error) {
console.error("Error fetching users:", error);
setError(error);
} finally {
setLoading(false);
}
};


useEffect(() => {
fetchUsers();
}, []);


return { users, loading, error, refetch: fetchUsers };
}
