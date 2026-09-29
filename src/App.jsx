import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import ImovelListPage from './pages/ImovelListPage';
import ImovelDetailPage from './pages/ImovelDetailPage';
import MercadoPage from './pages/MercadoPage';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/imoveis" element={<ImovelListPage />} />
        <Route path="/imovel/:id" element={<ImovelDetailPage />} />
        <Route path="/mercado" element={<MercadoPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
