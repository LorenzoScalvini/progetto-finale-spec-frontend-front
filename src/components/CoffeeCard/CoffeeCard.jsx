import { memo } from "react";
import styles from "./CoffeeCard.module.css";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";

function CoffeeCard({ coffee, onClick, isFavorite, onToggleFavorite }) {
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(coffee.id);
  };

  return (
    <div
      className={styles.card}
      onClick={() => onClick(coffee.id)}
      role="button"
      tabIndex={0}
      aria-label={`Dettagli del caffè ${coffee.title}`}
    >
      <div className={styles.cardHeader}>
        <h2 className={styles.title}>
          <span aria-hidden="true">☕</span>
          {coffee.title}
        </h2>

        <button
          onClick={handleFavoriteClick}
          className={styles.favoriteButton}
          aria-label={
            isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"
          }
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

      <p
        className={styles.category}
        aria-label={`Categoria: ${coffee.category}`}
      >
        {coffee.category}
      </p>
    </div>
  );
}

export default memo(CoffeeCard);
