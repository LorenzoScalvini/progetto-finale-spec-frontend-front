import { memo } from "react";
import styles from "./CoffeeCard.module.css";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";

const CoffeeCard = memo(({ coffee, onClick, isFavorite, onToggleFavorite }) => {
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(coffee.id);
  };

  const handleCardClick = () => {
    onClick(coffee.id);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <article
      className={styles.card}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${coffee.title}`}
    >
      <header className={styles.cardHeader}>
        <h2 className={styles.title}>
          <span className={styles.coffeeEmoji} aria-hidden="true">
            ☕
          </span>
          <span>{coffee.title}</span>
        </h2>

        <button
          onClick={handleFavoriteClick}
          className={`${styles.favoriteButton} ${
            isFavorite ? styles.favoriteActive : styles.favoriteInactive
          }`}
          aria-label={
            isFavorite
              ? `Remove ${coffee.title} from favorites`
              : `Add ${coffee.title} to favorites`
          }
        >
          {isFavorite ? (
            <HeartSolid className={styles.favoriteIcon} aria-hidden="true" />
          ) : (
            <HeartOutline className={styles.favoriteIcon} aria-hidden="true" />
          )}
        </button>
      </header>

      <div className={styles.cardContent}>
        <p className={styles.category}>
          <span className={styles.label}>Category:</span>
          <span>{coffee.category}</span>
        </p>

        {coffee.origin && (
          <p className={styles.origin}>
            <span className={styles.label}>Origin:</span>
            <span>{coffee.origin}</span>
          </p>
        )}

        <span className={styles.srOnly}>
          {isFavorite ? "This coffee is in your favorites" : ""}
        </span>
      </div>

      <footer className={styles.cardFooter}>
        <span>Click for more details</span>
      </footer>
    </article>
  );
});

export default CoffeeCard;
