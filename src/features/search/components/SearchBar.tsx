import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";

import styles from "./SearchBar.module.scss";

interface SearchBarProps {
  query: string;
  setQuery: (string: string) => void;
  handleSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  setQuery,
  handleSearch,
}) => {
  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      await handleSearch();
    }
  };

  const clearInput = () => {
    setQuery("");
  };

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="検索"
      />
      {query && (
        <CancelIcon className={styles.cancelIcon} onClick={clearInput} />
      )}
      <SearchIcon className={styles.searchIcon} />
    </div>
  );
};

export default SearchBar;
