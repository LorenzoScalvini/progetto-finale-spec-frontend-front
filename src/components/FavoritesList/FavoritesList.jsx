import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CoffeeCard from "../CoffeeCard/CoffeeCard";
import styles from "./FavoritesList.module.css";
import { HeartIcon as HeartBroken } from "@heroicons/react/24/outline";
import axios from "axios";

export default function FavoritesList() {
  const [state, setState] = useState({
    favorites: JSON.parse(localStorage.getItem("favoriteCoffees")) || [],
    coffees: [],
    isLoading: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:3001/coffees");
        setState((prev) => ({ ...prev, coffees: data, isLoading: false }));
      } catch (error) {
        console.error("Errore:", error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };
    fetchData();
  }, []);

  const handleToggleFavorite = (id) => {
    const newFavorites = state.favorites.includes(id)
      ? state.favorites.filter((favId) => favId !== id)
      : [...state.favorites, id];
    localStorage.setItem("favoriteCoffees", JSON.stringify(newFavorites));
    setState((prev) => ({ ...prev, favorites: newFavorites }));
  };

  const favoriteCoffees = state.coffees.filter((coffee) =>
    state.favorites.includes(coffee.id)
  );

  if (state.isLoading)
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Caricamento dei tuoi caffè preferiti...</p>
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.heartIcon}>❤️</span> I Miei Caffè Preferiti
        </h1>
      </div>

      {!favoriteCoffees.length ? (
        <div className={styles.emptyState}>
          <HeartBroken className={styles.emptyIcon} />
          <p>Non hai ancora aggiunto nessun caffè ai preferiti.</p>
          <p>
            Clicca sull'icona a forma di cuore nelle schede per aggiungerli!
          </p>
          <button onClick={() => navigate("/")} className={styles.browseButton}>
            Scopri i Caffè
          </button>
        </div>
      ) : (
        <>
          <div className={styles.resultsInfo}>
            {favoriteCoffees.length} caffè preferit
            {favoriteCoffees.length === 1 ? "o" : "i"}
          </div>
          <div className={styles.grid}>
            {favoriteCoffees.map((coffee) => (
              <CoffeeCard
                key={coffee.id}
                coffee={coffee}
                onClick={() => navigate(`/coffees/${coffee.id}`)}
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
