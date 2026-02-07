import { NavLink } from "react-router-dom";
import style from './Nav.module.css'

function Nav() {
  const linkClass = ({ isActive }) => (isActive ? style.active_link : style.link);

  return (
    <nav className={style.navigation}>
      <ul className={style.list}>
        <li>
          <NavLink to="/" className={linkClass}>
            Main Page
          </NavLink>
        </li>
        <li>
          <NavLink to="/categories" className={linkClass}>
            Categories
          </NavLink>
        </li>
        <li>
          <NavLink to="/products" className={linkClass}>
            All products
          </NavLink>
        </li>
        <li>
          <NavLink to="/sales" className={linkClass}>
            All sales
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;




