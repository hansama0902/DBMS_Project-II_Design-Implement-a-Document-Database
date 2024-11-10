# DBMS_Project-II

This project is a Node.js Express application that focuses on querying the `MongoDB_PatientManagementSystem` database using MongoDB. The dataset includes patient management information, and the project performs a series of queries to extract useful insights from the data.

## Project Structure

- **Loading the data**: Import patient management data files: `appointment.json`, `doctors.json`, `medicine_record.json`, `patients.json`, `prescriptions.json`, `tests.json`. These files contain structured data related to appointments, doctors, medicine records, patients, prescriptions, and tests.

- **`init.js`**: This script is responsible for importing the dataset into MongoDB. It uses the `mongoimport` command to load data from JSON files into MongoDB collections:
  ```bash
  mongoimport -h localhost:27017 -d dbms_project -c appointment --file ./db/appointment.json --drop
  mongoimport -h localhost:27017 -d dbms_project -c doctors --file ./db/doctors.json --drop
  mongoimport -h localhost:27017 -d dbms_project -c medicine_record --file ./db/medicine_record.json --drop
  mongoimport -h localhost:27017 -d dbms_project -c patients --file ./db/patients.json --drop
  mongoimport -h localhost:27017 -d dbms_project -c prescriptions --file ./db/prescriptions.json --drop
  mongoimport -h localhost:27017 -d dbms_project -c tests --file ./db/tests.json --drop
  ```
  This command connects to the MongoDB instance running on `localhost` at port `27017` and imports the dataset into the `dbms_project` database, dropping the existing collections before importing.

- **Queries (`Query1.js` to `Query5.js`)**: These files contain individual query scripts that perform various analyses on the data within the `MongoDB_PatientManagementSystem` database.

- **`runAllQueries.js`**: This script is used to execute all queries sequentially, including `init.js` and `Query1.js` to `Query5.js`. It ensures that the data is imported first before running the queries, and each query is executed in order.

## Prerequisites

- **Node.js**
- **Express.js**
- **MongoDB**
- **MongoDB Node.js Driver**
- **Dataset**: JSON files for patient management (`appointment.json`, `doctors.json`, `medicine_record.json`, `patients.json`, `prescriptions.json`, `tests.json`).

## Setup Instructions

1. Clone the repository to your local machine:
   ```bash
   git clone <repository-url>
   cd MongoDB_PatientManagementSystem
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```
3. Install MongoDB:
   ```bash
   npm install mongodb
   ```
4. Import the dataset into MongoDB by running the initialization script & run all queries using the following command:
   ```bash
   npm start
   ```

## Installing MongoDB on macOS

To install MongoDB on a Mac, follow these steps:

1. **Install Homebrew** (if not already installed):
   Homebrew is a package manager for macOS that makes it easy to install software.
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install MongoDB** using Homebrew:
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community@8.0
   ```

3. **Start MongoDB**:
   After installation, start the MongoDB service:
   ```bash
   brew services start mongodb/brew/mongodb-community
   ```

4. **Verify MongoDB is running**:
   You can verify that MongoDB is running by using the following command:
   ```bash
   mongo
   ```
   This will open the MongoDB shell if the server is running properly.

## Installing MongoDB on Docker

To install and run MongoDB using Docker, follow these steps:

1. **Pull the MongoDB Docker image**:
   ```bash
   docker pull mongo:latest
   ```

2. **Run MongoDB in a Docker container**:
   ```bash
   docker run --name mongodb -d -p 27017:27017 -v mongo_data:/data/db mongo:latest
   ```
   - `--name mongodb`: Assigns a name to the container.
   - `-d`: Runs the container in detached mode.
   - `-p 27017:27017`: Maps port 27017 on your local machine to port 27017 in the container.
   - `-v mongo_data:/data/db`: Creates a Docker volume to persist MongoDB data.

3. **Verify MongoDB is running**:
   ```bash
   docker ps
   ```
   This command will show a list of running containers. You should see the MongoDB container listed.

4. **Connect to MongoDB**:
   You can connect to MongoDB using the Mongo shell:
   ```bash
   docker exec -it mongodb mongo
   ```
   This command will open the MongoDB shell inside the running container.

## Project Workflow

1. **Initialization (`init.js`)**: The dataset is imported from JSON files (`appointment.json`, `doctors.json`, `medicine_record.json`, `patients.json`, `prescriptions.json`, `tests.json`) into MongoDB.
   ```bash
   node init.js
   ```

2. **Queries (`Query1.js` to `Query5.js`)**: These files contain various queries that analyze the imported data.
   - **Query1**: Aggregation query to count appointments per doctor, sorted in descending order using the MongoDB aggregation framework.
   - **Query2**: Aggregation query with complex conditions (multiple expressions and logical operators). Condition 1: Appointment date between "2024-11-01" and "2024-11-30". Condition 2: Appointment by a specific doctor (Dr. Jane Smith) and test type is "Blood Test".
   - **Query3**: Counts the number of appointments for a specified patient by counting documents for that specific user.
   - **Query4**: Updates the disease name directly in the `disease_history` field by updating a document based on a query parameter.
   - **Query5**: Aggregation query to count the number of diseases in each patient's `disease_history` and list the disease names.

3. **Execution (`runAllQueries.js`)**: This script runs all the queries sequentially, ensuring that data is properly imported before executing any query.
   ```bash
   node runAllQueries.js
   ```
## Project Information
1.The document includes a business requirements document with an inheritance diagram and Output result.  
2.MongoDB_PatientManagementSystem includes a Node.js project with queries.  

