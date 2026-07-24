import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import styles from "./UsersPage.module.css";
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaUserShield,
  FaSearch,
} from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";

interface User {
  id: string;
  email: string;
  role: string;
}

interface ApiResponse {
  $values?: User[];
}

const UsersPage: React.FC = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!loading && isAdmin) {
      fetchUsers();
    }
  }, [loading, isAdmin]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get<ApiResponse>("/admin/users");
      const data = response.data;
      const list: User[] = Array.isArray(data.$values)
        ? data.$values
        : Array.isArray(data)
        ? data
        : [];
      setUsers(list);
      setError(null);
    } catch (err) {
      setError("Ошибка загрузки пользователей");
      console.error(err);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredUsers = users.filter((user) => {
    if (!normalizedQuery) return true;

    const email = (user.email ?? "").toLowerCase();
    const role = (user.role ?? "").toLowerCase();

    return (
      email.includes(normalizedQuery) || role.includes(normalizedQuery)
    );
  });

  if (loading || isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <BiLoaderAlt className={styles.loadingSpinner} />
        <p>Загрузка...</p>
      </div>
    );
  }

  if (!isAdmin) {
    navigate("/");
    return null;
  }

  return (
    <div className={styles.usersContainer}>
      <div className={styles.header}>
        <button className={styles.navButton} onClick={() => navigate("/admin")}>
          <FaArrowLeft /> Вернуться в админку
        </button>
        <h1>Управление пользователями</h1>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.searchContainer}>
        <div className={styles.searchWrapper}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Поиск по email или роли..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.usersList}>
        {filteredUsers.length === 0 ? (
          <div className={styles.noResults}>
            {searchQuery
              ? "Пользователи не найдены"
              : "Нет доступных пользователей"}
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className={styles.userCard}>
              <div className={styles.userInfo}>
                <div className={styles.userIcon}>
                  <FaUser />
                </div>
                <div className={styles.userDetails}>
                  <div className={styles.userEmail}>
                    <FaEnvelope className={styles.icon} />
                    {user.email}
                  </div>
                  <div className={styles.userRole}>
                    <FaUserShield className={styles.icon} />
                    {user.role}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UsersPage;
