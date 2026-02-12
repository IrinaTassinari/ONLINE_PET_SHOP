// Импортируем Link для навигации,
// useLocation - чтобы получить текущий URL,
import { Link, useLocation } from "react-router-dom";
// useSelector нужен для получения данных из Redux store
import { useSelector } from "react-redux";
import style from "./Breadcrumbs.module.css";

/**
 *Входные пропсы- productTitle и productCategoryId приходят с OneProductPage.
    - productTitle нужен, чтобы последняя крошка была не 123, а название товара.
    - productCategoryId нужен, чтобы понять, к какой категории относится товар.
 */

function Breadcrumbs({ productTitle = "", productCategoryId = null }) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  const categories = useSelector((state) => state.categories.list || []);
  const currentCategory = useSelector((state) => state.categories.current);

  const isProductPage = pathnames[0] === "products" && pathnames.length === 2;
  const productIdFromUrl = Number(pathnames[1]);

  const categoryFromProduct =
    productCategoryId != null
      ? categories.find((c) => c.id === Number(productCategoryId)) || null
      : null;

  const resolvedCategory =
    categoryFromProduct ||
    (productCategoryId != null &&
    currentCategory &&
    Number(currentCategory.id) === Number(productCategoryId)
      ? currentCategory
      : null);

  if (isProductPage) {
    return (
      <nav className={style.breadcrumbs}>
        <Link to="/" className={style.crumb}>Main page</Link>

        {resolvedCategory ? (
          <>
            <Link to="/categories" className={style.crumb}>Categories</Link>
            <Link to={`/categories/${resolvedCategory.id}`} className={style.crumb}>
              {resolvedCategory.title}
            </Link>
          </>
        ) : (
          <Link to="/products" className={style.crumb}>Products</Link>
        )}

        <span className={`${style.crumb} ${style.crumbActive}`}>
          {productTitle || (Number.isFinite(productIdFromUrl) ? `Product #${productIdFromUrl}` : "Product")}
        </span>
      </nav>
    );
  }

  const getBreadcrumbName = (segment, index) => {
    if (segment === "categories") return "Categories";
    if (segment === "products") return "Products";
    if (segment === "sales") return "Sales";
    if (segment === "cart") return "Shopping cart";

    if (pathnames[0] === "categories" && index === 1) {
      if (currentCategory?.title && Number(currentCategory.id) === Number(segment)) {
        return currentCategory.title;
      }
      const category = categories.find((c) => c.id === Number(segment));
      if (category) return category.title;
    }

    return segment;
  };

  return (
    <nav className={style.breadcrumbs}>
      <Link
        to="/"
        className={`${style.crumb} ${pathnames.length === 0 ? style.crumbActive : ""}`}
      >
        Main page
      </Link>

      {pathnames.map((segment, index) => {
        const to = "/" + pathnames.slice(0, index + 1).join("/");
        const isLast = index === pathnames.length - 1;
        const label = getBreadcrumbName(segment, index);

        return isLast ? (
          <span key={to} className={`${style.crumb} ${style.crumbActive}`}>
            {label}
          </span>
        ) : (
          <Link key={to} to={to} className={style.crumb}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;
