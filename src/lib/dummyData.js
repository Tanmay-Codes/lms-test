// dummyData.js - Mock data for Jamclef LMS

// User accounts with different roles
export const users = [
  {
    id: "admin1",
    name: "Alex Morgan",
    email: "admin@jamclef.com",
    password: "password123",
    role: "admin",
    avatar: "/avatars/admin.jpg",
    bio: "Music education administrator with 15+ years of experience in curriculum development.",
    joinedDate: "2021-03-15",
  },
  {
    id: "teacher1",
    name: "Sarah Johnson",
    email: "teacher@jamclef.com",
    password: "password123",
    role: "teacher",
    avatar: "/avatars/teacher.jpg",
    bio: "Concert pianist with degrees from Juilliard. Teaching piano and music theory for 10+ years.",
    joinedDate: "2021-05-22",
    expertise: ["Piano", "Music Theory", "Composition"],
    availability: {
      Monday: ["9:00-12:00", "14:00-17:00"],
      Tuesday: ["10:00-16:00"],
      Wednesday: ["9:00-12:00", "14:00-17:00"],
      Thursday: ["10:00-16:00"],
      Friday: ["9:00-13:00"],
      Saturday: ["10:00-14:00"],
      Sunday: [],
    },
  },
  {
    id: "student1",
    name: "Mike Chen",
    email: "student@jamclef.com",
    password: "password123",
    role: "student",
    avatar: "/avatars/student.jpg",
    bio: "Aspiring guitarist with a passion for rock and jazz fusion.",
    joinedDate: "2022-01-10",
    interests: ["Guitar", "Music Theory", "Jazz"],
    enrolledCourses: [1, 3, 5],
  },
  {
    id: "proctor1",
    name: "Jamie Davis",
    email: "proctor@jamclef.com",
    password: "password123",
    role: "proctor",
    avatar: "/avatars/proctor.jpg",
    bio: "Former music professor supervising exams and assessments.",
    joinedDate: "2022-06-18",
  },
];

