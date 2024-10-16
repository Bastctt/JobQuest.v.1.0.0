import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useQuery } from "@tanstack/react-query";

// MUI
import { Close as CloseIcon } from "@mui/icons-material";
import { Box, Typography, Modal, IconButton, CircularProgress } from "@mui/material";

// Components
import CompaniesTable from "../../../../../custom/components/CompaniesTable";

// Service
import { fetchCompanies } from "../../../../../services/CompanyService";

const AllCompaniesModal = ({ open, handleClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [companies, setCompanies] = useState([]);

  const { isLoading, isError } = useQuery(
    ["companies"],
    fetchCompanies,
    {
      enabled: open,
      onSuccess: (data) => setCompanies(data),
      onError: () => {
        enqueueSnackbar("Failed to fetch companies", { variant: "error" });
      },
      staleTime: 5 * 60 * 1000,
    }
  );

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          p: 4,
          top: "50%",
          left: "50%",
          boxShadow: 24,
          display: "flex",
          borderRadius: 2,
          flexDirection: "column",
          justifyContent: "center",
          position: "absolute",
          alignItems: "center",
          bgcolor: "background.paper",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "80%", md: "70%", lg: "70%", xl: "50%" },
          maxHeight: "70%",
        }}
      >
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          variant="h6"
          component="h2"
          color="primary"
          id="add-modal-title"
          sx={{ mb: 2, textAlign: "center", fontWeight: 700 }}
        >
          All Our Companies
        </Typography>

        {isLoading ? (
          <CircularProgress />
        ) : isError ? (
          <Typography variant="body1" color="error">
            Failed to load companies.
          </Typography>
        ) : (
          <CompaniesTable companies={companies} setCompanies={setCompanies} />
        )}
      </Box>
    </Modal>
  );
};

export default AllCompaniesModal;