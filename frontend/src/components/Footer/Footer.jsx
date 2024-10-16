import React from "react";

// MUI
import Grid2 from "@mui/material/Grid2";
import { Box, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        textAlign: "center",
        borderTop: "1px solid #ddd",
      }}
    >
      <Typography variant="body1" color="textSecondary">
        &copy; 2024 JobQuest <br />
        Made by Thomas & Bastien
      </Typography>

      <Grid2 container justifyContent="center" spacing={2} sx={{ mt: 2 }}>
        <Grid2>
          <Link href="#" underline="none" color="textPrimary">
            Privacy Policy
          </Link>
        </Grid2>
        <Grid2>
          <Link href="#" underline="none" color="textPrimary">
            Terms of Service
          </Link>
        </Grid2>
        <Grid2>
          <Link href="#" underline="none" color="textPrimary">
            Cookie Policy
          </Link>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Footer;
