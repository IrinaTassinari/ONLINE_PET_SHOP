// Импортируем Link для навигации,
// useLocation - чтобы получить текущий URL,
import { Link, useLocation } from "react-router-dom";
// useSelector нужен для получения данных из Redux store
import { useSelector } from "react-redux";
import style from "./Breadcrumbs.module.css";

/**
 *Входные пропсы- productTitle и productCategoryId приходят с OneProductPage.
    - productTitle нужен, чтобы последняя крошка была не 123, а название товара. productTitle — название товара (для /products/:id)
    - productCategoryId нужен, чтобы понять, к какой категории относится товар.
 */


//в компоненте два return- Есть 2 режима рендера:
//1) режим товара (/products/:id) — специальная цепочка: Main -> Categories -> <category> -> <product></product>
//2) Все остальные страницы — универсальная логика через pathnames.map(...).

function Breadcrumbs({ productTitle = "", productCategoryId = null }) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean); //Берёт текущий путь

  const categories = useSelector((state) => state.categories.list || []); //categories.list — список категорий
  const currentCategory = useSelector((state) => state.categories.current);//categories.current — текущая открытая категория

 
  const isProductPage = pathnames[0] === "products" && pathnames.length === 2;
  const productIdFromUrl = Number(pathnames[1]);

  //Пытается найти категорию товара в общем списке categories по productCategoryId если productCategoryId не null/undefined
  const categoryFromProduct =
    productCategoryId != null
      ? categories.find((c) => c.id === Number(productCategoryId)) || null
      : null;

  //Выбирает итоговую категорию, которую показывать в breadcrumbs
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

  //Это функция, которая решает, какой текст показать в каждой крошке
  //segment — текущая часть URL ("categories", "sales", "3" и т.д.)
// index — позиция сегмента в пути
// вспомогательная функция - Она нужна только для универсального режима
  const getBreadcrumbName = (segment, index) => {
    if (segment === "categories") return "Categories";
    if (segment === "products") return "Products";
    if (segment === "sales") return "Sales";
    if (segment === "cart") return "Shopping cart";

    //Для страницы категории /categories/:id:
    if (pathnames[0] === "categories" && index === 1) {
      if (currentCategory?.title && Number(currentCategory.id) === Number(segment)) {
        return currentCategory.title;
      }
      const category = categories.find((c) => c.id === Number(segment));
      if (category) return category.title;
    }

    return segment; //Если ничего не подошло - показывает исходный сегмент как есть (например число 3)
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
