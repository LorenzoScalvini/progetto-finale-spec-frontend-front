import { useNavigate } from "react-router-dom";
import CoffeeCard from "../CoffeeCard/CoffeeCard";
import styles from "./FavoritesList.module.css";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useCoffee } from "../../contexts/CoffeeContext";

const FavoritesList = () => {
  const navigate = useNavigate();
  const { coffees, favorites, loading, toggleFavorite } = useCoffee();

  const favoriteCoffees = coffees.filter((coffee) =>
    favorites.includes(coffee.id)
  );

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}></div>
        <p>Loading your favorite coffees...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Favorite Coffees</h1>
      </div>

      {!favoriteCoffees.length ? (
        <div className={styles.empty}>
          <HeartIcon className={styles.icon} />
          <div className={styles.emptyContent}>
            <h2>No Favorite Coffees</h2>
            <p>You haven't added any coffees to your favorites yet.</p>
            <p>
              Explore our collection and click the heart icon to save your
              favorites!
            </p>
            <button onClick={() => navigate("/")} className={styles.button}>
              Browse Collection
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.info}>
            <span>
              <strong>{favoriteCoffees.length}</strong> favorite{" "}
              {favoriteCoffees.length === 1 ? "coffee" : "coffees"} in your
              collection
            </span>
          </div>

          <div className={styles.grid}>
            {favoriteCoffees.map((coffee) => (
              <CoffeeCard
                key={coffee.id}
                coffee={coffee}
                onClick={() => navigate(`/coffees/${coffee.id}`)}
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>

          <div className={styles.hint}>
            <p>
              Click on a coffee to view details or click the heart again to
              remove from favorites.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default FavoritesList;
