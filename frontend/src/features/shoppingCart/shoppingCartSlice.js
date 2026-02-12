import { createSlice } from "@reduxjs/toolkit";

//Определяет цену за 1 штуку:
const getUnitPrice = (item) => {
  const hasDiscount =
    item.discont_price !== null &&
    item.discont_price !== undefined &&
    Number(item.discont_price) < Number(item.price);

  return hasDiscount ? Number(item.discont_price) : Number(item.price); // если есть валидная скидка  -> берет discont_price, иначе берет price
};

const initialState = {
  items: [], // { id, title, image, price, discont_price, quantity, categoryId } items — массив товаров в корзине.
};

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.items.find((i) => i.id === product.id);   //addToCart ищет товар по id.
    
      if (existing) {
        existing.quantity += product.quantity || 1; //если уже есть -> увеличивает quantity
      } else { //если нет -> добавляет новый объект товара в items
        state.items.push({
          id: product.id,
          title: product.title,
          image: product.image,
          price: Number(product.price),
          discont_price:
            product.discont_price === null || product.discont_price === undefined
              ? null
              : Number(product.discont_price),
          categoryId: product.categoryId ?? null,
          quantity: product.quantity || 1,
        });
      }
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return;
      if (item.quantity > 1) item.quantity -= 1;
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = shoppingCartSlice.actions;

//selectCartItems -> вернуть весь массив товаров корзины
export const selectCartItems = (state) => state.shoppingCart.items;

//selectCartItemsCount -> общее количество единиц товаров (sum of quantity) число всех штук (для бейджа на иконке корзины)
export const selectCartItemsCount = (state) =>
  state.shoppingCart.items.reduce((sum, item) => sum + item.quantity, 0);

// selectCartTotal -> общая сумма корзины: unitPrice * quantity по каждому товару, затем суммируется
export const selectCartTotal = (state) =>
  state.shoppingCart.items.reduce((sum, item) => {
    return sum + getUnitPrice(item) * item.quantity;
  }, 0);

export default shoppingCartSlice.reducer;
