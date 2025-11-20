# EmpowerHer

## Description

EmpowerHer is a vibrant full-stack web platform dedicated to advancing gender equality and women's empowerment worldwide. This project aligns with UN Sustainable Development Goal 5 (Gender Equality) by providing a comprehensive ecosystem where women can access education, health resources, economic opportunities, and community networks to break barriers and achieve their full potential.

The platform celebrates diversity, fosters innovation, and builds a supportive community where every woman can lead with confidence. It offers curated resources for skill development, career growth, health and wellness information, community forums, networking opportunities, educational content, mentorship programs, and events focused on empowerment.

## Live Demo

- **Frontend**: [https://empower-her-final-project-npn9.vercel.app/](https://empower-her-final-project-npn9.vercel.app/)
- **Backend API**: [https://empower-her-final-project.onrender.com/](https://empower-her-final-project.onrender.com/)

## Features

### Core Functionality
- **User Authentication**: Secure login and registration system using JWT tokens
- **Dashboard**: Personalized user dashboard for authenticated users
- **Profile Management**: User profile creation and editing
- **Protected Routes**: Secure access to user-specific features

### Content and Resources
- **Curated Resources**: Collection of links and materials for skill development and career growth
- **Photo Gallery**: User-uploaded photos with caption support and admin approval system
- **About Page**: Detailed information about the platform's mission and offerings
- **Contact Page**: Contact form and information
- **Home Page**: Welcome page with testimonials, featured women, and key focus areas

### Community Features
- **Community Support**: Forums and networking opportunities
- **Educational Content**: Mentorship programs and learning materials
- **Events and Workshops**: Information about empowerment-focused events

### Technical Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion for enhanced user experience
- **File Uploads**: Multer integration for photo uploads
- **API Integration**: Axios for seamless frontend-backend communication

## Tech Stack

### Backend
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Web application framework for Node.js
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT (jsonwebtoken)**: Token-based authentication
- **bcryptjs**: Password hashing for security
- **Multer**: Middleware for handling file uploads
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **Nodemon**: Development server with auto-restart

### Frontend
- **React**: Component-based UI library
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router DOM**: Client-side routing
- **Framer Motion**: Animation library for React
- **Axios**: HTTP client for API requests
- **ESLint**: Code linting and formatting

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (version 14 or higher)
- **MongoDB** (local installation or cloud instance like MongoDB Atlas)
- **npm** or **yarn** package manager
- **Git** for version control

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd EmpowerHer
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**:
   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   MONGO_URI=mongodb://localhost:27017/empowerher
   # Or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/empowerher
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   ```

## Usage

### Development Mode

1. **Start the Backend Server**:
   ```bash
   cd backend
   npm run dev
   ```
   The server will start on `http://localhost:5000`

2. **Start the Frontend Development Server**:
   ```bash
   cd frontend
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (or the port shown by Vite)

3. **Access the Application**:
   Open your browser and navigate to the frontend URL. You can register a new account or login if you already have one.

### Production Build

1. **Build the Frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the Backend in Production**:
   ```bash
   cd backend
   npm start
   ```

## Project Structure

```
EmpowerHer/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── photoController.js   # Photo upload and management
│   │   └── resourcesController.js # Resources management
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── logger.js            # Request logging middleware
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Photo.js             # Photo schema
│   │   └── Resource.js          # Resource schema
│   ├── routes/
│   │   ├── api.js               # Main API routes
│   │   ├── auth.js              # Authentication routes
│   │   ├── photos.js            # Photo routes
│   │   └── resources.js         # Resources routes
│   ├── uploads/                 # Uploaded files directory
│   ├── server.js                # Main server file
│   └── package.json
├── frontend/
│   ├── public/
│   │   ├── images/              # Static images
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx       # Site header
│   │   │   ├── Navbar.jsx       # Navigation bar
│   │   │   ├── Footer.js        # Site footer
│   │   │   ├── Layout.jsx       # Layout wrapper
│   │   │   └── ProtectedRoute.jsx # Route protection
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # Authentication context
│   │   │   └── AppContext.js    # App-wide context
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── About.jsx        # About page
│   │   │   ├── Contact.jsx      # Contact page
│   │   │   ├── Gallery.jsx      # Photo gallery
│   │   │   ├── Resources.jsx    # Resources page
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Registration page
│   │   │   ├── Dashboard.jsx    # User dashboard
│   │   │   └── Profile.jsx      # User profile
│   │   ├── utils/
│   │   │   └── api.js           # API utility functions
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # App entry point
│   │   └── index.css            # Global styles
│   ├── index.html               # HTML template
│   └── package.json
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Authenticate user and return JWT token
- `GET /profile` - Get current user profile (requires authentication)

### Photo Routes (`/api/photos`)
- `GET /` - Retrieve all approved photos
- `POST /` - Upload a new photo (requires authentication)
- `PUT /:id/approve` - Approve a photo (admin functionality)
- `DELETE /:id` - Delete a photo (requires authentication)

### Resources Routes (`/api/resources`)
- `GET /` - Retrieve all resources
- `POST /` - Add a new resource (requires authentication)
- `PUT /:id` - Update a resource (requires authentication)
- `DELETE /:id` - Delete a resource (requires authentication)

## Database Models

### User Model
- `username`: String (required, unique)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `role`: String (default: 'user')
- `createdAt`: Date
- `updatedAt`: Date

### Photo Model
- `filename`: String (required)
- `originalName`: String (required)
- `mimetype`: String (required)
- `size`: Number (required)
- `path`: String (required)
- `caption`: String (optional)
- `uploadedBy`: ObjectId (reference to User, required)
- `isApproved`: Boolean (default: false)
- `createdAt`: Date
- `updatedAt`: Date

### Resource Model
- `title`: String (required)
- `link`: String (required)

## Contributing

We welcome contributions to EmpowerHer! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by UN Sustainable Development Goal 5: Gender Equality
- Built with ❤️ for women's empowerment worldwide
- Special thanks to all contributors and the open-source community

## Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact us through the platform's contact form
- Join our community discussions

---

*EmpowerHer - Celebrating diversity, fostering innovation, and building a world where every woman can lead with confidence.*
