import FilterButton from "@/components/ui/FilterButton/FilterButton";

import styles from "./ButtonContainer.module.scss";

interface ButtonContainerProps {
  filter: string;
  setFilter: (string: string) => void;
}

const ButtonContainer: React.FC<ButtonContainerProps> = ({
  filter,
  setFilter,
}) => {
  return (
    <div className={styles.container}>
      <FilterButton
        filterType="restaurants"
        filterString="レストラン"
        activeFilter={filter}
        count={null}
        setFilter={setFilter}
      />
      <FilterButton
        filterType="users"
        filterString="ユーザー"
        activeFilter={filter}
        count={null}
        setFilter={setFilter}
      />
    </div>
  );
};

export default ButtonContainer;
