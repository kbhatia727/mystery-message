# Anonymous Messaging App

This project allows users to send anonymous messages to any other user, view all the messages, and receive message suggestions using OpenAI integration.

## Features

**Anonymous Messaging**: Send messages to any user without revealing your identity.

- **View Messages**: Users can view all the messages sent to them.
- **OTP Verification**: Custom OTP verification for user registration and login.
- **Username Validation**: Ensures users choose a unique username.
- **NextAuth / Auth.js**: Built-in authentication using NextAuth.
- **Email Resend**: Resend email functionality for OTP or verification emails.
- **ZOD for Validation**: Data validation using ZOD across forms and API requests to ensure data consistency.
- **Connecting Database in Next.js**: MongoDB integration for storing and managing user information, messages, and other essential data.
- **Message API with Aggregation Pipeline**: MongoDB aggregation pipeline used to efficiently query and aggregate messages for optimized performance.
- **Integrating AI Features in Next.js**: OpenAI integration for providing personalized message suggestions to enhance the user experience.
- **React Hook Form, ShadCN, and Debouncing**: Managing forms with React Hook Form, UI components using ShadCN, and debouncing input to improve performance.

## Technologies Used

- **Next.js**: A React framework for building production-ready apps.
- **React Hook Form**: For handling form validation and submission.
- **Zod**: Used for data validation in the application.
- **ShadCN**: UI components to enhance the user interface.
- **Resend**: For email functionality like OTP sending and resending.
- **MongoDB**: NoSQL database used to store user data and messages.
- **NextAuth**: For handling authentication in the app.
- **OpenAI API**: For generating message suggestions.

### Installation

1. Clone this repository:
2. Install dependencies:
3. To configure your environment, create a `.env.local` file in the root directory of the project and add the following keys:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
RESEND_API_KEY=your_resend_api_key
OPENAI_API_KEY=your_openai_api_key
NEXTAUTH_URL=http://localhost:3000  # Replace with your production URL if applicable
```

4. Run the development server
