   //Получение всех категорий: `/categories/all`
    // const getAllCategories = () => {
    //     axios.get('http://localhost:3333/categories/all')
    //     .then(response => {
    //         this.setState({categories: response.data})
    //     })
    //     .catch(error => {
    //         console.error('There was an error fetching the categories!',error)
    //     })
    // }

    //Получение продуктов по категории: `/categories/:id`
    // const getOneCategorie = () => {
    //     axios.get(`http://localhost:3333/categories/${categoryId}`)
    //     .then(response => {
    //         this.setState({products: response.data})
    //     })
    //     .catch(error => {
    //         console.error('There was an error fetching the products!',error)
    //     })
    // }

    // Получение всех продуктов**: `/products/all`
    // const getAllProducts = () => {
    //     axios.get('http://localhost:3333/products/all')
    //     .then(response => {
    //         this.setState({products: response.data})
    //     })
    //     .catch(error => {
    //         console.error('There was an error fetching the products!',error)
    //     })
    // }

    //Получение продукта по ID: `/products/:id`
    //  const getOneProduct = () => {
    //     axios.get(`http://localhost:3333/products/${productId}`)
    //     .then(response => {
    //         this.setState({product: response.data})
    //     })
    //     .catch(error => {
    //         console.error('There was an error fetching the product!',error)
    //     })
    // }

import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3333";

function CategoriesComp() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const getAllCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories/all`);
      setCategories(response.data);
    } catch (error) {
      console.error("There was an error fetching the categories!", error);
    }
  };

  const getOneCategory = async (categoryId) => {
    try {
      const response = await axios.get(`${API_URL}/categories/${categoryId}`);
      setProducts(response.data?.data || []);
      setSelectedCategoryId(categoryId);
    } catch (error) {
      console.error("There was an error fetching the products!", error);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <div>
      <h2>Категории</h2>

      <div>
        {categories.map((category) => (
          <button key={category.id} onClick={() => getOneCategory(category.id)}>
            <img
              src={`${API_URL}/${category.image}`}
              alt={category.title}
              width={120}
            />
            <p>{category.title}</p>
          </button>
        ))}
      </div>

      {selectedCategoryId && (
        <div>
          <h3>Товары категории #{selectedCategoryId}</h3>
          {products.map((product) => (
            <div key={product.id}>{product.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoriesComp;
