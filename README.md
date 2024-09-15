# TextFlow

**TextFlow** is a real-time messaging application built using the MERN stack (MongoDB, Express, React, Node.js). It provides a minimalistic user interface, allowing users to send and receive messages seamlessly. The application leverages WebSockets for real-time communication between users.

## Features

- **Real-Time Messaging**: Send and receive messages instantly with WebSocket-based communication.
- **Subscribing to Messages**: Users can subscribe to message threads for instant updates.
- **Live Typing Indicator**: See when someone is typing a message in real-time.
- **Mobile Responsive**: Optimized for mobile devices with a responsive design.
- **Minimalistic Modals**: Clean and simple modal windows for various actions.
- **Sidebar Slider for User Searching**: Slide-in sidebar to search for users within the application.
- **JWT Tokens**: Secure authentication using JSON Web Tokens (JWT).
- **Creating Groups**: Users can create chat groups for collaborative conversations.
- **Adding/Removing Members from Groups**: Manage group members by adding or removing them.
- **Renaming Groups**: Update group names easily to reflect changes.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Real-Time Communication**: WebSockets - Socket.io

## Project Structure

### Backend Structure

```
backend/
│
├── config/             # Configuration files for database, JWT, etc.
├── controllers/        # Business logic for handling API requests
├── data/               # Seed data and database initialization scripts
├── middlewares/        # Custom middlewares (e.g., authentication, error handling)
├── Models/             # Mongoose models defining the schema for MongoDB
├── routes/             # API routes linking HTTP requests to controllers
├── .env                # Environment variables (not to be committed)
├── .gitignore          # Files to be ignored by Git
├── .npmrc              # NPM configuration file
├── package-lock.json   # NPM lock file
├── package.json        # Backend package information
├── README.md           # Documentation for the backend
└── server.js           # Entry point for the backend server
```

#### Folder/Files Descriptions

- **`config/`**: Contains configuration files for setting up MongoDB, JWT, and other environment-specific settings.
- **`controllers/`**: Houses the logic that handles incoming requests, processes data, and interacts with the database.
- **`data/`**: This folder includes scripts for initializing the database and any seed data needed for development.
- **`middlewares/`**: Contains middleware functions for authentication, validation, error handling, and other request-processing logic.
- **`Models/`**: Defines the structure of your data with Mongoose schemas, which represent collections in MongoDB.
- **`routes/`**: Maps incoming API requests to the appropriate controller methods.

### Frontend Structure

```
frontend/
│
├── node_modules/       # Frontend dependencies
├── public/             # Public assets (e.g., images, icons, static files)
└── src/
    ├── Animations/     # Animation-related files, for dynamic UI elements
    ├── Components/     # Reusable React components like buttons, modals, etc.
    ├── config/         # Configuration files (e.g., API endpoints, environment settings)
    ├── Context/        # React context files for global state management
    ├── Pages/          # Individual pages and views of the application
    ├── App.css         # Global CSS styles
    ├── App.js          # Root component that integrates all parts of the UI
    ├── index.css       # Base CSS styles
    └── index.js        # Entry point for the frontend application
├── .gitignore          # Files to be ignored by Git
├── package-lock.json   # NPM lock file
└── package.json        # Frontend package information
```

#### Folder/Files Descriptions

- **`Animations/`**: Contains animations that enhance the user experience with dynamic effects for UI elements.
- **`Components/`**: Houses reusable components such as buttons, input fields, modals, and more, which can be used across different pages.
- **`config/`**: This directory includes files that manage configuration settings like API endpoints and environment-specific variables.
- **`Context/`**: Contains files for React Context API, enabling global state management across the application.
- **`Pages/`**: Contains individual pages and views like login, signup, chat interface, and more.
- **`App.js`**: The main component that brings together different parts of the application and renders the UI.
- **`index.js`**: The entry point of the React application, where the app is rendered into the DOM.

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Code Editor

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/arin-paliwal/Text-Flow.git
   ```

2. Install dependencies for both frontend and backend:

   ```bash
   cd textflow
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the `backend` directory and add the following variables:

   ```bash
   MONGO_URI=your-mongodb-uri
   PORT=your-server-port
   ```

4. Start the development server:

   ```bash
   cd backend
   npm run dev
   ```

   In another terminal, start the React development server:

   ```bash
   cd frontend
   npm start
   ```


### Postman Collection

You can find the Postman collection for API testing here: [Postman Collection URL](https://www.postman.com/paliwalarin/workspace/text-flow-full-stack)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Feel free to fork this project and submit pull requests. Contributions are welcome!

