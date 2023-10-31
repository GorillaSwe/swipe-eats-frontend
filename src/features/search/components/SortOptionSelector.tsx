import { SORT_OPTIONS } from "@/const/sortOptions";
import SortOption from "@/features/search/components/SortOption";

import styles from "./SortOptionSelector.module.scss";

type SortOptionProps = {
  selectedSort: string;
  onSelectedSortChange: (selectedSort: string) => void;
};

const SortOptionSelector: React.FC<SortOptionProps> = ({
  selectedSort,
  onSelectedSortChange,
}) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>並び替え</h3>
      <div className={styles.option}>
        {SORT_OPTIONS.map((option) => (
          <SortOption
            key={option.value}
            value={option.value}
            label={option.label}
            isSelected={selectedSort === option.value}
            onOptionChange={() => onSelectedSortChange(option.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default SortOptionSelector;
