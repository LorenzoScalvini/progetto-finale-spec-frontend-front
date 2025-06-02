import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-500 text-lg">Caricamento dettagli caffè...</p>
      </div>
    );
  }

  if (error || !coffee) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <h3 className="text-xl font-semibold text-red-600 mb-2">
          {error ? "Errore" : "Caffè non trovato"}
        </h3>
        <p className="mb-4 text-gray-700">
          {error || "Questo caffè non è disponibile"}
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Torna alla Home
        </button>
      </div>
    );
  }

  const formatPrice = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(coffee.price);

  const flavors = coffee.flavor?.join(", ") || "Non specificato";

  return (
    <div className="max-w-3xl mx-auto p-4">
      <button
        onClick={() => navigate("/")}
        className="mb-4 text-green-600 hover:text-green-800 font-medium"
      >
        ← Torna alla Home
      </button>

      <h1 className="text-2xl font-bold mb-2">{coffee.title}</h1>
      {coffee.organic && (
        <p className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mb-4 text-sm font-semibold">
          ★ Biologico
        </p>
      )}

      <img
        src={coffee.imageUrl || "/placeholder.jpg"}
        alt={coffee.title}
        width="300"
        height="300"
        className="w-72 h-72 object-cover rounded mb-6"
      />

      <h3 className="text-lg font-semibold mb-1">Note di Degustazione</h3>
      <p className="mb-6 text-gray-700">{coffee.description}</p>

      <h3 className="text-lg font-semibold mb-2">Dettagli</h3>
      <ul className="space-y-1 text-gray-800">
        <li>
          <strong>Categoria:</strong> {coffee.category}
        </li>
        <li>
          <strong>Origine:</strong> {coffee.origin}
        </li>
        <li>
          <strong>Livello di tostatura:</strong> {coffee.roastLevel}
        </li>
        <li>
          <strong>Profilo aromatico:</strong> {flavors}
        </li>
        <li>
          <strong>Acidità:</strong> {coffee.acidity}/10
        </li>
        <li>
          <strong>Corpo:</strong> {coffee.body}/10
        </li>
        <li>
          <strong>Prezzo:</strong> {formatPrice}
        </li>
        <li>
          <strong>Confezione:</strong> {coffee.packaging}
        </li>
      </ul>
    </div>
  );
}
