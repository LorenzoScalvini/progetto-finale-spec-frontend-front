import React, { useState, useEffect } from "react";
import { useCoffee } from "../../contexts/CoffeeContext";

function CoffeeComparison() {
  const coffeeContext = useCoffee();
  const coffees = coffeeContext.coffees;
  const getCoffeeById = coffeeContext.getCoffeeById;

  const [firstId, setFirstId] = useState("");
  const [secondId, setSecondId] = useState("");
  const [coffeeA, setCoffeeA] = useState(null);
  const [coffeeB, setCoffeeB] = useState(null);

  useEffect(
    function () {
      if (firstId !== "") {
        getCoffeeById(parseInt(firstId)).then(function (result) {
          setCoffeeA(result);
        });
      } else {
        setCoffeeA(null);
      }
    },
    [firstId, getCoffeeById]
  );

  useEffect(
    function () {
      if (secondId !== "") {
        getCoffeeById(parseInt(secondId)).then(function (result) {
          setCoffeeB(result);
        });
      } else {
        setCoffeeB(null);
      }
    },
    [secondId, getCoffeeById]
  );

  function handleFirstChange(event) {
    setFirstId(event.target.value);
  }

  function handleSecondChange(event) {
    setSecondId(event.target.value);
  }

  function formatPrice(price) {
    if (price != null) {
      return "€ " + price.toFixed(2);
    } else {
      return "-";
    }
  }

  function renderValue(value) {
    if (value !== undefined && value !== null && value !== "") {
      return value;
    } else {
      return "-";
    }
  }

  function renderFlavor(flavors) {
    if (Array.isArray(flavors) && flavors.length > 0) {
      return flavors.join(", ");
    } else {
      return "-";
    }
  }

  function renderYesNo(flag) {
    if (flag === true) {
      return "Sì";
    } else {
      return "No";
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h2 className="text-xl font-semibold text-green-700 mb-6">
        Confronta due caffè
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <label
            htmlFor="firstCoffee"
            className="block text-green-700 font-medium mb-1"
          >
            Primo caffè
          </label>
          <select
            id="firstCoffee"
            value={firstId}
            onChange={handleFirstChange}
            className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            aria-label="Seleziona il primo caffè"
          >
            <option value="">Seleziona</option>
            {coffees.map(function (coffee) {
              return (
                <option key={coffee.id} value={coffee.id}>
                  {coffee.title}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex-1">
          <label
            htmlFor="secondCoffee"
            className="block text-green-700 font-medium mb-1"
          >
            Secondo caffè
          </label>
          <select
            id="secondCoffee"
            value={secondId}
            onChange={handleSecondChange}
            className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            aria-label="Seleziona il secondo caffè"
          >
            <option value="">Seleziona</option>
            {coffees.map(function (coffee) {
              return (
                <option key={coffee.id} value={coffee.id}>
                  {coffee.title}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {coffeeA !== null && coffeeB !== null && (
        <>
          <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col items-center w-1/2 text-left">
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                {coffeeA.title}
              </h3>
              <img
                src={coffeeA.imageUrl || "/placeholder.jpg"}
                alt={coffeeA.title}
                width={200}
                height={200}
                className="rounded shadow-sm object-cover border border-green-200"
              />
            </div>

            <div className="flex flex-col items-center w-1/2 text-right">
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                {coffeeB.title}
              </h3>
              <img
                src={coffeeB.imageUrl || "/placeholder.jpg"}
                alt={coffeeB.title}
                width={200}
                height={200}
                className="rounded shadow-sm object-cover border border-green-200"
              />
            </div>
          </div>

          {[
            { label: "Categoria", key: "category" },
            { label: "Origine", key: "origin" },
            { label: "Tostatura", key: "roastLevel" },
            { label: "Aromaticità", key: "flavor", custom: renderFlavor },
            { label: "Acidità", key: "acidity" },
            { label: "Corpo", key: "body" },
            { label: "Prezzo", key: "price", custom: formatPrice },
            { label: "Confezione", key: "packaging" },
            { label: "Biologico", key: "organic", custom: renderYesNo },
          ].map(function (item, index) {
            const valueA = item.custom
              ? item.custom(coffeeA[item.key])
              : renderValue(coffeeA[item.key]);
            const valueB = item.custom
              ? item.custom(coffeeB[item.key])
              : renderValue(coffeeB[item.key]);

            return (
              <div key={index}>
                <h4 className="text-green-700 font-semibold mb-1">
                  {item.label}
                </h4>
                <div className="flex justify-between bg-green-50 border border-green-200 rounded p-3">
                  <span>{valueA}</span>
                  <span>{valueB}</span>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default CoffeeComparison;
