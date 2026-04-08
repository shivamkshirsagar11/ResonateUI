import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { AppLayout } from "./components/layout/AppLayout";

// Lazy-loaded pages
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const UploadPage = lazy(() => import("./pages/UploadPage"));
const DocumentsPage = lazy(() => import("./pages/DocumentsPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));

function PageLoader() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

// Route definitions
const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <LoginPage />
    </Suspense>
  ),
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <SignupPage />
    </Suspense>
  ),
});

const homeLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/home",
  component: AppLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => homeLayoutRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <DashboardPage />
    </Suspense>
  ),
});

const uploadRoute = createRoute({
  getParentRoute: () => homeLayoutRoute,
  path: "/upload",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <UploadPage />
    </Suspense>
  ),
});

const documentsRoute = createRoute({
  getParentRoute: () => homeLayoutRoute,
  path: "/documents",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <DocumentsPage />
    </Suspense>
  ),
});

const chatRoute = createRoute({
  getParentRoute: () => homeLayoutRoute,
  path: "/chat",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ChatPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  homeLayoutRoute.addChildren([
    dashboardRoute,
    uploadRoute,
    documentsRoute,
    chatRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
