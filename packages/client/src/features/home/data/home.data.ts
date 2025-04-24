export const homeJSON = {
    heading: 'Real-time Code Collaboration Tool',
    tagline: 'Write, edit, and debug code together in real-time. Perfect for teams, classrooms, and interviews.',
    features: {
        tagline: 'What makes CodeSync stand out?',
        heading: 'Real-time collaboration, multi-file support and more',
        list: [
            {
                heading: 'Real-time Code Sync',
                tagline: 'See changes as they happen with real-time code synchronization powered by Socket.IO.',
                icon: 'Code'
            },
            {
                heading: '[Audio]',
                tagline: 'On its way in the next major update :)',
                icon: 'Mic'
            },
            {
                heading: 'Collaborative Whiteboard',
                tagline: 'Visualize concepts and explain code with our collaborative whiteboard using tldraw.',
                icon: 'Edit'
            },
            {
                heading: 'Integrated Chat',
                tagline: 'Communicate seamlessly with team members through our built-in chat functionality.',
                icon: 'Chat'
            },
            {
                heading: 'Multi-language Support',
                tagline: 'Code in Java, C++, Python, JavaScript, TypeScript and many more languages.',
                icon: 'Terminal'
            },
            {
                heading: 'No Setup Required',
                tagline: 'Get started instantly with no downloads or sign-ups required. Just create a room and share the link.',
                icon: 'Speed'
            }
        ]
    },
    about: {
        tagline: 'Collaborate - Code - Learn together',
        heading: 'Why CodeSync?',
        content: 'In today’s digital learning environment, real-time collaboration on coding tasks is essential but often limited by the lack of effective tools that allow multiple users to simultaneously edit, discuss, and debug code.',
        subheading: 'Built for Seamless Collaboration',
        subcontent: 'CodeSync provides an intuitive, real-time coding environment where multiple users can write, edit, and debug together effortlessly. Equipped with a shared code editor, integrated console, and collaborative whiteboard, it’s designed for students, bootcamps, and teams to work smarter—not harder.'
    },
    applications: {
        heading: 'Real World Applications',
        list: [
            {
                heading: 'Education',
                tagline: 'Enhanced Learning Experience: Allows instructors and students to code together in real-time. Ideal for educational institutions, coding bootcamps, and peer study groups.',
                icon: 'School'
            },
            {
                heading: 'Debugging',
                tagline: 'Debugging and understanding: Helps users debug code collectively to understand the impact of their code changes in real-time.',
                icon: 'Dashboard'
            },
            {
                heading: 'Team Collaboration',
                tagline: 'Remote Accessibility: As a web-based platform, it can be accessed from anywhere, making it suitable for remote learning and distributed teams.',
                icon: 'Group'
            }
        ]
    },
    displayCodeFileTitle: 'index.tsx - CodeSync',
    baseDisplayCode: `import React, { useState, useEffect, useCallback } from 'react';\nimport { fetchData, transformData } from '../utils/dataHelpers';\n\nconst DemoList = ({ initialPage, apiUrl }) => {`
};