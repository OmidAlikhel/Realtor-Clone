import { FcGoogle } from "react-icons/fc";
const OAuth = () => {
  return (
    <button className="flex items-center justify-center bg-red-700 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-800 active:bg-red-900 rounded shadow-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out">
      <FcGoogle className="bg-white rounded-full mr-2" /> Continue With Google
    </button>
  );
};

export default OAuth;
