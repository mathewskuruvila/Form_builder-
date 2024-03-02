import { Suspense, lazy } from 'react';
import type { RouteObject } from 'react-router';
// import LoadingScreen from './components/LoadingScreen';
// // import MainLayout from './layout/MainLayout';
import AuthGuard from '@/components/AuthGuard';
import GuestGuard from '@/components/GuestGuard';
import FormSubmitComponent from '@/components/FormSubmitComponent';

const Loadable = (Component: any) => (props: JSX.IntrinsicAttributes) =>
(
  <Suspense>
    <Component {...props} />
  </Suspense>
);

// *  AUTHENTICATION PAGES
const Login = Loadable(lazy(() => import('@/pages/auth/sign-in')));
const Register = Loadable(lazy(() => import('@/pages/auth/sign-up')));
const Builder = Loadable(lazy(()=> import("@/pages/builder")))
//  * HOME PAGE
const Home = Loadable(lazy(() => import('@/pages')));

const routes: RouteObject[] = [
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        element: (
          // <GuestGuard>
            <Login />
          // </GuestGuard>
        ),
      },
      {
        path: 'register',
        element: (
          // <GuestGuard>
            <Register />
          // </GuestGuard>
        ),
      },
    ],
  },

  {
    path: '/',
    children: [
      {
        path:"/",
        element: (
          // <AuthGuard>
            <Home />
          // </AuthGuard>
        ),
      },
      {
        path: 'builder',
        element: (
          // <GuestGuard>
            <Builder />
          // </GuestGuard>
        ),
      },
      {
        path: 'form',
        element: (
          // <GuestGuard>
            <FormSubmitComponent />
          // </GuestGuard>
        ),
      },
    ],
  },
];

export default routes;