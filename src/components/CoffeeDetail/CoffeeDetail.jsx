import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./CoffeeDetail.module.css";
import { useCoffee } from "../../contexts/CoffeeContext";

const CoffeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCoffeeById } = useCoffee();
  const [coffee, setCoffee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCoffee = async () => {
      try {
        const data = await getCoffeeById(id);
        if (!data?.id) throw new Error("Invalid coffee data");
        setCoffee(data);
      } catch (err) {
        setError(err.message || "Failed to load coffee");
      } finally {
        setLoading(false);
      }
    };
    loadCoffee();
  }, [id, getCoffeeById]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}></div>
        <p>Loading coffee details...</p>
      </div>
    );
  }

  if (error || !coffee) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h3>{error ? "Error" : "Coffee Not Found"}</h3>
          <p>{error || "This coffee is not available"}</p>
          <button onClick={() => navigate(-1)} className={styles.button}>
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(coffee.price);

  const flavors = coffee.flavor.join(", ");

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.button}>
        ← Back to Menu
      </button>

      <div className={styles.header}>
        <h1>{coffee.title}</h1>
        {coffee.organic && <span className={styles.badge}>★ Organic</span>}
      </div>

      <div className={styles.card}>
        <div className={styles.imageWrapper}>
          <img
            src={coffee.imageUrl || "/placeholder.jpg"}
            alt={coffee.title}
            className={styles.image}
          />
        </div>

        <div className={styles.description}>
          <h3>Tasting Notes</h3>
          <p>{coffee.description}</p>
        </div>

        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span>Category:</span>
            <span>{coffee.category}</span>
          </div>
          <div className={styles.detailItem}>
            <span>Origin:</span>
            <span>{coffee.origin}</span>
          </div>
          <div className={styles.detailItem}>
            <span>Roast Level:</span>
            <span>{coffee.roastLevel}</span>
          </div>
          <div className={styles.detailItem}>
            <span>Flavor Profile:</span>
            <span>{flavors}</span>
          </div>
          <div className={styles.detailItem}>
            <span>Acidity:</span>
            <span>{coffee.acidity}/10</span>
          </div>
          <div className={styles.detailItem}>
            <span>Body:</span>
            <span>{coffee.body}/10</span>
          </div>
          <div className={styles.detailItem}>
            <span>Price:</span>
            <span>{formatPrice}</span>
          </div>
          <div className={styles.detailItem}>
            <span>Packaging:</span>
            <span>{coffee.packaging}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeDetail;
