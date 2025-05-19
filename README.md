# Code Sync

A real-time code collaboration tool powered by the MERN stack and Socket.IO.

## Table of Contents

- [Problem Statement](#problem-statement)
- [Aim/Objective](#aimobjective)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Design Overview](#system-design-overview)
- [Real world applications](#real-world-applications)
- [Team](#team)

## Problem Statement

In today's digital learning environment, real-time collaboration on coding tasks is essential but often limited by the lack of effective tools that allow multiple users to simultaneously edit, discuss, and debug code.

## Aim/Objective:

Objective of the Real-time Code Collaboration Platform is to create an interactive and user-friendly environment where multiple participants can collaboratively write, edit, and debug code in real-time. By offering a shared code editor, integrated console, and a collaborative whiteboard, the platform aims to enhance the coding and learning experience for educational institutions, coding bootcamps, and casual coding groups.

## Features

**Features implemented so far:**

1. Real-time Collaboration via Socket.IO:
<ul type='none'>
    <li>
        1.1 Shared code editor:
        <ul type='none'>
            <li>
                1.1.1 Real-time code synchronization (using @codemirror/collab)
            </li>
            <li>
                1.1.2 Supports multiple languages: Java, C++, Python, JS, TS, etc [14 at the moment]
            </li>
            <li>
                1.1.3 In-browser console for instant code execution (using Code Compiler API)
            </li>
            <li>
                1.1.4 Prettier integration for code formatting
            </li>
        </ul>
    </li>
    <li>
        1.2 Collaborative Whiteboard (tldraw): For visual explanations
    </li>
    <li>
        1.3 Live Chat: For seamless in-app communication.
    </li>
    <li>
        1.4 Participant Management: Role-based access (using ABAC)
    </li>
    <li>
        1.5 Host controls: For room management
        <ul type='none'>
            <li>
                1.5.1 Room Lock: Limit who can join
            </li>
            <li>
                1.5.2 Edit Lock: Restrict who can edit the code
            </li>
        </ul>
    </li>
</ul>

2. User authentication and management implemented using Firebase
3. Settings for Customization like themes, editor preferences and notificatons etc
4. Modern, Responsive UI
5. A basic prototype with a responsive and modern UI.
6. Data modeling for rooms and users.
7. Implemented Socket.IO for code synchronization and chat functionalities:

**Features to be Implemented in the Future:**

- **Multi-File System:** Allows users to create and manage multiple files within a room.
- **Advanced Chat Options:** Enable sending media such as images and PDFs, with the ability to store them in the cloud.
- **Audio and Video Integration:** Use WebRTC to support audio/video streaming and screen sharing for improved communication and collaboration.

## Tech Stack

- **Frontend:**
  - **React + Vite:** For building fast, component-based websites.
  - **Tailwind CSS + Material UI:** For modern and responsive styling.
  - **TypeScript:** For type safety and better developer experience

- **Backend:**
  - **Node with Express (in TS):** To build and manage the server-side logic.
  - **Socket.IO:** Enables real-time, two-way communication between client and server via WebSockets.

- **Deployment:**
  - **Frontend:** Vercel
  - **Backend:** Render
    - **Why different services?** Vercel is a serverless platform, which is stateless and event-driven, making it unsuitable for persistent WebSocket connections. Therefore, the backend is deployed on Render.

- **Other Tools and Technologies Used:**
  - [**tldraw**](https://tldraw.dev/)**:** For implementing collaborative whiteboard.
  - [**CodeMirror**](https://codemirror.net/)**:** Used as the in-browser code editor. @codemirror/collab enables operational transformation for syncing multiple edits.
  - [**Code Compiler API**](https://rapidapi.com/abdheshnayak/api/code-compiler)**:** RESTful API used to execute code snippets.
  - **Attribute-Based Access Control (ABAC):** Implements roles such as user, moderator, and host for effective room moderation. Based on the [Web Dev Simplified - How To Handle Permissions Like A Senior Dev](https://youtu.be/5GG-VUvruzE?si=NTVrL44oXBznGtKX) video.
  - [**Firebase**](https://firebase.google.com/docs/auth)**:** Used for authentication due to its ease of integration with multiple providers (Google, Facebook, GitHub, Email/Password). 

## System Design Overview

[CodeSync ER Diagram and Technical Architecture](https://app.eraser.io/workspace/ewHbT6LRwZ1UOKbTdjaM)

## Real world applications

1. **Enhanced Learning Experience:**
   Facilitates real-time collaborative coding for students and instructors. Ideal for schools, bootcamps, and peer study groups.
2. **Debugging and understanding:**
   Helps users debug and understand the effects of code changes together.
3. **Remote Accessibility:**
   Being web-based, it’s accessible from anywhere.<br />
   Easy setup, no sign-up or download required.
4. **Practical Use Cases:**
   Useful for coding interviews, live sessions, pair programming, and collaborative hackathons where coordination is critical.

## Team

  - [**Karan**](https://github.com/Karan-Bisht16)**:** Mainly handled deployment and ABAC. Also contributed to both frontend and backend development.
  - [**Raj**](https://github.com/rkchaos/)**:** Implemented a secure and scalable backend, contributed to the Socket.IO integration, and implemented the tldraw whiteboard and Firebase on the client side.
  - [**Ayush**](https://github.com/ayushgitt)**:** Primarily focused on ideation and research of similar software and their shortcomings. Also evaluated feasibility and contributed to frontend development.
  - [**Yashika**](https://github.com/Yashika1711)**:** Primarily worked on UI and proposed new and relevant features.