import React, { useState, useEffect } from "react";

// Lib
import { SnackbarProvider } from "notistack";
import { animateScroll as scroll } from "react-scroll";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Mui
import { Fab } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// Components
import Nav from "./components/Nav/Nav";
import Jobs from "./components/Jobs/Jobs";
import AdminPanel from "./page/AdminPanel";

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    primary: {
      main: "#2557a7",
    },
    secondary: {
      main: "#2d2d2d",
    },
  },
  typography: {
    fontFamily: '"Afacad Flux", sans-serif',
  },
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
        },
      },
    },
  },
});

function App() {
  const [isUser, setIsUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleScroll = () => {
    const isBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
    setIsAtBottom(isBottom);
  };

  const scrollToBottom = () => {
    scroll.scrollToBottom({ duration: 500, smooth: true });
  };

  const scrollToTop = () => {
    scroll.scrollToTop({ duration: 500, smooth: true });
  };

  const handleClick = () => {
    if (isAtBottom) {
      scrollToTop();
    } else {
      scrollToBottom();
    }
  };

  const checkAuthStatus = () => {
    const uuid = localStorage.getItem("authToken");
    if (uuid) {
      setIsLoggedIn(true);

      const roles = JSON.parse(localStorage.getItem("userRoles"));
      if (roles) {
        if (roles.includes("ROLE_ADMIN")) {
          setIsAdmin(true);
        }
        if (roles.includes("ROLE_USER")) {
          setIsUser(true);
        }
      }
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <Router>
            <Fab
              size="small"
              color="primary"
              aria-label="scroll"
              onClick={handleClick}
              style={{ position: "fixed", bottom: 30, right: 20 }}
            >
              {isAtBottom ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </Fab>
            <Nav
              isAdmin={isAdmin}
              setIsAdmin={setIsAdmin}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
            <Routes>
              <Route path="/" element={<Jobs isAdmin={isAdmin} />} />
              <Route path="/admin-panel" element={<AdminPanel />} />
            </Routes>
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;