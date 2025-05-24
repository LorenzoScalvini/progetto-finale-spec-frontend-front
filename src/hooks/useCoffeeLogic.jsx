// useCoffeeLogic.jsx
import { useState, useEffect } from "react";
import axios from "axios";

export const useCoffeeLogic = () => {
  const [coffees, setCoffees] = useState([]);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favoriteCoffees")) || []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchCoffees = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/coffees`);
        setCoffees(
          response.data.success ? response.data.coffees : response.data
        );
      } catch (err) {
        setError(err.response?.data?.message || "Error loading coffees");
      } finally {
        setLoading(false);
      }
    };
    fetchCoffees();
  }, [baseUrl]);

  const toggleFavorite = (id) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((favId) => favId !== id)
      : [...favorites, id];
    localStorage.setItem("favoriteCoffees", JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const getCoffeeById = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/coffees/${id}`);
      const coffeeData = response.data.success
        ? response.data.coffee
        : response.data;
      if (!coffeeData) throw new Error("Coffee not found");
      return coffeeData;
    } catch (err) {
      const errorMessage =
        err.response?.status === 404
          ? "Coffee not found"
          : err.response?.data?.message || "Error loading coffee";
      throw new Error(errorMessage);
    }
  };

  return {
    coffees,
    favorites,
    loading,
    error,
    toggleFavorite,
    getCoffeeById,
  };
};
