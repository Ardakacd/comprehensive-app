import * as React from "react";
import { default as MuiMenu } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import { connect } from "react-redux";
import AuthActions from "../actions/authActions";
import { useRouter } from "next/router";

const Menu = ({ photo, logoutRequest }) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfile = () => {
    setAnchorEl(null);
    router.push("/profile");
  };
  const handleLogout = () => {
    logoutRequest();
    setAnchorEl(null);
    router.push("/");
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Avatar
        alt="Remy Sharp"
        src={`/images/${photo}`}
        sx={{ width: 30, height: 30 }}
        onClick={handleClick}
        style={{ marginLeft: "3rem" }}
      />
      <MuiMenu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </MuiMenu>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { photo: state.user.photo };
};

export default connect(mapStateToProps, {
  logoutRequest: AuthActions["logoutRequest"],
})(Menu);
