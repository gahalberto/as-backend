# 🎅 Secret Santa API

## 🎯 Project Overview

The Secret Santa API is a backend service for the Secret Santa frontend project. This API facilitates the management of events, people, and groups, and performs the Secret Santa draw with specific rules to ensure fair and valid draws.

## ✨ Features

- **🎉 Event Management**
  - Create, read, update, and delete events.
  
- **👥 Group Management**
  - Manage groups within events, including creating, reading, updating, and deleting groups.
  
- **🧑‍🤝‍🧑 People Management**
  - Manage people within groups and events, including creating, reading, updating, and deleting people.
  
- **🎁 Secret Santa Draw**
  - Implement logic to draw Secret Santa pairs ensuring no one draws themselves or someone from the same group.

## 🛠️ Technologies Used

- **🟢 Node.js** - A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **⚡ Express.js** - A minimal and flexible Node.js web application framework.
- **📝 TypeScript** - A superset of JavaScript that adds static types.
- **📦 Prisma ORM** - An open-source database toolkit for TypeScript and Node.js.
- **🐘 PostgreSQL** - An open-source relational database.
- **🔧 dotenv** - A module to load environment variables from a .env file.
- **🌐 Cors** - A package for providing a Connect/Express middleware that can be used to enable CORS.
- **🌐 HTTP/HTTPS** - Node.js modules to create HTTP and HTTPS servers.
- **📁 fs** - File System module to interact with the file system.
- **🔍 Insomnia** - A powerful HTTP and GraphQL tool to test the API.

## 🚀 Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/secretsanta-api.git
    cd secretsanta-api
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up the environment variables:
    Create a `.env` file in the root directory and add the necessary environment variables.
    ```plaintext
    DEFAULT_TOKEN=your_default_token
    SSL_KEY=path_to_your_ssl_key
    SSL_CERT=path_to_your_ssl_cert
    NODE_ENV=development
    PORT=9000
    ```

4. Run the server:
    ```bash
    npm start
    ```

## 📖 API Endpoints

### 🎉 Event Routes
- `GET /events` - Get all events
- `GET /events/:id` - Get an event by ID
- `POST /events` - Create a new event
- `PUT /events/:id` - Update an event by ID
- `DELETE /events/:id` - Delete an event by ID

### 👥 Group Routes
- `GET /events/:id_event/groups` - Get all groups for an event
- `GET /events/:id_event/groups/:id` - Get a group by ID
- `POST /events/:id_event/groups` - Create a new group
- `PUT /events/:id_event/groups/:id` - Update a group by ID
- `DELETE /events/:id_event/groups/:id` - Delete a group by ID

### 🧑‍🤝‍🧑 People Routes
- `GET /events/:id_event/groups/:id_group/people` - Get all people in a group
- `GET /events/:id_event/groups/:id_group/people/:id` - Get a person by ID
- `POST /events/:id_event/groups/:id_group/people` - Add a new person
- `PUT /events/:id_event/groups/:id_group/people/:id` - Update a person by ID
- `DELETE /events/:id_event/groups/:id_group/people/:id` - Delete a person by ID

### 🎁 Secret Santa Draw
- The logic for the Secret Santa draw ensures no person draws themselves or someone from the same group, managing edge cases and ensuring fair distribution.

## 🧪 Testing

The API was tested using Insomnia to ensure all endpoints function correctly.

## 🌍 Deployment

The API is deployed and available at https://as-api.guib.com.br/. The frontend will be published soon.
