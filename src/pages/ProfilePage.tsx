import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaHeart,
  FaPlus,
  FaSignOutAlt,
  FaSpinner,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import axiosInstance from "../api/axiosInstance";
import { fetchOrders } from "../api/orders";
import {
  createAddress,
  deleteAddress,
  fetchFavoriteIds,
  fetchProfile,
  ProfileAddress,
  removeFavorite,
  uploadProfilePhoto,
  updateAddress,
  updateProfile as updateProfileRequest,
} from "../api/profile";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";
import { Order } from "../types/order";
import { getProductName } from "../i18n/categories";
import styles from "./ProfilePage.module.css";

interface AccountProduct {
  id: number;
  name: string;
  description: string;
  nameEn?: string | null;
  nameAz?: string | null;
  descriptionEn?: string | null;
  descriptionAz?: string | null;
  price: number;
  imageUrl: string;
}

interface AddressEntry extends Omit<ProfileAddress, "id"> {
  id: number | null;
  originalFullAddress: string | null;
}

interface ProfileFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  photoUrl: string;
  addresses: AddressEntry[];
}

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<ProfileFormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    photoUrl: "",
    addresses: [],
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<AccountProduct[]>(
    [],
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [favoritesError, setFavoritesError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState(false);

  useEffect(() => {
    let active = true;
    fetchProfile()
      .then((result) => {
        if (!active) return;
        setProfile({
          fullName: result.fullName ?? "",
          email: result.email ?? "",
          phoneNumber: result.phoneNumber ?? "",
          photoUrl: result.photoUrl ?? "",
          addresses: (result.addresses ?? []).map((address) => ({
            ...address,
            originalFullAddress: address.fullAddress,
          })),
        });
      })
      .catch(() => {
        if (active) setProfileError(true);
      })
      .finally(() => {
        if (active) setProfileLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    fetchOrders()
      .then((result) => {
        if (active) setOrders(result);
      })
      .catch(() => {
        if (active) setOrdersError(true);
      })
      .finally(() => {
        if (active) setOrdersLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([fetchFavoriteIds(), axiosInstance.get("/products")])
      .then(([ids, response]) => {
        const data = response.data as
          | AccountProduct[]
          | { $values?: AccountProduct[] };
        const products = Array.isArray(data)
          ? data
          : Array.isArray(data.$values)
            ? data.$values
            : [];
        if (active) {
          setFavoriteIds(ids);
          setFavoriteProducts(
            products.filter((product) => ids.includes(product.id)),
          );
          setFavoritesError(false);
        }
      })
      .catch(() => {
        if (active) setFavoritesError(true);
      })
      .finally(() => {
        if (active) setFavoritesLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const updateProfileField = <K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K],
  ) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setSaved(false);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setSaveError(false);
    setSaved(false);
    try {
      await updateProfileRequest({
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber,
        photoUrl: profile.photoUrl,
      });

      const savedAddresses = await Promise.all(
        profile.addresses.map(async (address): Promise<AddressEntry | null> => {
          const fullAddress = address.fullAddress.trim();
          if (!fullAddress) {
            if (address.id !== null) await deleteAddress(address.id);
            return null;
          }

          const data = { fullAddress, isDefault: address.isDefault };
          if (address.id === null) {
            const created = await createAddress(data);
            return { ...created, originalFullAddress: created.fullAddress };
          }

          if (fullAddress !== address.originalFullAddress) {
            await updateAddress(address.id, data);
          }
          return { ...address, fullAddress, originalFullAddress: fullAddress };
        }),
      );

      setProfile((current) => ({
        ...current,
        addresses: savedAddresses.filter(
          (address): address is AddressEntry => address !== null,
        ),
      }));
      setSaved(true);
    } catch {
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const handleRemoveAddress = async (index: number) => {
    const address = profile.addresses[index];
    if (!address) return;

    setSaveError(false);
    if (address.id !== null) {
      setSaving(true);
      try {
        await deleteAddress(address.id);
      } catch {
        setSaveError(true);
        setSaving(false);
        return;
      }
      setSaving(false);
    }

    updateProfileField(
      "addresses",
      profile.addresses.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const handleRemoveFavorite = async (productId: number) => {
    try {
      await removeFavorite(productId);
      setFavoriteIds((current) => current.filter((id) => id !== productId));
      setFavoriteProducts((current) =>
        current.filter((product) => product.id !== productId),
      );
      setFavoritesError(false);
    } catch {
      setFavoritesError(true);
    }
  };

  const handlePhotoSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadingPhoto(true);
    setPhotoUploadError(false);
    try {
      const photoUrl = await uploadProfilePhoto(file);
      setProfile((current) => ({ ...current, photoUrl }));
    } catch {
      setPhotoUploadError(true);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat(i18n.language, {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium" }).format(
      new Date(date),
    );

  const getOrderStatus = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized === "pending") return t("orders.statusPending");
    if (normalized === "cancelled" || normalized === "canceled") {
      return t("orders.statusCancelled");
    }
    return status;
  };

  const avatarInitial =
    profile.fullName.trim().charAt(0) || profile.email.charAt(0);
  const visibleFavoriteProducts = favoriteProducts.filter((product) =>
    favoriteIds.includes(product.id),
  );

  return (
    <main className={styles.page}>
      <div className={styles.pageHeading}>
        <div>
          <p className={styles.eyebrow}>{t("account.title")}</p>
          <h1>{profile.fullName || profile.email || t("account.title")}</h1>
        </div>
        <button
          type="button"
          className={styles.logoutButton}
          onClick={() => void handleLogout()}
        >
          <FaSignOutAlt aria-hidden="true" />
          {t("account.logout")}
        </button>
      </div>

      <div className={styles.accountLayout}>
        <section
          className={styles.panel}
          aria-labelledby="account-profile-title"
        >
          <div className={styles.profileIntro}>
            <div
              className={styles.avatar}
              aria-label={t("account.profilePhoto")}
            >
              {profile.photoUrl && (
                <img
                  key={profile.photoUrl}
                  src={
                    profile.photoUrl.startsWith("http")
                      ? profile.photoUrl
                      : `${API_BASE_URL}${profile.photoUrl}`
                  }
                  alt={t("account.profilePhoto")}
                  onError={(event) => {
                    event.currentTarget.hidden = true;
                  }}
                />
              )}
              <span>{avatarInitial.toUpperCase()}</span>
            </div>
            <div>
              <h2 id="account-profile-title">{t("account.personalDetails")}</h2>
              <p>
                {t("account.role")}: {currentUser?.role ?? t("profile.unknown")}
              </p>
            </div>
          </div>

          {profileLoading ? (
            <p className={styles.muted}>{t("common.loading")}</p>
          ) : profileError ? (
            <p className={styles.errorMessage} role="alert">
              {t("common.error")}
            </p>
          ) : (
            <form className={styles.profileForm} onSubmit={handleSave}>
              <label className={styles.field}>
                <span>{t("account.name")}</span>
                <input
                  type="text"
                  autoComplete="name"
                  value={profile.fullName}
                  onChange={(event) =>
                    updateProfileField("fullName", event.target.value)
                  }
                  required
                />
              </label>
              <label className={styles.field}>
                <span>{t("account.email")}</span>
                <input
                  type="email"
                  autoComplete="email"
                  value={profile.email}
                  readOnly
                  required
                />
              </label>
              <label className={styles.field}>
                <span>{t("account.phone")}</span>
                <input
                  type="tel"
                  autoComplete="tel"
                  pattern="[+0-9() .-]{7,24}"
                  value={profile.phoneNumber}
                  onChange={(event) =>
                    updateProfileField("phoneNumber", event.target.value)
                  }
                />
              </label>
              <div className={styles.field}>
                <span>{t("account.profilePhoto")}</span>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(event) => void handlePhotoSelected(event)}
                />
                <button
                  type="button"
                  className={styles.addAddressButton}
                  disabled={uploadingPhoto}
                  onClick={() => photoInputRef.current?.click()}
                >
                  {uploadingPhoto ? (
                    <FaSpinner className={styles.spinner} aria-hidden="true" />
                  ) : (
                    <FaUpload aria-hidden="true" />
                  )}
                  {uploadingPhoto
                    ? t("common.loading")
                    : t("account.profilePhoto")}
                </button>
                {photoUploadError && (
                  <span className={styles.errorMessage} role="alert">
                    {t("account.saveFailed")}
                  </span>
                )}
              </div>

              <div className={styles.addressSection}>
                <h3>{t("account.addresses")}</h3>
                {profile.addresses.map((address, index) => (
                  <div
                    className={styles.addressRow}
                    key={address.id ?? `new-${index}`}
                  >
                    <input
                      type="text"
                      autoComplete="street-address"
                      value={address.fullAddress}
                      placeholder={t("account.addressPlaceholder")}
                      onChange={(event) => {
                        const addresses = [...profile.addresses];
                        addresses[index] = {
                          ...addresses[index],
                          fullAddress: event.target.value,
                        };
                        updateProfileField("addresses", addresses);
                      }}
                    />
                    <button
                      type="button"
                      className={styles.iconButton}
                      aria-label={t("account.removeAddress")}
                      onClick={() => void handleRemoveAddress(index)}
                    >
                      <FaTrash aria-hidden="true" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className={styles.addAddressButton}
                  onClick={() =>
                    updateProfileField("addresses", [
                      ...profile.addresses,
                      {
                        id: null,
                        fullAddress: "",
                        isDefault: false,
                        originalFullAddress: null,
                      },
                    ])
                  }
                >
                  <FaPlus aria-hidden="true" />
                  {t("account.addAddress")}
                </button>
              </div>

              <div className={styles.formFooter}>
                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={saving}
                >
                  {saving && (
                    <FaSpinner className={styles.spinner} aria-hidden="true" />
                  )}
                  {saving ? t("account.saving") : t("account.save")}
                </button>
                {saved && (
                  <span className={styles.successMessage} role="status">
                    {t("account.saved")}
                  </span>
                )}
                {saveError && (
                  <span className={styles.errorMessage} role="alert">
                    {t("account.saveFailed")}
                  </span>
                )}
              </div>
            </form>
          )}
        </section>

        <div className={styles.sideColumn}>
          <section
            className={styles.panel}
            aria-labelledby="account-orders-title"
          >
            <h2 id="account-orders-title">{t("account.orders")}</h2>
            {ordersLoading ? (
              <p className={styles.muted}>{t("orders.loading")}</p>
            ) : ordersError ? (
              <p className={styles.errorMessage} role="alert">
                {t("account.ordersFailed")}
              </p>
            ) : orders.length === 0 ? (
              <p className={styles.muted}>{t("account.noOrders")}</p>
            ) : (
              <ul className={styles.orderList}>
                {orders.map((order) => (
                  <li className={styles.orderItem} key={order.id}>
                    <div className={styles.orderHeading}>
                      <strong>#{order.id}</strong>
                      <span className={styles.status}>
                        {getOrderStatus(order.status)}
                      </span>
                    </div>
                    <div className={styles.orderDetails}>
                      <time dateTime={order.orderDate}>
                        {formatDate(order.orderDate)}
                      </time>
                      <strong>{formatCurrency(order.totalPrice)}</strong>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section
            className={styles.panel}
            aria-labelledby="account-favorites-title"
          >
            <h2 id="account-favorites-title">
              <FaHeart aria-hidden="true" />
              {t("account.favorites")}
            </h2>
            {favoritesLoading ? (
              <p className={styles.muted}>{t("account.loadingFavorites")}</p>
            ) : favoritesError ? (
              <p className={styles.errorMessage} role="alert">
                {t("account.favoritesFailed")}
              </p>
            ) : visibleFavoriteProducts.length === 0 ? (
              <p className={styles.muted}>{t("account.noFavorites")}</p>
            ) : (
              <ul className={styles.favoriteList}>
                {visibleFavoriteProducts.map((product) => (
                  <li className={styles.favoriteItem} key={product.id}>
                    <img
                      src={
                        product.imageUrl.startsWith("http")
                          ? product.imageUrl
                          : `${API_BASE_URL}${product.imageUrl}`
                      }
                      alt={getProductName(product, i18n.language)}
                    />
                    <div className={styles.favoriteInfo}>
                      <strong>{getProductName(product, i18n.language)}</strong>
                      <span>{formatCurrency(product.price)}</span>
                    </div>
                    <button
                      type="button"
                      className={styles.iconButton}
                      aria-label={t("account.removeFavorite")}
                      onClick={() => void handleRemoveFavorite(product.id)}
                    >
                      <FaTrash aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
