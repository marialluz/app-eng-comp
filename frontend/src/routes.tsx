import { RouteObject } from 'react-router-dom';
import CurriculumStructure from './pages/curriculum/CurriculumStructure';
import PreRequisites from './pages/curriculum/PreRequisites';
import SubjectDetails from './pages/curriculum/SubjectDetails';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import DirectoryList from './pages/materials/DirectoryList';
import DirectoryView from './pages/materials/DirectoryView';
import FileShare from './pages/materials/FileShare';
import FileUpload from './pages/materials/FileUpload';
import PostCreate from './pages/posts/PostCreate';
import PostList from './pages/posts/PostList';
import PostView from './pages/posts/PostView';
import Register from './pages/Register';
import ScheduleList from './pages/schedule/ScheduleList';
import SchedulePlanner from './pages/schedule/SchedulePlanner';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';

// import DirectoryList from './pages/Materials/DirectoryList';
// import DirectoryView from './pages/Materials/DirectoryView';
// import FileUpload from './pages/Materials/FileUpload';
// import FileShare from './pages/Materials/FileShare';
// import CurriculumStructure from './pages/Curriculum/CurriculumStructure';
// import SubjectDetails from './pages/Curriculum/SubjectDetails';
// import PreRequisites from './pages/Curriculum/PreRequisites';
// import SchedulePlanner from './pages/Schedule/SchedulePlanner';
// import ScheduleList from './pages/Schedule/ScheduleList';
// import PostList from './pages/Posts/PostList';
// import PostCreate from './pages/Posts/PostCreate';
// import PostView from './pages/Posts/PostView';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/dashboard',
    children: [
      {
        path: 'student',
        element: <StudentDashboard />,
      },
      {
        path: 'teacher',
        element: <TeacherDashboard />,
      },
    ],
   },  
   {
    path: '/materials',
    children: [
      {
        path: '',
        element: <DirectoryList />,
      },
      {
        path: ':directoryId',
        element: <DirectoryView />,
      },
      {
        path: 'upload',
        element: <FileUpload />,
      },
      {
        path: 'share/:fileId',
        element: <FileShare />,
      },
    ],
   },
  {
    path: '/curriculum',
    children: [
      {
        path: '',
        element: <CurriculumStructure />,
      },
      {
        path: ':subjectId',
        element: <SubjectDetails />,
      },
      {
        path: 'prerequisites/:subjectId',
        element: <PreRequisites />,
      },
    ],
  },
  {
    path: '/schedule',
    children: [
      {
        path: 'planner',
        element: <SchedulePlanner />,
      },
      {
        path: 'list',
        element: <ScheduleList />,
      },
    ],
  },
  {
    path: '/posts',
    children: [
      {
        path: '',
        element: <PostList />,
      },
      {
        path: 'create',
        element: <PostCreate />,
      },
      {
        path: ':postId',
        element: <PostView />,
      },
    ],
  },
];

