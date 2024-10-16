import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useMutation } from "@tanstack/react-query";

// Service
import { deleteCompanies } from "../../services/CompanyService";

// MUI
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Typography,
} from "@mui/material";

// Components
import ConfirmModal from "../../custom/components/ConfirmModal";

const CompaniesTable = ({ companies, setCompanies }) => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [deletingCompanyId, setDeletingCompanyId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: deleteCompany } = useMutation({
    mutationFn: (companyId) => deleteCompanies(companyId),
    onSuccess: (data, variables) => {
      setCompanies((prevCompanies) =>
        prevCompanies.filter((company) => company.id !== variables)
      );
      enqueueSnackbar("Company deleted successfully!", {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      setOpenConfirmModal(false);
      setDeletingCompanyId(null);
    },
    onError: (error) => {
      enqueueSnackbar("Failed to delete company. Please try again.", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      console.error("Error deleting company:", error);
      setDeletingCompanyId(null);
    },
  });

  const handleDeleteClick = (company) => {
    setSelectedCompany(company);
    setOpenConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setOpenConfirmModal(false);
    setSelectedCompany(null);
  };

  const handleConfirmDelete = () => {
    if (selectedCompany) {
      setDeletingCompanyId(selectedCompany.id);
      deleteCompany(selectedCompany.id);
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "#2557a7" }}>Name</TableCell>
              <TableCell style={{ color: "#2557a7" }}>
                Creation Year
              </TableCell>
              <TableCell style={{ color: "#2557a7" }}>Headquarters</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.length > 0 ? (
              companies.map((company, index) => (
                <TableRow
                  key={company.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "grey.100" : "white",
                  }}
                >
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.anneeCreation}</TableCell>
                  <TableCell>{company.siegeSocialVille}</TableCell>
                  <TableCell>
                    {deletingCompanyId === company.id ? (
                      <CircularProgress size={24} />
                    ) : (
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteClick(company)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No companies available.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmModal
        queryKey="companies"
        item={selectedCompany}
        open={openConfirmModal}
        deleteFunction={handleConfirmDelete}
        handleClose={handleCloseConfirmModal}
      />
    </>
  );
};

export default CompaniesTable;