// Courses data
export const courses = [
  {
    id: 1,
    title: "Music Theory Fundamentals",
    description: "Learn the essential elements of music theory including notation, scales, and chord progressions. Perfect for beginners with no prior music theory knowledge.",
    instructor: "Sarah Johnson",
    instructorId: "teacher1",
    students: 28,
    duration: "8 weeks",
    level: "Beginner",
    status: "active",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    courseType: "group",
    maxStudents: 30,
    reviewStatus: "approved",
    releaseDate: "2023-08-01T09:00:00",
    schedule: {
      days: ["Monday", "Wednesday"],
      time: "10:00 AM - 11:30 AM",
      timezone: "EST",
    },
    resources: [
      {
        id: "res001",
        title: "Music Theory Cheat Sheet",
        description: "A quick reference guide for common music theory concepts",
        url: "/resources/music-theory-cheatsheet.pdf",
        type: "pdf",
        size: "1.2 MB",
        dateAdded: "2023-07-20"
      },
      {
        id: "res002",
        title: "Ear Training Exercises",
        description: "Audio examples for interval and chord recognition",
        url: "/resources/ear-training.mp3",
        type: "audio",
        size: "15 MB",
        dateAdded: "2023-07-22"
      }
    ],
    syllabus: [
      {
        week: 1,
        title: "Notation Basics",
        description: "Introduction to staff, clefs, and basic note reading",
        materials: ["Notation handout", "Practice sheet music"],
        assignments: [
          {
            id: 101,
            title: "Note Identification",
            dueDate: "2023-09-15",
            description: "Complete the worksheet identifying notes on the staff",
          }
        ]
      },
      {
        week: 2,
        title: "Rhythm and Meter",
        description: "Understanding time signatures, note values, and basic rhythms",
        materials: ["Rhythm charts", "Audio examples"],
        assignments: [
          {
            id: 102,
            title: "Rhythm Notation Exercise",
            dueDate: "2023-09-22",
            description: "Notate the rhythms from the provided audio examples",
          }
        ]
      },
      {
        week: 3,
        title: "Major Scales",
        description: "Construction and theory behind major scales",
        materials: ["Scale worksheet", "Audio examples"],
        assignments: [
          {
            id: 103,
            title: "Major Scale Construction",
            dueDate: "2023-09-29",
            description: "Write out all 12 major scales with correct key signatures",
          }
        ]
      },
      {
        week: 4,
        title: "Minor Scales",
        description: "Natural, harmonic, and melodic minor scales",
        materials: ["Minor scale reference sheet", "Practice exercises"],
        assignments: [
          {
            id: 104,
            title: "Minor Scale Analysis",
            dueDate: "2023-10-06",
            description: "Analyze and identify different minor scale types in musical excerpts",
          }
        ]
      },
      {
        week: 5,
        title: "Intervals",
        description: "Understanding and identifying musical intervals",
        materials: ["Interval chart", "Ear training exercises"],
        assignments: [
          {
            id: 105,
            title: "Interval Identification",
            dueDate: "2023-10-13",
            description: "Complete worksheet identifying intervals visually and aurally",
          }
        ]
      },
      {
        week: 6,
        title: "Triads and Chord Construction",
        description: "Major, minor, diminished, and augmented triads",
        materials: ["Chord construction guide", "Examples"],
        assignments: [
          {
            id: 106,
            title: "Chord Building",
            dueDate: "2023-10-20",
            description: "Construct various triads and seventh chords in different keys",
          }
        ]
      },
      {
        week: 7,
        title: "Chord Progressions",
        description: "Common chord progressions and harmonic analysis",
        materials: ["Progression examples", "Analysis worksheet"],
        assignments: [
          {
            id: 107,
            title: "Harmonic Analysis",
            dueDate: "2023-10-27",
            description: "Analyze the chord progressions in provided musical examples",
          }
        ]
      },
      {
        week: 8,
        title: "Final Project",
        description: "Apply all concepts learned in a comprehensive analysis",
        materials: ["Project guidelines", "Example analyses"],
        assignments: [
          {
            id: 108,
            title: "Final Theory Analysis",
            dueDate: "2023-11-03",
            description: "Complete a full harmonic and melodic analysis of a short musical piece",
          }
        ]
      },
    ],
    reviews: [
      {
        id: 201,
        studentId: "student1",
        studentName: "Mike Chen",
        rating: 5,
        comment: "Excellent introduction to music theory! The instructor breaks down complex concepts into easy-to-understand chunks.",
        date: "2023-07-15",
      },
      {
        id: 202,
        studentId: "student2",
        studentName: "Lisa Wong",
        rating: 4,
        comment: "Great course overall. The assignments really helped solidify my understanding.",
        date: "2023-08-02",
      },
    ],
  },
  {
    id: 2,
    title: "Electric Guitar Masterclass",
    description: "Comprehensive electric guitar course covering techniques from basic to advanced, including scales, chords, improvisation, and performance skills.",
    instructor: "James Wilson",
    instructorId: "teacher2",
    students: 15,
    duration: "12 weeks",
    level: "Intermediate",
    status: "active",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    courseType: "group",
    maxStudents: 15,
    reviewStatus: "approved",
    releaseDate: "2023-07-15T10:00:00",
    resources: [
      {
        id: "res003",
        title: "Guitar Technique Guide",
        description: "Comprehensive guide for electric guitar techniques",
        url: "/resources/guitar-technique-guide.pdf",
        type: "pdf",
        size: "3.5 MB",
        dateAdded: "2023-07-10"
      }
    ],
    schedule: {
      days: ["Tuesday", "Thursday"],
      time: "6:00 PM - 7:30 PM",
      timezone: "EST",
    },
    syllabus: [
      {
        week: 1,
        title: "Electric Guitar Fundamentals",
        description: "Guitar setup, amplifier settings, and basic techniques",
        materials: ["Guitar setup guide", "Technique videos"],
        assignments: [
          {
            id: 201,
            title: "Technique Exercises",
            dueDate: "2023-09-14",
            description: "Practice and record the fundamental picking and fretting exercises",
          }
        ]
      },
      // More syllabus weeks...
    ],
    reviews: [],
  },
  {
    id: 3,
    title: "Acoustic Guitar for Beginners",
    description: "Start your musical journey with this beginner-friendly acoustic guitar course. Learn chords, strumming patterns, and play your first songs.",
    instructor: "Emma Rodriguez",
    instructorId: "teacher3",
    students: 32,
    duration: "8 weeks",
    level: "Beginner",
    status: "active",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    courseType: "group",
    maxStudents: 35,
    reviewStatus: "approved",
    releaseDate: "2023-06-20T08:30:00",
    resources: [
      {
        id: "res004",
        title: "Beginner Chord Chart",
        description: "Essential chords for beginners",
        url: "/resources/beginner-chords.pdf",
        type: "pdf",
        size: "1.1 MB",
        dateAdded: "2023-06-15"
      }
    ],
    schedule: {
      days: ["Monday", "Wednesday"],
      time: "5:00 PM - 6:00 PM",
      timezone: "EST",
    },
    syllabus: [],
    reviews: [],
  },
  {
    id: 4,
    title: "Private Piano Lessons",
    description: "One-on-one piano instruction tailored to your skill level and musical interests. From classical to contemporary styles.",
    instructor: "Sarah Johnson",
    instructorId: "teacher1",
    students: 1,
    duration: "Ongoing",
    level: "All Levels",
    status: "active",
    price: 75.00, // per hour
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    courseType: "solo",
    reviewStatus: "approved",
    releaseDate: "2023-05-10T09:00:00",
    resources: [
      {
        id: "res005",
        title: "Piano Scales Library",
        description: "Collection of all major and minor scales",
        url: "/resources/piano-scales.pdf",
        type: "pdf",
        size: "2.3 MB",
        dateAdded: "2023-05-08"
      },
      {
        id: "res006",
        title: "Piano Technique Videos",
        description: "Video demonstrations of proper piano technique",
        url: "/resources/piano-technique.mp4",
        type: "video",
        size: "45 MB",
        dateAdded: "2023-05-09"
      }
    ],
    schedule: {
      days: ["Flexible"],
      time: "By appointment",
      timezone: "EST",
    },
    syllabus: [],
    reviews: [],
  },
  {
    id: 5,
    title: "Jazz Improvisation",
    description: "Develop your skills in jazz improvisation, learning scales, patterns, and the theory behind great solos.",
    instructor: "Marcus Green",
    instructorId: "teacher4",
    students: 18,
    duration: "10 weeks",
    level: "Intermediate",
    status: "upcoming",
    price: 219.99,
    image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 0,
    courseType: "group",
    maxStudents: 20,
    reviewStatus: "approved",
    releaseDate: "2023-11-15T14:00:00",
    resources: [
      {
        id: "res007",
        title: "Jazz Scale Patterns",
        description: "Common scale patterns used in jazz improvisation",
        url: "/resources/jazz-scales.pdf",
        type: "pdf",
        size: "1.8 MB",
        dateAdded: "2023-10-25"
      }
    ],
    schedule: {
      days: ["Friday"],
      time: "4:00 PM - 6:00 PM",
      timezone: "EST",
    },
    syllabus: [],
    reviews: [],
  },
  {
    id: 6,
    title: "Songwriting Workshop",
    description: "Learn the craft of songwriting from melody creation to lyrics writing. Develop your unique voice as a composer.",
    instructor: "Olivia Barnes",
    instructorId: "teacher5",
    students: 22,
    duration: "6 weeks",
    level: "All Levels",
    status: "active",
    price: 179.99,
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    courseType: "group",
    maxStudents: 25,
    reviewStatus: "approved",
    releaseDate: "2023-05-05T13:00:00",
    resources: [
      {
        id: "res008",
        title: "Songwriting Workbook",
        description: "Exercises and templates for songwriting practice",
        url: "/resources/songwriting-workbook.pdf",
        type: "pdf",
        size: "2.7 MB",
        dateAdded: "2023-05-01"
      },
      {
        id: "res009",
        title: "Lyrics Writing Guide",
        description: "Tips and techniques for writing compelling lyrics",
        url: "/resources/lyrics-guide.pdf",
        type: "pdf",
        size: "1.9 MB",
        dateAdded: "2023-05-02"
      }
    ],
    schedule: {
      days: ["Saturday"],
      time: "10:00 AM - 12:00 PM",
      timezone: "EST",
    },
    syllabus: [],
    reviews: [],
  },
  {
    id: 7,
    title: "Vocal Training",
    description: "Develop proper singing technique, increase vocal range, and improve tone quality with this comprehensive vocal training course.",
    instructor: "Diana Ross",
    instructorId: "teacher6",
    students: 25,
    duration: "12 weeks",
    level: "All Levels",
    status: "active",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    courseType: "group",
    maxStudents: 25,
    reviewStatus: "approved",
    releaseDate: "2023-06-01T15:30:00",
    resources: [
      {
        id: "res010",
        title: "Vocal Warm-up Exercises",
        description: "Audio guide for daily vocal warm-ups",
        url: "/resources/vocal-warmup.mp3",
        type: "audio",
        size: "18 MB",
        dateAdded: "2023-05-28"
      },
      {
        id: "res011",
        title: "Breathing Techniques",
        description: "Video demonstration of proper breathing for singers",
        url: "/resources/breathing-techniques.mp4",
        type: "video",
        size: "35 MB",
        dateAdded: "2023-05-29"
      }
    ],
    schedule: {
      days: ["Tuesday", "Thursday"],
      time: "7:00 PM - 8:00 PM",
      timezone: "EST",
    },
    syllabus: [],
    reviews: [],
  },
  {
    id: 8,
    title: "Drum Fundamentals",
    description: "Master the basics of drumming including technique, rhythm, and coordination. Suitable for complete beginners.",
    instructor: "Jason Lee",
    instructorId: "teacher7",
    students: 15,
    duration: "8 weeks",
    level: "Beginner",
    status: "active",
    price: 189.99,
    image: "https://images.unsplash.com/photo-1457523054379-8d03ab311737?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    courseType: "group",
    maxStudents: 15,
    reviewStatus: "approved",
    releaseDate: "2023-07-10T10:00:00",
    resources: [
      {
        id: "res012",
        title: "Drum Notation Guide",
        description: "Basic guide to reading drum notation",
        url: "/resources/drum-notation.pdf",
        type: "pdf",
        size: "1.5 MB",
        dateAdded: "2023-07-05"
      },
      {
        id: "res013",
        title: "Basic Beats and Fills",
        description: "Audio examples of common drum patterns",
        url: "/resources/basic-beats.mp3",
        type: "audio",
        size: "22 MB",
        dateAdded: "2023-07-08"
      }
    ],
    schedule: {
      days: ["Wednesday", "Friday"],
      time: "5:00 PM - 6:30 PM",
      timezone: "EST",
    },
    syllabus: [],
    reviews: [],
  },
  {
    id: 9,
    title: "Private Violin Lessons",
    description: "One-on-one violin instruction with personalized feedback and guidance. From classical to contemporary approaches.",
    instructor: "Sophia Chen",
    instructorId: "teacher8",
    students: 1,
    duration: "Ongoing",
    level: "All Levels",
    status: "active",
    price: 80.00, // per hour
    image: "https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    courseType: "solo",
    reviewStatus: "approved",
    releaseDate: "2023-04-15T09:00:00",
    resources: [
      {
        id: "res014",
        title: "Violin Positioning Guide",
        description: "Illustrations for proper violin and bow positioning",
        url: "/resources/violin-positioning.pdf",
        type: "pdf",
        size: "3.2 MB",
        dateAdded: "2023-04-10"
      },
      {
        id: "res015",
        title: "Beginner Violin Pieces",
        description: "Sheet music for beginning violin students",
        url: "/resources/beginner-violin-music.pdf",
        type: "pdf",
        size: "4.5 MB",
        dateAdded: "2023-04-12"
      }
    ],
    schedule: {
      days: ["Flexible"],
      time: "By appointment",
      timezone: "EST",
    },
    syllabus: [],
    reviews: [],
  },
];

