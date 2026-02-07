import { Link } from "react-router-dom";
import Nav from "./Nav";
import CartIcon from "../../ui/CartIcon/CartIcon";
import style from "./Header.module.css";
import logo from "../../../assets/icons/logo.svg";
import { useState } from "react";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((open) => !open);
  };

  return (
    <header>
      <div className="container">
        <div className={style.headerContainer}>
          {/* Desktop */}
          <div className={style.desktopHeader}>
            <Link to="/" className={style.logo} aria-label="Go to homepage">
              <img src={logo} alt="Logo" />
            </Link>

            <Nav variant="desktop" />

            <Link to="/cart" className={style.cart} aria-label="Go to cart">
              <CartIcon />
            </Link>
          </div>

          {/* Mobile  */}
          {/* Если isMenuOpen === true, то вызовем toggleMenu()  */}
          <div className={style.mobileHeader}>
            <Link
              to="/"
              className={style.logoMobile}
              aria-label="Go to homepage"
            >
              <img src={logo} alt="Logo" />
            </Link>

            <button
              className={style.burger}
              onClick={toggleMenu}
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
            >
              <span className={style.burgerLine} />
              <span className={style.burgerLine} />
              <span className={style.burgerLine} />
            </button>

            <Link
              to="/cart"
              className={style.cartMobile}
              aria-label="Go to cart"
            >
              <CartIcon />
            </Link>
          </div>
        </div>
      </div>

      {/* Выпадающее меню */}
      <div className={`${style.mobileMenu} ${isMenuOpen ? style.mobileMenuActive : ""}`}>
        <Nav variant="mobile" />
      </div>

      {/* затемнение фона*/}
      {isMenuOpen && (
        <div className={style.backdrop} onClick={() => setIsMenuOpen(false)} />
      )}
      
    </header>
  );
}

export default Header;
