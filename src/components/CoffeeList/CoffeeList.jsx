import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CoffeeCard from "../CoffeeCard/CoffeeCard";
import styles from "./CoffeeList.module.css";
import {
  MagnifyingGlassIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import { useCoffee } from "../../contexts/CoffeeContext";

export default function CoffeeList() {
  const navigate = useNavigate();
  const { coffees, favorites, loading, toggleFavorite } = useCoffee();

  const [searchTerm, setSearchTerm] = useState("");
  const [displayedSearchTerm, setDisplayedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("none");
  const [sortDirection, setSortDirection] = useState("asc");

  // Effetto per il debounce della ricerca
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Memoizzare le categorie per evitare ricalcoli non necessari
  const categories = useMemo(() => {
    return ["", ...new Set(coffees.map((coffee) => coffee.category))];
  }, [coffees]);

  // Memoizzare i caffè filtrati e ordinati
  const filteredCoffees = useMemo(() => {
    let result = coffees.filter((coffee) => {
      const matchesSearch = coffee.title
        .toLowerCase()
        .includes(displayedSearchTerm.toLowerCase());
      const matchesCategory =
        !selectedCategory || coffee.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "title") {
      result.sort((a, b) => {
        const comparison = a.title.localeCompare(b.title);
        return sortDirection === "asc" ? comparison : -comparison;
      });
    } else if (sortBy === "category") {
      result.sort((a, b) => {
        const comparison = a.category.localeCompare(b.category);
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [coffees, displayedSearchTerm, selectedCategory, sortBy, sortDirection]);

  // Funzioni di callback memoizzate
  const handleTitleSort = useCallback(() => {
    if (sortBy === "title") {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy("title");
      setSortDirection("asc");
    }
  }, [sortBy]);

  const handleCategorySelect = useCallback((category) => {
    setSelectedCategory(category);
    setSortBy(category ? "category" : "none");
    setSortDirection("asc");
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}></div>
        <p>Caricamento della nostra selezione premium di caffè...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>La Nostra Collezione Premium di Caffè</h1>

        <div className={styles.controls}>
          <div className={styles.search}>
            <MagnifyingGlassIcon className={styles.icon} />
            <input
              type="text"
              placeholder="Cerca il tuo caffè perfetto..."
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
            <option value="">Tutte le categorie</option>
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
              : "Ordina A-Z"}
          </button>
        </div>
      </div>

      <div className={styles.info}>
        <span>
          Mostrati <strong>{filteredCoffees.length}</strong> di{" "}
          <strong>{coffees.length}</strong> caffè
        </span>

        {sortBy === "category" && selectedCategory && (
          <span> • Ordinati per categoria</span>
        )}

        {favorites.length > 0 && (
          <span>
            {" "}
            • <strong>{favorites.length}</strong> nei preferiti
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
          <p>Nessun caffè trovato con i criteri di ricerca attuali.</p>
          <p>
            Prova a cambiare il termine di ricerca o seleziona una categoria
            diversa.
          </p>
        </div>
      )}
    </div>
  );
}
