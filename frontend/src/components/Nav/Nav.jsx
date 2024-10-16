import React, { useState } from "react";

// Lib
import { useSnackbar } from "notistack";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient, useQuery } from "@tanstack/react-query";

// MUI
import { Stack } from "@mui/system";
import LogoutIcon from "@mui/icons-material/Logout";
import { AccountCircle } from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Divider,
} from "@mui/material";

// Components
import Auth from "../Auth/Auth";
import Register from "../Auth/Register";
import Profile from "../Profile/Profile";

// Service
import { getUser } from "../../services/userService";

const Nav = ({ isLoggedIn, setIsLoggedIn, setIsAdmin, isAdmin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const handleLoginModalOpen = () => {
    setLoginModalOpen(true);
  };

  const handleLoginModalClose = () => {
    setLoginModalOpen(false);
  };

  const handleModalToggle = () => {
    setModalOpen(!modalOpen);
  };

  const handleRegisterModalOpen = () => {
    setOpenRegisterModal(true);
  };

  const handleRegisterModalClose = () => {
    setOpenRegisterModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRoles");
    setIsLoggedIn(false);
    setIsAdmin(false);
    queryClient.removeQueries("user");
    enqueueSnackbar("You have been logged out", { variant: "success" });
    if (location.pathname === "/admin-panel") {
      navigate("/");
    }
  };

  const uuid = localStorage.getItem("authToken");

  const { data, isLoading, isError } = useQuery(
    ["user", uuid],
    () => getUser(uuid),
    {
      enabled: !!uuid,
      onSuccess: (data) => setUserInfo(data),
      onError: () => {
        enqueueSnackbar("Failed to fetch user information", {
          variant: "error",
        });
      },
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  );

  const handleAdminPanelClick = () => {
    if (location.pathname === "/admin-panel") {
      navigate("/");
    } else {
      navigate("/admin-panel");
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          boxShadow: "none",
          padding: "10px 0",
          backgroundColor: "transparent",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#2557a7" }}
          >
            JobQuest
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {!isLoggedIn && (
              <>
                <Button color="primary" onClick={handleRegisterModalOpen}>
                  Sign up
                </Button>
                <Button color="primary" onClick={handleLoginModalOpen}>
                  Sign in
                </Button>
              </>
            )}

            {isLoggedIn && (
              <Stack direction={"row"} gap={2}>
                {isAdmin && (
                  <>
                    <Button
                      edge="end"
                      aria-label="settings"
                      color="primary"
                      size="small"
                      onClick={handleAdminPanelClick}
                    >
                      {location.pathname === "/admin-panel"
                        ? "Return to JobQuest"
                        : "View Admin Panel"}
                    </Button>
                  </>
                )}
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  color="primary"
                  onClick={handleModalToggle}
                >
                  <AccountCircle />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  color="primary"
                  onClick={handleLogout}
                >
                  <LogoutIcon />
                </IconButton>
              </Stack>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Divider />

      <Profile
        open={modalOpen}
        onClose={handleModalToggle}
        setIsLoggedIn={setIsLoggedIn}
        isAdmin={isAdmin}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        isLoading={isLoading}
        isError={isError}
      />
      <Register
        open={openRegisterModal}
        handleClose={handleRegisterModalClose}
        setIsLoggedIn={setIsLoggedIn}
      />
      <Auth
        open={loginModalOpen}
        handleClose={handleLoginModalClose}
        setIsLoggedIn={setIsLoggedIn}
        setIsAdmin={setIsAdmin}
      />
    </Box>
  );
};

export default Nav;