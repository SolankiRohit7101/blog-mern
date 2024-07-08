import { NotebookPen } from "lucide-react";

const Spinner = () => {
  return (
    <div className="w-full min-h-full flex justify-center items-center bg-white/20">
      <div className="h-screen justify-center items-center flex flex-col">
        <div className="border-gray-300 h-10 w-10 animate-spin rounded-full border-8 border-t-blue-600" />
        <div className=" flex justify-center items-center text-blue-600 cursor-pointer hover:opacity-75  text-2xl ">
          <span>
            <NotebookPen />
          </span>
          BlogLogo
        </div>
      </div>
    </div>
  );
};

export default Spinner;
