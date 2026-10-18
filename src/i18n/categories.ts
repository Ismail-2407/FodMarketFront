import type { TFunction } from "i18next";

export interface LocalizedProductText {
  name: string;
  description?: string;
  nameEn?: string | null;
  nameAz?: string | null;
  descriptionEn?: string | null;
  descriptionAz?: string | null;
}

const CATEGORY_TRANSLATION_KEYS = {
  Фрукты: "categories.fruits",
  Овощи: "categories.vegetables",
  Выпечка: "categories.bakery",
  Напитки: "categories.drinks",
} as const;

export function translateCategory(category: string, t: TFunction): string {
  const key = CATEGORY_TRANSLATION_KEYS[
    category as keyof typeof CATEGORY_TRANSLATION_KEYS
  ];
  return key ? t(key) : category;
}

export function getProductName(
  product: LocalizedProductText,
  language: string,
): string {
  const locale = language.split("-")[0];
  const translatedName =
    locale === "en"
      ? product.nameEn
      : locale === "az"
        ? product.nameAz
        : undefined;

  return translatedName?.trim() ? translatedName : product.name;
}

export function getProductDescription(
  product: LocalizedProductText,
  language: string,
): string {
  const locale = language.split("-")[0];
  const translatedDescription =
    locale === "en"
      ? product.descriptionEn
      : locale === "az"
        ? product.descriptionAz
        : undefined;

  return translatedDescription?.trim()
    ? translatedDescription
    : product.description ?? "";
}
