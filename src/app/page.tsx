import CategoryItem from "@/features/category/components/CategoryItem";
import { CATEGORIES } from "@/const/categories";
import styles from './page.module.scss';

const CategorySelectionPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>カテゴリを選択してください</h1>
      <ul className={styles.list}>
        {CATEGORIES.map((category) => (
          <CategoryItem
            key={category.id}
            value={category.value}
            image={category.image}
          />
        ))}
      </ul>
    </div>
  );
};

export default CategorySelectionPage;
