import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CoffeeCard from "../CoffeeCard/CoffeeCard";
import { useCoffee } from "../../contexts/CoffeeContext";

export default function CoffeeList() {
  const navigate = useNavigate();
  const { coffees, favorites, toggleFavorite } = useCoffee();

  const [searchTerm, setSearchTerm] = useState("");
  const [displayedSearchTerm, setDisplayedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  // Debounce per il filtro ricerca
  const debounceSearch = useCallback(() => {
    const timer = setTimeout(() => {
      setDisplayedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const cancel = debounceSearch();
    return cancel;
  }, [debounceSearch]);

  // Categorie dinamiche dai dati
  const categories = [""];
  coffees.forEach((c) => {
    if (!categories.includes(c.category)) {
      categories.push(c.category);
    }
  });

  // Filtraggio + ordinamento
  const filteredCoffees = coffees
    .filter((coffee) => {
      const matchSearch = coffee.title
        .toLowerCase()
        .includes(displayedSearchTerm.toLowerCase());
      const matchCategory =
        !selectedCategory || coffee.category === selectedCategory;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === "title") {
        const compare = a.title.localeCompare(b.title);
        return sortDirection === "asc" ? compare : -compare;
      }
      return 0;
    });

  // Gestione ordinamento titolo
  const handleTitleSort = () => {
    if (sortBy === "title") {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy("title");
      setSortDirection("asc");
    }
  };

  // Gestione cambio categoria
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  //Bottone reset: pulisce tutti i filtri
  const handleResetFilters = () => {
    setSearchTerm("");
    setDisplayedSearchTerm("");
    setSelectedCategory("");
    setSortBy("");
    setSortDirection("asc");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-800 mb-6">
        Collezione Caffè
      </h1>

      {/* Controlli */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-6 space-y-3 sm:space-y-0">
        {/* Ricerca */}
        <input
          type="text"
          placeholder="Cerca caffè..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 shadow-sm w-full sm:w-auto"
        />

        {/* Filtro categoria */}
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border border-gray-300 rounded-md px-3 py-2 shadow-sm"
        >
          <option value="">Tutte le categorie</option>
          {categories.slice(1).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Ordina titolo */}
        <button
          onClick={handleTitleSort}
          className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition"
        >
          Ordina {sortDirection === "asc" ? "A-Z" : "Z-A"}
        </button>

        {/*Bottone reset */}
        <button
          onClick={handleResetFilters}
          className="text-gray-600 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition"
        >
          Reset filtri
        </button>
      </div>

      {/* Lista caffè */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Messaggio se nessun caffè */}
      {filteredCoffees.length === 0 && (
        <div className="mt-10 text-center text-gray-500">
          <p className="mb-2 font-semibold">
            Nessun caffè trovato con i criteri selezionati.
          </p>
          <p>Prova a cambiare la ricerca o la categoria.</p>
        </div>
      )}
    </div>
  );
}
