export const SORT_VALUES = {
  DEFAULT: "default",
  PRICE_ASC: "price_asc",
  PRICE_DESC: "price_desc",
  TITLE_ASC: "title_asc",
  TITLE_DESC: "title_desc",
};

export function hasDiscount(product) {
  return (
    product.discont_price !== null &&
    product.discont_price !== undefined &&
    Number(product.discont_price) < Number(product.price)
  );
}

// вычисляет “актуальную цену” товара 
// getCurrentPrice - Возвращает цену, по которой товар реально показывать в фильтре/сортировке
//Если есть скидка (hasDiscount(product) === true) → берёт discont_price.
// Иначе берёт обычную price.
//Number(...) нужен, чтобы гарантированно сравнивать числа.
export function getCurrentPrice(product) {
  return hasDiscount(product) ? Number(product.discont_price) : Number(product.price);
}


/**
 * 
 * настройки фильтра:
    priceFrom, priceTo — границы цены
    discountedOnly — показывать только скидочные
    salesOnly — тоже принудительно только скидочные (для страницы AllSalesPage)
    sortBy — тип сортировки
 */
export function filterAndSortProducts(
  products,
  { priceFrom, priceTo, discountedOnly = false, salesOnly = false, sortBy = SORT_VALUES.DEFAULT }
) {
  const from = priceFrom === "" ? null : Number(priceFrom); //если пустая строка "", то null (фильтр не активен), иначе в число через Number(...).
  const to = priceTo === "" ? null : Number(priceTo);

  const filtered = products.filter((product) => {
    const discounted = hasDiscount(product);

    if (salesOnly && !discounted) return false; //если включён salesOnly или discountedOnly, а товар без скидки → исключается.
    if (discountedOnly && !discounted) return false; //если включён salesOnly или discountedOnly, а товар без скидки → исключается.


    /**
     * Number.isFinite(from):
            -проверяет, что from это нормальное число (не null, не NaN, не Infinity).
            -если пользователь не ввёл from, проверка не применяется.    
     */
    const price = getCurrentPrice(product); //берёт актуальную цену getCurrentPrice(product)
    if (Number.isFinite(from) && price < from) return false; // price < from - если цена товара ниже минимальной границы, товар отбрасываем (return false).
    if (Number.isFinite(to) && price > to) return false; // если to задан числом и цена выше максимальной границы, товар отбрасываем

    return true;
    // Итог:
    //проходит только товар с ценой в диапазоне [from, to] (включительно по краям, потому что исключаем только < from и > to).
  });

  if (sortBy === SORT_VALUES.DEFAULT) return filtered; //Если sortBy === DEFAULT, возвращает отфильтрованный массив как есть

  const sorted = [...filtered]; // Иначе копирует массив ([...filtered]), чтобы не мутировать исходный

  if (sortBy === SORT_VALUES.PRICE_ASC) {
    sorted.sort((a, b) => getCurrentPrice(a) - getCurrentPrice(b)); // Сортирует цену по возрастанию (дешёвые → дорогие). Если результат отрицательный, a идёт раньше b.
  } else if (sortBy === SORT_VALUES.PRICE_DESC) {
    sorted.sort((a, b) => getCurrentPrice(b) - getCurrentPrice(a));
  } else if (sortBy === SORT_VALUES.TITLE_ASC) {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === SORT_VALUES.TITLE_DESC) {
    sorted.sort((a, b) => b.title.localeCompare(a.title));
  }

  return sorted;
}
/**
 * используем getCurrentPrice(...):
    чтобы сортировка шла по “реальной” цене (со скидкой, если она есть), а не всегда по price
 */