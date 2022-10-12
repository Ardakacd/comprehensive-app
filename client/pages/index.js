import styles from "../styles/Home.module.css";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import React from "react";
import { connect } from "react-redux";
import AuthActions from "../actions/authActions";
import Grid from "@mui/material/Grid";
import Item from "../components/Item";
import Filter from "../components/Filter";
import ProductActions from "../actions/productActions";
import Pagination from "../components/Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

const Home = ({ user, userRequest, products, getProductsRequest, filters }) => {
  console.log(products);
  useEffect(() => {
    if (!user.name) {
      console.log("Requested");
      userRequest();
    }
    let queryParams = `${filters.sortFilter}${filters.priceFilter}`;
    getProductsRequest(null, queryParams);
  }, []);

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.header}>Products</h1>
        {products?.length === 0 && (
          <Alert severity="info" style={{ marginTop: "3rem" }}>
            No product found!
          </Alert>
        )}
        {products ? (
          <>
            <Filter />
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2} style={{ alignItems: "strech" }}>
                {products.map((product) => {
                  return (
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={3}
                      lg={2}
                      xl={2}
                      key={product._id}
                    >
                      <Item product={product} />
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
            <Pagination />
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <CircularProgress />
          </div>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    products: state.products.filteredProducts,
    filters: state.filters,
  };
};

export default connect(mapStateToProps, {
  userRequest: AuthActions["userRequest"],
  getProductsRequest: ProductActions["getProductsRequest"],
})(Home);
