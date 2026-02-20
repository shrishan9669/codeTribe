#  CodeTribe – Real-Time Collaborative Coding Platform

CodeTribe is a real-time collaborative coding platform where developers can create groups, join live coding rooms, and code together with version control and role-based permissions.

Built with a scalable backend architecture and real-time communication using Socket.IO.

---

##  Features

###  Authentication & Security
- User Authentication with JWT
- Secure password storage
- Protected routes
- Role-based authorization

---

###  Group Management
- Create Groups
- Delete Groups (Host only)
- Add / Remove Users
- Role-based group system:
  - Host
  - Editor
- Persistent group storage using PostgreSQL

---

###  Live Coding Room
- Real-time code synchronization using Socket.IO
- Multi-user collaborative editing
- Language synchronization across users
- Monaco Code Editor integration
- User typing indicator ("User is typing...")

---

###  Advanced Room Controls
- Host can:
  - Kick users from room
  - Block editing of specific users
- Role-based editing control
- Dynamic user count updates

---

###  Persistent Code Storage
- Code auto-save (every few seconds)
- Room code stored in PostgreSQL
- Code persists even after room exit
- DB-based state restoration on rejoin

---

###  Version Control System
- Automatic version snapshots
- Version history panel
- Restore any previous version
- Full database-backed version storage

---

###  Code Execution (Integrated Infrastructure)
- Backend-ready structure for code execution engine
- Designed to integrate Judge0 / Docker-based execution system

---

##  Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Monaco Editor
- Socket.IO Client
- Axios

### Backend
- Node.js
- Express.js
- Socket.IO
- Prisma ORM

### Database
- PostgreSQL

---

##  Architecture Highlights

- Real-time WebSocket communication
- Room-based socket architecture
- In-memory room state sync + DB persistence
- Role-controlled server-side validation
- Scalable Prisma data modeling

---

##  Core Functional Modules

- Authentication (JWT)
- Group System
- Role-Based Access Control
- Live Coding Engine
- Auto Save Mechanism
- Version History & Restore
- User Activity Tracking
- Host Controls (Kick / Block Editing)

---

##  How It Works

1. User logs in via JWT authentication.
2. User creates or joins a group.
3. Group opens a live coding room.
4. Code syncs in real-time via Socket.IO.
5. Auto-save stores code in DB.
6. Version snapshots are created.
7. Host manages participants.

---

##  Resume Value

This project demonstrates:

- Full-stack architecture design
- Real-time systems engineering
- WebSocket-based synchronization
- Role-based access control
- Persistent database architecture
- Advanced UI state management
- Scalable backend logic

---

##  Future Improvements

- Interview Mode (Timer + Question Panel)
- Code execution sandbox (Docker-based)
- Activity analytics dashboard
- Screen sharing integration
- AI-based code suggestions

---

##  Author

**Ishan Shrivastava**

GitHub: https://github.com/shrishan9669

---

## ⭐ If you like this project, consider giving it a star!
