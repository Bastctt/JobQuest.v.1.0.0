import React from "react";

// MUI
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";

const JobPagination = ({
  totalJobs,
  jobsPerPage,
  currentPage,
  handlePageChange,
}) => {
  const pageCount = Math.ceil(totalJobs / jobsPerPage);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Pagination
        color="primary"
        count={pageCount}
        page={currentPage}
        onChange={(event, value) => handlePageChange(value)}
      />
    </Box>
  );
};

export default JobPagination;
