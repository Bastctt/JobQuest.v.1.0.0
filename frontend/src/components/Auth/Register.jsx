import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../../services/AuthService";

// MUI
import { Close as CloseIcon } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";

const Register = ({ open, handleClose, setIsLoggedIn }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const { mutate: handleRegister, isLoading } = useMutation(registerUser, {
    onSuccess: (data) => {
      setIsLoggedIn(true);
      enqueueSnackbar(`${data.message}!`, { variant: "success" });

      localStorage.setItem("authToken", data.user);
      setUsername("");
      setEmail("");
      setPassword("");
      setPhone("");
      setFirstName("");
      setLastName("");

      handleClose();
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: "error" });
      setIsLoggedIn(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !email || !password || !phone || !firstName || !lastname) {
      enqueueSnackbar("Please fill all fields", { variant: "warning" });
      return;
    }

    handleRegister({
      username,
      email,
      password,
      phone,
      first_name: firstName,
      last_name: lastname,
    });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="register-modal-title"
      aria-describedby="register-modal-description"
    >
      <Box
        sx={{
          p: 4,
          top: "50%",
          left: "50%",
          boxShadow: 24,
          display: "flex",
          borderRadius: "8px",
          position: "absolute",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          bgcolor: "background.paper",
          transform: "translate(-50%, -50%)",
          width: { xs: "80%", sm: "50%", md: "50%", lg: "30%", xl: "30%" },
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: 8, right: 8 }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          id="register-modal-title"
          color="primary"
          variant="h6"
          sx={{ mb: 2, textAlign: "center", fontWeight: 700 }}
        >
          Sign Up
        </Typography>

        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: { xs: "80%", sm: "80%", md: "80%", lg: "80%", xl: "80%" },
          }}
          onSubmit={handleSubmit}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              required
              fullWidth
              size="small"
              label="First Name"
              variant="outlined"
              value={firstName}
              autoComplete="off"
              onChange={(e) => setFirstName(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              required
              fullWidth
              size="small"
              label="Last Name"
              variant="outlined"
              value={lastname}
              autoComplete="off"
              onChange={(e) => setLastName(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              required
              fullWidth
              size="small"
              label="Username"
              variant="outlined"
              value={username}
              autoComplete="off"
              onChange={(e) => setUsername(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              required
              fullWidth
              size="small"
              label="Email"
              variant="outlined"
              value={email}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              required
              fullWidth
              size="small"
              label="Phone"
              variant="outlined"
              value={phone}
              autoComplete="off"
              onChange={(e) => setPhone(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              required
              fullWidth
              size="small"
              type={showPassword ? "text" : "password"}
              label="Password"
              value={password}
              variant="outlined"
              autoComplete="off"
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      size="small"
                      color="primary"
                      onClick={handleClickShowPassword}
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Button
            size="small"
            color="primary"
            variant="contained"
            type="submit"
            sx={{ alignSelf: "center", width: "auto", mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default Register;
