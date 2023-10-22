import Link from "next/link";
import styles from './CategoryItem.module.scss';

type CategoryItemProps = {
  value: string;
  image: string;
};

const CategoryItem: React.FC<CategoryItemProps> = ({ value, image }) => {
  return (
    <li className={styles.container}>
      <Link href={`/search?category=${value}`} className={styles.link}>
        <div
          style={{ backgroundImage: `url(${image})` }}
          className={styles.image}
        >
        </div>
        <div className={styles.text}>
          <p>{value}</p>
        </div>
      </Link>
    </li>
  );
};

export default CategoryItem;
