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
        <p>Caricamento dei tuoi caffè preferiti...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>I miei caffè preferiti</h1>
      </div>

      {!favoriteCoffees.length ? (
        <div className={styles.empty}>
          <HeartIcon className={styles.icon} />
          <div className={styles.emptyContent}>
            <h2>Nessun caffè preferito</h2>
            <p>Non hai ancora aggiunto caffè ai tuoi preferiti.</p>
            <p>
              Esplora la nostra collezione e clicca sull'icona del cuore per
              salvare i tuoi preferiti!
            </p>
            <button onClick={() => navigate("/")} className={styles.button}>
              Esplora la collezione
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.info}>
            <span>
              <strong>{favoriteCoffees.length}</strong> caffè{" "}
              {favoriteCoffees.length === 1 ? "preferito" : "preferiti"} nella
              tua collezione
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
              Clicca su un caffè per vedere i dettagli o clicca di nuovo sul
              cuore per rimuoverlo dai preferiti.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default FavoritesList;
