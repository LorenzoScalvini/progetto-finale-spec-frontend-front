import { useState, useEffect } from "react";
import axios from "axios";

export const useCoffeeLogic = () => {
  const [coffees, setCoffees] = useState([]);

  let storedFavorites = localStorage.getItem("favoriteCoffees");
  let initialFavorites = [];

  if (storedFavorites) {
    try {
      initialFavorites = JSON.parse(storedFavorites);
    } catch (e) {
      initialFavorites = [];
    }
  }

  const [favorites, setFavorites] = useState(initialFavorites);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchCoffees = async () => {
      try {
        setLoading(true);
        const response = await axios.get(baseUrl + "/coffees");

        if (response.data && response.data.success) {
          setCoffees(response.data.coffees);
        } else {
          setCoffees(response.data);
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Error loading coffees");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCoffees();
  }, [baseUrl]);

  const toggleFavorite = (id) => {
    let newFavorites = [];

    if (favorites.includes(id)) {
      newFavorites = favorites.filter(function (favId) {
        return favId !== id;
      });
    } else {
      newFavorites = favorites.concat([id]);
    }

    localStorage.setItem("favoriteCoffees", JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const getCoffeeById = async (id) => {
    try {
      const response = await axios.get(baseUrl + "/coffees/" + id);
      let coffeeData;

      if (response.data && response.data.success) {
        coffeeData = response.data.coffee;
      } else {
        coffeeData = response.data;
      }

      if (!coffeeData) {
        throw new Error("Coffee not found");
      }

      return coffeeData;
    } catch (err) {
      let errorMessage;

      if (err.response && err.response.status === 404) {
        errorMessage = "Coffee not found";
      } else if (
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
        errorMessage = err.response.data.message;
      } else {
        errorMessage = "Error loading coffee";
      }

      throw new Error(errorMessage);
    }
  };

  return {
    coffees: coffees,
    favorites: favorites,
    loading: loading,
    error: error,
    toggleFavorite: toggleFavorite,
    getCoffeeById: getCoffeeById,
  };
};
