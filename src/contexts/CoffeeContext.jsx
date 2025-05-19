// context/CoffeeContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CoffeeContext = createContext();

export function CoffeeProvider({ children }) {
  const [coffees, setCoffees] = useState([]);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favoriteCoffees")) || []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoffees = async () => {
      try {
        const response = await axios.get("http://localhost:3001/coffees");
        setCoffees(response.data);
      } catch (err) {
        setError(err.message || "Failed to load coffees");
      } finally {
        setLoading(false);
      }
    };
    fetchCoffees();
  }, []);

  const toggleFavorite = (id) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((favId) => favId !== id)
      : [...favorites, id];
    localStorage.setItem("favoriteCoffees", JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const getCoffeeById = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/coffees/${id}`);
      return response.data.success ? response.data.coffee : response.data;
    } catch (err) {
      throw new Error(
        err.response?.status === 404
          ? "Coffee not found"
          : "Failed to load coffee"
      );
    } finally {
      setLoading(false);
    }
  };

  const value = {
    coffees,
    favorites,
    loading,
    error,
    toggleFavorite,
    getCoffeeById,
  };

  return (
    <CoffeeContext.Provider value={value}>{children}</CoffeeContext.Provider>
  );
}

export function useCoffee() {
  const context = useContext(CoffeeContext);
  if (!context) {
    throw new Error("useCoffee must be used within a CoffeeProvider");
  }
  return context;
}
