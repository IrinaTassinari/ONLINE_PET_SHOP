import './App.css'
import Header from './components/layout/Header/Header'
import AppRoutes from './AppRoutes'
import Footer from './components/layout/Footer/Footer'
import ScrollToTopButton from './components/ui/ScrollToTopButton/ScrollToTopButton'


function App() {

  return (
    <>
    <Header/>
      <AppRoutes/>
    <Footer/>
    <ScrollToTopButton/>
    </>
  )
}

export default App
