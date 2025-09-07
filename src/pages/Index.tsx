// import { TaskTracker } from "@/components/TaskTracker";

// const Index = () => {
//   return <TaskTracker />;
// };

// export default Index;
import { TaskTracker } from "@/components/TaskTracker";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <TaskTracker />
      {/* Move NOTES button up with margin */}
      <button
        onClick={() => navigate("/notes")}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-5 mb-10 hover:bg-blue-600"
      >
        NOTES
      </button>
      {/* Remove or comment out the footer text below */}
      {/* <div className="text-center text-gray-500 mt-4">
        Built with React, TypeScript & Tailwind CSS
        <br />
        Perfect for showcasing modern development skills ✨
      </div> */}
    </div>
  );
};

export default Index;
