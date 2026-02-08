import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../features/categories/categoriesThunks";
import style from './CategoriesComp.module.css'

const API_URL = "http://localhost:3333";

function CategoriesComp() {
  const dispatch = useDispatch();

  // Берем из store:
  // list — массив категорий.
  // listStatus — статус загрузки (idle/loading/succeeded/failed).

  const { list, listStatus } = useSelector((s) => s.categories);


  //При первом рендере, если статус idle, вызывается dispatch(fetchCategories())
  //Это делает запрос на /categories/all через thunk
  useEffect(() => {
    if (listStatus === "idle") dispatch(fetchCategories());
  }, [dispatch, listStatus]);

  return (
    <section className="container">
      <div className={style.categoriesHeader}>
        <h2 className={style.titleCategories}>Categories</h2>
        <span className={style.headerLine}></span>
        <Link className={style.linkToAllCateg} to="/categories">All categories</Link>
      </div>

      <div className={style.categoriesList}>
        {list.slice(0, 4).map((category) => (
          <Link key={category.id} to={`/categories/${category.id}`} className={style.categoryCard}>
            <img src={`${API_URL}/${category.image}`} alt={category.title} />
            <p className={style.categoryName}>{category.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
export default CategoriesComp;