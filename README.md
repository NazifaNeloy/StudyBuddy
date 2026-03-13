
# 🎓 StudyBuddy | East Delta University

**Course:** CSE342: Web Programming  
**Project Lead:** Nazifa Jahan Neloy 
**Academic Year:** Spring 2026


StudyBuddy is a collaborative learning platform designed to bridge the gap between solo studying and group excellence. Built with the MERN stack and Supabase, it focuses on real-time interaction and academic gamification.

---

## Project Overview
Developed for the university web development curriculum, StudyBuddy addresses student productivity by offering a centralized hub for group study. The platform emphasizes **real-time synchronization** and **relational data integrity**, ensuring a seamless collaborative experience.

## ✨ Core Features
*  Study Groups:** Create and join course-specific groups with ease.
* Real-Time Messaging:** Instant group chat for seamless collaboration.
* User Profiles: Customize profiles with bios and personal information
* Shared Pomodoro Timers:** Synchronized focus sessions to keep the whole group on track.
* Gamification:** Earn points for activity and climb the global **Leaderboard**.
*  Resource Sharing:** Share and categorize study materials, links, and PDFs.
* Live Notifications:** Stay updated on group requests and scheduled sessions.
* Privacy Settings: Control your profile visibility and group access
* Join Requests: Manage group membership requests

## 🛠 Tech Stack

### Frontend
* **Framework:** React.js (Vite)
* **Styling:** Tailwind CSS — *For a crisp, modern, and responsive UI/UX.*
* **Icons:** Lucide React

### Backend & Database
* **Server:** Node.js & Express.js — *Handling custom business logic and gamification.*
* **Database:** PostgreSQL (via **Supabase**) — *Ensuring 3NF normalization and data integrity.*
* **Authentication:** Supabase Auth — *Secure JWT-based user management.*
* **Real-time:** Supabase Realtime / WebSockets — *Powering the live chat and synced timers.*

## 📁 Project Structure
```text
StudyBuddy/
├── client/                  # React + Vite Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI (Buttons, Cards, Modals)
│   │   ├── contexts/       # Auth & Real-time state
│   │   ├── pages/          # Dashboard, Groups, Leaderboard, Auth
│   │   └── lib/            # Supabase client configuration
├── server/                  # Node.js + Express Backend
│   ├── controllers/        # Logic for Points, Groups, and Users
│   ├── routes/             # API Endpoints
│   ├── middleware/         # Auth verification
│   └── index.js            # Server entry point
└── README.md
```


## Database (3NF Relational Structure)
The project uses PostgreSQL (via Supabase) for data persistence with the following main entities organized in Third Normal Form:

* Users: Profiles, authentication metadata, and total gamification points.

* Study Groups: Group information with unique IDs and join-request logic.

* Study Sessions: Scheduling data and synchronized timer logs.

* Messages: Real-time communication logs linked to groups.

* Notifications: System alerts for group activities and sessions.

* Resources: Metadata for shared study materials (links/files).

* Points & Rankings: Records for the global leaderboard.

---

##  API Endpoints
The Node.js backend provides RESTful endpoints for:

* Auth: Custom session handling (bridged with Supabase Auth).

* Groups: Management, searching, and join-request approvals.

* Sessions: Timer state synchronization and scheduling.

* Profiles: CRUD operations for user bios and settings.

* Gamification: Fetching leaderboard rankings and awarding points.

* Resources: Handling file metadata and sharing links.

* Real-time: Handled via Supabase Realtime and WebSockets for instant messaging.

---

## Frontend Pages
* HomePage: Main landing page and group discovery.

* MainDashboard: User's personal dashboard with active study stats.

* GroupDetail: The "hub"—contains real-time chat, shared timers, and resources.

* UserProfile: Personal statistics, achievements, and badges.

* Calendar: View and schedule upcoming group study sessions.

* SettingsPage: Privacy controls and account preferences.

* Auth Page: Responsive Login and Registration forms.

---

🤝 Contributing
Contributions are welcome! Please follow the existing MERN structure and use Conventional Commits (e.g., feat:, fix:, style:) to keep the history clean.

⚖️ License
This project is provided as-is for educational purposes.
