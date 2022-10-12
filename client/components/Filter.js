import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FilterCreators from "../actions/filterActions";
import { connect } from "react-redux";
import ProductActions from "../actions/productActions";

const Filter = ({ filters, changeFilters, getProductsRequest }) => {
  const [open, setOpen] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpen(open);
  };

  const filteredRequest = () => {
    console.log(filters.sortFilter);
    console.log(filters.priceFilter);
    let queryParams = `${filters.sortFilter}${filters.priceFilter}`;
    getProductsRequest(null, queryParams);
  };

  const list = () => (
    <Box role="presentation">
      <h3
        style={{
          color: "aquamarine",
          marginLeft: "1.5rem",
          marginBottom: "0px",
        }}
      >
        Sort
      </h3>
      <FormControl>
        <RadioGroup
          aria-labelledby="radio-buttons-group-label"
          name="radio-buttons-group"
          defaultValue={filters.sortFilter}
          style={{ padding: "1rem" }}
        >
          {[
            { text: "Alphabetic (Asc)", tag: "?sort=name&" },
            { text: "Alphabetic (Desc)", tag: "?sort=-name&" },
            { text: "Price (Asc)", tag: "?sort=price&" },
            { text: "Price (Desc)", tag: "?sort=-price&" },
          ].map((item) => (
            <FormControlLabel
              key={item.text}
              value={item.tag}
              control={<Radio />}
              label={item.text}
              style={{ marginLeft: "0px" }}
              onChange={(e) => {
                console.log(e.target);
                console.log(e.target.checked);
                if (e.target.checked) {
                  changeFilters("sort", { name: item.text });
                }
              }}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <h3
        style={{
          color: "aquamarine",
          marginLeft: "1.5rem",
          marginBottom: "0px",
        }}
      >
        Price
      </h3>
      <List style={{ margin: "0.3rem 0.2rem 0 0.2rem" }}>
        <TextField
          id="outlined-basic"
          label="MinPrice"
          variant="outlined"
          defaultValue={filters.priceFilter.minPrice}
          value={minPrice}
          onChange={(e) => {
            setMinPrice(e.target.value);
            changeFilters("price", { minPrice: e.target.value, maxPrice });
          }}
        />
        <TextField
          id="outlined-basic"
          label="MaxPrice"
          variant="outlined"
          defaultValue={filters.priceFilter.maxPrice}
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(e.target.value);
            console.log(e.target.value);
            changeFilters("price", { maxPrice: e.target.value, minPrice });
          }}
        />
      </List>
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Button variant="contained" onClick={filteredRequest}>
          Filter
        </Button>
      </div>
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>Filter</Button>
      <SwipeableDrawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {list()}
      </SwipeableDrawer>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { filters: state.filters };
};

export default connect(mapStateToProps, {
  getProductsRequest: ProductActions["getProductsRequest"],
  changeFilters: FilterCreators["handleFilter"],
})(Filter);
