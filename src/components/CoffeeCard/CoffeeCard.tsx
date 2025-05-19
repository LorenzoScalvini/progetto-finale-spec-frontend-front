import { memo } from 'react';
import styles from './CoffeeCard.module.css';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';

// 1. TIPI E INTERFACCE
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

// 2. COMPONENTE PRINCIPALE
function CoffeeCard({ coffee, onClick, isFavorite, onToggleFavorite }: CoffeeCardProps) {
  // 3. HANDLER FUNCTIONS
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Previene la propagazione all'elemento padre
    onToggleFavorite(coffee.id);
  };

  // 4. RENDER
  return (
    <div 
      className={styles.card}
      onClick={() => onClick(coffee.id)}
      role="button" // Migliore accessibilità
      tabIndex={0} // Permette la navigazione da tastiera
      aria-label={`Dettagli del caffè ${coffee.title}`}
    >
      {/* Intestazione della card con titolo e pulsante preferiti */}
      <div className={styles.cardHeader}>
        <h2 className={styles.title}>
          <span aria-hidden="true">☕</span> {/* Icona decorativa */}
          {coffee.title}
        </h2>
        
        {/* Pulsante preferiti */}
        <button 
          onClick={handleFavoriteClick}
          className={styles.favoriteButton}
          aria-label={isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
        >
          {isFavorite ? (
            <HeartSolid 
              className={styles.favoriteIconSolid} 
              aria-hidden="true" 
            />
          ) : (
            <HeartOutline 
              className={styles.favoriteIconOutline} 
              aria-hidden="true" 
            />
          )}
        </button>
      </div>

      {/* Categoria del caffè */}
      <p className={styles.category} aria-label={`Categoria: ${coffee.category}`}>
        {coffee.category}
      </p>
    </div>
  );
}

// 5. MEMOIZATION
export default memo(CoffeeCard);