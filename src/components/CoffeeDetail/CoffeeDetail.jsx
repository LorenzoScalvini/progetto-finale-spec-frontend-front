import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./CoffeeDetail.module.css";

export default function CoffeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coffee, setCoffee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoffee = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:3001/coffees/${id}`);
        if (!response.ok) {
          throw new Error("Coffee not found");
        }

        const data = await response.json();
        const coffeeData = data.success ? data.coffee : data;

        if (!coffeeData?.id) {
          throw new Error("Invalid coffee data format");
        }

        setCoffee(coffeeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch coffee");
      } finally {
        setLoading(false);
      }
    };

    fetchCoffee();
  }, [id]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const formattedData = useMemo(() => {
    if (!coffee) return null;

    return {
      ...coffee,
      formattedPrice: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(coffee.price),
      flavorList: coffee.flavor.join(", "),
      formattedDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    };
  }, [coffee]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your Starbucks® coffee...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorAlert}>
          <h3>We're sorry</h3>
          <p>{error}</p>
          <button onClick={goBack} className={styles.backButton}>
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  if (!formattedData) {
    return (
      <div className={styles.container}>
        <div className={styles.errorAlert}>
          <h3>Coffee Not Found</h3>
          <p>This product is no longer available</p>
          <button onClick={goBack} className={styles.backButton}>
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button
        onClick={goBack}
        className={styles.backButton}
        aria-label="Go back to menu"
      >
        ← Back to Menu
      </button>

      <div className={styles.coffeeHeader}>
        <h1 className={styles.title}>Starbucks® {formattedData.title}</h1>
        {formattedData.organic && (
          <span className={styles.organicBadge}>★ Certified Organic</span>
        )}
      </div>

      <div className={styles.coffeeCard}>
        <div className={styles.imageWrapper}>
          <img
            src={
              formattedData.imageUrl ||
              "https://placehold.co/600x400?text=Starbucks+Coffee"
            }
            alt={`Starbucks ${formattedData.title}`}
            className={styles.coffeeImage}
            loading="lazy"
          />
        </div>

        <div className={styles.description}>
          <h3 className={styles.descriptionTitle}>Tasting Notes</h3>
          <p>{formattedData.description}</p>
        </div>

        <div className={styles.detailsGrid}>
          <DetailItem label="Category" value={formattedData.category} />
          <DetailItem label="Origin" value={formattedData.origin} />
          <DetailItem label="Roast Level" value={formattedData.roastLevel} />
          <DetailItem label="Flavor Profile" value={formattedData.flavorList} />
          <DetailItem label="Acidity" value={`${formattedData.acidity}/10`} />
          <DetailItem label="Body" value={`${formattedData.body}/10`} />
          <DetailItem label="Price" value={formattedData.formattedPrice} />
          <DetailItem label="Packaging" value={formattedData.packaging} />
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className={styles.detailItem}>
      <span className={styles.detailLabel}>{label}:</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  );
}
