// Импортируем Link для навигации,
// useLocation - чтобы получить текущий URL,
// useParams - чтобы получить параметры маршрута (например id)
// import { Link, useLocation,useParams } from "react-router-dom";

// // useSelector нужен для получения данных из Redux store
// import { useSelector } from "react-redux";

// // Модульные стили для хлебных крошек
// import style from "./Breadcrumbs.module.css";

// function Breadcrumbs() {
//   // Получаем объект location
//   // В нем хранится текущий путь, например: "/categories/3"
//   const location = useLocation();

//   // Получаем параметры маршрута
//   // Например для /categories/3 -> { id: "3" }
//   const params = useParams();

//   // Забираем список категорий из Redux
//   // Нужен, чтобы по id категории показать её название
//   const categories = useSelector((state) => state.categories.list);

//   // Забираем список товаров (может пригодиться для страниц списков)
//   const products = useSelector(state => state.products.items);

//   // Текущий товар (используется на странице товара)
//   // Нужен, чтобы по id товара показать его название
//   //const currentProduct = useSelector(state => state.products.current);
//   const currentProduct = useSelector((state) => state.products?.current ?? null);

  
//   // Берём текущий pathname и разбиваем его на части
//   // "/categories/3" -> ["categories", "3"]
//   // filter(Boolean) убирает пустые строки
//   const pathnames = location.pathname.split("/").filter(Boolean);

//   /**
//    * Функция определяет, какой текст нужно показать
//    * в хлебных крошках для каждого сегмента URL
//    */
//   const getBreadcrumbName = (segment) => {
//     // Если сегмент - это название маршрута,
//     // возвращаем человекочитаемый текст
//     if (segment === "categories") return "Categories";
//     if (segment === "products") return "Products";
//     if (segment === "sales") return "Sales";

//     // Если сегмент - это id категории
//     // и категории уже загружены из backend
//     if (params.id && categories.length) {
//       const category = categories.find((c) => c.id === Number(segment));

//       // Если нашли категорию - возвращаем её title
//       if (category) return category.title;
//     }

//     // Если сегмент - это id товара
//     // и текущий товар загружен
//     if (currentProduct && currentProduct.id === Number(segment)) {
//       return currentProduct.title;
//     }

//     // Если ничего не подошло - возвращаем сегмент как есть
//     // (запасной вариант)
//     return segment;
//   };

//   return (
//     // nav - семантический тег для навигации
//     <nav className={style.breadcrumbs}>
//       {/* Первая крошка всегда ведёт на главную страницу */}
//       <Link 
//         to="/"
//         className={`${style.crumb} ${pathnames.length === 0 ? style.crumbActive : ""}`}
//       >Main page</Link>

//       {pathnames.map((segment, index) => {
//         // Формируем ссылку для каждой крошки
//         // Например:
//         // index 0 -> /categories
//         // index 1 -> /categories/3
//         const to = "/" + pathnames.slice(0, index + 1).join("/");

//         // Последний элемент - это текущая страница
//         // Он НЕ должен быть ссылкой
//         const isLast = index === pathnames.length - 1;

//         const label = getBreadcrumbName(segment);

//         return isLast ? (
//           // Последняя крошка - просто текст
//           <span key={to} className={`${style.crumb} ${style.crumbActive}`}>{label}</span>
//         ) : (
//           // Все предыдущие - ссылки
//           <Link key={to} to={to} className={style.crumb}>
//            {label}
//           </Link>
//         );
//       })}
//     </nav>
//   );
// }

// export default Breadcrumbs;





// Импортируем Link для навигации,
// useLocation - чтобы получить текущий URL,
import { Link, useLocation } from "react-router-dom";
// useSelector нужен для получения данных из Redux store
import { useSelector } from "react-redux";
import style from "./Breadcrumbs.module.css";

/**
 * 
 *Входные пропсы- productTitle и productCategoryId приходят с OneProductPage.
    - productTitle нужен, чтобы последняя крошка была не 123, а название товара.
    - productCategoryId нужен, чтобы понять, к какой категории относится товар.
 * 
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