// Assignments for students
export const assignments = [
  {
    id: 1,
    courseId: 1,
    title: "Note Identification Quiz",
    description: "Complete the worksheet identifying notes on the staff in treble and bass clefs.",
    dueDate: "2023-09-15",
    totalPoints: 100,
    attachments: [
      {
        name: "note_identification_worksheet.pdf",
        url: "/assignments/note_worksheet.pdf",
      }
    ],
    submissions: [
      {
        id: 101,
        studentId: "student1",
        studentName: "Mike Chen",
        submittedDate: "2023-09-14",
        status: "submitted",
        grade: 92,
        feedback: "Excellent work! Just a few errors in the bass clef notes.",
        files: [
          {
            name: "mike_notes_assignment.pdf",
            url: "/submissions/mike_notes.pdf",
          }
        ]
      }
    ]
  },
  {
    id: 2,
    courseId: 1,
    title: "Major Scale Construction",
    description: "Write out all 12 major scales with correct key signatures and fingerings.",
    dueDate: "2023-09-29",
    totalPoints: 100,
    attachments: [
      {
        name: "scale_template.pdf",
        url: "/assignments/scale_template.pdf",
      }
    ],
    submissions: [
      {
        id: 201,
        studentId: "student1",
        studentName: "Mike Chen",
        submittedDate: "2023-09-28",
        status: "submitted",
        grade: 88,
        feedback: "Good work overall. Pay attention to the key signatures for F# and Gb major.",
        files: [
          {
            name: "mike_scales_assignment.pdf",
            url: "/submissions/mike_scales.pdf",
          }
        ]
      }
    ]
  },
  {
    id: 3,
    courseId: 2,
    title: "Blues Scale Solo",
    description: "Record yourself playing a 12-bar blues solo using the blues scale patterns we learned in class.",
    dueDate: "2023-10-05",
    totalPoints: 100,
    attachments: [
      {
        name: "blues_backing_track.mp3",
        url: "/assignments/blues_backing.mp3",
      }
    ],
    submissions: []
  }
];

