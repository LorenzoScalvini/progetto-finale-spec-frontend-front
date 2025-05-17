import { memo } from 'react';
import styles from './CoffeeCard.module.css';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';

type Coffee = {
  id: number;
  title: string;
  category: string;
  origin: string;
  roastLevel: string;
  flavor: string[];
  acidity: number;
  body: number;
  price: number;
  packaging: string;
  organic: boolean;
  description: string;
  imageUrl?: string;
};

interface CoffeeCardProps {
  coffee: Coffee;
  onClick: (id: number) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

function CoffeeCard({ coffee, onClick, isFavorite, onToggleFavorite }: CoffeeCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(coffee.id);
  };

  return (
    <div 
      className={styles.card}
      onClick={() => onClick(coffee.id)}
    >
      <div className={styles.cardHeader}>
        <h2 className={styles.title}>☕{coffee.title}</h2>
        <button 
          onClick={handleFavoriteClick}
          className={styles.favoriteButton}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <HeartSolid className={styles.favoriteIconSolid} />
          ) : (
            <HeartOutline className={styles.favoriteIconOutline} />
          )}
        </button>
      </div>
      <p className={styles.category}>{coffee.category}</p>
    </div>
  );
}

export default memo(CoffeeCard);