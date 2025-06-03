// CoffeeContext.jsx
import { createContext, useContext } from "react";
import { useCoffeeLogic } from "../hooks/useCoffeeLogic";

const CoffeeContext = createContext();

export const CoffeeProvider = function (props) {
  const coffeeLogic = useCoffeeLogic();

  return (
    <CoffeeContext.Provider value={coffeeLogic}>
      {props.children}
    </CoffeeContext.Provider>
  );
};

export const useCoffee = function () {
  return useContext(CoffeeContext);
};
