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
        if (!response.ok) throw new Error("Failed to fetch coffees");
        setCoffees(await response.json());
      } catch (error) {
        console.error("Error fetching coffees:", error);
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
        <p>Loading your favorite coffees...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.heartIcon}>❤️</span> My Favorite Coffees
        </h1>
      </div>

      {favoriteCoffees.length === 0 ? (
        <div className={styles.emptyState}>
          <HeartBroken className={styles.emptyIcon} />
          <p>You don't have any favorite coffees yet.</p>
          <p>Click the heart icon on coffee cards to add them here!</p>
          <button onClick={() => navigate("/")} className={styles.browseButton}>
            Browse Coffees
          </button>
        </div>
      ) : (
        <>
          <div className={styles.resultsInfo}>
            Showing {favoriteCoffees.length} favorite coffee
            {favoriteCoffees.length !== 1 ? "s" : ""}
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
