# Bug Hunt Game

A fun and educational game where players compete to find and fix bugs in code snippets. Test your debugging skills, climb the leaderboard, and become the ultimate bug hunter!

## 🎮 Game Features

### Bug Hunting
- Find and fix bugs in real code snippets
- Multiple difficulty levels to challenge players of all skill levels
- Time-based scoring system to encourage quick thinking
- Detailed feedback on your solutions

### Leaderboard
- Global and category-specific leaderboards
- Track your progress and compare with other players
- Weekly and all-time high scores
- Achievement system to reward your bug hunting skills

## 🚀 Getting Started

### Prerequisites
- Node.js
- NPM
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```

2. Install dependencies:
   ```bash
   # Install client dependencies
   cd ./client/
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. Set up environment files:
   - Create `.env` in `./client`:
     ```
     REACT_APP_SERVER_URL=http://localhost:8000
     ```
   - Create `.env` in `./server`:
     ```
     MONGODB_URI=mongodb://127.0.0.1:27017
     CLIENT_URL=http://localhost:3000
     PORT=8000
     ```

4. Initialize the database:
   ```bash
   cd ./server/
   npm run populate-db
   ```

5. Start the application:
   ```bash
   # Start the server
   cd ./server/
   npm run start

   # Start the client (in a new terminal)
   cd ./client/
   npm run start
   ```

6. Open http://localhost:3000 in your browser and start bug hunting!

## 🏆 How to Play

1. **Create an Account**: Sign up to track your progress and compete on the leaderboard
2. **Choose a Challenge**: Select from various difficulty levels and programming languages
3. **Find the Bug**: Analyze the code and identify the issue
4. **Submit Your Solution**: Fix the bug and submit your solution
5. **Earn Points**: Score based on speed and correctness
6. **Climb the Leaderboard**: Compete with other players and track your progress

## 📊 Leaderboard System

The game features a comprehensive leaderboard system that tracks:
- Overall ranking
- Category-specific rankings (by language, difficulty)
- Weekly high scores
- Personal bests
- Achievement progress

## 🛠️ Technical Details

### Project Structure
- `client/`: Frontend React application
- `server/`: Backend Node.js application
- `shared/`: Shared TypeScript type definitions

### API Documentation
For detailed API documentation, please refer to the [API Routes](#api-routes) section below.


## Codebase Folder Structure

- `client`: Contains the frontend application code, responsible for the user interface and interacting with the backend. This directory includes all React components and related assets.
- `server`: Contains the backend application code, handling the logic, APIs, and database interactions. It serves requests from the client and processes data accordingly.
- `shared`: Contains all shared type definitions that are used by both the client and server. This helps maintain consistency and reduces duplication of code between the two folders. The type definitions are imported and shared within each folder's `types/types.ts` file.

## Database Architecture

The schemas for the database are documented in the directory `server/models/schema`.
A class diagram for the schema definition is shown below:

![Class Diagram](class-diagram.png)

## API Routes

### `/answer`

| Endpoint   | Method | Description      |
| ---------- | ------ | ---------------- |
| /addAnswer | POST   | Add a new answer |

### `/comment`

| Endpoint    | Method | Description       |
| ----------- | ------ | ----------------- |
| /addComment | POST   | Add a new comment |

### `/messaging`

| Endpoint     | Method | Description           |
| ------------ | ------ | --------------------- |
| /addMessage  | POST   | Add a new message     |
| /getMessages | GET    | Retrieve all messages |

### `/question`

| Endpoint          | Method | Description                     |
| ----------------- | ------ | ------------------------------- |
| /getQuestion      | GET    | Fetch questions by filter       |
| /getQuestionById/ | GET    | Fetch a specific question by ID |
| /addQuestion      | POST   | Add a new question              |
| /upvoteQuestion   | POST   | Upvote a question               |
| /downvoteQuestion | POST   | Downvote a question             |

### `/tag`

| Endpoint                   | Method | Description                                   |
| -------------------------- | ------ | --------------------------------------------- |
| /getTagsWithQuestionNumber | GET    | Fetch tags along with the number of questions |
| /getTagByName/             | GET    | Fetch a specific tag by name                  |

### `/user`

| Endpoint         | Method | Description                    |
| ---------------- | ------ | ------------------------------ |
| /signup          | POST   | Create a new user account      |
| /login           | POST   | Log in as a user               |
| /resetPassword   | PATCH  | Reset user password            |
| /getUser/        | GET    | Fetch user details by username |
| /getUsers        | GET    | Fetch all users                |
| /deleteUser/     | DELETE | Delete a user by username      |
| /updateBiography | PATCH  | Update user biography          |

### `/chat`

| Endpoint                    | Method | Description                                                                 |
| --------------------------- | ------ | --------------------------------------------------------------------------- |
| `/createChat`               | POST   | Create a new chat.                                                          |
| `/:chatId/addMessage`       | POST   | Add a new message to an existing chat.                                      |
| `/:chatId`                  | GET    | Retrieve a chat by its ID, optionally populating participants and messages. |
| `/:chatId/addParticipant`   | POST   | Add a new participant to an existing chat.                                  |
| `/getChatsByUser/:username` | GET    | Retrieve all chats for a specific user based on their username.             |

### `/games`

| Endpoint | Method | Description           |
| -------- | ------ | --------------------- |
| /create  | POST   | Create a new game     |
| /join    | POST   | Join an existing game |
| /leave   | POST   | Leave a game          |
| /games   | GET    | Retrieve all games    |

## Running Stryker Mutation Testing

Mutation testing helps you measure the effectiveness of your tests by introducing small changes (mutations) to your code and checking if your tests catch them. To run mutation testing with Stryker, use the following command in `server/`:

```sh
npm run stryker
```

{ : .note } In case you face an "out of memory" error while running Stryker, use the following command to increase the memory allocation to 4GB for Node.js:

```sh
node --max-old-space-size=4096 ./node_modules/.bin/stryker run
```
