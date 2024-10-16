import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// MUI
import CloseIcon from "@mui/icons-material/Close";
import CardContent from "@mui/material/CardContent";
import { Box, Typography, Modal, Button, IconButton } from "@mui/material";

// Components
import EditJobModal from "./modal/job/EditJobModal";
import ConfirmModal from "../../../custom/components/ConfirmModal";
import ApplyNoUser from "../components/modal/job/ApplyNoUser";

// Service
import { deleteJobs } from "../../../services/advertisementsService";
import { createApplyWithUser } from "../../../services/applyService";

const JobsDetails = ({ job, open, handleClose, isAdmin }) => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openApplyModal, setOpenApplyModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutate: handleDeleteJob, isLoading: isDeleting } = useMutation(
    deleteJobs,
    {
      onSuccess: () => {
        enqueueSnackbar("Job deleted successfully", {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
        queryClient.invalidateQueries("jobs");
        handleClose();
      },
      onError: () => {
        enqueueSnackbar(`Failed to delete job`, {
          variant: "error",
        });
      },
    }
  );

  const { mutate: applyToJob, isLoading: isApplying } = useMutation(
    () => createApplyWithUser({ job_id: job.id }),
    {
      onSuccess: () => {
        enqueueSnackbar("Application sent successfully!", {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
        queryClient.invalidateQueries("apply");
        handleClose();
      },
      onError: () => {
        enqueueSnackbar(`Failed to apply for job, you already applied`, {
          variant: "error",
        });
      },
    }
  );

  const handleApply = () => {
    const uuid = localStorage.getItem("authToken");

    if (uuid) {
      applyToJob();
    } else {
      setOpenApplyModal(true);
    }
  };

  const handleOpenConfirmModal = () => {
    setOpenConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setOpenConfirmModal(false);
  };

  const handleOpenEditModal = () => {
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleCloseApplyModal = () => {
    setOpenApplyModal(false);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="job-details-modal"
      >
        <Box
          sx={{
            p: 4,
            top: "50%",
            left: "50%",
            boxShadow: 24,
            borderRadius: 2,
            position: "absolute",
            bgcolor: "background.paper",
            transform: "translate(-50%, -50%)",
            width: { xs: "70%", sm: "40%", md: "40%", lg: "30%", xl: "30%" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              top: 8,
              right: 8,
              position: "absolute",
            }}
          >
            <CloseIcon />
          </IconButton>

          <CardContent sx={{ textAlign: "center" }}>
            <Typography
              id="job-details-modal"
              variant="h5"
              fontWeight="bold"
              color="primary"
              sx={{ mb: 4 }}
            >
              {job.title}
            </Typography>
            <Typography>
              <strong>Company :</strong> {job.company.name}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              <strong>Location :</strong> {job.location}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              <strong>Job Type :</strong> {job.jobType}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              <strong>Description :</strong> {job.description}
            </Typography>
          </CardContent>

          <Box
            sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 3 }}
          >
            {isAdmin ? (
              <>
                <Button
                  color="error"
                  variant="contained"
                  size="small"
                  onClick={handleOpenConfirmModal}
                >
                  Delete
                </Button>
                <Button
                  color="success"
                  variant="contained"
                  size="small"
                  onClick={handleOpenEditModal}
                >
                  Edit
                </Button>
              </>
            ) : (
              <Button
                color="primary"
                variant="contained"
                size="small"
                onClick={handleApply}
                disabled={isApplying}
              >
                {isApplying ? "Applying..." : "Apply"}
              </Button>
            )}
          </Box>
        </Box>
      </Modal>

      <EditJobModal
        job={job}
        open={openEditModal}
        handleClose={handleCloseEditModal}
      />

      <ConfirmModal
        item={job}
        queryKey="jobs"
        open={openConfirmModal}
        deleteFunction={handleDeleteJob}
        handleClose={handleCloseConfirmModal}
      />

      <Modal open={openApplyModal} onClose={handleCloseApplyModal}>
        <Box
          sx={{
            p: 4,
            top: "50%",
            left: "50%",
            boxShadow: 24,
            borderRadius: 2,
            position: "absolute",
            bgcolor: "background.paper",
            transform: "translate(-50%, -50%)",
            width: { xs: "70%", sm: "40%", md: "40%", lg: "30%", xl: "10%" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ApplyNoUser jobId={job.id} handleClose={handleCloseApplyModal} />
        </Box>
      </Modal>
    </>
  );
};

export default JobsDetails;
