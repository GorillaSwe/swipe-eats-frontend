import FilterButton from "@/components/ui/FilterButton/FilterButton";

import styles from "./ButtonContainer.module.scss";

interface ButtonContainerProps {
  filter: string;
  setFilter: (string: string) => void;
  favoriteCount: number;
  nullCount: number;
  allCount: number;
}

const ButtonContainer: React.FC<ButtonContainerProps> = ({
  filter,
  setFilter,
  favoriteCount,
  nullCount,
  allCount,
}) => {
  return (
    <div className={styles.container}>
      <FilterButton
        filterType="favorites"
        filterString="お気に入り"
        activeFilter={filter}
        count={favoriteCount}
        setFilter={setFilter}
      />
      <FilterButton
        filterType="null"
        filterString="未評価"
        activeFilter={filter}
        count={nullCount}
        setFilter={setFilter}
      />
      <FilterButton
        filterType="all"
        filterString="すべて"
        activeFilter={filter}
        count={allCount}
        setFilter={setFilter}
      />
    </div>
  );
};

export default ButtonContainer;