// Schedule data
export const schedules = [
  {
    id: 1,
    title: "Music Theory Fundamentals",
    courseId: 1,
    teacher: "Sarah Johnson",
    teacherId: "teacher1",
    date: "2023-09-11",
    startTime: "2023-09-11T10:00:00",
    endTime: "2023-09-11T11:30:00",
    time: "10:00 AM - 11:30 AM",
    location: "Virtual Classroom 1",
    type: "lecture",
    recurring: true,
    description: "Introduction to music notation and basic theory concepts",
    attendees: [
      {
        studentId: "student1",
        studentName: "Mike Chen",
        status: "present"
      }
    ]
  },
  {
    id: 2,
    title: "Music Theory Fundamentals",
    courseId: 1,
    teacher: "Sarah Johnson",
    teacherId: "teacher1",
    date: "2023-09-13",
    startTime: "2023-09-13T10:00:00",
    endTime: "2023-09-13T11:30:00",
    time: "10:00 AM - 11:30 AM",
    location: "Virtual Classroom 1",
    type: "lecture",
    recurring: true,
    description: "Scales and intervals in music theory",
    attendees: []
  },
  {
    id: 3,
    title: "Private Piano Lesson",
    courseId: 4,
    teacher: "Sarah Johnson",
    teacherId: "teacher1",
    date: "2023-09-12",
    startTime: "2023-09-12T15:00:00",
    endTime: "2023-09-12T16:00:00",
    time: "3:00 PM - 4:00 PM",
    location: "Studio B",
    type: "lesson",
    recurring: false,
    description: "One-on-one piano instruction focusing on technique",
    attendees: [
      {
        studentId: "student1",
        studentName: "Mike Chen",
        status: "pending"
      }
    ]
  },
  {
    id: 4,
    title: "Doubt Session - Music Theory",
    courseId: 1,
    teacher: "Sarah Johnson",
    teacherId: "teacher1",
    date: "2023-09-14",
    startTime: "2023-09-14T14:00:00",
    endTime: "2023-09-14T15:00:00",
    time: "2:00 PM - 3:00 PM",
    location: "Virtual Office Hours",
    type: "office-hours",
    recurring: false,
    description: "Open session for students to ask questions about music theory concepts",
    attendees: [
      {
        studentId: "student1",
        studentName: "Mike Chen",
        status: "pending"
      }
    ]
  },
  // New events with current dates
  {
    id: 5,
    title: "Guitar Workshop",
    courseId: 2,
    teacher: "Robert Smith",
    teacherId: "teacher2",
    date: new Date().toISOString().split('T')[0],
    startTime: new Date(new Date().setHours(13, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(14, 30, 0, 0)).toISOString(),
    time: "1:00 PM - 2:30 PM",
    location: "Guitar Studio",
    type: "workshop",
    recurring: false,
    description: "Hands-on workshop focusing on advanced guitar techniques",
    attendees: []
  },
  {
    id: 6,
    title: "Vocal Training",
    courseId: 7,
    teacher: "Diana Ross",
    teacherId: "teacher6",
    date: new Date().toISOString().split('T')[0],
    startTime: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(),
    time: "3:00 PM - 4:00 PM",
    location: "Vocal Studio A",
    type: "lesson",
    recurring: true,
    description: "Group vocal lesson focusing on breath control and pitch",
    attendees: []
  },
  {
    id: 7,
    title: "Jazz Improvisation",
    courseId: 5,
    teacher: "Marcus Green",
    teacherId: "teacher4",
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
    startTime: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(10, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(12, 0, 0, 0)).toISOString(),
    time: "10:00 AM - 12:00 PM",
    location: "Jazz Room",
    type: "practice",
    recurring: true,
    description: "Practice session for jazz improvisation techniques",
    attendees: []
  },
  {
    id: 8,
    title: "Music Theory Exam",
    courseId: 1,
    teacher: "Sarah Johnson",
    teacherId: "teacher1",
    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
    startTime: new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(14, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(15, 30, 0, 0)).toISOString(),
    time: "2:00 PM - 3:30 PM",
    location: "Virtual Classroom 1",
    type: "exam",
    recurring: false,
    description: "Mid-term examination on music theory fundamentals",
    attendees: []
  },
  {
    id: 9,
    title: "Songwriting Workshop",
    courseId: 6,
    teacher: "Olivia Barnes",
    teacherId: "teacher5",
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
    startTime: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(16, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(18, 0, 0, 0)).toISOString(),
    time: "4:00 PM - 6:00 PM",
    location: "Creative Studio",
    type: "workshop",
    recurring: false,
    description: "Collaborative workshop on lyric writing and melody composition",
    attendees: []
  },
  {
    id: 10,
    title: "Faculty Meeting",
    courseId: null,
    teacher: "All Staff",
    teacherId: "admin",
    date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
    startTime: new Date(new Date(new Date().setDate(new Date().getDate() + 3)).setHours(9, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 3)).setHours(10, 0, 0, 0)).toISOString(),
    time: "9:00 AM - 10:00 AM",
    location: "Conference Room",
    type: "meeting",
    recurring: false,
    description: "Monthly faculty meeting to discuss curriculum and student progress",
    attendees: []
  }
];

