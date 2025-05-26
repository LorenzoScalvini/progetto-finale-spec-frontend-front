import React, { useState, useMemo, useCallback } from "react";
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

const RESULT_ICONS = {
  higher: <ArrowUpIcon className={styles.resultIcon} />,
  lower: <ArrowDownIcon className={styles.resultIcon} />,
  equal: <ArrowsRightLeftIcon className={styles.resultIcon} />,
  different: <SparklesIcon className={styles.resultIcon} />,
};

const compareValues = (coffeeA, coffeeB, item) => {
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

const COMPARISON_ITEMS = [
  {
    label: "Categoria",
    getValue: (coffee) => coffee.category,
    icon: <ScaleIcon className={styles.icon} />,
    description: "Categoria del caffè",
  },
  {
    label: "Origine",
    getValue: (coffee) => coffee.origin,
    icon: <MapPinIcon className={styles.icon} />,
    description: "Paese d'origine",
  },
  {
    label: "Tostatura",
    getValue: (coffee) => coffee.roastLevel,
    icon: <FireIcon className={styles.icon} />,
    description: "Intensità di tostatura",
  },
  {
    label: "Profilo aromatico",
    getValue: (coffee) => coffee.flavor?.join(", ") || "Non specificato",
    icon: <SparklesIcon className={styles.icon} />,
    description: "Note aromatiche",
  },
  {
    label: "Acidità",
    getValue: (coffee) => `${coffee.acidity}/10`,
    isNumeric: true,
    icon: <ArrowUpIcon className={styles.icon} />,
    description: "Livello di acidità",
  },
  {
    label: "Corpo",
    getValue: (coffee) => `${coffee.body}/10`,
    isNumeric: true,
    icon: <ArrowDownIcon className={styles.icon} />,
    description: "Intensità del corpo",
  },
  {
    label: "Prezzo",
    getValue: (coffee) =>
      new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
      }).format(coffee.price),
    isNumeric: true,
    icon: <CurrencyEuroIcon className={styles.icon} />,
    description: "Prezzo del prodotto",
  },
  {
    label: "Confezione",
    getValue: (coffee) => coffee.packaging,
    icon: <ArchiveBoxIcon className={styles.icon} />,
    description: "Tipo di confezione",
  },
  {
    label: "Biologico",
    getValue: (coffee) => (coffee.organic ? "Sì" : "No"),
    icon: <CheckBadgeIcon className={styles.icon} />,
    description: "Certificazione biologica",
  },
];

export default function CoffeeComparison() {
  const navigate = useNavigate();
  const { coffees, getCoffeeById } = useCoffee();
  const [selectedCoffees, setSelectedCoffees] = useState([null, null]);
  const [loading, setLoading] = useState({ first: false, second: false });
  const [errors, setErrors] = useState({});

  const loadCoffeeDetails = useCallback(
    async (coffeeId, position) => {
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
          [position]: error.message || "Errore nel caricamento dei dettagli",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, [position]: false }));
      }
    },
    [getCoffeeById]
  );

  const handleCoffeeSelect = useCallback(
    (position, selectedId) => {
      const id = selectedId ? parseInt(selectedId, 10) : null;
      setSelectedCoffees((prev) => {
        const newCoffees = [...prev];
        newCoffees[position === "first" ? 0 : 1] = null;
        return newCoffees;
      });

      if (id) loadCoffeeDetails(id, position);
    },
    [loadCoffeeDetails]
  );

  const resetComparison = () => {
    setSelectedCoffees([null, null]);
    setErrors({});
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>
          <ScaleIcon className={styles.headerIcon} />
          Confronto Caffè
        </h1>
        <div className={styles.actions}>
          <button
            onClick={() => navigate("/")}
            className={styles.button}
            aria-label="Torna alla pagina principale"
          >
            <HomeIcon className={styles.buttonIcon} />
            Torna alla Home
          </button>
          <button
            onClick={resetComparison}
            disabled={!selectedCoffees[0] && !selectedCoffees[1]}
            className={styles.button}
            aria-label="Azzera il confronto"
          >
            <ArrowPathIcon className={styles.buttonIcon} />
            Azzera
          </button>
        </div>
      </header>

      <div className={styles.selectorContainer}>
        {["first", "second"].map((position) => (
          <div key={position} className={styles.selector}>
            <label htmlFor={`selector-${position}`}>
              <TrophyIcon className={styles.selectorIcon} />
              {position === "first" ? "Primo" : "Secondo"} caffè da confrontare
            </label>

            <select
              id={`selector-${position}`}
              value={selectedCoffees[position === "first" ? 0 : 1]?.id || ""}
              onChange={(e) => handleCoffeeSelect(position, e.target.value)}
              className={styles.select}
              aria-label={`Seleziona ${
                position === "first" ? "primo" : "secondo"
              } caffè per il confronto`}
            >
              <option value="">-- Seleziona un caffè --</option>
              {coffees.map((coffee) => (
                <option key={coffee.id} value={coffee.id}>
                  {coffee.title}
                </option>
              ))}
            </select>

            {loading[position] && (
              <div className={styles.loading}>
                <ClockIcon className={styles.statusIcon} />
                <span>Caricamento dettagli...</span>
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
              <span>Proprietà</span>
            </div>
            <div className={styles.gridHeader}>
              <TrophyIcon className={styles.gridIcon} />
              <span>{selectedCoffees[0].title}</span>
            </div>
            <div className={styles.gridHeader}>
              <ArrowsRightLeftIcon className={styles.gridIcon} />
              <span>Confronto</span>
            </div>
            <div className={styles.gridHeader}>
              <TrophyIcon className={styles.gridIcon} />
              <span>{selectedCoffees[1].title}</span>
            </div>

            {COMPARISON_ITEMS.map((item, index) => {
              const result = compareValues(
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
                    {RESULT_ICONS[result]}
                    <span>
                      {result === "higher"
                        ? "maggiore"
                        : result === "lower"
                        ? "minore"
                        : result === "equal"
                        ? "uguale"
                        : "differente"}
                    </span>
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
              <span>Confronto visivo</span>
            </h3>

            <div className={styles.visualCards}>
              {selectedCoffees.map((coffee, index) => (
                <div key={`visual-${index}`} className={styles.visualCard}>
                  <div className={styles.imageContainer}>
                    <img
                      src={coffee?.imageUrl || "/placeholder.jpg"}
                      alt={`Caffè ${coffee?.title}`}
                      className={styles.image}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "/placeholder.jpg";
                        e.target.alt = "Immagine non disponibile";
                      }}
                    />
                  </div>

                  <div className={styles.cardContent}>
                    <h4>{coffee?.title}</h4>
                    <p>
                      {coffee?.description || "Nessuna descrizione disponibile"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
