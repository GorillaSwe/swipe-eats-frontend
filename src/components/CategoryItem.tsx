import React from "react";
import Link from "next/link";

type CategoryItemProps = {
  value: string;
  image: string;
};

const CategoryItem: React.FC<CategoryItemProps> = ({ value, image }) => {
  return (
    <li className='category-item'>
      <Link href={`/search?category=${value}`} className='category-link'>
        <div 
          style={{ backgroundImage: `url(${image})` }}
          className='category-image'
        >
        </div>
        <div className='category-text'>
          <p>{value}</p>
        </div>
      </Link>
    </li>
  );
};

export default CategoryItem;
