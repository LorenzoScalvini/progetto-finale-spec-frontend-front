import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./CoffeeDetail.module.css";

export default function CoffeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coffee, setCoffee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCoffee = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:3001/coffees/${id}`);

        const coffeeData = response.data.success
          ? response.data.coffee
          : response.data;
        if (!coffeeData?.id) throw new Error("Invalid coffee data");

        setCoffee(coffeeData);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Coffee not found");
        } else {
          setError(err.message || "Failed to load coffee");
        }
      } finally {
        setLoading(false);
      }
    };

    getCoffee();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading coffee details...</p>
      </div>
    );
  }

  if (error || !coffee) {
    return (
      <div className={styles.container}>
        <div className={styles.errorAlert}>
          <h3>{error ? "Error" : "Coffee Not Found"}</h3>
          <p>{error || "This coffee is not available"}</p>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(coffee.price);

  const flavorList = coffee.flavor.join(", ");

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        ← Back to Menu
      </button>

      <div className={styles.coffeeHeader}>
        <h1 className={styles.title}>Starbucks® {coffee.title}</h1>
        {coffee.organic && (
          <span className={styles.organicBadge}>★ Certified Organic</span>
        )}
      </div>

      <div className={styles.coffeeCard}>
        <div className={styles.imageWrapper}>
          <img
            src={coffee.imageUrl || "https://placehold.co/600x400?text=Coffee"}
            alt={coffee.title}
            className={styles.coffeeImage}
          />
        </div>

        <div className={styles.description}>
          <h3>Tasting Notes</h3>
          <p>{coffee.description}</p>
        </div>

        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Category:</span>
            <span className={styles.detailValue}>{coffee.category}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Origin:</span>
            <span className={styles.detailValue}>{coffee.origin}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Roast Level:</span>
            <span className={styles.detailValue}>{coffee.roastLevel}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Flavor Profile:</span>
            <span className={styles.detailValue}>{flavorList}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Acidity:</span>
            <span className={styles.detailValue}>{coffee.acidity}/10</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Body:</span>
            <span className={styles.detailValue}>{coffee.body}/10</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Price:</span>
            <span className={styles.detailValue}>{formattedPrice}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Packaging:</span>
            <span className={styles.detailValue}>{coffee.packaging}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
