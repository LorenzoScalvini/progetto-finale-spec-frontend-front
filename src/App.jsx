import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CoffeePage from "./pages/CoffeePage";
import ComparatorPage from "./pages/ComparatorPage";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import CoffeeFav from "./pages/CoffeeFav";
import Footer from "./components/Footer/Footer";
import { CoffeeProvider } from "./contexts/CoffeeContext";

function App() {
  return (
    <CoffeeProvider>
      <Navbar logoSrc="/assets/starbucks-logo.png" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coffees/:id" element={<CoffeePage />} />
        <Route path="/coffeecomparator" element={<ComparatorPage />} />
        <Route path="/favorites" element={<CoffeeFav />} />
      </Routes>
      <Footer />
    </CoffeeProvider>
  );
}

export default App;
