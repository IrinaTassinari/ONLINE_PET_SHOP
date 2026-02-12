import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../features/categories/categoriesThunks";
import style from './AllCategoriesPage.module.css'
import Breadcrumbs from "../../components/layout/Breadcrumbs/Breadcrumbs";

const API_URL = "http://localhost:3333";

function AllCategoriesPage() {
  const dispatch = useDispatch(); //получает функцию dispatch из Redux, чтобы отправлять actions/thunks в store

  // Берем из store:
  // list — массив категорий.
  // listStatus — статус загрузки (idle/loading/succeeded/failed).

  const { list, listStatus, listError } = useSelector((state) => state.categories);

  //При первом рендере, если статус idle, вызывается dispatch(fetchCategories())
  //Это делает запрос на /categories/all через thunk
  useEffect(() => {
    if (listStatus === "idle") dispatch(fetchCategories());
  }, [dispatch, listStatus]);

  return (
    <section className={`container ${style.wrapperAllCategories}`}>
      <Breadcrumbs />

      <div className={style.categoriesHeader}>
        <h1 className={style.titleCategories}>Categories</h1>
      </div>

      {listStatus === "loading" && <p>Loading...</p>}
      {listStatus === "failed" && <p>{listError || "Error loading categories"}</p>}

      {listStatus === "succeeded" && (
        <div className={style.categoriesList}>
          {list.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.id}`}
              className={style.categoryCard}
            >
              <img src={`${API_URL}/${category.image}`} alt={category.title} />
              <p className={style.categoryName}>{category.title}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default AllCategoriesPage;




