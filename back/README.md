# API Documentation

## Advertisements API

### Get All Jobs

**Endpoint:** `/api/jobs`

**Method:** `GET`

**Description:** Retrieves a list of all jobs with total applications.

**Responses:**

- `200 OK`: Returns the list of jobs.
- `404 Not Found`: No jobs found.
- `500 Internal Server Error`: An error occurred while fetching jobs.

### Delete Job

**Endpoint:** `/api/jobs/{id}`

**Method:** `DELETE`

**Description:** Deletes a job by its ID.

**Headers:**

- `uuid`: User UUID (required)

**Responses:**

- `204 No Content`: Job successfully deleted.
- `400 Bad Request`: UUID not provided.
- `403 Forbidden`: Access denied. Admin privileges required.
- `404 Not Found`: Job not found.
- `500 Internal Server Error`: An error occurred while deleting the job.

### Update Job

**Endpoint:** `/api/jobs/{id}`

**Method:** `PUT`

**Description:** Updates a job by its ID.

**Headers:**

- `uuid`: User UUID (required)

**Request Body:**

- JSON representation of the job to be updated.

**Responses:**

- `204 No Content`: Job successfully updated.
- `400 Bad Request`: UUID not provided or an error occurred while updating the job.
- `403 Forbidden`: Access denied. Admin privileges required.
- `404 Not Found`: Job not found.

### Create Job

**Endpoint:** `/api/jobs`

**Method:** `POST`

**Description:** Creates a new job.

**Headers:**

- `uuid`: User UUID (required)

**Request Body:**

- JSON representation of the job to be created.

**Responses:**

- `201 Created`: Job successfully created.
- `400 Bad Request`: UUID not provided, invalid JSON format, or company name is required.
- `403 Forbidden`: Access denied. Admin privileges required.
- `404 Not Found`: User or company not found.
- `500 Internal Server Error`: An error occurred while creating the job.

## Companies API

### Get All Companies

**Endpoint:** `/api/company`

**Method:** `GET`

**Description:** Retrieves a list of all companies.

**Responses:**

- `200 OK`: Returns the list of companies.
- `500 Internal Server Error`: An error occurred while fetching companies.

### Delete Company

**Endpoint:** `/api/company/{id}`

**Method:** `DELETE`

**Description:** Deletes a company by its ID.

**Headers:**

- `uuid`: User UUID (required)

**Responses:**

- `204 No Content`: Company successfully deleted.
- `400 Bad Request`: UUID not provided.
- `403 Forbidden`: Access denied. Admin privileges required.
- `404 Not Found`: Company not found.
- `500 Internal Server Error`: An error occurred while deleting the company.

### Update Company

**Endpoint:** `/api/company/{id}`

**Method:** `PUT`

**Description:** Updates a company by its ID.

**Headers:**

- `uuid`: User UUID (required)

**Request Body:**

- JSON representation of the company to be updated.

**Responses:**

- `204 No Content`: Company successfully updated.
- `400 Bad Request`: UUID not provided or an error occurred while updating the company.
- `403 Forbidden`: Access denied. Admin privileges required.
- `404 Not Found`: Company not found.

### Create Company

**Endpoint:** `/api/company`

**Method:** `POST`

**Description:** Creates a new company.

**Headers:**

- `uuid`: User UUID (required)

**Request Body:**

- JSON representation of the company to be created.

**Responses:**

- `201 Created`: Company successfully created.
- `400 Bad Request`: UUID not provided or missing required fields.
- `403 Forbidden`: Access denied. Admin privileges required.
- `404 Not Found`: User not found.
- `500 Internal Server Error`: An error occurred while creating the company.

## Applications API

### Get User Applications

**Endpoint:** `/api/user/applications`

**Method:** `GET`

**Description:** Retrieves a list of applications for the authenticated user.

**Headers:**

- `uuid`: User UUID (required)

**Responses:**

- `200 OK`: Returns the list of applications.
- `400 Bad Request`: UUID not provided.
- `404 Not Found`: User or applications not found.
- `500 Internal Server Error`: An error occurred while fetching applications.

### Delete User Application

**Endpoint:** `/api/user/applications`

**Method:** `DELETE`

**Description:** Deletes an application for the authenticated user.

**Headers:**

- `uuid`: User UUID (required)

**Request Body:**

- JSON representation containing the job ID.

**Responses:**

- `200 OK`: Application successfully deleted.
- `400 Bad Request`: UUID or job ID not provided.
- `404 Not Found`: User or application not found.
- `500 Internal Server Error`: An error occurred while deleting the application.

### Create Application

**Endpoint:** `/api/apply`

**Method:** `POST`

**Description:** Creates a new application.

**Headers:**

- `uuid`: User UUID (optional)

**Request Body:**

- JSON representation of the application to be created.

**Responses:**

- `201 Created`: Application successfully created.
- `400 Bad Request`: UUID or job ID not provided, or missing required fields for non-connected user.
- `404 Not Found`: User or job not found.
- `409 Conflict`: Application already exists.
- `500 Internal Server Error`: An error occurred while creating the application.

## Authentication API

### Login

**Endpoint:** `/api/login`

**Method:** `POST`

**Description:** Authenticates a user.

**Request Body:**

- JSON representation containing the username and password.

**Responses:**

- `200 OK`: Login successful.
- `400 Bad Request`: Invalid credentials.
- `401 Unauthorized`: User not found or invalid credentials.

### Logout

**Endpoint:** `/api/logout`

**Method:** `POST`

**Description:** Logs out the authenticated user.

**Responses:**

- `200 OK`: Logout successful.

### Register

**Endpoint:** `/api/register`

**Method:** `POST`

**Description:** Registers a new user.

**Request Body:**

- JSON representation containing the username, password, email, and phone.

**Responses:**

- `201 Created`: Registration successful.
- `400 Bad Request`: Invalid data.
- `409 Conflict`: Username, email, or phone already taken.

## People API

### Get All Users

**Endpoint:** `/api/users`

**Method:** `GET`

**Description:** Retrieves a list of all users.

**Responses:**

- `200 OK`: Returns the list of users.
- `404 Not Found`: No users found.
- `500 Internal Server Error`: An error occurred while fetching users.

### Get User Details

**Endpoint:** `/api/users/show`

**Method:** `GET`

**Description:** Retrieves details of the authenticated user.

**Headers:**

- `uuid`: User UUID (required)

**Responses:**

- `200 OK`: Returns the user details.
- `400 Bad Request`: UUID not provided.
- `404 Not Found`: User not found.
- `500 Internal Server Error`: An error occurred while fetching user details.

### Delete User

**Endpoint:** `/api/user`

**Method:** `DELETE`

**Description:** Deletes the authenticated user.

**Headers:**

- `uuid`: User UUID (required)

**Responses:**

- `204 No Content`: User successfully deleted.
- `400 Bad Request`: UUID not provided.
- `403 Forbidden`: Access denied.
- `404 Not Found`: User not found.
- `500 Internal Server Error`: An error occurred while deleting the user.

### Update User

**Endpoint:** `/api/user`

**Method:** `PUT`

**Description:** Updates the authenticated user.

**Headers:**

- `uuid`: User UUID (required)

**Request Body:**

- JSON representation of the user to be updated.

**Responses:**

- `204 No Content`: User successfully updated.
- `400 Bad Request`: UUID not provided or an error occurred while updating the user.
- `403 Forbidden`: Access denied.
- `404 Not Found`: User not found.
