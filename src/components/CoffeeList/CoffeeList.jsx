import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CoffeeCard from "../CoffeeCard/CoffeeCard";
import styles from "./CoffeeList.module.css";
import {
  ArrowRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function CoffeeList() {
  const [coffees, setCoffees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedSearchTerm, setDisplayedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("none");
  const [sortDirection, setSortDirection] = useState("asc");
  const [favorites, setFavorites] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedFavorites = localStorage.getItem("favoriteCoffees");
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }

        const response = await fetch("http://localhost:3001/coffees");
        if (!response.ok) throw new Error("Errore nel caricamento dei caffè");
        setCoffees(await response.json());
      } catch (error) {
        console.error("Errore nel caricamento dati:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleCardClick = (id) => navigate(`/coffees/${id}`);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSortBy(e.target.value ? "category" : "none");
    setSortDirection("asc");
  };

  const toggleAlphabeticalSort = () => {
    setSortBy("title");
    setSortDirection((prev) =>
      sortBy === "title" && prev === "asc" ? "desc" : "asc"
    );
  };

  const handleToggleFavorite = (id) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((favId) => favId !== id)
      : [...favorites, id];

    setFavorites(newFavorites);
    localStorage.setItem("favoriteCoffees", JSON.stringify(newFavorites));
  };

  const categories = useMemo(() => {
    return ["", ...new Set(coffees.map((c) => c.category))];
  }, [coffees]);

  const filteredCoffees = useMemo(() => {
    let result = coffees.filter(
      (c) =>
        c.title.toLowerCase().includes(displayedSearchTerm.toLowerCase()) &&
        (!selectedCategory || c.category === selectedCategory)
    );

    if (sortBy === "title") {
      result.sort((a, b) =>
        sortDirection === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title)
      );
    } else if (sortBy === "category") {
      result.sort((a, b) =>
        sortDirection === "asc"
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category)
      );
    }

    return result;
  }, [coffees, displayedSearchTerm, selectedCategory, sortBy, sortDirection]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Caricamento dei nostri caffè premium...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.starbucksStar}>★</span> La Nostra Collezione
          di Caffè
        </h1>

        <div className={styles.controls}>
          <div className={styles.searchContainer}>
            <MagnifyingGlassIcon className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Trova il tuo caffè perfetto..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className={styles.categorySelect}
          >
            <option value="">Tutte le Categorie</option>
            {categories.slice(1).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <button
            onClick={toggleAlphabeticalSort}
            className={`${styles.sortButton} ${
              sortBy === "title" ? styles.active : ""
            }`}
          >
            {sortBy === "title"
              ? sortDirection === "asc"
                ? "A-Z ↓"
                : "Z-A ↑"
              : "Ordina A-Z"}
          </button>

          <button
            onClick={() => navigate("/favorites")}
            className={styles.favoritesButton}
          >
            <span className={styles.favoritesText}>I Miei Preferiti</span>
            <ArrowRightIcon className={styles.favoritesIcon} />
          </button>
        </div>
      </div>

      <div className={styles.resultsInfo}>
        Mostrati {filteredCoffees.length} di {coffees.length} selezioni premium
        {sortBy === "category" &&
          selectedCategory &&
          ` (ordinati per categoria)`}
        {favorites.length > 0 && ` • ${favorites.length} nei preferiti`}
      </div>

      <div className={styles.grid}>
        {filteredCoffees.map((coffee) => (
          <CoffeeCard
            key={coffee.id}
            coffee={coffee}
            onClick={handleCardClick}
            isFavorite={favorites.includes(coffee.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>

      {filteredCoffees.length === 0 && (
        <div className={styles.noResults}>
          Nessun caffè trovato. Prova con un'altra ricerca.
        </div>
      )}
    </div>
  );
}
