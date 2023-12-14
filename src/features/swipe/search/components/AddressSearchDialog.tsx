import React, { useEffect, useRef, useState } from "react";

import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import SearchIcon from "@mui/icons-material/Search";

import NonScroll from "@/components/ui/NonScroll/NonScroll";
import { searchLocations } from "@/lib/api/locationsInfo";

import styles from "./AddressSearchDialog.module.scss";

interface AddressSearchDialogProps {
  buttonText: string;
  address: string;
  setIsDialogOpen: () => void;
  onAddressSelect: (
    name: string,
    address: string,
    latitude: number,
    longitude: number
  ) => void;
}

const AddressSearchDialog: React.FC<AddressSearchDialogProps> = ({
  buttonText,
  address,
  setIsDialogOpen,
  onAddressSelect,
}) => {
  const [nameText, setNameText] = useState(buttonText);
  const [addressText, setAddressText] = useState(address);
  const [addressSuggestions, setAddressSuggestions] = useState<
    { name: string; address: string; latitude: number; longitude: number }[]
  >([]);
  const [query, setQuery] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDialogOpen();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsDialogOpen]);

  const handleSearch = async () => {
    const fetchedLocations = await searchLocations(query);
    setAddressSuggestions(fetchedLocations);
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      await handleSearch();
    }
  };

  const handleSelectSuggestion = (suggestion: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  }) => {
    setNameText(suggestion.name);
    setAddressText(suggestion.address);
    onAddressSelect(
      suggestion.name,
      suggestion.address,
      suggestion.latitude,
      suggestion.longitude
    );
    setIsDialogOpen();
  };

  return (
    <div className={styles.container}>
      <div className={styles.dialog} ref={containerRef}>
        <CloseIcon className={styles.close} onClick={() => setIsDialogOpen()} />
        <h3 className={styles.title}>検索地点</h3>

        <div className={styles.currentLocation}>
          <FmdGoodIcon className={styles.icon} />
          <div className={styles.location}>
            <h3 className={styles.name}>{nameText}</h3>
            <p className={styles.address}>{addressText}</p>
          </div>
        </div>

        <div className={styles.searchBar}>
          <input
            className={styles.input}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="検索"
          />
          {query && (
            <CancelIcon
              className={styles.cancelIcon}
              onClick={() => {
                setQuery("");
                setAddressSuggestions([]);
              }}
            />
          )}
          <SearchIcon className={styles.searchIcon} />
        </div>

        {addressSuggestions.map((suggestion, index) => (
          <li
            key={index}
            className={styles.suggestion}
            onClick={() => handleSelectSuggestion(suggestion)}
          >
            <FmdGoodIcon className={styles.icon} />
            <div className={styles.location}>
              <h3 className={styles.name}>{suggestion.name}</h3>
              <p className={styles.address}>{suggestion.address}</p>
            </div>
          </li>
        ))}
        <div className={styles.buttons}>
          <button onClick={() => setIsDialogOpen()} className={styles.button}>
            完了
          </button>
        </div>
      </div>
      <NonScroll />
    </div>
  );
};

export default AddressSearchDialog;
