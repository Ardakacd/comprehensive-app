import { connect } from "react-redux";
import styles from "../styles/Profile.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import AuthActions from "../actions/authActions";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";

const Profile = ({ user, userRequest, changePhotoRequest }) => {
  const [file, setFile] = useState(null);
  useEffect(() => {
    if (!user.name) {
      console.log("Requested");
      userRequest();
    }
  }, []);

  const handleChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handlePhotoChange = async (event) => {
    event.preventDefault();
    console.log(file);
    console.log(typeof file);
    console.log(JSON.stringify(file));
    if (!(file === null)) {
      changePhotoRequest(user.userId, await toBase64(file));
    } else {
      changePhotoRequest(user.userId, null);
    }
  };

  const toBase64 = (argFile) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(argFile);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  if (!user.username) {
    return (
      <Alert severity="warning" style={{ marginTop: "3rem" }}>
        No user found!
      </Alert>
    );
  }

  return (
    <div className={styles.container}>
      <Image
        src={`/images/${user.photo}`}
        alt="Picture of the user"
        width={150}
        height={100}
        blurDataURL="data:..."
        placeholder="blur"
      />
      <div className={styles.infoContainer}>
        <h1 className={styles.header}>{user.username}</h1>
        <h3>
          <span className={styles.infoKey}>Email address: </span>
          {user.email}
        </h3>
        <form onSubmit={handlePhotoChange}>
          <div>
            <h3 className={styles.photoHeader}>Change User Photo</h3>
            {user.changePhotoError && (
              <p style={{ color: "red" }}>{user.changePhotoError}</p>
            )}
            <Input
              type="file"
              margin="none"
              name="avatar"
              onChange={handleChange}
            />
          </div>
          <div>
            <Button
              variant="outlined"
              type="submit"
              style={{ textAlign: "center", marginTop: "1rem" }}
            >
              Change
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { user: state.user };
};

export default connect(mapStateToProps, {
  userRequest: AuthActions["userRequest"],
  changePhotoRequest: AuthActions["changePhotoRequest"],
})(Profile);
