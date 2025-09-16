import { Plus, Folder, LogOut, Pencil, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addProject,
  deleteProject,
  renameProject,
} from "../store/projectsSlice";
import { logout } from "../store/authSlice";
import { useState } from "react";
import { deleteTasksByProject } from "../store/tasksSlice";

interface SidebarProps {
  activeProjectId: string | null;
  onSelectProject: (id: string | null) => void;
}

const Sidebar = ({ activeProjectId, onSelectProject }: SidebarProps) => {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((s) => s.projects.items);
  const [name, setName] = useState("");

  // handle add project
  function handleAddProject() {
    const trimmed = name.trim();
    if (!trimmed) return;
    dispatch(addProject(trimmed));
    setName("");
  }

  // handle rename project
  function handleRename(id: string, currentName: string) {
    const newName = prompt("Rename project", currentName);
    if (newName) dispatch(renameProject({ id, name: newName }));
  }

  // handle delete project
  function handleDelete(id: string) {
    if (confirm("Delete project and its tasks?")) {
      dispatch(deleteProject(id));
      dispatch(deleteTasksByProject(id));
      if (activeProjectId === id) onSelectProject(null);
    }
  }

  return (
    <aside className="flex h-full w-72 flex-col gap-3 border-r border-r-black/20 bg-white p-4">
      {/* header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Projects</h3>

        {/* logout button */}
        <button
          onClick={() => dispatch(logout())}
          className="rounded-full p-2 text-red-600 cursor-pointer transition-colors duration-200 hover:bg-red-50"
        >
          <LogOut
            size={18}
            className="transition-transform duration-200 ease-in-out hover:translate-x-1"
          />
        </button>
      </div>

      {/* enter project name */}
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New project name"
          className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20"
        />
        <button
          onClick={handleAddProject}
          className="flex items-center justify-center rounded-full bg-blue-600 w-10 h-10 px-3 text-white transition-transform duration-200  hover:bg-blue-700 cursor-pointer"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* project lists */}
      <nav className="mt-2 space-y-2">
        {projects.map((p) => (
          <div key={p.id} className="group">
            {/* Project button */}
            <button
              className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left transition cursor-pointer hover:bg-gray-100 ${
                activeProjectId === p.id ? "bg-gray-100" : ""
              }`}
              onClick={() => onSelectProject(p.id)}
            >
              <Folder size={16} /> {p.name}
            </button>

            {/* Edit and Delete buttons */}
            <div className="ml-6 hidden group-hover:flex items-center gap-4 text-xs text-gray-500 mt-1">
              <button
                className="rounded px-1 hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
                onClick={() => handleRename(p.id, p.name)}
              >
                <Pencil size={14} />
              </button>
              <button
                className="rounded px-1 text-red-600 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
                onClick={() => handleDelete(p.id)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
