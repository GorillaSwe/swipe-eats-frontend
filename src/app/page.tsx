import React from "react";
import CategoryItem from "@/components/CategoryItem";
import { CATEGORIES } from "@/constants/categories";

const CategorySelectionPage: React.FC = () => {
  return (
    <div>
      <h1>カテゴリを選択してください</h1>
      <ul className='category-list'>
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
