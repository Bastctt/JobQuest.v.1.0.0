import React, { useState } from "react";

// Lib
import { useSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Components
import CompanySelect from "../../../../../custom/components/CustomSelect";

// MUI
import Grid2 from "@mui/material/Grid2";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  IconButton,
  FormControl,
} from "@mui/material";

// service
import { createJobs } from "../../../../../services/advertisementsService";

const AddJobModal = ({ open, handleClose }) => {
  const [newJob, setNewJob] = useState({
    title: "",
    company: { anneeCreation: "", id: "", siegeSocialVille: "", name: "" },
    location: "",
    jobType: "",
    description: "",
  });

  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutate: createJob, isLoading } = useMutation({
    mutationFn: createJobs,
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs"]);
      enqueueSnackbar("Job created successfully!", {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      setNewJob({
        title: "",
        company: { anneeCreation: "", id: "", siegeSocialVille: "", name: "" },
        location: "",
        jobType: "",
        description: "",
      });
      handleClose();
    },
    onError: (error) => {
      enqueueSnackbar("Error creating job. Please try again.", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      console.error(
        "Error creating job:",
        error.response?.data || error.message
      );
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewJob({
      ...newJob,
      [name]: value,
    });
  };

  const handleCompanyChange = (selectedCompany) => {
    setNewJob((prevJob) => ({
      ...prevJob,
      company: {
        name: selectedCompany.name,
        id: selectedCompany.id,
        anneeCreation: selectedCompany.anneeCreation,
        siegeSocialVille: selectedCompany.siegeSocialVille,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      newJob.title &&
      newJob.company &&
      newJob.location &&
      newJob.jobType &&
      newJob.description
    ) {
      const jobPayload = {
        title: newJob.title,
        company: {
          id: newJob.company.id,
          name: newJob.company.name,
          anneeCreation: newJob.company.anneeCreation,
          siegeSocialVille: newJob.company.siegeSocialVille,
        },
        location: newJob.location,
        jobType: newJob.jobType,
        description: newJob.description,
      };
      createJob(jobPayload);
    } else {
      enqueueSnackbar("Please fill in all the fields.", {
        variant: "warning",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    }
  };

  const isFormValid =
    newJob.title.trim() !== "" &&
    newJob.company.anneeCreation.trim() !== "" &&
    newJob.company.id !== "" &&
    newJob.company.siegeSocialVille.trim() !== "" &&
    newJob.location.trim() !== "" &&
    newJob.jobType.trim() !== "" &&
    newJob.description.trim() !== "";

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
          width: { xs: "90%", sm: "60%", md: "50%", lg: "50%", xl: "30%" },
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
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
          id="add-modal-title"
          variant="h6"
          component="h2"
          color="primary"
          sx={{ mb: 2, textAlign: "center", fontWeight: 700 }}
        >
          Add New Job
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
          <Grid2>
            <TextField
              label="Job Title"
              size="small"
              name="title"
              value={newJob.title}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
              required
              autoComplete="off"
              InputLabelProps={{ shrink: true }}
            />

            <Grid2>
              <FormControl fullWidth required>
                <CompanySelect
                  value={newJob.company || "Select"}
                  onChange={handleCompanyChange}
                />
              </FormControl>
            </Grid2>

            <TextField
              label="Location"
              name="location"
              size="small"
              value={newJob.location}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
              required
              autoComplete="off"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Job Type"
              name="jobType"
              size="small"
              value={newJob.jobType}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
              required
              autoComplete="off"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Description"
              name="description"
              size="small"
              value={newJob.description}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
              multiline
              rows={4}
              required
              autoComplete="off"
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

export default AddJobModal;
