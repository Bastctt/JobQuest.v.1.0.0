import React, { useState } from "react";

// Lib
import { useSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// MUI
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import {
  Avatar,
  Typography,
  Modal,
  Box,
  IconButton,
  Divider,
  CircularProgress,
  Button,
} from "@mui/material";

// Components
import OpenFile from '../../custom/viewer/OpenFile';
import ConfirmModal from "../../custom/components/ConfirmModal";

// Service
import { deleteUser } from "../../services/userService";
import { uploadCV } from "../../services/uploadService";
import { viewCV } from "../../services/uploadService";

const stringToColor = (string) => {
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FF8F33",
    "#33FFF5", "#8D33FF", "#FF3333", "#33FF8D", "#FF5733"
  ];
  const index = string.charCodeAt(0) % colors.length;
  return colors[index];
};

const Profile = ({
  open,
  onClose,
  setIsLoggedIn,
  isAdmin,
  isLoading,
  isError,
  userInfo,
  setUserInfo,
}) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openFileModal, setOpenFileModal] = useState(false);
  const [pdfToView, setPdfToView] = useState(null);

  const { mutate: handleDeleteUser, isLoading: isDeleting } = useMutation(
    deleteUser,
    {
      onSuccess: () => {
        enqueueSnackbar("User deleted successfully", {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
        localStorage.removeItem("userInfo");
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        queryClient.removeQueries("user");
        onClose();
      },
      onError: () => {
        enqueueSnackbar(`Failed to delete user`, {
          variant: "error",
        });
      },
    }
  );

  const { mutate: handleUploadCV, isLoading: isUploading } = useMutation(
    uploadCV,
    {
      onSuccess: (data) => {
        enqueueSnackbar("CV uploaded successfully", {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
        setSelectedFile(null);
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          cvPath: data.cvPath,
        }));
      },
      onError: (error) => {
        enqueueSnackbar(`Failed to upload CV: ${error.message}`, {
          variant: "error",
        });
      },
    }
  );

  const { mutate: handleViewCV, isLoading: isViewing } = useMutation(
    viewCV,
    {
      onSuccess: () => {
        enqueueSnackbar("CV opened successfully", {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
        setSelectedFile(null);
      },
      onError: (error) => {
        enqueueSnackbar(`Failed to open CV: ${error.message}`, {
          variant: "error",
        });
      },
    }
  );

  if (!open && selectedFile) {
    setSelectedFile(null);
  }

  const handleDeleteClick = () => {
    setOpenConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setOpenConfirmModal(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      enqueueSnackbar("PDF ready to be uploaded", {
        variant: "info",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    } else {
      enqueueSnackbar("Please upload a valid PDF file", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    }
  };

  const handleFileOpen = () => {
    if (selectedFile) {
      setOpenFileModal(true);
    }
  };

  const handleUploadClick = () => {
    if (selectedFile && userInfo) {
      handleUploadCV({ uuid: userInfo.uuid, cvFile: selectedFile });
    }
  };

  const handleOpenUploadedCV = () => {
    if (userInfo.cvPath) {
      setPdfToView(`${userInfo.cvPath}`);
      setOpenFileModal(true);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            p: 4,
            top: "50%",
            left: "50%",
            boxShadow: 24,
            overflow: "hidden",
            borderRadius: "8px",
            position: "absolute",
            bgcolor: "background.paper",
            transform: "translate(-50%, -50%)",
            width: { xs: "70%", sm: "50%", md: "30%" },
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              top: 8,
              right: 8,
              position: "absolute",
            }}
          >
            <CloseIcon />
          </IconButton>
          {isAdmin && (
            <IconButton
              sx={{
                top: 8,
                left: 8,
                position: "absolute",
              }}
            >
              <AdminPanelSettingsIcon color="primary"/>
            </IconButton>
          )}

          {!isAdmin && (
            <>
              <IconButton
                onClick={handleDeleteClick}
                sx={{
                  top: 8,
                  left: 8,
                  position: "absolute",
                }}
                disabled={isDeleting}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </>
          )}

          <Box
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {isLoading ? (
              <CircularProgress />
            ) : isError ? (
              <Typography variant="body1" color="text.secondary">
                Failed to load user information.
              </Typography>
            ) : userInfo ? (
              <>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    mb: 2,
                    bgcolor: stringToColor(userInfo.username),
                  }}
                >
                  <Typography variant="h4" color="white">
                    {userInfo.username[0].toUpperCase()}
                  </Typography>
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {userInfo.username}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 1 }}>
                  {userInfo.email}
                </Typography>
                <Typography color="text.secondary">
                  {userInfo.phone}
                </Typography>
                <Typography color="text.secondary">{userInfo.tel}</Typography>
                <Divider sx={{ my: 2, width: "100%" }} />
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Member since -{" "}
                  <strong>
                    {new Date(userInfo.creationDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </strong>
                </Typography>
                <Typography sx={{ mb: isAdmin ? 0 : 2 }} variant="body1" color="text.secondary">
                  Status -{" "}
                  <strong>{userInfo.isActive ? "Active" : "Inactive"}</strong>
                </Typography>

                {!isAdmin && (
                  userInfo.cvPath ? (
                    <Button
                      color="primary"
                      variant="outlined"
                      size="small"
                      onClick={handleViewCV}
                    >
                      {userInfo.cvPath}
                    </Button>
                  ) : (
                    !selectedFile && (
                      <Button
                        size="small"
                        variant="contained"
                        component="label"
                      >
                        Upload CV
                        <input
                          type="file"
                          hidden
                          accept="application/pdf"
                          onChange={handleFileChange}
                        />
                      </Button>
                    )
                  )
                )}

                {selectedFile && (
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ mr: 2 }}>
                      {selectedFile.name}
                    </Typography>
                    <IconButton
                      color="primary"
                      onClick={handleUploadClick}
                      disabled={isUploading}
                    >
                      <SendIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={handleFileOpen}
                    >
                      <InsertPhotoIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={handleRemoveFile}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                )}
              </>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No user information available.
              </Typography>
            )}
          </Box>
        </Box>
      </Modal>

      {openFileModal && (
        <OpenFile file={pdfToView ? pdfToView : selectedFile} />
      )}

      <ConfirmModal
        item={userInfo}
        queryKey="users"
        open={openConfirmModal}
        deleteFunction={handleDeleteUser}
        handleClose={handleCloseConfirmModal}
      />
    </>
  );
};

export default Profile;