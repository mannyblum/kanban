import type { Task } from "../../../lib/columns";

type ProjectCardProps = {
  task: Task;
};

export default function ProjectCard({ task }: ProjectCardProps) {
  return (
    <div
      key={task.id}
      className="text-sm bg-[#F9FAFB] hover:bg-neutral-50 p-4 rounded-lg mb-4 shadow-slate-800 border border-slate-800/10"
    >
      <h3 className="font-medium">{task.title}</h3>
    </div>
  );
}
