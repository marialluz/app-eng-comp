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

