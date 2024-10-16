import React, { useState, useEffect } from "react";

// Lib
import { useSnackbar } from "notistack";
import { useQuery } from "@tanstack/react-query";

// Components
import Footer from "../Footer/Footer";
import JobCard from "./components/JobsCard";
import SearchBar from "../SearchBar/SearchBar";
import Pagination from "../Pagination/Pagination";
import AddJobModal from "./components/modal/job/AddJobModal";
import AddCompanyModal from "./components/modal/company/AddCompanyModal";
import AllCompaniesModal from "./components/modal/company/AllCompaniesModal";

// service
import { fetchJobs } from "../../services/advertisementsService";

// MUI
import Grid2 from "@mui/material/Grid2";
import AddIcon from "@mui/icons-material/Add";
import { CircularProgress, Box, Button, Typography } from "@mui/material";

const Jobs = ({ isAdmin }) => {
  const { data: jobs = [], error, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
    staleTime: Infinity,
  });

  const jobsPerPage = 18;
  const { enqueueSnackbar } = useSnackbar();
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [openAddJobModal, setOpenAddJobModal] = useState(false);
  const [openAddCompanyModal, setOpenAddCompanyModal] = useState(false);
  const [openTableCompanyModal, setOpenTableCompanyModal] = useState(false);

  useEffect(() => {
    if (jobs.length > 0) {
      setFilteredJobs(jobs);
    }
  }, [jobs]);

  const handleSearch = ({ keywords, location }) => {
    const lowercasedKeywords = keywords.toLowerCase().trim();
    const lowercasedLocation = location.toLowerCase().trim();

    if (!lowercasedKeywords && !lowercasedLocation) {
      enqueueSnackbar("Empty filters, please enter some filters", {
        variant: "warning",
      });
      return;
    }

    const filtered = jobs.filter((job) => {
      const isTitleMatch = lowercasedKeywords
        ? job.title.toLowerCase().includes(lowercasedKeywords)
        : true;
      const isCompanyMatch = lowercasedKeywords
        ? job.company.name.toLowerCase().includes(lowercasedKeywords)
        : true;
      const isJobTypeMatch = lowercasedKeywords
        ? job.jobType.toLowerCase().includes(lowercasedKeywords)
        : true;
      const isLocationMatch = lowercasedLocation
        ? job.location.toLowerCase().includes(lowercasedLocation)
        : true;

      return (
        (isTitleMatch || isJobTypeMatch || isCompanyMatch) && isLocationMatch
      );
    });

    if (filtered.length === 0) {
      enqueueSnackbar("No jobs found with the given filters", {
        variant: "warning",
      });
    } else {
      enqueueSnackbar(`${filtered.length} job(s) found`, {
        variant: "success",
      });
    }

    setFilteredJobs(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilteredJobs(jobs);
    setCurrentPage(1);
    enqueueSnackbar("Filters cleared", { variant: "info" });
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleOpenAddJobModal = () => {
    setOpenAddJobModal(true);
  };

  const handleCloseAddJobModal = () => {
    setOpenAddJobModal(false);
  };

  const handleOpenTableCompany = () => {
    setOpenTableCompanyModal(true);
  };

  const handleCloseTableCompany = () => {
    setOpenTableCompanyModal(false);
  };

  const handleOpenAddCompanyModal = () => {
    setOpenAddCompanyModal(true);
  };

  const handleCloseAddCompanyModal = () => {
    setOpenAddCompanyModal(false);
  };

  if (isLoading) {
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

  if (error) {
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
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box
        sx={{
          p: 3,
          mt: 2,
          flex: "1 0 auto",
          ml: { xs: 2, sm: 4, md: 8 },
          mr: { xs: 2, sm: 4, md: 8 },
        }}
      >
        <SearchBar onSearch={handleSearch} onClear={clearFilters} />
        <Grid2
          container
          spacing={2}
          sx={{ mb: 4 }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid2 size={{ xs: 12, sm: "auto" }}>
            <Typography
              variant="h5"
              sx={{
                color: "secondary.main",
                fontWeight: 600,
                fontSize: "2.1rem",
                borderBottom: "2px solid #2557a7",
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              Latest Job Opportunities
            </Typography>
          </Grid2>

          {isAdmin && (
            <Grid2
              size={{ xs: 12, sm: "auto" }}
              sx={{
                display: "flex",
                justifyContent: { xs: "center", sm: "flex-end" },
                gap: 2,
              }}
            >
              <Button
                size="small"
                color="primary"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleOpenAddJobModal}
                sx={{ width: { xs: "50%", sm: "auto" } }}
              >
                Add Job
              </Button>
              <Button
                size="small"
                color="primary"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleOpenAddCompanyModal}
                sx={{ width: { xs: "50%", sm: "auto" } }}
              >
                Add Company
              </Button>
              <Button
                size="small"
                color="primary"
                variant="text"
                onClick={handleOpenTableCompany}
                sx={{ width: { xs: "50%", sm: "auto" } }}
              >
                See all companies...
              </Button>
            </Grid2>
          )}
        </Grid2>

        <Grid2 container spacing={3}>
          {currentJobs.map((job) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }} key={job.id}>
              <JobCard job={job} isAdmin={isAdmin} />
            </Grid2>
          ))}
        </Grid2>

        <AddJobModal
          open={openAddJobModal}
          handleClose={handleCloseAddJobModal}
        />
        <AddCompanyModal
          open={openAddCompanyModal}
          handleClose={handleCloseAddCompanyModal}
        />
        <AllCompaniesModal
          open={openTableCompanyModal}
          handleClose={handleCloseTableCompany}
        />
      </Box>

      <Box
        sx={{ mt: "auto", mb: 4, display: "flex", justifyContent: "center" }}
      >
        <Pagination
          jobsPerPage={jobsPerPage}
          currentPage={currentPage}
          totalJobs={filteredJobs.length}
          handlePageChange={handlePageChange}
        />
      </Box>

      <Footer sx={{ flexShrink: 0 }} />
    </Box>
  );
};

export default Jobs;
