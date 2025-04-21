import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './lib/redux/store';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './lib/auth-context';
import { ProtectedRoute } from './components/ProtectedRoute';

// Layouts
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthLayout } from './layouts/AuthLayout';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Courses } from './pages/Courses';
import { CourseDetails } from './pages/CourseDetails';
import { Schedule } from './pages/Schedule';
import { Assignments } from './pages/Assignments';
import { AssignmentDetails } from './pages/AssignmentDetails';
import { Discussions } from './pages/Discussions';
import { Progress } from './pages/Progress';
import { Certificates } from './pages/Certificates';
import { Profile } from './pages/Profile';
import { CourseManagement } from './pages/CourseManagement';
import { StudentManagement } from './pages/StudentManagement';
import { TeacherManagement } from './pages/TeacherManagement';
import { Revenue } from './pages/Revenue';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { Assessments } from './pages/Assessments';
import { AssessmentDetails } from './pages/AssessmentDetails';
import { TakeAssessment } from './pages/TakeAssessment';
import { Resources } from './pages/Resources';
import { NotFound } from './pages/NotFound';
import { CourseManagePage } from './pages/CourseManagePage';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Redirect root to dashboard or login */}
              <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
              />

              {/* Auth routes */}
              <Route path="/" element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>

              {/* Protected dashboard routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                {/* Common routes for all roles */}
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="courses" element={<Courses />} />
                <Route path="courses/:id" element={<CourseDetails />} />
                <Route path="schedule" element={<Schedule />} />
                <Route path="assignments" element={<Assignments />} />
                <Route path="assignments/:id" element={<AssignmentDetails />} />
                <Route path="discussions" element={<Discussions />} />
                <Route path="resources" element={<Resources />} />
                <Route path="profile" element={<Profile />} />
                
                {/* Student specific routes */}
                <Route path="progress" element={<Progress />} />
                <Route path="certificates" element={<Certificates />} />
                <Route path="assessments/take/:id" element={<TakeAssessment />} />
                
                {/* Teacher and Admin routes */}
                <Route 
                  path="assessments" 
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'teacher', 'proctor']}>
                      <Assessments />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="assessments/:id" 
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'teacher', 'proctor']}>
                      <AssessmentDetails />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="course-management" 
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                      <CourseManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="course-management/edit/:id" 
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                      <CourseManagePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="student-management" 
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                      <StudentManagement />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin-only routes */}
                <Route 
                  path="analytics" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Analytics />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="revenue" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Revenue />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="teacher-management" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <TeacherManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="settings" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Settings />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Proctor specific routes */}
                <Route 
                  path="proctoring" 
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'proctor']}>
                      <Assessments />
                    </ProtectedRoute>
                  } 
                />
              </Route>

              {/* 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;