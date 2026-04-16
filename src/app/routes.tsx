import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Chat } from "./components/Chat";
import { Quiz } from "./components/Quiz";
import { MistakeAnalysis } from "./components/MistakeAnalysis";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "chat", element: <Chat /> },
      { path: "quiz", element: <Quiz /> },
      { path: "mistakes", element: <MistakeAnalysis /> },
    ],
  },
]);
