import React, { useState } from "react";
import {
  YMaps,
  Map,
  GeolocationControl,
  ZoomControl,
  Placemark,
} from "@pbe/react-yandex-maps";
import styles from "./AddressSelector.module.css";

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

const getYmapsApi = (): YandexMapsApi | null => {
  const mapsWindow = window as unknown as { ymaps?: YandexMapsApi };
  return mapsWindow.ymaps ?? null;
};

const AddressSelector: React.FC<Props> = ({ onClose }) => {
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<[number, number]>([40.4093, 49.8671]);

  const handleMapClick = async (e: YandexMapClickEvent) => {
    const newCoords = e.get("coords");
    setCoords(newCoords);

    const ymapsApi = getYmapsApi();
    if (!ymapsApi) {
      setAddress("Не удалось определить адрес");
      return;
    }

    const geocoder = await ymapsApi.geocode(newCoords);
    const firstGeoObject = geocoder.geoObjects.get(0);
    const newAddress =
      firstGeoObject?.properties.get("text") ||
      firstGeoObject?.properties.get("name") ||
      "Не удалось определить адрес";
    setAddress(newAddress);
  };

  return (
    <div className={styles.container}>
      <h2>Уточните адрес доставки</h2>
      <div className={styles.mapContainer}>
        <YMaps
          query={{
            lang: "ru_RU",
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
          placeholder="Введите адрес вручную"
        />

        <button className={styles.button} onClick={onClose}>
          Доставить сюда
        </button>
      </div>
    </div>
  );
};

export default AddressSelector;
