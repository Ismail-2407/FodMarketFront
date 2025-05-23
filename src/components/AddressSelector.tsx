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

const AddressSelector: React.FC<Props> = ({ onClose }) => {
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<[number, number]>([40.4093, 49.8671]);

  const handleMapClick = async (e: any) => {
    const newCoords = e.get("coords");
    setCoords(newCoords);

    const geocoder = await window.ymaps.geocode(newCoords);
    const firstGeoObject = geocoder.geoObjects.get(0);
    const newAddress =
      firstGeoObject?.getAddressLine() || "Не удалось определить адрес";
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
            <GeolocationControl options={{ float: "left" }} />
            <ZoomControl options={{ float: "right" }} />
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
