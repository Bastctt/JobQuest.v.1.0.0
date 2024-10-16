export const columns = {
    advertisements: [
      { field: 'id', headerName: 'ID', width: 90 },
      { field: 'title', headerName: 'Title', width: 150 },
      { field: 'location', headerName: 'Location', width: 150 },
      { field: 'jobType', headerName: 'Job Type', width: 150 },
      { field: 'companyId', headerName: 'Company ID', width: 90 },
      { field: 'description', headerName: 'Description', width: 220 },
      { field: 'totalApplications', headerName: 'Total Applications', width: 70 },
    ],
    people: [
      { field: 'id', headerName: 'ID', width: 70 },
      { field: 'username', headerName: 'Username', width: 120 },
      { field: 'roles', headerName: 'Roles', width: 180 },
      { field: 'isActive', headerName: 'Active', width: 70 },
      { field: 'email', headerName: 'Email', width: 140 },
      { field: 'phone', headerName: 'Phone', width: 140 },
      { field: 'creationDate', headerName: 'Creation Date', width: 140 },
      { field: 'uuid', headerName: 'UUID', width: 210 },
    ],
    companies: [
      { field: 'id', headerName: 'ID', width: 150 },
      { field: 'name', headerName: 'Name', width: 150 },
      { field: 'anneeCreation', headerName: 'Creation Year', width: 150 },
      { field: 'siegeSocialVille', headerName: 'Headquarters', width: 150 },
    ],
    applications: [
      { field: 'appliedAt', headerName: 'Applied At', width: 200 },
      { field: 'companyName', headerName: 'Company Name', width: 200 },
      { field: 'jobTitle', headerName: 'Job Title', width: 200 },
      { field: 'user' , headerName: 'User', width: 200 },
    ],
    applications_no_user: [
      { field: 'appliedAt', headerName: 'Applied At', width: 200 },
      { field: 'companyName', headerName: 'Company Name', width: 200 },
      { field: 'jobTitle', headerName: 'Job Title', width: 120 },
      { field: 'firstName' , headerName: 'First Name', width: 120 },
      { field: 'surname' , headerName: 'Surname', width: 120 },
      { field: 'email', headerName: 'Email', width: 120 },
      { field: 'phone', headerName: 'Phone', width: 120 },
    ]
  };