import { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HomePage } from './pages/HomePage';
import Header from './widgets/Header';
import { AboutPage } from './pages/AboutPage';
import Catalog from './pages/catalog/Catalog';
import TestPage from './pages/test/TestPage';
import { LoadingFallback } from './components/LoadingFallback';

function App() {
  const path = window.location.pathname;

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} />
      <Suspense fallback={<div className="h-16 bg-white border-b border-stone-200" />}>
        <Header />
      </Suspense>
      <main>
        <Suspense fallback={<LoadingFallback />}>
          {path === '/about' ? (
            <AboutPage />
          ) : path === '/catalog' || path === '/products' ? (
            <Catalog />
          ) : path === '/test' ? (
            <TestPage />
          ) : (
            <HomePage />
          )}
        </Suspense>
      </main>
    </>
  );
}

export default App;
