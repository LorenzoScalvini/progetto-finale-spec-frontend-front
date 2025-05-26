import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./CoffeeDetail.module.css";
import { useCoffee } from "../../contexts/CoffeeContext";

export default function CoffeeDetail() {
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
        if (!data?.id) throw new Error("Dati del caffè non validi");
        setCoffee(data);
      } catch (err) {
        setError(err.message || "Errore nel caricamento del caffè");
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
        <p>Caricamento dettagli caffè...</p>
      </div>
    );
  }

  if (error || !coffee) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h3>{error ? "Errore" : "Caffè non trovato"}</h3>
          <p>{error || "Questo caffè non è disponibile"}</p>
          <button onClick={() => navigate(-1)} className={styles.button}>
            Torna al Menù
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(coffee.price);

  const flavors = coffee.flavor.join(", ");

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.button}>
        ← Torna al Menù
      </button>

      <div className={styles.header}>
        <h1>{coffee.title}</h1>
        {coffee.organic && <span className={styles.badge}>★ Biologico</span>}
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
          <h3>Note di Degustazione</h3>
          <p>{coffee.description}</p>
        </div>

        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span>Categoria:</span>
            <span>{coffee.category}</span>
          </div>
          <div className={styles.detailItem}>
            <span>Origine:</span>
            <span>{coffee.origin}</span>
          </div>
          <div className={styles.detailItem}>
            <span>Livello di tostatura:</span>
            <span>{coffee.roastLevel}</span>
          </div>
          <div className={styles.detailItem}>
            <span>Profilo aromatico:</span>
            <span>{flavors}</span>
          </div>
          <div className={styles.detailItem}>
            <span>Acidità:</span>
            <span>{coffee.acidity}/10</span>
          </div>
          <div className={styles.detailItem}>
            <span>Corpo:</span>
            <span>{coffee.body}/10</span>
          </div>
          <div className={styles.detailItem}>
            <span>Prezzo:</span>
            <span>{formatPrice}</span>
          </div>
          <div className={styles.detailItem}>
            <span>Confezione:</span>
            <span>{coffee.packaging}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
