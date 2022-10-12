import { createReducer } from "reduxsauce";
import { FilterTypes } from "../actions/filterActions";

export const INITIAL_STATE = {
  sortFilter: "?sort=price&",
  priceFilter: "",
};

export const changeFilters = (state = INITIAL_STATE, action) => {
  let { kind, values } = action;

  if (kind === "sort") {
    switch (values.name) {
      case "Alphabetic (Asc)":
        return { ...state, sortFilter: "?sort=name&" };
      case "Alphabetic (Desc)":
        return { ...state, sortFilter: "?sort=-name&" };
      case "Price (Asc)":
        return { ...state, sortFilter: "?sort=price&" };
      case "Price (Desc)":
        return { ...state, sortFilter: "?sort=-price&" };
    }
  } else if (kind === "price") {
    console.log(minPrice);
    let { minPrice, maxPrice } = values;
    let priceFilterText = "price";
    if (minPrice) {
      priceFilterText = priceFilterText.concat(`[gte]=${minPrice}`);
    }
    if (maxPrice) {
      minPrice
        ? (priceFilterText = priceFilterText.concat(`&price[lte]=${maxPrice}`))
        : (priceFilterText = priceFilterText.concat(`[lte]=${maxPrice}`));
    }
    if (priceFilterText === "price") {
      priceFilterText = "";
    }
    return { ...state, priceFilter: priceFilterText };
  }

  return { ...state };
};

export const HANDLERS = {
  [FilterTypes.HANDLE_FILTER]: changeFilters,
};

export default createReducer(INITIAL_STATE, HANDLERS);
