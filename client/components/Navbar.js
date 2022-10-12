import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Menu from "./Menu";

const Navbar = ({ user }) => {
  const router = useRouter();

  const [token, setToken] = useState(null);
  useEffect(() => {
    if (user.username) {
      setToken(true);
    } else {
      setToken(false);
    }
  }, [user]);

  return (
    <div className={styles.navbarContainer}>
      <Link href="/">
        <a className={styles.sideHeader}>Comprehensive App</a>
      </Link>

      <div className={styles.navbarFunc}>
        {!token ? (
          <>
            <Link href="/register">
              <a className={styles.navbarLink}>Register</a>
            </Link>
            <Link href="/login">
              <a className={styles.navbarLink}>Login</a>
            </Link>{" "}
          </>
        ) : (
          <>
            <Link href="/product-create">
              <a className={styles.navbarLink}>Create Product</a>
            </Link>
            <Menu />
          </>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { user: state.user };
};

export default connect(mapStateToProps, null)(Navbar);
