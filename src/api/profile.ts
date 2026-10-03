import axiosInstance from "./axiosInstance";

export interface ProfileAddress {
  id: number;
  fullAddress: string;
  isDefault: boolean;
}

export interface Profile {
  fullName: string;
  email: string;
  phoneNumber: string;
  photoUrl: string;
  addresses: ProfileAddress[];
}

export interface ProfileUpdate {
  fullName: string;
  phoneNumber: string;
  photoUrl: string;
}

export interface AddressInput {
  fullAddress: string;
  isDefault: boolean;
}

export async function fetchProfile(): Promise<Profile> {
  const response = await axiosInstance.get<Profile>("/profile");
  return {
    ...response.data,
    addresses: Array.isArray(response.data.addresses)
      ? response.data.addresses
      : [],
  };
}

export async function updateProfile(data: ProfileUpdate): Promise<void> {
  await axiosInstance.put("/profile", data);
}

export async function createAddress(
  data: AddressInput,
): Promise<ProfileAddress> {
  const response = await axiosInstance.post<ProfileAddress>("/addresses", data);
  return response.data;
}

export async function updateAddress(
  id: number,
  data: AddressInput,
): Promise<void> {
  await axiosInstance.put(`/addresses/${id}`, data);
}

export async function deleteAddress(id: number): Promise<void> {
  await axiosInstance.delete(`/addresses/${id}`);
}

export async function fetchFavoriteIds(): Promise<number[]> {
  const response = await axiosInstance.get<unknown>("/favorites");
  return Array.isArray(response.data)
    ? response.data.filter((id): id is number => Number.isInteger(id))
    : [];
}

export async function addFavorite(productId: number): Promise<void> {
  await axiosInstance.post(`/favorites/${productId}`);
}

export async function removeFavorite(productId: number): Promise<void> {
  await axiosInstance.delete(`/favorites/${productId}`);
}
