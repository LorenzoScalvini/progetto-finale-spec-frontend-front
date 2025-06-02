import React, { useState, useEffect } from "react";
import { useCoffee } from "../../contexts/CoffeeContext";

export default function CoffeeComparison() {
  const { coffees, getCoffeeById } = useCoffee();
  const [firstId, setFirstId] = useState("");
  const [secondId, setSecondId] = useState("");
  const [coffeeA, setCoffeeA] = useState(null);
  const [coffeeB, setCoffeeB] = useState(null);

  useEffect(() => {
    if (firstId) {
      getCoffeeById(parseInt(firstId)).then(setCoffeeA);
    } else {
      setCoffeeA(null);
    }
  }, [firstId, getCoffeeById]);

  useEffect(() => {
    if (secondId) {
      getCoffeeById(parseInt(secondId)).then(setCoffeeB);
    } else {
      setCoffeeB(null);
    }
  }, [secondId, getCoffeeById]);

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
            onChange={(e) => setFirstId(e.target.value)}
            className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            aria-label="Seleziona il primo caffè"
          >
            <option value="">Seleziona</option>
            {coffees.map((coffee) => (
              <option key={coffee.id} value={coffee.id}>
                {coffee.title}
              </option>
            ))}
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
            onChange={(e) => setSecondId(e.target.value)}
            className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            aria-label="Seleziona il secondo caffè"
          >
            <option value="">Seleziona</option>
            {coffees.map((coffee) => (
              <option key={coffee.id} value={coffee.id}>
                {coffee.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {coffeeA && coffeeB && (
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

          <div className="space-y-6">
            <div>
              <h4 className="text-green-700 font-semibold mb-1">Categoria</h4>
              <div className="flex justify-between bg-green-50 border border-green-200 rounded p-3">
                <span>{coffeeA.category || "-"}</span>
                <span>{coffeeB.category || "-"}</span>
              </div>
            </div>

            <div>
              <h4 className="text-green-700 font-semibold mb-1">Origine</h4>
              <div className="flex justify-between bg-green-50 border border-green-200 rounded p-3">
                <span>{coffeeA.origin || "-"}</span>
                <span>{coffeeB.origin || "-"}</span>
              </div>
            </div>

            <div>
              <h4 className="text-green-700 font-semibold mb-1">Tostatura</h4>
              <div className="flex justify-between bg-green-50 border border-green-200 rounded p-3">
                <span>{coffeeA.roastLevel || "-"}</span>
                <span>{coffeeB.roastLevel || "-"}</span>
              </div>
            </div>

            <div>
              <h4 className="text-green-700 font-semibold mb-1">Aromaticità</h4>
              <div className="flex justify-between bg-green-50 border border-green-200 rounded p-3">
                <span>{coffeeA.flavor ? coffeeA.flavor.join(", ") : "-"}</span>
                <span>{coffeeB.flavor ? coffeeB.flavor.join(", ") : "-"}</span>
              </div>
            </div>

            <div>
              <h4 className="text-green-700 font-semibold mb-1">Acidità</h4>
              <div className="flex justify-between bg-green-50 border border-green-200 rounded p-3">
                <span>{coffeeA.acidity ?? "-"}</span>
                <span>{coffeeB.acidity ?? "-"}</span>
              </div>
            </div>

            <div>
              <h4 className="text-green-700 font-semibold mb-1">Corpo</h4>
              <div className="flex justify-between bg-green-50 border border-green-200 rounded p-3">
                <span>{coffeeA.body ?? "-"}</span>
                <span>{coffeeB.body ?? "-"}</span>
              </div>
            </div>

            <div>
              <h4 className="text-green-700 font-semibold mb-1">Prezzo</h4>
              <div className="flex justify-between bg-green-50 border border-green-200 rounded p-3">
                <span>
                  {coffeeA.price != null
                    ? `€ ${coffeeA.price.toFixed(2)}`
                    : "-"}
                </span>
                <span>
                  {coffeeB.price != null
                    ? `€ ${coffeeB.price.toFixed(2)}`
                    : "-"}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-green-700 font-semibold mb-1">Confezione</h4>
              <div className="flex justify-between bg-green-50 border border-green-200 rounded p-3">
                <span>{coffeeA.packaging || "-"}</span>
                <span>{coffeeB.packaging || "-"}</span>
              </div>
            </div>

            <div>
              <h4 className="text-green-700 font-semibold mb-1">Biologico</h4>
              <div className="flex justify-between bg-green-50 border border-green-200 rounded p-3">
                <span>{coffeeA.organic ? "Sì" : "No"}</span>
                <span>{coffeeB.organic ? "Sì" : "No"}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
