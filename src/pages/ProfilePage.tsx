import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

const ProfilePage = () => {
  const { token, logout } = useAuth();
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5091/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [token]);

  return (
    <div>
      <h2>Profile</h2>
      {user ? (
        <div>
          <p>Email: {user.email}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfilePage;
