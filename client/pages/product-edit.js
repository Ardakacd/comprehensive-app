import styles from "../styles/ProductCreate.module.css";
import { connect } from "react-redux";
import TextField from "@mui/material/TextField";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import updateProductRequest from "../requests/updateProductRequest";
import deleteProductRequest from "../requests/deleteProductRequest";
import Alert from "@mui/material/Alert";
import AuthActions from "../actions/authActions";
import Input from "@mui/material/Input";

const ProductEdit = ({ user, userRequest }) => {
  const router = useRouter();
  const [product, setProduct] = useState(router.query);
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  useEffect(() => {
    if (!user.name) {
      console.log("Requested");
      userRequest();
    }
  }, []);

  if (!product) {
    return (
      <Alert severity="warning" style={{ marginTop: "3rem" }}>
        No product found!
      </Alert>
    );
  }
  const handleDelete = async () => {
    const { data, status } = await deleteProductRequest(product.slug);
    console.log(status);
    if (status === 204) {
      setError(null);
      router.push("/");
    } else {
      console.log("Error in deleting product!");
      console.log(status);
      console.log(data);
      setError(data.message);
    }
  };
  const handleUpdate = async (event) => {
    event.preventDefault();
    const { data, status } = await updateProductRequest(
      product.slug,
      name,
      price,
      file
    );
    console.log(status);
    if (status === 201) {
      console.log(data);
      setError(null);
      router.push("/");
    } else {
      console.log("Error in creating product!");
      console.log(status);
      console.log(data);
      setError(data.message);
    }
  };

  const handleChange = (event) => {
    setFile(event.target.files[0]);
  };
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Edit Product!</h1>
      {error && (
        <DialogContentText style={{ color: "red" }}>{error}</DialogContentText>
      )}
      <form onSubmit={handleUpdate}>
        <TextField
          fullWidth
          required
          id="outlined-required"
          label="Name"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          fullWidth
          required
          id="outlined-required"
          label="Price ($)"
          margin="normal"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <div>
          <h3 className={styles.photoHeader}>Image Photo</h3>
          <Input
            type="file"
            margin="none"
            name="coverPhoto"
            onChange={handleChange}
          />
        </div>
        <div className={styles.buttonContainer}>
          <Button variant="outlined" onClick={handleDelete} color="error">
            Delete Product
          </Button>
          <Button variant="outlined" className={styles.button} type="submit">
            Update Product
          </Button>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { user: state.user };
};

export default connect(mapStateToProps, {
  userRequest: AuthActions["userRequest"],
})(ProductEdit);
