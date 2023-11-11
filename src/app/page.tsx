import { NextPage } from "next";

import { CATEGORIES } from "@/const/categories";
import CategoryItem from "@/features/swipe/category/components/CategoryItem";

import styles from "./page.module.scss";

const CategoryPage: NextPage = () => {
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

export default CategoryPage;
