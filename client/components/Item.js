import Image from "next/image";
import styles from "../styles/Item.module.css";
import Button from "@mui/material/Button";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Avatar from "@mui/material/Avatar";

const Item = ({ product, userId }) => {
  const imageUrl = `/images/${product.coverPhoto}`;
  const imageOwnerUrl = `/images/${product.owner.photo}`;
  let router = useRouter();
  const handleItemDetail = () => {
    router.push(`/product/${product.slug}`);
  };
  const handleEdit = (event) => {
    console.log("clicked");
    router.push(
      {
        pathname: "/product-edit",
        query: product,
      },
      `/product-edit/${product.slug}`
    );
    event.preventDefault();
  };

  return (
    <div className={styles.itemContainer}>
      <div style={{ width: "100%" }}>
        <Image
          src={imageUrl}
          alt="Picture of the product"
          layout="responsive"
          height={10}
          width={10}
          onClick={handleItemDetail}
        />
      </div>
      <div className={styles.ownerField}>
        <div style={{ marginLeft: "0.3rem", marginRight: "0.3rem" }}>
          <Avatar
            alt="Remy Sharp"
            src={imageOwnerUrl}
            sx={{ width: 24, height: 24 }}
          />
        </div>
        <p style={{ color: "gray" }}>{product.owner.username}</p>
      </div>
      <p className={styles.productNameText} style={{ color: "black" }}>
        {product.name}
      </p>
      <div className={styles.footer}>
        <p className={styles.productPriceText}>{product.price} ₺ </p>
        {product.owner._id === userId && (
          <Button variant="outlined" color="secondary" onClick={handleEdit}>
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { userId: state.user.userId };
};

export default connect(mapStateToProps, null)(Item);
