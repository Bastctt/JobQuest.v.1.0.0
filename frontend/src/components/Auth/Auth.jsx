import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../services/AuthService";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Modal,
  InputAdornment,
} from "@mui/material";
import {
  Close as CloseIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

const Auth = ({ open, handleClose, setIsLoggedIn, setIsAdmin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { mutate, isLoading } = useMutation(loginUser, {
    onSuccess: (data) => {
      enqueueSnackbar(`Welcome ${data.user.username} !`, {
        variant: "success",
      });

      setIsLoggedIn(true);
      localStorage.setItem("authToken", data.user.uuid);
      localStorage.setItem("userRoles", JSON.stringify(data.user.roles));

      if (data.user.roles.includes("ROLE_ADMIN")) {
        setIsAdmin(true);
      }
      setUsername("");
      setPassword("");
      handleClose();
    },
    onError: (error) => {
      console.error("Login failed:", error);
      enqueueSnackbar("Login failed", { variant: "error" });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ username, password });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: { xs: "80%", sm: "50%", md: "50%", lg: "30%", xl: "20%" },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "8px",
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: 8, right: 8 }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          variant="h6"
          component="h2"
          color="primary"
          sx={{ mb: 2, textAlign: "center", fontWeight: 700 }}
        >
          Login
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            gap: 2,
            display: "flex",
            flexDirection: "column",
            width: { xs: "80%", sm: "70%", md: "70%" },
          }}
        >
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
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            size="small"
            variant="contained"
            color="primary"
            disabled={isLoading}
            type="submit"
            sx={{ alignSelf: "center", width: "auto", mt: 2 }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default Auth;
