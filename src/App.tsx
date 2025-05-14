import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CoffeePage from './pages/CoffeePage'
import ComparatorPage from './pages/ComparatorPage'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import Navbar from './components/Navbar/Navbar'
import './App.css';

function App() {
  return (
    <>
    <Navbar logoSrc="/assets/starbucks-logo.png" />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/coffees/:id" element={<CoffeePage />} />
      <Route path="/coffeecomparator" element={<ComparatorPage />} />
    </Routes>
    <ScrollToTop />
    </>
  )
}

export default App