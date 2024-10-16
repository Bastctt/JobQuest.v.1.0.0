import React, { useState } from "react";

// MUI
import { TextField, Button, Typography, Box, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

// Lib
import { useSnackbar } from "notistack";
import { useMutation } from "@tanstack/react-query";

// Service
import { createApplyWithUser } from "../../../../../services/applyService";

const ApplyNoUser = ({ jobId, handleClose }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [formData, setFormData] = useState({
        first_name: '',
        surname: '',
        phone: '',
        email: '',
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const { mutate: applyToJob, isLoading: isApplying } = useMutation(
        () => createApplyWithUser({ ...formData, job_id: jobId }),
        {
            onSuccess: () => {
                enqueueSnackbar("Application sent successfully!", {
                    variant: "success",
                    autoHideDuration: 3000,
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });
                setFormData({
                    first_name: '',
                    surname: '',
                    phone: '',
                    email: '',
                });
                handleClose();
            },
            onError: () => {
                enqueueSnackbar("Failed to apply for job", {
                    variant: "error",
                });
            },
        }
    );

    const handleApply = () => {
        applyToJob();
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
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
            <Typography variant="body1" color="primary" sx={{ mb: 2 }}>
                Non-registered user? Please fill out the form below to apply:
            </Typography>
            <Box
                component="form"
                sx={{
                    gap: 2,
                    width: { xs: "80%", sm: "70%", md: "70%" },
                }}
            >
                <TextField
                    label="First Name"
                    name="first_name"
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    margin="normal"
                    autoComplete="off"
                    value={formData.first_name}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Surname"
                    name="surname"
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    autoComplete="off"
                    margin="normal"
                    value={formData.surname}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Phone"
                    name="phone"
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    margin="normal"
                    autoComplete="off"
                    value={formData.phone}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Email"
                    name="email"
                    fullWidth
                    autoComplete="off"
                    required
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    margin="normal"
                    value={formData.email}
                    onChange={handleInputChange}
                />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    onClick={handleApply}
                    disabled={isApplying}
                >
                    {isApplying ? "Applying..." : "Apply"}
                </Button>
            </Box>
        </Box>
    );
};

export default ApplyNoUser;