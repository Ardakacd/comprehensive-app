import styles from "../styles/ProductCreate.module.css";
import { connect } from "react-redux";
import TextField from "@mui/material/TextField";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import createProductRequest from "../requests/createProductRequest";
import { useRouter } from "next/router";
import AuthActions from "../actions/authActions";
import Input from "@mui/material/Input";

const ProductCreate = ({ user, userRequest }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  useEffect(() => {
    if (!user.name) {
      console.log("Requested");
      userRequest();
    }
  }, []);

  const handleProductCreate = async (event) => {
    event.preventDefault();
    const { data, status } = await createProductRequest(name, price, file);
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
      <h1 className={styles.header}>Create A New Product!</h1>

      {error && (
        <DialogContentText style={{ color: "red" }}>{error}</DialogContentText>
      )}
      <form onSubmit={handleProductCreate}>
        <TextField
          fullWidth
          id="outlined-required"
          label="Name"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          fullWidth
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
          <Button variant="outlined" type="submit">
            Create Product
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
})(ProductCreate);
