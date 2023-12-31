import styles from "./SortOption.module.scss";

type SortOptionProps = {
  value: string;
  label: string;
  isSelected: boolean;
  onOptionChange: (value: string) => void;
};

const SortOption: React.FC<SortOptionProps> = ({
  value,
  label,
  isSelected,
  onOptionChange,
}) => {
  return (
    <label className={`${styles.label} ${isSelected ? styles.selected : ""}`}>
      <input
        type="radio"
        className={styles.button}
        name="sortOptions"
        value={value}
        checked={isSelected}
        onChange={() => onOptionChange(value)}
      />
      <p className={styles.text}>{label}</p>
    </label>
  );
};

export default SortOption;
