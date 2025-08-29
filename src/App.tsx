import ProjectBoard from "./components/ProjectBoard";

function App() {
  return (
    <div className="container mx-auto my-10">
      <div className="mb-8">
        <h1 className="text-4xl text-indigo-700 font-semibold mb-2">
          KaosBan KanBan
        </h1>
        <p className="text-slate-600">
          Organize and showcase your chaos in style
        </p>
      </div>
      <ProjectBoard />
    </div>
  );
}

export default App;
