import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';

const ListTables = ({ onTableClick, selectedTable }) => {

  const tables = ["advertisements", "people", "companies", "applications", "applications_no_user"];

  return (
    <Box mb={4} mt={4}>
      <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: 2 }}>
        JobQuest Tables
      </Typography>
      <Stack display={"flex"} justifyContent={"center"} flexDirection={"row"} gap={2}>
        {tables.map((table, index) => (
          <Button
            key={index}
            size="small"
            color="primary"
            variant={selectedTable === table ? "contained" : "outlined"}
            onClick={() => onTableClick(table)}
          >
            {table}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default ListTables;