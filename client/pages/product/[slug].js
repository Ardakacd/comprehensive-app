import getProductDetailReq from "../../requests/getProductDetailRequest";
import { useEffect } from "react";
import Image from "next/image";
import styles from "../../styles/ProductDetail.module.css";
import Alert from "@mui/material/Alert";
import Comment from "../../components/Comment";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import addCommentRequest from "../../requests/addCommentRequest";
import { connect } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import AuthActions from "../../actions/authActions";

const ProductDetail = ({ product, error, user, userRequest }) => {
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState(product?.reviews);
  const [commentError, setCommentError] = useState(null);
  useEffect(() => {
    if (!user.name) {
      console.log("Requested");
      userRequest();
    }
  }, []);

  const handleAddComment = async () => {
    console.log(user.userId);
    if (!title || !comment) {
      setCommentError("Title and description should be filled!");
      setTimeout(() => {
        setCommentError(null);
      }, 5000);
      return;
    }
    const { data, status } = await addCommentRequest(
      title,
      comment,
      product._id,
      user.userId
    );
    console.log(status);
    if (status === 201) {
      console.log(data);
      let temp = [...allComments];
      temp.unshift({
        title,
        description: comment,
        user: { username: user.username, photo: user.photo },
      });
      setAllComments(temp);
    } else {
      console.log("Error in creating product!");
      console.log(status);
      console.log(data);
    }
  };
  return (
    <>
      {error && (
        <Alert severity="warning" style={{ marginTop: "3rem" }}>
          {error}
        </Alert>
      )}
      {product ? (
        <>
          <div className={styles.container}>
            <Image
              src={`/images/${product.coverPhoto}`}
              alt="Picture of the photo"
              width={300}
              height={300}
              blurDataURL="data:..."
              placeholder="blur"
            />
            <div className={styles.infoContainer}>
              <h1 className={styles.header}>{product.name}</h1>
              <h3>
                <span className={styles.infoKey}>Owner: </span>
                {product.owner.username}
              </h3>
              <h3>
                <span className={styles.infoKey}>Price: </span>
                {product.price} ₺
              </h3>
            </div>
          </div>
          <div className={styles.commentContainer}>
            <h2 className={styles.commentHeader}>Comments</h2>
            {commentError && (
              <p
                style={{
                  color: "red",
                  transitionTimingFunction: "ease-in-out",
                }}
              >
                {commentError}
              </p>
            )}
            <TextField
              fullWidth
              required
              id="outlined-required"
              label="Title"
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <TextField
              fullWidth
              required
              id="outlined-required"
              label="Comment"
              margin="normal"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div style={{ textAlign: "end" }}>
              <Button variant="outlined" onClick={handleAddComment}>
                Add comment
              </Button>
            </div>
            {allComments.length == 0 ? (
              <Alert severity="info" style={{ marginTop: "3rem" }}>
                Not any comment yet!
              </Alert>
            ) : (
              <>
                <div style={{ marginTop: "3rem" }}>
                  {allComments.map((review) => (
                    <Comment comment={review} />
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        !error && <CircularProgress />
      )}
    </>
  );
};

export async function getServerSideProps(context) {
  const { slug } = context.query;
  let { data, status } = await getProductDetailReq(slug);
  console.log(data);
  console.log(status);

  let product = null;
  let error = null;
  if (status === 200) {
    let { product: tempProduct } = data.data;
    product = tempProduct;
  } else {
    console.log(data);
    let { message } = data;
    error = message;
  }

  return {
    props: { product, error }, // will be passed to the page component as props
  };
}

const mapStateToProps = (state) => {
  console.log(state);
  return { user: state.user };
};

export default connect(mapStateToProps, {
  userRequest: AuthActions["userRequest"],
})(ProductDetail);
