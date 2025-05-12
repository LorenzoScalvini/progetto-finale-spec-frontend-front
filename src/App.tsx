import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CoffeePage from './pages/CoffeePage'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import Navbar from './components/Navbar/Navbar'

function App() {
  return (
    <>
    <Navbar logoSrc="/assets/starbucks-logo.png" />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/coffees/:id" element={<CoffeePage />} />
    </Routes>
    <ScrollToTop />
    </>
  )
}

export default App