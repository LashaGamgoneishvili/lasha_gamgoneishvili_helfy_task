import { AppContent } from "./components/AppContent/AppContent";
import { TaskAppProvider } from "./context/TaskAppContext";
import "./App.css";

export default function App() {
  return (
    <TaskAppProvider>
      <AppContent />
    </TaskAppProvider>
  );
}
