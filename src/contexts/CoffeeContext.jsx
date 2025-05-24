import { createContext, useContext } from "react";
import { useCoffeeLogic } from "../hooks/useCoffeeLogic";

const CoffeeContext = createContext();

export const CoffeeProvider = ({ children }) => {
  const coffeeLogic = useCoffeeLogic();
  return (
    <CoffeeContext.Provider value={coffeeLogic}>
      {children}
    </CoffeeContext.Provider>
  );
};

export const useCoffee = () => {
  const context = useContext(CoffeeContext);
  if (!context) {
    throw new Error("useCoffee must be used within a CoffeeProvider");
  }
  return context;
};
