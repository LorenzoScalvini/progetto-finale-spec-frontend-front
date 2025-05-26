import { createContext, useContext } from "react";
import { useCoffeeLogic } from "../hooks/useCoffeeLogic";

const CoffeeContext = createContext();

// Componente Provider per gestire lo stato globale delle informazioni sui caffè
export const CoffeeProvider = ({ children }) => {
  const coffeeLogic = useCoffeeLogic();
  return (
    <CoffeeContext.Provider value={coffeeLogic}>
      {children}
    </CoffeeContext.Provider>
  );
};

// Custom hook per l'utilizzo del  CoffeeContext
export const useCoffee = () => {
  const context = useContext(CoffeeContext);
  if (!context) {
    throw new Error("useCoffee must be used within a CoffeeProvider");
  }
  return context;
};
