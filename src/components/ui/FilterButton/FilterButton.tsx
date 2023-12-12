import styles from "./FilterButton.module.scss";

interface FileterButtonProps {
  filterType: string;
  filterString: string;
  activeFilter: string;
  count: number | null;
  setFilter: (filterType: string) => void;
}

const FilterButton: React.FC<FileterButtonProps> = ({
  filterType,
  filterString,
  activeFilter,
  count,
  setFilter,
}) => {
  return (
    <button
      onClick={() => setFilter(filterType)}
      className={`${styles.button} ${
        activeFilter === filterType ? styles.active : ""
      }`}
    >
      {filterString}
      {count != null && <span>{count}か所</span>}
    </button>
  );
};

export default FilterButton;
