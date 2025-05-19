import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CoffeeCard from "../CoffeeCard/CoffeeCard";
import styles from "./FavoritesList.module.css";
import { HeartIcon as HeartBroken } from "@heroicons/react/24/outline";

export default function FavoritesList() {
  const [favorites, setFavorites] = useState([]);
  const [coffees, setCoffees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteCoffees");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    const fetchCoffees = async () => {
      try {
        const response = await fetch("http://localhost:3001/coffees");
        if (!response.ok) throw new Error("Impossibile recuperare i caffè");
        setCoffees(await response.json());
      } catch (error) {
        console.error("Errore durante il recupero dei caffè:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoffees();
  }, []);

  const handleCardClick = (id) => navigate(`/coffees/${id}`);

  const handleToggleFavorite = (id) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((favId) => favId !== id)
      : [...favorites, id];

    setFavorites(newFavorites);
    localStorage.setItem("favoriteCoffees", JSON.stringify(newFavorites));
  };

  const favoriteCoffees = coffees.filter((coffee) =>
    favorites.includes(coffee.id)
  );

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Caricamento dei tuoi caffè preferiti...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.heartIcon}>❤️</span> I Miei Caffè Preferiti
        </h1>
      </div>

      {favoriteCoffees.length === 0 ? (
        <div className={styles.emptyState}>
          <HeartBroken className={styles.emptyIcon} />
          <p>Non hai ancora aggiunto nessun caffè ai preferiti.</p>
          <p>
            Clicca sull’icona a forma di cuore nelle schede per aggiungerli!
          </p>
          <button onClick={() => navigate("/")} className={styles.browseButton}>
            Scopri i Caffè
          </button>
        </div>
      ) : (
        <>
          <div className={styles.resultsInfo}>
            {favoriteCoffees.length} caffè preferit
            {favoriteCoffees.length === 1 ? "o" : "i"} visualizzat
            {favoriteCoffees.length === 1 ? "o" : "i"}
          </div>

          <div className={styles.grid}>
            {favoriteCoffees.map((coffee) => (
              <CoffeeCard
                key={coffee.id}
                coffee={coffee}
                onClick={handleCardClick}
                isFavorite={true}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
