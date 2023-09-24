import React from "react";
import { Link } from "react-router-dom";

const CategorySelectionPage: React.FC = () => {
  // カテゴリ一覧を用意する（適切なデータソースから取得するなど）
  const categories = [
    { id: 1, name: "ramen", value: "ラーメン", image: "/images/category/image_ramen.jpg" },
    { id: 2, name: "pasta", value: "パスタ", image: "/images/category/image_pasta.jpg" },
    { id: 3, name: "pizza", value: "ピザ", image: "/images/category/image_pizza.jpg" },
    { id: 4, name: "westernfood", value: "洋食", image: "/images/category/image_westernfood.jpg" },
    { id: 5, name: "fastfood", value: "ファーストフード", image: "/images/category/image_fastfood.jpg" },
    { id: 6, name: "sushi", value: "寿司", image: "/images/category/image_sushi.jpg" },
    { id: 7, name: "cafe", value: "カフェ", image: "/images/category/image_cafe.jpg" },
    // 他のカテゴリを追加
  ];

  return (
    <div>
      <h1>カテゴリを選択してください</h1>
      <ul className='category-list'>
        {categories.map((category) => (
          <li key={category.id} className='category-item'>
            <Link to={`/search?category=${category.value}`} className='category-link' >
              <div 
                style={{ backgroundImage: 'url(' + category.image + ')' }}
                className='category-image'
              >
              </div>
              <div className='category-text'>
                <p>{category.value}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySelectionPage;