// Attendance records
export const attendance = [
  {
    id: 1,
    scheduleId: 1,
    courseId: 1,
    date: "2023-09-11",
    records: [
      {
        studentId: "student1",
        studentName: "Mike Chen",
        status: "present",
        note: ""
      },
      // More student records...
    ]
  },
  // More attendance records...
];

// Student progress and grades
export const studentProgress = [
  {
    studentId: "student1",
    courses: [
      {
        courseId: 1,
        progress: 25, // percentage
        assignments: [
          {
            assignmentId: 1,
            status: "completed",
            grade: 92
          },
          {
            assignmentId: 2,
            status: "completed",
            grade: 88
          }
        ],
        overallGrade: 90,
        lastAccessed: "2023-09-10"
      },
      {
        courseId: 3,
        progress: 15,
        assignments: [],
        overallGrade: null,
        lastAccessed: "2023-09-09"
      }
    ]
  }
];

// Revenue data
export const revenue = [
  {
    month: "January",
    year: 2023,
    amount: 12500.00,
    courses: {
      "Music Theory Fundamentals": 2099.86,
      "Electric Guitar Masterclass": 2399.92,
      "Acoustic Guitar for Beginners": 1559.88,
      "Private Piano Lessons": 2250.00,
      "Jazz Improvisation": 1759.92,
      "Songwriting Workshop": 1079.94,
      "Vocal Training": 1249.95,
      "Drum Fundamentals": 759.96,
      "Private Violin Lessons": 800.00
    }
  },
  {
    month: "February",
    year: 2023,
    amount: 13200.00,
    courses: {
      "Music Theory Fundamentals": 2249.85,
      "Electric Guitar Masterclass": 2699.91,
      "Acoustic Guitar for Beginners": 1689.87,
      "Private Piano Lessons": 2100.00,
      "Jazz Improvisation": 1979.91,
      "Songwriting Workshop": 1259.93,
      "Vocal Training": 1499.94,
      "Drum Fundamentals": 949.95,
      "Private Violin Lessons": 640.00
    }
  },
  // More months...
];

