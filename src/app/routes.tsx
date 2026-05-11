import { lazy, Suspense, type ReactElement } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AuthGuard } from "./components/AuthGuard";
import { Skeleton } from "./components/ui/skeleton";

const Layout = lazy(() => import("./components/Layout").then((module) => ({ default: module.Layout })));
const Dashboard = lazy(() => import("./components/Dashboard").then((module) => ({ default: module.Dashboard })));
const Chat = lazy(() => import("./components/Chat").then((module) => ({ default: module.Chat })));
const Quiz = lazy(() => import("./components/Quiz").then((module) => ({ default: module.Quiz })));
const Notes = lazy(() => import("./components/Notes").then((module) => ({ default: module.Notes })));
const MistakeAnalysis = lazy(() =>
  import("./components/MistakeAnalysis").then((module) => ({ default: module.MistakeAnalysis })),
);
const Login = lazy(() => import("./components/Login").then((module) => ({ default: module.Login })));

function RouteFallback() {
  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4 lg:p-8">
      <Skeleton className="h-16 rounded-2xl" />
      <Skeleton className="h-52 rounded-2xl" />
      <Skeleton className="h-52 rounded-2xl" />
    </div>
  );
}

function withSuspense(element: ReactElement) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: withSuspense(<Login />),
  },
  {
    path: "/",
    element: (
      <AuthGuard>
        {withSuspense(<Layout />)}
      </AuthGuard>
    ),
    children: [
      { index: true, element: withSuspense(<Dashboard />) },
      { path: "chat", element: withSuspense(<Chat />) },
      { path: "quiz", element: withSuspense(<Quiz />) },
      { path: "notes", element: withSuspense(<Notes />) },
      { path: "mistakes", element: withSuspense(<MistakeAnalysis />) },
    ],
  },
]);
