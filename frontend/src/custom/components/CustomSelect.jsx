import React, { useState, useEffect } from "react";

// Lib
import { useSnackbar } from "notistack";

// Companies
import { fetchCompanies } from "../../services/CompanyService";

// MUI
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Box,
} from "@mui/material";

const CompanySelect = ({ value, onChange }) => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const getCompanies = async () => {
      try {
        const data = await fetchCompanies();
        setCompanies(data);
        setIsLoading(false);
      } catch (error) {
        enqueueSnackbar("Failed to fetch companies", { variant: "error" });
        setIsLoading(false);
      }
    };

    getCompanies();
  }, [enqueueSnackbar]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <FormControl fullWidth required>
      <InputLabel id="company-select-label">Company</InputLabel>
      <Select
        size="small"
        sx={{ mb: 2 }}
        label="Company"
        id="company-select"
        value={value?.id || "Select"}
        labelId="company-select-label"
        onChange={(e) => {
          const selectedCompany = companies.find(
            (company) => company.id === e.target.value
          );
          onChange(selectedCompany || { id: "", name: "" });
        }}
      >
        <MenuItem value="Select" disabled>
          <em>Select a company</em>
        </MenuItem>
        {companies.map((company) => (
          <MenuItem key={company.id} value={company.id}>
            {company.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CompanySelect;
