import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  ArrowPathIcon,
  ScaleIcon,
  TrophyIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowsRightLeftIcon,
  SparklesIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  FireIcon,
  CurrencyEuroIcon,
  ArchiveBoxIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import styles from "./CoffeeComparison.module.css";
import { useCoffee } from "../../contexts/CoffeeContext";

const CoffeeComparison = () => {
  const navigate = useNavigate();
  const { coffees, getCoffeeById } = useCoffee();
  const [selectedCoffees, setSelectedCoffees] = useState([null, null]);
  const [loading, setLoading] = useState({ first: false, second: false });
  const [errors, setErrors] = useState({});

  const loadCoffeeDetails = async (coffeeId, position) => {
    if (!coffeeId) return;

    setLoading((prev) => ({ ...prev, [position]: true }));
    setErrors((prev) => ({ ...prev, [position]: undefined }));

    try {
      const details = await getCoffeeById(coffeeId);
      setSelectedCoffees((prev) => {
        const newCoffees = [...prev];
        newCoffees[position === "first" ? 0 : 1] = details;
        return newCoffees;
      });
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [position]: error.message || "Error loading coffee details",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [position]: false }));
    }
  };

  const handleCoffeeSelect = (position, selectedId) => {
    const id = selectedId ? parseInt(selectedId, 10) : null;
    setSelectedCoffees((prev) => {
      const newCoffees = [...prev];
      newCoffees[position === "first" ? 0 : 1] = null;
      return newCoffees;
    });

    if (id) loadCoffeeDetails(id, position);
  };

  const resetComparison = () => {
    setSelectedCoffees([null, null]);
    setErrors({});
  };

  const comparisonItems = useMemo(
    () => [
      {
        label: "Category",
        getValue: (coffee) => coffee.category,
        icon: <ScaleIcon className={styles.icon} />,
        description: "Coffee category",
      },
      {
        label: "Origin",
        getValue: (coffee) => coffee.origin,
        icon: <MapPinIcon className={styles.icon} />,
        description: "Country of origin",
      },
      {
        label: "Roast Level",
        getValue: (coffee) => coffee.roastLevel,
        icon: <FireIcon className={styles.icon} />,
        description: "Roast intensity",
      },
      {
        label: "Flavor Profile",
        getValue: (coffee) => coffee.flavor?.join(", ") || "Not specified",
        icon: <SparklesIcon className={styles.icon} />,
        description: "Flavor notes",
      },
      {
        label: "Acidity",
        getValue: (coffee) => `${coffee.acidity}/10`,
        isNumeric: true,
        icon: <ArrowUpIcon className={styles.icon} />,
        description: "Acidity level",
      },
      {
        label: "Body",
        getValue: (coffee) => `${coffee.body}/10`,
        isNumeric: true,
        icon: <ArrowDownIcon className={styles.icon} />,
        description: "Body intensity",
      },
      {
        label: "Price",
        getValue: (coffee) =>
          new Intl.NumberFormat("it-IT", {
            style: "currency",
            currency: "EUR",
          }).format(coffee.price),
        isNumeric: true,
        icon: <CurrencyEuroIcon className={styles.icon} />,
        description: "Product price",
      },
      {
        label: "Packaging",
        getValue: (coffee) => coffee.packaging,
        icon: <ArchiveBoxIcon className={styles.icon} />,
        description: "Package type",
      },
      {
        label: "Organic",
        getValue: (coffee) => (coffee.organic ? "Yes" : "No"),
        icon: <CheckBadgeIcon className={styles.icon} />,
        description: "Organic certification",
      },
    ],
    []
  );

  const getComparisonResult = (coffeeA, coffeeB, item) => {
    const valueA = item.getValue(coffeeA);
    const valueB = item.getValue(coffeeB);

    if (
      item.isNumeric &&
      typeof valueA === "string" &&
      typeof valueB === "string"
    ) {
      const numA = parseFloat(valueA);
      const numB = parseFloat(valueB);

      if (!isNaN(numA) && !isNaN(numB)) {
        if (numA > numB) return "higher";
        if (numA < numB) return "lower";
        return "equal";
      }
    }

    return valueA === valueB ? "equal" : "different";
  };

  const getResultIcon = (result) => {
    const icons = {
      higher: <ArrowUpIcon className={styles.resultIcon} />,
      lower: <ArrowDownIcon className={styles.resultIcon} />,
      equal: <ArrowsRightLeftIcon className={styles.resultIcon} />,
      different: <SparklesIcon className={styles.resultIcon} />,
    };
    return icons[result] || icons.different;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>
          <ScaleIcon className={styles.headerIcon} />
          Coffee Comparison
        </h1>
        <div className={styles.actions}>
          <button
            onClick={() => navigate("/")}
            className={styles.button}
            aria-label="Return to main page"
          >
            <HomeIcon className={styles.buttonIcon} />
            Back to Main
          </button>
          <button
            onClick={resetComparison}
            disabled={!selectedCoffees[0] && !selectedCoffees[1]}
            className={styles.button}
            aria-label="Reset comparison"
          >
            <ArrowPathIcon className={styles.buttonIcon} />
            Reset
          </button>
        </div>
      </header>

      <div className={styles.selectorContainer}>
        {["first", "second"].map((position) => (
          <div key={position} className={styles.selector}>
            <label htmlFor={`selector-${position}`}>
              <TrophyIcon className={styles.selectorIcon} />
              {position === "first" ? "First" : "Second"} Coffee to Compare
            </label>

            <select
              id={`selector-${position}`}
              value={selectedCoffees[position === "first" ? 0 : 1]?.id || ""}
              onChange={(e) => handleCoffeeSelect(position, e.target.value)}
              className={styles.select}
              aria-label={`Select ${position} coffee for comparison`}
            >
              <option value="">-- Select a coffee --</option>
              {coffees.map((coffee) => (
                <option key={coffee.id} value={coffee.id}>
                  {coffee.title}
                </option>
              ))}
            </select>

            {loading[position] && (
              <div className={styles.loading}>
                <ClockIcon className={styles.statusIcon} />
                <span>Loading coffee details...</span>
              </div>
            )}

            {errors[position] && (
              <div className={styles.error} role="alert">
                <ExclamationTriangleIcon className={styles.statusIcon} />
                <span>{errors[position]}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedCoffees[0] && selectedCoffees[1] && (
        <div className={styles.comparison}>
          <div className={styles.comparisonGrid}>
            <div className={styles.gridHeader}>
              <ScaleIcon className={styles.gridIcon} />
              <span>Property</span>
            </div>
            <div className={styles.gridHeader}>
              <TrophyIcon className={styles.gridIcon} />
              <span>{selectedCoffees[0].title}</span>
            </div>
            <div className={styles.gridHeader}>
              <ArrowsRightLeftIcon className={styles.gridIcon} />
              <span>Comparison</span>
            </div>
            <div className={styles.gridHeader}>
              <TrophyIcon className={styles.gridIcon} />
              <span>{selectedCoffees[1].title}</span>
            </div>

            {comparisonItems.map((item, index) => {
              const result = getComparisonResult(
                selectedCoffees[0],
                selectedCoffees[1],
                item
              );

              return (
                <React.Fragment key={index}>
                  <div
                    className={styles.propertyLabel}
                    title={item.description}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <div className={styles.propertyValue}>
                    {item.getValue(selectedCoffees[0])}
                  </div>
                  <div className={`${styles.result} ${styles[result]}`}>
                    {getResultIcon(result)}
                    <span>{result}</span>
                  </div>
                  <div className={styles.propertyValue}>
                    {item.getValue(selectedCoffees[1])}
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          <div className={styles.visualComparison}>
            <h3>
              <SparklesIcon className={styles.visualIcon} />
              <span>Visual Comparison</span>
            </h3>

            <div className={styles.visualCards}>
              {selectedCoffees.map((coffee, index) => (
                <div key={`visual-${index}`} className={styles.visualCard}>
                  <div className={styles.imageContainer}>
                    <img
                      src={coffee?.imageUrl || "/placeholder.jpg"}
                      alt={`${coffee?.title} coffee`}
                      className={styles.image}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "/placeholder.jpg";
                        e.target.alt = "Image not available";
                      }}
                    />
                  </div>

                  <div className={styles.cardContent}>
                    <h4>{coffee?.title}</h4>
                    <p>{coffee?.description || "No description available"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoffeeComparison;
