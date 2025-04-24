# Code Sync

A real-time code collaboration tool powered by the MERN stack and Socket.IO.

## Table of Contents

- [Problem Statement](#problem-statement)
- [Aim/Objective](#aimobjective)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Design Overview](#system-design-overview)
- [Real world applications](#real-world-applications)
<!-- - [Usage](#usage) -->

## Problem Statement

In today's digital learning environment, real-time collaboration on coding tasks is essential but often limited by the lack of effective tools that allow multiple users to simultaneously edit, discuss, and debug code.

## Aim/Objective:

objective of the Real-time Code Collaboration Platform is to create an interactive and user-friendly environment where multiple participants can collaboratively write, edit, and debug code in real-time. By offering a shared code editor, integrated console, and a collaborative whiteboard, the platform aims to enhance the coding and learning experience for educational institutions, coding bootcamps, and casual coding groups.

## Features

**Features implemented so far:**
1. A basic prototype with a responsive and modern UI.
2. Data modeling for rooms and users.
3. Implemented Socket.IO for code synchronization and chat functionalities:
<ul type='none'>
    <li>
        3.1 A shared code editor (using codemirror) allowing users to write,edit, and view code collectively. Code editors features:
        <ul type='none'>
            <li>
                3.1.1 Real-time code synchronization
            </li>
            <li>
                3.1.2 Multiple programming languages (Java, C++, Python, JavaScript, TypeScript, etc)
            </li>
            <li>
                3.1.3 Console for immediate code execution (using code-compiler api)
            </li>
        </ul>
    </li>
    <li>
        3.2 Whiteboard (using tldraw): For visual explanations.
    </li>
    <li>
        3.3 Chat: For easy in app communication.
    </li>
</ul>

4. Server setup and deployment on Render.<br/><br/>

**Features to be Implemented in the Future:**
- **Persistent Storage:** Permanent code storage in MongoDB with user Authentication.
- **Screen Lock:** The room creator will be able to lock the screen, allowing only them to edit the code while others can only view.
- **Room Lock:** Lock the number of participants, with a premium feature for more than 50 participants.

## Tech Stack

- **Frontend:**
    - **React:** For easy development of component-based websites.
    - **Tailwind CSS:** For styling.
        - **Why Tailwind CSS?** Offers flexibility, PurgeCSS, and faster development.
- **Backend:**
    - **Node with Express:** To build the server-side of the application.
    - **Socket.IO:** Enables real-time, two-way communication between a client and a server.
- **Deployment:**
    - **Frontend:** Vercel
    - **Backend:** Render
        - **Why different services?** Vercel is a serverless service, meaning it is stateless and event-driven, making it unsuitable for maintaining persistent connections like WebSockets. Render is used for the backend to maintain socket connections.

- **Other Tools and Technologies Used:**
    - [**tldraw**](https://tldraw.dev/): Used to implement a synchronous canvas for collaborative whiteboards.
    - [**CodeMirror**](https://codemirror.net/): A code editor component for the web, supporting various editing features with a rich programming interface.
    - [**Code Compiler API**](https://rapidapi.com/abdheshnayak/api/code-compiler): A RESTful API used to execute code, supporting 37 languages with robust error handling.
    

## System Design Overview

[CodeSync ER Diagram and Technical Architecture](https://app.eraser.io/workspace/ewHbT6LRwZ1UOKbTdjaM?origin=share)

## Real world applications

1. **Enhanced Learning Experience:**
   Allows instructors and students to code together in real-time. Ideal for educational institutions, coding bootcamps, and peer study groups.
2. **Debugging and understanding:**
   Helps user debug code collectively to understand the impact of their code changes.
3. **Remote Accessibility:**
   As a web-based platform, it can be accessed from anywhere, making it suitable for remote learning and distributed teams.<br />
   Easy setup, no sign-up or download required.
4. **Practical Use Cases:**
   Suitable for conducting coding interviews, live coding sessions, and pair programming exercises.<br />
   It can also be used for collaborative coding competitions or hackathons, where real-time coordination is key.