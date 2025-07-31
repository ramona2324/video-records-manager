# Video Records RESTful API

This project implements a simple RESTful API for managing video records, built with NestJS and utilizing Microsoft SQL Server (MSSQL) for data persistence via TypeORM. It also integrates Swagger for comprehensive API documentation and interactive testing.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Setup and Run Instructions](#setup-and-run-instructions)
  - [Prerequisites](#prerequisites)
  - [Database Configuration](#database-configuration)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
-   [API Endpoints](#api-endpoints)
  -   [1. Add a New Video Record](#1-add-a-new-video-record)
  -   [2. Delete a Video Record by ID](#2-delete-a-video-record-by-id)
  -   [3. Update a Video Record by ID](#3-update-a-video-record-by-id)
  -   [4. Get All Video Records (with Optional Sorting)](#4-get-all-video-records-with-optional-sorting)
  -   [5. Seed Database (Development Only)](#5-seed-database-development-only)
-   [Swagger Documentation](#swagger-documentation)
-   [Database Schema](#database-schema)
-   [Sample Records](#sample-records)
-   [Error Handling](#error-handling)
-   [Evaluation Criteria](#evaluation-criteria)

---

## Features

-   Create, Retrieve, Update, and Delete (CRUD) operations for video records.
-   Support for sorting video records by various criteria (`name`, `post_date`, `views_count`) and order (`asc`, `desc`).
-   Data persistence using TypeORM with Microsoft SQL Server.
-   Comprehensive API documentation via Swagger UI.
-   Validation for all incoming request payloads.

## Requirements

The API supports the following features as per the task:
-   Add a new video record
-   Delete a video record by ID
-   Update an existing video record
-   Get all video records, with support for sorting (by `name`, `post_date`, `views_count` and `asc`/`desc` order).

## Setup and Run Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
-   [npm](https://www.npmjs.com/get-npm) (comes with Node.js) or [Yarn](https://yarnpkg.com/getting-started/install)
-   **Microsoft SQL Server Instance**:
    -   Ensure you have an accessible MSSQL Server instance (e.g., `DAVTXN0003\SQLEXPRESS01`).
    -   **Authentication Mode:** Must be configured for "SQL Server and Windows Authentication mode" (Mixed Mode).
    -   **Network Protocols:** TCP/IP must be enabled for your instance.
    -   **SQL Server Browser Service:** Must be running (essential for named instances).
    -   **Firewall:** Ensure your SQL Server machine's firewall allows inbound connections on the configured port (e.g., `1435` for `SQLEXPRESS01`, or `1433` for a default instance).

### Database Configuration

1.  Create a database named `VideoRecordsDB` on your SQL Server instance (`DAVTXN0003\SQLEXPRESS01` or `DAVTXN0003` if using default instance).
2.  Create a SQL Server login (e.g., `video-manager`) with a password (e.g., `123`).
3.  Map this login to a user in the `VideoRecordsDB` database and grant it `db_owner` permissions (for `synchronize: true` to work in development).
4.  Create a `.env` file in the root of the project with the following content:

_Adjust `DB_INSTANCE` and `DB_PORT` based on which SQL Server instance you are targeting and its configuration._

### Installation

1.  Clone this repository:
    ```bash
    git clone <your-repository-url>
    cd video-records-api
    ```
2.  Install the dependencies:
    ```bash
    npm install
    # or yarn install
    ```

### Running the Application

1.  Start the application in development mode:
    ```bash
    npm run start:dev
    # or yarn start:dev
    ```
    The application will typically run on `http://localhost:3000`.

2.  Access the Swagger API documentation at:
    ```
    http://localhost:3000/api
    ```

## API Endpoints

The API is accessible at `http://localhost:3000/videos`. All requests and responses are in JSON format.

### 1. Add a New Video Record

-   **Endpoint:** `POST /videos/`
-   **Description:** Creates a new video entry.
-   **Request Body (`application/json`):**
    ```json
    {
        "id": "unique_video_id_001",
        "name": "Introduction to NestJS",
        "href": "[http://example.com/videos/nestjs-intro](http://example.com/videos/nestjs-intro)",
        "date_posted": "2024-01-15",
        "views_count": 1250
    }
    ```
-   **Validations:**
    -   `id` must be unique.
    -   All fields (`id`, `name`, `href`, `date_posted`, `views_count`) are required and must be valid according to their types.
-   **Success Response (201 Created):**
    ```json
    {
        "id": "unique_video_id_001",
        "name": "Introduction to NestJS",
        "href": "[http://example.com/videos/nestjs-intro](http://example.com/videos/nestjs-intro)",
        "post_date": "2024-01-15T00:00:00.000Z",
        "views_count": 1250
    }
    ```
-   **Error Responses (400 Bad Request, 409 Conflict):**
    -   `400` if validation fails (e.g., missing required fields, invalid types).
    -   `409` if `id` is not unique (if `id` is client-provided).

### 2. Delete a Video Record by ID

-   **Endpoint:** `DELETE /videos/{id}/`
-   **Description:** Deletes a video by its unique id.
-   **Path Parameters:**
    -   `id`: The unique identifier of the video (e.g., `unique_video_id_001`).
-   **Validations:**
    -   The video must exist.
-   **Success Response (204 No Content):** (Empty response body)
-   **Error Response (404 Not Found):**
    -   `404` if the video with the specified ID does not exist.

### 3. Update a Video Record by ID

-   **Endpoint:** `PUT /videos/{id}/`
-   **Description:** Updates an existing video entry by its id.
-   **Path Parameters:**
    -   `id`: The unique identifier of the video to update (e.g., `unique_video_id_001`).
-   **Request Body (`application/json`):**
    ```json
    {
        "name": "Updated NestJS Introduction",
        "href": "[http://example.com/videos/updated-nestjs](http://example.com/videos/updated-nestjs)",
        "date_posted": "2024-01-20",
        "views_count": 1300
    }
    ```
-   **Validations:**
    -   The video must exist.
    -   All fields must be provided and valid (as defined in `UpdateVideoDto`).
-   **Success Response (200 OK):**
    ```json
    {
        "id": "unique_video_id_001",
        "name": "Updated NestJS Introduction",
        "href": "[http://example.com/videos/updated-nestjs](http://example.com/videos/updated-nestjs)",
        "post_date": "2024-01-20T00:00:00.000Z",
        "views_count": 1300
    }
    ```
-   **Error Responses (400 Bad Request, 404 Not Found):**
    -   `400` if validation fails.
    -   `404` if the video with the specified ID does not exist.

### 4. Get All Video Records (with Optional Sorting)

-   **Endpoint:** `GET /videos/`
-   **Description:** Retrieves all video records, optionally sorted.
-   **Query Parameters:**
    -   `sort_by` (Optional): Field to sort by. Must be one of `name`, `date_posted`, or `views_count`.
        -   Example: `GET /videos?sort_by=date_posted`
    -   `order` (Optional): Sort order. Must be `asc` or `desc`. Only applies if `sort_by` is provided.
        -   Example: `GET /videos?sort_by=views_count&order=desc`
-   **Success Response (200 OK):**
    ```json
    [
        {
            "id": "unique_video_id_001",
            "name": "Introduction to NestJS",
            "href": "[http://example.com/videos/nestjs-intro](http://example.com/videos/nestjs-intro)",
            "post_date": "2024-01-15T00:00:00.000Z",
            "views_count": 1250
        },
        // ... more video records
    ]
    ```

### 5. Seed Database (Development Only)

-   **Endpoint:** `POST /videos/seed`
-   **Description:** Populates the `Videos` table with sample data. This endpoint is primarily for development and testing. It will clear existing data before inserting new samples.
-   **Request Body:** (Empty)
-   **Success Response (201 Created):** Returns an array of the newly seeded video records.
-   **Error Responses (500 Internal Server Error, 409 Conflict):**
    -   `500` if an unexpected error occurs during seeding.
    -   `409` if attempting to seed with duplicate IDs (if `id` is client-provided and you run it multiple times without clearing).

## Swagger Documentation

Access the interactive API documentation and testing interface at:
`http://localhost:3000/api`

## Database Schema

The `Videos` table is created by TypeORM (when `synchronize: true`) with the following structure:

-   `id`: `NVARCHAR(255)`, Primary Key (Client-provided string)
-   `name`: `NVARCHAR(255)`, NOT NULL
-   `href`: `NVARCHAR(500)`, NOT NULL
-   `post_date`: `DATE`, NOT NULL
-   `views_count`: `INT`, NOT NULL, default `0`

## Sample Records

Upon successful execution of the `POST /videos/seed` endpoint, 5-10 sample records will be inserted into the `Videos` table for testing purposes.

## Error Handling

The API handles various error conditions gracefully, providing appropriate HTTP status codes and error messages for:
-   Validation failures (400 Bad Request)
-   Resource not found (404 Not Found)
-   Duplicate ID conflicts (409 Conflict - if ID is client-provided)
-   Internal server errors (500 Internal Server Error)

---

## Evaluation Criteria

This project will be evaluated based on the following:

-   **Code Structure:** Organization, modularity, readability, and adherence to NestJS best practices.
-   **Functionality:** All specified API endpoints work as expected, including sorting and validation.
-   **Database Handling:** Data is read and written safely and consistently from/to the database.
-   **Error Handling:** Edge cases, missing/invalid input, and other errors are handled gracefully with appropriate responses.