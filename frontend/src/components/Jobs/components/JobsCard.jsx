import React, { useState } from "react";

// Components
import JobsDetails from "./JobsDetails";

// MUI
import { Card, CardContent, Typography, Button } from "@mui/material";

const JobCard = ({ job, isAdmin }) => {
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const truncateTitle = (title) => {
    const words = title.split(" ");
    if (words.length > 2) {
      return words.slice(0, 2).join(" ") + "...";
    }
    return title;
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          borderRadius: 2,
          display: "flex",
          position: "relative",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: "transform 0.3s",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          cursor: "pointer",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <CardContent>
          <Typography
            color="success"
            variant="body2"
            sx={{ position: "absolute", top: 10, right: 10 }}
          >
            {job.totalApplications} candidates
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{
              height: "auto",
              fontWeight: "bold",
              WebkitLineClamp: 2,
              overflow: "hidden",
              color: "primary.main",
              display: "-webkit-box",
              textOverflow: "ellipsis",
              WebkitBoxOrient: "vertical",
            }}
          >
            {truncateTitle(job.title)}
          </Typography>

          <Typography
            sx={{
              mb: 1,
              height: "auto",
              fontSize: "0.9rem",
              overflow: "hidden",
              whiteSpace: "nowrap",
              color: "text.secondary",
              textOverflow: "ellipsis",
            }}
          >
            <strong>{job.company.name}</strong> - {job.location}
          </Typography>

          <Typography
            sx={{
              fontWeight: "bold",
              color: "primary.main",
            }}
          >
            {job.jobType}
          </Typography>

        </CardContent>
          <Button
            color="primary"
            size="small"
            variant="text"
            onClick={handleOpenModal}
            sx={{
              bottom: 8,
              right: 8,
              position: "absolute",
            }}
          >
            Learn More...
          </Button>
      </Card>

      <JobsDetails
        job={job}
        open={openModal}
        isAdmin={isAdmin}
        handleClose={handleCloseModal}
      />
    </>
  );
};

export default JobCard;
