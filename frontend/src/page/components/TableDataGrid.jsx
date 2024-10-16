import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

const TableDataGrid = ({ rows, columns }) => {
  const editableColumns = columns ? columns.map(column => ({
    ...column,
    editable: true,
  })) : [];

  return (
    <Box>
      {rows.length > 0 ? (
        <DataGrid
          rows={rows}
          pageSize={5}
          columns={editableColumns}
          checkboxSelection
          rowsPerPageOptions={[5]}
          sx={{ height: 550, width: '100%' }}
        />
      ) : (
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          Select a table to view its data
        </Typography>
      )}
    </Box>
  );
};

export default TableDataGrid;