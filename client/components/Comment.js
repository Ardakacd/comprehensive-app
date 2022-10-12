import Avatar from "@mui/material/Avatar";
import styles from "../styles/Comment.module.css";
const Comment = ({ comment }) => {
  return (
    <div className={styles.container}>
      <div className={styles.userSide}>
        <Avatar
          alt="Remy Sharp"
          src={`/images/${comment.user.photo}`}
          sx={{ width: 20, height: 20 }}
        />
        <p className="userText">{comment.user.username}</p>
      </div>
      <div className={styles.commentSide}>
        <h3 className={styles.title}>{comment.title}</h3>
        <p>{comment.description}</p>
      </div>
    </div>
  );
};

export default Comment;
