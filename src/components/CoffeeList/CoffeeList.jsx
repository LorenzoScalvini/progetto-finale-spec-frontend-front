import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CoffeeCard from "../CoffeeCard/CoffeeCard";
import styles from "./CoffeeList.module.css";
import {
  ArrowRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";

export default function CoffeeList() {
  const [coffees, setCoffees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedSearchTerm, setDisplayedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("none");
  const [sortDirection, setSortDirection] = useState("asc");
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favoriteCoffees")) || []
  );

  const navigate = useNavigate();

  useEffect(() => {
    const getCoffees = async () => {
      try {
        const response = await axios.get("http://localhost:3001/coffees");
        setCoffees(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setIsLoading(false);
      }
    };
    getCoffees();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleToggleFavorite = (id) => {
    let newFavorites;
    if (favorites.includes(id)) {
      newFavorites = favorites.filter((favId) => favId !== id);
    } else {
      newFavorites = [...favorites, id];
    }
    localStorage.setItem("favoriteCoffees", JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const categories = ["", ...new Set(coffees.map((c) => c.category))];

  let filteredCoffees = coffees.filter((c) => {
    const matchesSearch = c.title
      .toLowerCase()
      .includes(displayedSearchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (sortBy === "title") {
    filteredCoffees.sort((a, b) => {
      if (sortDirection === "asc") {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
  } else if (sortBy === "category") {
    filteredCoffees.sort((a, b) => {
      if (sortDirection === "asc") {
        return a.category.localeCompare(b.category);
      } else {
        return b.category.localeCompare(a.category);
      }
    });
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading our premium coffees...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.starbucksStar}>★</span> Our Coffee Collection
        </h1>

        <div className={styles.controls}>
          <div className={styles.searchContainer}>
            <MagnifyingGlassIcon className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Find your perfect coffee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSortBy(e.target.value ? "category" : "none");
              setSortDirection("asc");
            }}
            className={styles.categorySelect}
          >
            <option value="">All Categories</option>
            {categories.slice(1).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSortBy("title");
              setSortDirection(
                sortBy === "title" && sortDirection === "asc" ? "desc" : "asc"
              );
            }}
            className={`${styles.sortButton} ${
              sortBy === "title" ? styles.active : ""
            }`}
          >
            {sortBy === "title"
              ? sortDirection === "asc"
                ? "A-Z ↓"
                : "Z-A ↑"
              : "Sort A-Z"}
          </button>

          <button
            onClick={() => navigate("/favorites")}
            className={styles.favoritesButton}
          >
            <span className={styles.favoritesText}>My Favorites</span>
            <ArrowRightIcon className={styles.favoritesIcon} />
          </button>
        </div>
      </div>

      <div className={styles.resultsInfo}>
        Showing {filteredCoffees.length} of {coffees.length} premium selections
        {sortBy === "category" && selectedCategory && ` (sorted by category)`}
        {favorites.length > 0 && ` • ${favorites.length} in favorites`}
      </div>

      <div className={styles.grid}>
        {filteredCoffees.map((coffee) => (
          <CoffeeCard
            key={coffee.id}
            coffee={coffee}
            onClick={() => navigate(`/coffees/${coffee.id}`)}
            isFavorite={favorites.includes(coffee.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>

      {filteredCoffees.length === 0 && (
        <div className={styles.noResults}>
          No coffees found. Try a different search.
        </div>
      )}
    </div>
  );
}
