import React, { useState } from "react";
import {
  YMaps,
  Map,
  GeolocationControl,
  ZoomControl,
  Placemark,
} from "@pbe/react-yandex-maps";
import { useTranslation } from "react-i18next";
import styles from "./AddressSelector.module.css";
import type { AppLocale } from "../i18n";

interface Props {
  onClose: () => void;
}

type YandexMapClickEvent = {
  get: (name: "coords") => [number, number];
};

type YandexGeoObject = {
  properties: {
    get: (name: "text" | "name") => string | undefined;
  };
};

type YandexGeocodeResult = {
  geoObjects: {
    get: (index: number) => YandexGeoObject | undefined;
  };
};

type YandexMapsApi = {
  geocode: (coords: [number, number]) => Promise<YandexGeocodeResult>;
};

type YandexMapLang = "en_US" | "ru_RU" | "tr_TR" | "en_RU" | "ru_UA" | "uk_UA";

const YANDEX_LANG: Record<AppLocale, YandexMapLang> = {
  en: "en_US",
  ru: "ru_RU",
  az: "en_US", // Yandex Maps has no Azerbaijani locale — fall back to English
};

const getYmapsApi = (): YandexMapsApi | null => {
  const mapsWindow = window as unknown as { ymaps?: YandexMapsApi };
  return mapsWindow.ymaps ?? null;
};

const AddressSelector: React.FC<Props> = ({ onClose }) => {
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<[number, number]>([40.4093, 49.8671]);
  const { t, i18n } = useTranslation();
  const mapLang: YandexMapLang =
    YANDEX_LANG[i18n.language as AppLocale] ?? "en_US";

  const handleMapClick = async (e: YandexMapClickEvent) => {
    const newCoords = e.get("coords");
    setCoords(newCoords);

    const ymapsApi = getYmapsApi();
    if (!ymapsApi) {
      setAddress(t("address.geocodeFailed"));
      return;
    }

    const geocoder = await ymapsApi.geocode(newCoords);
    const firstGeoObject = geocoder.geoObjects.get(0);
    const newAddress =
      firstGeoObject?.properties.get("text") ||
      firstGeoObject?.properties.get("name") ||
      t("address.geocodeFailed");
    setAddress(newAddress);
  };

  return (
    <div className={styles.container}>
      <h2>{t("address.title")}</h2>
      <div className={styles.mapContainer}>
        <YMaps
          query={{
            lang: mapLang,
            apikey: "4319fa3f-e001-4dcc-9b6e-c3f6f18836d0",
          }}
        >
          <Map
            defaultState={{ center: coords, zoom: 14 }}
            width="100%"
            height="400px"
            onClick={handleMapClick}
            modules={["geocode"]}
          >
            <GeolocationControl options={{ position: { left: 10, top: 10 } }} />
            <ZoomControl options={{ position: { right: 10, top: 10 } }} />
            <Placemark geometry={coords} />
          </Map>
        </YMaps>

        <input
          className={styles.input}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={t("address.placeholder")}
        />

        <button className={styles.button} onClick={onClose}>
          {t("address.deliverHere")}
        </button>
      </div>
    </div>
  );
};

export default AddressSelector;
