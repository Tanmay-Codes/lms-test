# JamClef LMS Backend Documentation

This document outlines the backend API structure for the JamClef Learning Management System (LMS), including models, relationships, routes, and response formats.

## Table of Contents
1. [Data Models](#data-models)
2. [API Routes](#api-routes)
3. [Authentication](#authentication)
4. [File Storage](#file-storage)
5. [Real-time Features](#real-time-features)

## Data Models

### Users
Users in the system have different roles with varying permissions.

#### Schema
```javascript
{
  id: String,              // UUID
  name: String,            // Full name
  email: String,           // Unique email
  password: String,        // Hashed password
  role: String,            // 'admin', 'teacher', 'student', 'proctor'
  avatar: String,          // URL to avatar image
  bio: String,             // User bio
  joinedDate: Date,        // When user joined
  // Role-specific fields
  expertise: [String],     // For teachers
  availability: Object,    // For teachers
  interests: [String],     // For students
  enrolledCourses: [UUID], // For students
}
```

#### Relationships
- Teachers have many Courses
- Students enroll in many Courses
- Proctors monitor Assessments

### Courses
The central entity representing a course offering.

#### Schema
```javascript
{
  id: UUID,
  title: String,
  description: String,
  instructor: String,       // Name of instructor 
  instructorId: UUID,       // Reference to Users
  students: Number,         // Count of enrolled students
  duration: String,
  level: String,            // 'Beginner', 'Intermediate', 'Advanced', 'All Levels'
  status: String,           // 'active', 'upcoming', 'archived', 'review'
  price: Number,
  image: String,            // URL to course image
  rating: Number,           // Average rating from reviews
  courseType: String,       // 'group' or 'solo'
  maxStudents: Number,      // For group courses
  reviewStatus: String,     // 'pending', 'approved', 'rejected'
  releaseDate: Date,        // When the course becomes/became active
  schedule: {
    days: [String],
    time: String,
    timezone: String
  },
  resources: [              // Course materials
    {
      id: UUID,
      title: String,
      description: String,
      url: String,
      type: String,         // 'pdf', 'video', 'audio', 'image', etc.
      size: String,
      dateAdded: Date
    }
  ],
  syllabus: [
    {
      week: Number,
      title: String,
      description: String,
      materials: [String],
      assignments: [
        {
          id: UUID,
          title: String,
          dueDate: Date,
          description: String
        }
      ]
    }
  ],
  reviews: [
    {
      id: UUID,
      studentId: UUID,
      studentName: String,
      rating: Number,
      comment: String,
      date: Date
    }
  ]
}
```

#### Relationships
- Course belongs to a Teacher (User)
- Course has many Assignments
- Course has many Students (Users) enrolled
- Course has many Resources
- Course has many Reviews
- Course has one Syllabus with many SyllabusWeeks

### Assignments
Tasks that students complete for courses.

#### Schema
```javascript
{
  id: UUID,
  courseId: UUID,           // Reference to Course
  title: String,
  description: String,
  dueDate: Date,
  maxScore: Number,
  type: String,             // 'quiz', 'project', 'essay', etc.
  content: Object,          // Varies based on assignment type
  submissions: [
    {
      id: UUID,
      studentId: UUID,
      submissionDate: Date,
      content: Object,
      score: Number,
      feedback: String,
      status: String        // 'submitted', 'graded', 'late', etc.
    }
  ]
}
```

### Assessments
Formal evaluations like exams.

#### Schema
```javascript
{
  id: UUID,
  title: String,
  description: String,
  courseId: UUID,           // Reference to Course
  duration: Number,         // In minutes
  maxScore: Number,
  passingScore: Number,
  scheduledDate: Date,
  status: String,           // 'scheduled', 'active', 'completed'
  questions: [
    {
      id: UUID,
      type: String,         // 'multiple-choice', 'essay', etc.
      content: String,      // Question text
      options: [String],    // For multiple choice
      correctAnswer: String,
      points: Number
    }
  ],
  submissions: [
    {
      id: UUID,
      studentId: UUID,
      submissionTime: Date,
      answers: [
        {
          questionId: UUID,
          answer: String,
          score: Number
        }
      ],
      totalScore: Number,
      status: String,       // 'passed', 'failed', 'pending'
      proctorNotes: String
    }
  ]
}
```

### Schedule
Course schedules and sessions.

#### Schema
```javascript
{
  id: UUID,
  courseId: UUID,           // Reference to Course
  title: String,
  start: Date,              // Session start time
  end: Date,                // Session end time
  location: String,         // 'online' or physical location
  description: String,
  recurrence: String,       // Recurrence pattern
  attendees: [UUID],        // Student IDs
  attendance: [
    {
      studentId: UUID,
      status: String,       // 'present', 'absent', 'late'
      notes: String
    }
  ]
}
```

## API Routes

### Authentication Routes
```
POST   /api/auth/register       - Register a new user
POST   /api/auth/login          - Login user
POST   /api/auth/logout         - Logout user
GET    /api/auth/me             - Get current user
PUT    /api/auth/me             - Update current user
POST   /api/auth/forgot-password - Initiate password reset
POST   /api/auth/reset-password - Complete password reset
```

### User Routes
```
GET    /api/users               - List users (admin only)
GET    /api/users/:id           - Get user details
PUT    /api/users/:id           - Update user (admin or self)
DELETE /api/users/:id           - Delete user (admin only)
GET    /api/users/:id/courses   - List courses for a user
```

### Course Routes
```
GET    /api/courses                      - List all courses
POST   /api/courses                      - Create new course (teacher/admin)
GET    /api/courses/:id                  - Get course details
PUT    /api/courses/:id                  - Update course (owner/admin)
DELETE /api/courses/:id                  - Delete course (owner/admin)
PUT    /api/courses/:id/status           - Update course status (admin)
PUT    /api/courses/:id/review           - Review a course (admin)
GET    /api/courses/:id/students         - List enrolled students
POST   /api/courses/:id/enroll           - Enroll a student
DELETE /api/courses/:id/enroll/:studentId - Unenroll a student
GET    /api/courses/:id/schedule         - Get course schedule
GET    /api/courses/:id/resources        - List course resources
POST   /api/courses/:id/resources        - Add a course resource
DELETE /api/courses/:id/resources/:resourceId - Delete a resource
GET    /api/courses/:id/syllabus         - Get course syllabus
POST   /api/courses/:id/syllabus         - Add syllabus week
PUT    /api/courses/:id/syllabus/:weekId - Update syllabus week
DELETE /api/courses/:id/syllabus/:weekId - Delete syllabus week
GET    /api/courses/:id/reviews          - Get course reviews
POST   /api/courses/:id/reviews          - Add a review (enrolled students)
```

### Assignment Routes
```
GET    /api/assignments                    - List assignments (filtered by user)
POST   /api/assignments                    - Create assignment (teacher/admin)
GET    /api/assignments/:id                - Get assignment details
PUT    /api/assignments/:id                - Update assignment (owner/admin)
DELETE /api/assignments/:id                - Delete assignment (owner/admin)
GET    /api/assignments/:id/submissions    - List submissions (teacher/admin)
POST   /api/assignments/:id/submissions    - Submit assignment (student)
GET    /api/assignments/:id/submissions/:submissionId - Get submission
PUT    /api/assignments/:id/submissions/:submissionId - Grade submission (teacher)
```

### Assessment Routes
```
GET    /api/assessments                    - List assessments
POST   /api/assessments                    - Create assessment (teacher/admin)
GET    /api/assessments/:id                - Get assessment details
PUT    /api/assessments/:id                - Update assessment (owner/admin)
DELETE /api/assessments/:id                - Delete assessment (owner/admin)
POST   /api/assessments/:id/start          - Start taking assessment (student)
POST   /api/assessments/:id/submit         - Submit assessment (student)
GET    /api/assessments/:id/submissions    - List all submissions (teacher/admin)
GET    /api/assessments/:id/submissions/:submissionId - Get submission details
PUT    /api/assessments/:id/submissions/:submissionId - Grade submission (teacher/proctor)
```

### Schedule Routes
```
GET    /api/schedule                     - Get user's schedule
GET    /api/courses/:id/schedule         - Get course schedule
POST   /api/courses/:id/schedule         - Add session to course schedule
PUT    /api/courses/:id/schedule/:sessionId - Update schedule session
DELETE /api/courses/:id/schedule/:sessionId - Delete schedule session
POST   /api/courses/:id/schedule/:sessionId/attendance - Mark attendance
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Each request to a protected endpoint should include an `Authorization` header with a valid token.

```
Authorization: Bearer <token>
```

### Token Payload
```javascript
{
  id: String,         // User ID
  email: String,      // User email
  role: String,       // User role
  iat: Number,        // Issued at timestamp
  exp: Number         // Expiration timestamp
}
```

## File Storage

The system uses secure cloud storage for all user-uploaded files, including:
- User avatars
- Course images
- Course resources (PDFs, videos, audio)
- Assignment submissions

### File Upload Process
1. Frontend requests a signed URL from the backend
2. Backend generates a time-limited signed URL for the specific file type
3. Frontend uploads directly to storage using the signed URL
4. Storage service triggers a webhook to notify the backend of successful upload
5. Backend updates the database with the permanent file URL

### File Types and Limitations
- Images: JPG, PNG, GIF (max 2MB)
- Documents: PDF (max 10MB)
- Audio: MP3, WAV (max 50MB)
- Video: MP4 (max 200MB)

## Real-time Features

The system implements WebSockets for real-time features:

1. **Live Classes**: Real-time video and audio streaming for virtual classroom sessions
2. **Chat**: Instant messaging between students and teachers
3. **Notifications**: Real-time notifications for:
   - New assignments
   - Upcoming deadlines
   - Graded submissions
   - Course announcements

### WebSocket Events
```javascript
// Connection events
'connect'             // Client connected
'disconnect'          // Client disconnected

// Chat events
'message:send'        // Send a message
'message:receive'     // Receive a message

// Notification events
'notification:new'    // New notification

// Class events
'class:join'          // Join a live class
'class:leave'         // Leave a live class
'class:question'      // Student asks a question
'class:answer'        // Teacher answers a question
```

## Response Format

All API responses follow a consistent format:

### Success Response
```javascript
{
  success: true,
  data: {
    // Response data here
  },
  message: "Optional success message"
}
```

### Error Response
```javascript
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "Human readable error message",
    details: {
      // Optional additional error details
    }
  }
}
```

### Pagination
For endpoints that return lists of items, pagination is supported:

```javascript
{
  success: true,
  data: [
    // Array of items
  ],
  pagination: {
    page: 1,
    limit: 10,
    totalItems: 100,
    totalPages: 10,
    hasNextPage: true,
    hasPrevPage: false
  }
}
```

## Database Relationships Diagram

```
User
├── Teacher
│   └── has many Courses
│   └── has many Schedules
├── Student
│   └── enrolled in many Courses
│   └── has many Submissions
│   └── has many Reviews
└── Admin
    └── manages all resources

Course
├── belongs to Teacher
├── has many Students
├── has many Resources
├── has many SyllabusWeeks
├── has many Assignments
├── has many Reviews
└── has many ScheduleSessions

Assignment
├── belongs to Course
└── has many Submissions

Submission
├── belongs to Assignment
└── belongs to Student

Assessment
├── belongs to Course
└── has many Questions
└── has many Submissions

Schedule
├── belongs to Course
└── has many Sessions
``` 