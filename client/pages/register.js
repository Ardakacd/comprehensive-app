import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import { useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import AuthActions from "../actions/authActions";

const Register = ({ error, registerRequest }) => {
  const router = useRouter();
  const handleClose = () => {
    setOpen(false);
    router.push("/");
  };
  const [open, setOpen] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    registerRequest(username, email, password);
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ color: "aquamarine" }}>Register</DialogTitle>
        <DialogContent>
          {error && (
            <DialogContentText style={{ color: "red" }}>
              {error}
            </DialogContentText>
          )}

          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleRegister}>
            Register
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { error: state.user.registerError };
};

export default connect(mapStateToProps, {
  registerRequest: AuthActions.registerRequest,
})(Register);
