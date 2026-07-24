import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { currentUser } = useAuth();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Профиль</h1>
      <p>Роль: {currentUser?.role ?? "Неизвестно"}</p>
    </div>
  );
};

export default ProfilePage;
