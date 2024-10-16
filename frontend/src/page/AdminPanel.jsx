import React, { useState } from "react";
import { Stack, Box, Typography, CircularProgress } from "@mui/material";
import { useQuery } from '@tanstack/react-query';

// components
import { columns } from "./components/tableColumns";
import ListTables from "./components/ListTables";
import TableDataGrid from "./components/TableDataGrid";

// service
import { getAllUsers } from "../services/userService";
import { fetchCompanies } from "../services/companyService";
import { fetchJobs } from "../services/advertisementsService";
import { getAllApplications } from "../services/applyService";
import { getAllApplicationsNoUser } from "../services/applyService";

const AdminPanel = () => {
  const [selectedTable, setSelectedTable] = useState(null);

  const { data: advertisementsData = [], error: jobsError, isLoading: jobsLoading } = useQuery(['jobs'], fetchJobs);

  const { data: companiesData = [], error: companiesError, isLoading: companiesLoading } = useQuery(['companies'], fetchCompanies);

  const { data: usersData = [], error: usersError, isLoading: usersLoading } = useQuery(['users'], getAllUsers);

  const { data: allApplicationsData = [], error: applicationsError, isLoading: applicationsLoading } = useQuery(['applications'], getAllApplications);

  const { data: allApplicationsNoUserData = [], error: applicationsNoUserError, isLoading: applicationsNoUserLoading } = useQuery(['applicationsNoUser'], getAllApplicationsNoUser);

  const handleTableClick = (table) => {
    setSelectedTable(table);
  };

  const rows = {
    advertisements: Array.isArray(advertisementsData) ? advertisementsData.map((row, index) => ({
      ...row,
      id: row.id || index,
      companyId: row.company?.id,
    })) : [],
    people: Array.isArray(usersData) ? usersData.map((row, index) => ({ ...row, id: row.id || index })) : [],
    companies: Array.isArray(companiesData) ? companiesData.map((row, index) => ({ ...row, id: row.id || index })) : [],
    applications: Array.isArray(allApplicationsData) ? allApplicationsData.map((row, index) => ({ ...row, id: row.id || index })) : [],
    applications_no_user: Array.isArray(allApplicationsNoUserData) ? allApplicationsNoUserData.map((row, index) => ({ ...row, id: row.id || index })) : [],
  };

  if (jobsLoading || companiesLoading || usersLoading || applicationsLoading || applicationsNoUserLoading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (jobsError || companiesError || usersError || applicationsError || applicationsNoUserError) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography color="secondary" sx={{ opacity: 0.3 }} variant="h3">
          No job offers currently...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Stack sx={{ height: "100%", width: "100%" }}>
        <Stack sx={{ display: "flex", alignItems: "center"}}>
          <Box sx={{ width: "80%"}}>
            <ListTables onTableClick={handleTableClick} selectedTable={selectedTable} />
          </Box>

          <Box sx={{ width: "80%"}}>
            <TableDataGrid
              rows={selectedTable ? rows[selectedTable] : []}
              columns={selectedTable && columns[selectedTable] ? columns[selectedTable] : columns.jobs}
            />
          </Box>
        </Stack>
      </Stack>
    </>
  );
};

export default AdminPanel;