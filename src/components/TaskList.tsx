import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addTask,
  deleteTask,
  setStatus,
  updateTask,
} from "../store/tasksSlice";
import type { TaskItem, TaskStatus } from "../types";
import {
  CheckCircle2,
  Circle,
  Pencil,
  Trash2,
  Plus,
  Search,
} from "lucide-react";
import Modal from "./ui/Modal";
import TaskForm from "./TaskForm";

interface TaskListProps {
  projectId: string | null;
}

// Task status options
const statusOptions: TaskStatus[] = ["pending", "in-progress", "completed"];

const TaskList = ({ projectId }: TaskListProps) => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.items);

  // --- Filters ---
  const [query, setQuery] = useState("");
  const [status, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [due, setDue] = useState<"all" | "overdue" | "today" | "upcoming">(
    "all"
  );

  // --- Modal state ---
  const [openNew, setOpenNew] = useState(false);
  const [editing, setEditing] = useState<TaskItem | null>(null);

  // --- Filtered tasks ---
  const filtered = useMemo(() => {
    const now = new Date();
    return tasks.filter((t) => {
      if (projectId && t.projectId !== projectId) return false;
      if (status !== "all" && t.status !== status) return false;

      if (query) {
        const q = query.toLowerCase();
        if (
          !t.title.toLowerCase().includes(q) &&
          !t.description.toLowerCase().includes(q)
        )
          return false;
      }

      if (due !== "all") {
        const d = new Date(t.dueDate);
        const isToday = d.toDateString() === now.toDateString();
        if (due === "overdue" && !(d < now && !isToday)) return false;
        if (due === "today" && !isToday) return false;
        if (due === "upcoming" && !(d > now && !isToday)) return false;
      }

      return true;
    });
  }, [tasks, projectId, status, query, due]);

  // --- Add new task ---
  const handleAdd = (values?: {
    title: string;
    description: string;
    dueDate: string;
    status: TaskStatus;
    projectId: string;
  }) => {
    if (!values) {
      setOpenNew(true);
      return;
    }

    const payload: Omit<TaskItem, "id" | "createdAt" | "updatedAt"> = {
      title: values.title,
      description: values.description,
      dueDate: new Date(values.dueDate).toISOString(),
      status: values.status,
      projectId: values.projectId || projectId || "",
    };

    dispatch(addTask(payload));
    setOpenNew(false);
  };

  // --- Open edit modal ---
  const openEdit = (task: TaskItem) => setEditing(task);

  // --- Submit edited task ---
  const submitEdit = (values: {
    title: string;
    description: string;
    dueDate: string;
    status: TaskStatus;
    projectId: string;
  }) => {
    if (!editing) return;

    dispatch(
      updateTask({
        id: editing.id,
        updates: {
          title: values.title,
          description: values.description,
          dueDate: new Date(values.dueDate).toISOString(),
          status: values.status,
          projectId: values.projectId,
        },
      })
    );

    setEditing(null);
  };

  // --- Toggle task status ---
  const toggleStatus = (task: TaskItem) => {
    const nextStatus: TaskStatus =
      task.status === "completed" ? "pending" : "completed";
    dispatch(setStatus({ id: task.id, status: nextStatus }));
  };

  return (
    <>
      {/* --- Filter & Action Bar --- */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search
              className="pointer-events-none absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full rounded-md border border-black/20 bg-gray-50 px-10 py-2 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20"
            />
          </div>

          {/* Status filter */}
          <select
            value={status}
            onChange={(e) =>
              setStatusFilter(e.target.value as TaskStatus | "all")
            }
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20"
          >
            <option value="all">All statuses</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Due filter */}
          <select
            value={due}
            onChange={(e) =>
              setDue(e.target.value as "all" | "overdue" | "today" | "upcoming")
            }
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20"
          >
            <option value="all">Any due</option>
            <option value="overdue">Overdue</option>
            <option value="today">Today</option>
            <option value="upcoming">Upcoming</option>
          </select>

          {/* New task button */}
          <button
            onClick={() => handleAdd()}
            className="ml-auto flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:scale-[1.02] hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <Plus size={16} /> New Task
          </button>
        </div>

        {/* --- Task Table --- */}
        <div className="overflow-hidden rounded-lg border border-black/20 bg-white mt-10 ">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            {/* table body */}
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    className="px-4 py-8 text-center text-gray-400"
                    colSpan={4}
                  >
                    No tasks.
                  </td>
                </tr>
              )}

              {filtered.map((task) => (
                <tr
                  key={task.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* Status */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(task)}
                      title={
                        task.status === "completed"
                          ? "Mark pending"
                          : "Mark completed"
                      }
                      className="cursor-pointer text-gray-600 transition hover:scale-110"
                    >
                      {task.status === "completed" ? (
                        <CheckCircle2 className="text-green-500" size={18} />
                      ) : (
                        <Circle size={18} />
                      )}
                    </button>
                  </td>

                  {/* Title */}
                  <td className="px-4 py-3">
                    <div className="font-medium">{task.title}</div>
                  </td>

                  {/* description */}
                  <td className="px-4 py-3">
                    <div className="text-xs text-gray-500">
                      {task.description}
                    </div>
                  </td>

                  {/* Due date */}
                  <td className="px-4 py-3 text-gray-700">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 ">
                      <button
                        onClick={() => openEdit(task)}
                        className="cursor-pointer rounded-md px-2 py-1 text-blue-600 hover:bg-blue-50 transition"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => dispatch(deleteTask(task.id))}
                        className="cursor-pointer rounded-md px-2 py-1 text-red-600 hover:bg-red-50 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Modals --- */}
      <Modal open={openNew} title="New Task" onClose={() => setOpenNew(false)}>
        <TaskForm
          initial={{ projectId: projectId ?? undefined }}
          onSubmit={handleAdd}
        />
      </Modal>

      <Modal
        open={!!editing}
        title="Edit Task"
        onClose={() => setEditing(null)}
      >
        {editing && (
          <TaskForm
            initial={{
              ...editing,
              dueDate: editing.dueDate,
            }}
            onSubmit={submitEdit}
          />
        )}
      </Modal>
    </>
  );
};

export default TaskList;
