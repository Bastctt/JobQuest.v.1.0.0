import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Grid2 from "@mui/material/Grid2";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  IconButton,
} from "@mui/material";
import { createCompanies } from "../../../../../services/companyService";

const AddCompanyModal = ({ open, handleClose }) => {
  const [newCompany, setNewCompany] = useState({
    name: "",
    anneeCreation: "",
    siegeSocialVille: "",
  });

  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutate: createCompany, isLoading } = useMutation({
    mutationFn: createCompanies,
    onSuccess: () => {
      queryClient.invalidateQueries(["companies"]);
      enqueueSnackbar("Company created successfully!", {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      setNewCompany({
        name: "",
        anneeCreation: "",
        siegeSocialVille: "",
      });
      handleClose();
    },
    onError: (error) => {
      enqueueSnackbar("Error creating company. Please try again.", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      console.error("Error creating company:", error);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCompany((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      newCompany.name &&
      newCompany.anneeCreation &&
      newCompany.siegeSocialVille
    ) {
      const companyPayload = {
        name: newCompany.name,
        anneeCreation: newCompany.anneeCreation,
        siegeSocialVille: newCompany.siegeSocialVille,
      };
      createCompany(companyPayload);
    } else {
      enqueueSnackbar("Please fill in all the fields.", {
        variant: "warning",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    }
  };

  const isFormValid =
    newCompany.name.trim() !== "" &&
    newCompany.anneeCreation.trim() !== "" &&
    newCompany.siegeSocialVille.trim() !== "";

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
          width: { xs: "80%", sm: "50%", md: "40%", lg: "40%", xl: "30%" },
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
          Add New Company
        </Typography>

        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
          onSubmit={handleSubmit}
        >
          <Grid2 sx={{ ml: 4, mr: 4 }}>
            <TextField
              required
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              autoComplete="off"
              name="name"
              label="Company Name"
              value={newCompany.name}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              required
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              autoComplete="off"
              name="anneeCreation"
              label="Creation Year"
              value={newCompany.anneeCreation}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              required
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              autoComplete="off"
              name="siegeSocialVille"
              label="Headquarters"
              value={newCompany.siegeSocialVille}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                type="submit"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? "Adding..." : "Add"}
              </Button>
            </Box>
          </Grid2>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddCompanyModal;