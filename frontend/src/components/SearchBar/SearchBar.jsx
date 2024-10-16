import React, { useState } from "react";
import {
  LocationOn as LocationOnIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  Divider,
  Grid2,
} from "@mui/material";

const SearchBar = ({ onSearch, onClear }) => {
  const [keywords, setKeywords] = useState("");
  const [location, setLocation] = useState("");

  const handleKeywordsChange = (event) => {
    setKeywords(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleSearch = () => {
    onSearch({ keywords, location });
  };

  const handleClear = () => {
    setKeywords("");
    setLocation("");
    onClear();
  };

  return (
    <Box
      sx={{
        p: 2,
        mb: 4,
        display: "flex",
        overflow: "hidden",
        borderRadius: "25px",
        alignItems: "center",
        gap: { xs: 2, md: 0 },
        backgroundColor: "#fff",
        justifyContent: "center",
        mx: { md: "auto", sm: "auto" },
        flexDirection: { xs: "column", md: "row" },
        width: { xs: "100%", sm: "80%", md: "80%", lg: "60%", xl: "40%" },
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <TextField
        fullWidth
        size="small"
        variant="outlined"
        value={keywords}
        autoComplete="off"
        onChange={handleKeywordsChange}
        placeholder="Job title, job type or company"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="secondary.main" />
            </InputAdornment>
          ),
        }}
        sx={{
          flex: 1,
          border: "none",
          "& fieldset": { border: "none" },
        }}
      />

      <Divider
        orientation="vertical"
        sx={{
          height: { xs: 0, md: "30px" },
          display: { xs: "none", md: "block" },
        }}
      />

      <TextField
        fullWidth
        size="small"
        variant="outlined"
        value={location}
        autoComplete="off"
        onChange={handleLocationChange}
        placeholder="Location (e.g., New York, Paris)"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnIcon color="secondary" />
            </InputAdornment>
          ),
        }}
        sx={{
          flex: 1,
          border: "none",
          "& fieldset": { border: "none" },
        }}
      />
      <Grid2>
        <Button
          size="small"
          variant="contained"
          onClick={handleSearch}
          sx={{
            borderRadius: "25px",
            textTransform: "none",
            fontSize: "0.875rem",
          }}
        >
          Find jobs
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={handleClear}
          sx={{
            borderRadius: "25px",
            textTransform: "none",
            fontSize: "0.875rem",
            marginLeft: 2,
          }}
        >
          Clear filters
        </Button>
      </Grid2>
    </Box>
  );
};

export default SearchBar;
