import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CoffeeCard from "../CoffeeCard/CoffeeCard";
import styles from "./CoffeeList.module.css";
import {
  MagnifyingGlassIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import { useCoffee } from "../../contexts/CoffeeContext";

const CoffeeList = () => {
  const navigate = useNavigate();
  const { coffees, favorites, loading, toggleFavorite } = useCoffee();

  const [searchTerm, setSearchTerm] = useState("");
  const [displayedSearchTerm, setDisplayedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("none");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const categories = ["", ...new Set(coffees.map((coffee) => coffee.category))];

  let filteredCoffees = coffees.filter((coffee) => {
    const matchesSearch = coffee.title
      .toLowerCase()
      .includes(displayedSearchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || coffee.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (sortBy === "title") {
    filteredCoffees.sort((a, b) => {
      const comparison = a.title.localeCompare(b.title);
      return sortDirection === "asc" ? comparison : -comparison;
    });
  } else if (sortBy === "category") {
    filteredCoffees.sort((a, b) => {
      const comparison = a.category.localeCompare(b.category);
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }

  const handleTitleSort = () => {
    if (sortBy === "title") {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy("title");
      setSortDirection("asc");
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSortBy(category ? "category" : "none");
    setSortDirection("asc");
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}></div>
        <p>Loading our premium coffee selection...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Our Premium Coffee Collection</h1>

        <div className={styles.controls}>
          <div className={styles.search}>
            <MagnifyingGlassIcon className={styles.icon} />
            <input
              type="text"
              placeholder="Search for your perfect coffee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.input}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => handleCategorySelect(e.target.value)}
            className={styles.select}
          >
            <option value="">All Categories</option>
            {categories.slice(1).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <button
            onClick={handleTitleSort}
            className={`${styles.button} ${
              sortBy === "title" ? styles.active : ""
            }`}
          >
            <ArrowsUpDownIcon className={styles.sortIcon} />
            {sortBy === "title"
              ? sortDirection === "asc"
                ? "A-Z ↓"
                : "Z-A ↑"
              : "Sort A-Z"}
          </button>
        </div>
      </div>

      <div className={styles.info}>
        <span>
          Showing <strong>{filteredCoffees.length}</strong> of{" "}
          <strong>{coffees.length}</strong> coffees
        </span>

        {sortBy === "category" && selectedCategory && (
          <span> • Sorted by category</span>
        )}

        {favorites.length > 0 && (
          <span>
            {" "}
            • <strong>{favorites.length}</strong> in favorites
          </span>
        )}
      </div>

      <div className={styles.grid}>
        {filteredCoffees.map((coffee) => (
          <CoffeeCard
            key={coffee.id}
            coffee={coffee}
            onClick={() => navigate(`/coffees/${coffee.id}`)}
            isFavorite={favorites.includes(coffee.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {filteredCoffees.length === 0 && (
        <div className={styles.empty}>
          <p>No coffees found with current search criteria.</p>
          <p>Try changing your search term or select a different category.</p>
        </div>
      )}
    </div>
  );
};

export default CoffeeList;
