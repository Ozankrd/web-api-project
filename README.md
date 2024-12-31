# Cocktail Management with Two-Factor Authentication

## Introduction
This project provides a web platform for managing cocktail recipes. Users can publish, view, and interact with recipes while ensuring enhanced security through two-factor authentication.

---

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  

---

## Features

### User Management
- **Registration**: Account creation with field validation.
- **Login**: Secure login using Passport.js and two-factor authentication via temporary codes.
- **Profile Update**: Update personal information (email, password).
- **Logout**: Secure session management.

### Cocktail Management
- **Add Recipes**: Upload images and manage metadata.
- **Delete Recipes**: Access restricted to recipe owners.
- **View Recipes**: Display cocktail lists and details.

### Real-Time Interactions
- **Notifications**: Real-time updates on new and deleted cocktails using Socket.IO.

---

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed (version 14 or higher).
- PostgreSQL installed and running.
- A Mailtrap account for email testing.
- Basic knowledge of JavaScript and REST API management.

---

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/Ozankrd/web-api-project
   ```
2. Navigate to the project directory:
   ```bash
   cd cocktail-management
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables in a `.env` file:
   ```
   DB_HOST=<database_host>
   DB_USER=<database_user>
   DB_PASSWORD=<database_password>
   MAILTRAP_USER=<mailtrap_user>
   MAILTRAP_PASSWORD=<mailtrap_password>
   ```
5. Synchronize the database:
   ```bash
   npx sequelize db:migrate
   ```
6. Start the server:
   ```bash
   npm start
   ```

---

## Usage

### Access the Interface
- Open a browser and go to `http://localhost:3000`.

### Key Features
1. **Create an Account**: Fill out the registration form.
2. **Log In**: Enter your credentials and validate the temporary code received via email.
3. **Add a Cocktail**: Submit a recipe and upload an image.
4. **Interact**: Like or comment on available recipes.