// Notifications for users
export const notifications = [
  {
    id: 1,
    userId: "student1",
    title: "New Assignment Posted",
    message: "A new assignment 'Chord Progression Analysis' has been posted in Music Theory Fundamentals.",
    date: "2023-09-11T10:30:00",
    read: false,
    link: "/dashboard/assignments/4"
  },
  {
    id: 2,
    userId: "student1",
    title: "Assignment Graded",
    message: "Your submission for 'Note Identification Quiz' has been graded. You received 92/100.",
    date: "2023-09-15T14:22:00",
    read: true,
    link: "/dashboard/assignments/1"
  },
  {
    id: 3,
    userId: "teacher1",
    title: "New Assignment Submission",
    message: "Mike Chen has submitted 'Major Scale Construction' for review.",
    date: "2023-09-28T18:45:00",
    read: false,
    link: "/dashboard/assignments/submissions/201"
  }
];

// Discussion forums
export const discussions = [
  {
    id: 1,
    courseId: 1,
    title: "Questions about Circle of Fifths",
    author: {
      id: "student1",
      name: "Mike Chen",
      avatar: "/avatars/student.jpg"
    },
    date: "2023-09-16T09:30:00",
    content: "I'm having trouble understanding how to use the circle of fifths to determine key signatures. Can anyone provide some additional examples?",
    replies: [
      {
        id: 101,
        author: {
          id: "teacher1",
          name: "Sarah Johnson",
          avatar: "/avatars/teacher.jpg"
        },
        date: "2023-09-16T11:15:00",
        content: "Great question, Mike! The circle of fifths is a visual tool that shows the relationship between the 12 tones. Each clockwise movement adds one sharp to the key signature. For example, C has no sharps or flats, G has one sharp (F#), D has two sharps (F# and C#), and so on. I'll post some visual examples in our next class materials."
      }
    ],
    pinned: false,
    locked: false
  }
];

