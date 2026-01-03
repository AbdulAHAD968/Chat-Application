# CheatWithFaizan

A real-time chat application built with [Next.js](https://nextjs.org) and [Firebase](https://firebase.google.com), enabling users to create chat rooms, exchange messages, and share media seamlessly.

## Features

- **Real-time Chat Rooms**: Create and join multiple chat rooms
- **Live Messaging**: Instant message delivery using Firebase Firestore
- **User Profiles**: Set usernames for chat identification
- **Media Sharing**: Upload and share images within chat rooms
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Real-time Updates**: Automatic updates using Firebase listeners

## Tech Stack

- **Frontend**: Next.js 16, React 19
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **Language**: JavaScript

## Prerequisites

- Node.js (v18 or higher)
- Firebase account with a configured project
- Environment variables set up

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

Create a `.env.local` file in the root directory with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── components/
│   ├── ChatRoom.js       - Main chat room component
│   └── ChatRoomList.js   - List of available chat rooms
├── lib/
│   └── firebase.js       - Firebase configuration and initialization
├── layout.js             - Root layout component
├── page.js               - Home page
└── globals.css           - Global styles
```

## Usage

1. Navigate to the application
2. Browse available chat rooms on the home page
3. Click on a room to enter it
4. Set your username when prompted
5. Start chatting and sharing media with other users

## License

This project is private. All rights reserved.
