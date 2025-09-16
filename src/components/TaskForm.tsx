import { useEffect, useState } from "react";
import type { TaskItem, TaskStatus } from "../types";

interface TaskFormProps {
  initial?: Partial<TaskItem> & { projectId?: string };
  onSubmit: (values: {
    title: string;
    description: string;
    dueDate: string;
    status: TaskStatus;
    projectId: string;
  }) => void;
}

const inputStyling =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20";

const TaskForm = ({ initial, onSubmit }: TaskFormProps) => {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [dueDate, setDueDate] = useState(() =>
    initial?.dueDate
      ? initial.dueDate.slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const [status, setStatus] = useState<TaskStatus>(
    (initial?.status as TaskStatus) ?? "pending"
  );
  const [projectId, setProjectId] = useState(initial?.projectId ?? "");

  useEffect(() => {
    if (initial?.projectId) setProjectId(initial.projectId);
  }, [initial?.projectId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ title, description, dueDate, status, projectId });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* title */}
      <div>
        <label className="mb-1 block text-sm">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={inputStyling}
        />
      </div>

      {/* decription */}
      <div>
        <label className="mb-1 block text-sm">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={inputStyling}
        />
      </div>

      {/* due date */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm">Due date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={inputStyling}
          />
        </div>

        {/* status */}
        <div>
          <label className="mb-1 block text-sm">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className={inputStyling}
          >
            <option value="pending">pending</option>
            <option value="in-progress">in-progress</option>
            <option value="completed">completed</option>
          </select>
        </div>
      </div>

      {/* project id */}
      <div>
        <label className="mb-1 block text-sm">Project ID</label>
        <input
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          placeholder="Leave empty for unassigned"
          className={inputStyling}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 cursor-pointer"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