// Available resources
export const resources = [
  {
    id: 1,
    courseId: 1,
    title: "Music Theory Reference Guide",
    description: "Comprehensive PDF with all key music theory concepts covered in the course.",
    type: "pdf",
    url: "/resources/music_theory_reference.pdf",
    size: "2.4 MB",
    uploadedBy: "teacher1",
    uploadDate: "2023-08-28"
  },
  {
    id: 2,
    courseId: 1,
    title: "Ear Training Exercises",
    description: "Audio files for practicing interval and chord recognition.",
    type: "audio",
    url: "/resources/ear_training_exercises.zip",
    size: "15.8 MB",
    uploadedBy: "teacher1",
    uploadDate: "2023-08-30"
  }
];

// Assessment and exam data
export const assessments = [
  {
    id: 1,
    courseId: 1,
    title: "Midterm Exam: Music Fundamentals",
    description: "Comprehensive assessment covering notation, scales, intervals, and basic chord construction.",
    dueDate: "2023-10-15",
    duration: 90, // minutes
    totalPoints: 100,
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "Which of the following notes has a duration of 2 beats in 4/4 time?",
        options: ["Quarter note", "Half note", "Whole note", "Eighth note"],
        correctAnswer: "Half note",
        points: 5
      },
      // More questions...
    ],
    status: "scheduled",
    proctored: true,
    proctorId: "proctor1"
  }
];

// Certificate templates
export const certificates = [
  {
    id: 1,
    title: "Course Completion",
    description: "Standard certificate awarded upon successful completion of a course",
    template: "/certificates/completion_template.jpg",
    requiredGrade: 70,
    signatures: ["Director of Education", "Course Instructor"]
  },
  {
    id: 2,
    title: "Excellence Award",
    description: "Special certificate awarded for outstanding performance",
    template: "/certificates/excellence_template.jpg",
    requiredGrade: 95,
    signatures: ["Director of Education", "Course Instructor", "Academic Dean"]
  }
];

// Default export for all data
export default {
  users,
  courses,
  assignments,
  schedules,
  attendance,
  studentProgress,
  revenue,
  notifications,
  discussions,
  resources,
  assessments,
  certificates
}; 