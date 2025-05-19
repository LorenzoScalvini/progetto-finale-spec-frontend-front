import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  ArrowPathIcon,
  ScaleIcon,
  TrophyIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ArrowsRightLeftIcon,
  SparklesIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import styles from "./CoffeeComparison.module.css";
import { useCoffee } from "../../contexts/CoffeeContext";

export default function CoffeeComparison() {
  const navigate = useNavigate();
  const { coffees: allCoffees, getCoffeeById } = useCoffee();

  const [coffees, setCoffees] = useState([null, null]);
  const [loading, setLoading] = useState({
    first: false,
    second: false,
  });
  const [error, setError] = useState({});

  // Load details for a specific coffee
  const fetchCoffee = async (id, position) => {
    if (!id) return;

    setLoading((prev) => ({ ...prev, [position]: true }));
    setError((prev) => ({ ...prev, [position]: undefined }));

    try {
      const coffee = await getCoffeeById(id);
      setCoffees((prev) => {
        const newCoffees = [...prev];
        newCoffees[position === "first" ? 0 : 1] = coffee;
        return newCoffees;
      });
    } catch (err) {
      setError((prev) => ({
        ...prev,
        [position]: err instanceof Error ? err.message : "Errore sconosciuto",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [position]: false }));
    }
  };

  const handleSelect = (position, id) => {
    const numId = id ? parseInt(id) : null;
    setCoffees((prev) => {
      const newCoffees = [...prev];
      newCoffees[position === "first" ? 0 : 1] = numId ? null : null;
      return newCoffees;
    });
    if (numId) fetchCoffee(numId, position);
  };

  const resetComparison = () => setCoffees([null, null]);

  // Comparison configuration (memoized)
  const comparisonItems = useMemo(
    () => [
      {
        label: "Categoria",
        value: (c) => c.category,
        icon: <ScaleIcon className="icon" width={18} />,
      },
      {
        label: "Origine",
        value: (c) => c.origin,
        icon: <SparklesIcon className="icon" width={18} />,
      },
      {
        label: "Livello di tostatura",
        value: (c) => c.roastLevel,
        icon: <ClockIcon className="icon" width={18} />,
      },
      {
        label: "Profilo aromatico",
        value: (c) => c.flavor.join(", "),
        icon: <TrophyIcon className="icon" width={18} />,
      },
      {
        label: "Acidità",
        value: (c) => `${c.acidity}/10`,
        isNumeric: true,
        icon: <ArrowTrendingUpIcon className="icon" width={18} />,
      },
      {
        label: "Corpo",
        value: (c) => `${c.body}/10`,
        isNumeric: true,
        icon: <ArrowTrendingDownIcon className="icon" width={18} />,
      },
      {
        label: "Prezzo",
        value: (c) =>
          new Intl.NumberFormat("it-IT", {
            style: "currency",
            currency: "EUR",
          }).format(c.price),
        isNumeric: true,
        icon: <ScaleIcon className="icon" width={18} />,
      },
      {
        label: "Confezione",
        value: (c) => c.packaging,
        icon: <SparklesIcon className="icon" width={18} />,
      },
      {
        label: "Biologico",
        value: (c) => (c.organic ? "Sì" : "No"),
        icon: <TrophyIcon className="icon" width={18} />,
      },
    ],
    []
  );

  // Comparison logic
  const getComparisonResult = (a, b, item) => {
    const valA = item.value(a);
    const valB = item.value(b);

    if (
      item.isNumeric &&
      typeof valA === "string" &&
      typeof valB === "string"
    ) {
      const numA = parseFloat(valA);
      const numB = parseFloat(valB);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA > numB ? "higher" : numA < numB ? "lower" : "equal";
      }
    }
    return valA === valB ? "equal" : "different";
  };

  // Get appropriate icon for comparison result
  const getResultIcon = (result) => {
    switch (result) {
      case "higher":
        return <ArrowTrendingUpIcon width={16} />;
      case "lower":
        return <ArrowTrendingDownIcon width={16} />;
      case "equal":
        return <ArrowsRightLeftIcon width={16} />;
      default:
        return <SparklesIcon width={16} />;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>
          <ScaleIcon width={24} />
          Confronto Caffè
        </h1>
        <div className={styles.actions}>
          <button onClick={() => navigate("/")}>
            <HomeIcon width={18} />
            Torna al Menu
          </button>
          <button
            onClick={resetComparison}
            disabled={!coffees[0] && !coffees[1]}
            aria-label="Resetta il confronto"
          >
            <ArrowPathIcon width={18} />
            Resetta
          </button>
        </div>
      </header>

      <div className={styles.selectorContainer}>
        {["first", "second"].map((position) => (
          <div key={position} className={styles.selector}>
            <label>
              <TrophyIcon width={18} />
              {position === "first" ? "Primo" : "Secondo"} Caffè
            </label>
            <select
              value={coffees[position === "first" ? 0 : 1]?.id || ""}
              onChange={(e) => handleSelect(position, e.target.value)}
              aria-label={`Seleziona ${
                position === "first" ? "primo" : "secondo"
              } caffè`}
            >
              <option value="">Seleziona caffè</option>
              {allCoffees.map((coffee) => (
                <option key={coffee.id} value={coffee.id}>
                  {coffee.title}
                </option>
              ))}
            </select>
            {loading[position] && (
              <span className={styles.loadingIndicator}>
                <ClockIcon width={16} />
                Caricamento...
              </span>
            )}
            {error[position] && (
              <span className={styles.error}>
                <ExclamationTriangleIcon width={16} />
                {error[position]}
              </span>
            )}
          </div>
        ))}
      </div>

      {coffees[0] && coffees[1] && (
        <div className={styles.comparison}>
          <div className={styles.comparisonGrid}>
            <div className={styles.gridHeader}>
              <ScaleIcon width={18} />
              Proprietà
            </div>
            <div className={styles.gridHeader}>
              <TrophyIcon width={18} />
              {coffees[0].title}
            </div>
            <div className={styles.gridHeader}>
              <ArrowsRightLeftIcon width={18} />
              Confronto
            </div>
            <div className={styles.gridHeader}>
              <TrophyIcon width={18} />
              {coffees[1].title}
            </div>

            {comparisonItems.map((item, index) => {
              const result = getComparisonResult(coffees[0], coffees[1], item);
              return (
                <React.Fragment key={index}>
                  <div className={styles.propertyLabel}>
                    {item.icon}
                    {item.label}
                  </div>
                  <div>{item.value(coffees[0])}</div>
                  <div className={styles[result]}>
                    {getResultIcon(result)}
                    {result === "higher"
                      ? "maggiore"
                      : result === "lower"
                      ? "minore"
                      : result === "equal"
                      ? "uguale"
                      : "differente"}
                  </div>
                  <div>{item.value(coffees[1])}</div>
                </React.Fragment>
              );
            })}
          </div>

          <div className={styles.visualComparison}>
            <h3>
              <SparklesIcon width={24} />
              Confronto Visivo
            </h3>
            <div className={styles.coffeeCards}>
              {coffees.map((coffee, i) => (
                <div key={i} className={styles.coffeeCard}>
                  <img
                    src={
                      coffee?.imageUrl ||
                      "https://placehold.co/300x200?text=Caffè"
                    }
                    alt={coffee?.title}
                    loading="lazy"
                  />
                  <h4>{coffee?.title}</h4>
                  <p>{coffee?.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
