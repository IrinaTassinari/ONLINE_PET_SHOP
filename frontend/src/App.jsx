import "./App.css";
import Header from "./components/layout/Header/Header";
import AppRoutes from "./AppRoutes";
import Footer from "./components/layout/Footer/Footer";
import ScrollToTopButton from "./components/ui/ScrollToTopButton/ScrollToTopButton";
import ScrollToTop from "./utils/ScrollToTop";

function App() {
  return (
    <div className="app">
      <Header />
      <ScrollToTop />
      <AppRoutes />
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
export default App;
