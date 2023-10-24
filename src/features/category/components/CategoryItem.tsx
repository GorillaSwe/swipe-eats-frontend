import Link from "next/link";
import Image from "next/image";
import styles from './CategoryItem.module.scss';

type CategoryItemProps = {
  value: string;
  image: string;
};

const CategoryItem: React.FC<CategoryItemProps> = ({ value, image }) => {
  return (
    <li className={styles.container}>
      <Link href={`/search?category=${value}`} className={styles.link}>
        <div className={styles.image}>
          <Image
            src={image}
            alt={value}
            quality={100}
            priority={true}
            placeholder="blur"
            fill
          />
        </div>
        <div className={styles.text}>
          <p>{value}</p>
        </div>
      </Link>
    </li>
  );
};

export default CategoryItem;
