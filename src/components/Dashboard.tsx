import { useState } from "react";
import Sidebar from "./Sidebar";
import TaskList from "./TaskList";

const Dashboard = () => {
  const [projectId, setProjectId] = useState<string | null>(null);

  return (
    <div className="flex  h-screen">
      {/* sidebar */}
      <Sidebar activeProjectId={projectId} onSelectProject={setProjectId} />
      {/* main dashboard area */}
      <main className="flex-1 p-6">
        <TaskList projectId={projectId} />
      </main>
    </div>
  );
};

export default Dashboard;
