import React, { useState, useEffect } from "react";

// Lib
import { useSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
} from "@mui/material";

// service
import { updateJobs } from "../../../../../services/advertisementsService";

const EditJobModal = ({ job, open, handleClose }) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [updateJob, setUpdateJob] = useState({
    title: "",
    location: "",
    jobType: "",
    description: "",
  });
  const [isModified, setIsModified] = useState(false);

  const { mutate: updateJobMutation, isLoading } = useMutation({
    mutationFn: (updatedJob) => updateJobs(job.id, updatedJob),
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs"]);
      enqueueSnackbar("Job updated successfully!", {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      setUpdateJob({
        title: "",
        location: "",
        jobType: "",
        description: "",
      });
      handleClose();
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour du job:", error);
      enqueueSnackbar("Error updating job. Please try again.", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    },
  });

  useEffect(() => {
    if (job) {
      setUpdateJob({
        title: job.title || "",
        location: job.location || "",
        jobType: job.jobType || "",
        description: job.description || "",
      });
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateJob((prevJob) => ({
      ...prevJob,
      [name]: value,
    }));
    setIsModified(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      isModified &&
      updateJob.title &&
      updateJob.location &&
      updateJob.jobType &&
      updateJob.description
    ) {
      updateJobMutation(updateJob);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          p: 4,
          top: "50%",
          left: "50%",
          boxShadow: 24,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          position: "absolute",
          flexDirection: "column",
          justifyContent: "center",
          bgcolor: "background.paper",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "60%", md: "50%", lg: "50%", xl: "30%" },
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
          id="edit-modal-title"
          variant="h6"
          component="h2"
          color="primary"
          sx={{ mb: 2, textAlign: "center", fontWeight: 700 }}
        >
          Edit Job
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid2 ml={{ xs: 0, sm: 0, md: 5 }} mr={{ xs: 0, sm: 0, md: 5 }}>
            <TextField
              label="Job Title"
              size="small"
              name="title"
              fullWidth
              value={updateJob.title}
              onChange={handleChange}
              sx={{ mb: 2 }}
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Location"
              name="location"
              size="small"
              fullWidth
              value={updateJob.location}
              onChange={handleChange}
              sx={{ mb: 2 }}
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Job Type"
              name="jobType"
              size="small"
              fullWidth
              value={updateJob.jobType}
              onChange={handleChange}
              sx={{ mb: 2 }}
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Description"
              name="description"
              size="small"
              fullWidth
              value={updateJob.description}
              onChange={handleChange}
              multiline
              rows={4}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid2>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="small"
              disabled={
                !isModified ||
                !updateJob.title ||
                !updateJob.location ||
                !updateJob.jobType ||
                !updateJob.description ||
                isLoading
              }
            >
              {isLoading ? "Updating..." : "Edit"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default EditJobModal;
