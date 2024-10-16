import React from "react";

// Lib
import { useSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// MUI
import { Close as CloseIcon } from "@mui/icons-material";
import { Box, Button, Typography, Modal, IconButton } from "@mui/material";

const ConfirmModal = ({
  open,
  handleClose,
  item,
  deleteFunction,
  queryKey,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutate: deleteItem, isLoading } = useMutation({
    mutationFn: () => deleteFunction(item.id),
    onSuccess: () => {
      queryClient.invalidateQueries([queryKey]);
      handleClose();
    },
    onError: (error) => {
      enqueueSnackbar("Failed to delete item. Please try again.", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      console.error("Error deleting item:", error);
    },
  });

  const handleDelete = () => {
    if (item?.id) {
      deleteItem();
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
          display: "flex",
          borderRadius: 2,
          alignItems: "center",
          position: "absolute",
          flexDirection: "column",
          justifyContent: "space-between",
          bgcolor: "background.paper",
          transform: "translate(-50%, -50%)",
          width: { xs: "70%", sm: "40%", md: "30%", lg: "30%", xl: "20%" },
          height: { xs: "20%", sm: "20%", md: "20%", lg: "20%", xl: "20%" },
        }}
      >
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
          }}
        >
          <Typography
            id="confirm-modal-title"
            variant="body1"
            color="secondary"
            sx={{ textAlign: "center" }}
          >
            Are you sure you want to delete this item?
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "50%",
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="small"
            fullWidth
            sx={{ mr: 1 }}
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Confirm"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            fullWidth
            onClick={handleClose}
            sx={{ ml: 1 }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmModal;
