import React from "react";
import CategoryItem from "@/components/CategoryItem";
import { CATEGORIES } from "@/constants/categories";
import styles from './page.module.css';

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
