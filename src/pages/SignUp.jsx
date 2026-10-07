import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// sign up page function
const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  //  show password

  const [showPassword, setShowPassword] = useState(false);

  // handle submit button for form

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      updateProfile(auth.currentUser, {
        displayName: name,
      });
      const user = userCredential.user;

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();
      await setDoc(doc(db, "users", user.uid), formDataCopy);

      toast.success("Signed Up Successfully ");
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong with the registration");
    }
  }
  return (
    <section>
      <h1 className="text-3xl font-bold text-center mt-6 mb-6"> Sign Up </h1>
      <div className="justify-center flex flex-wrap items-center px-6 py-12 max-w-6xl mx-auto ">
        <div className="md:w-[67%]  lg:w-[50%] mb-12 md:mb-6">
          <img
            src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8a2V5fGVufDB8fDB8fHww"
            alt="key"
            className="w-full rounded-xl"
          />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20 ">
          <form
            onSubmit={handleSubmit}
            action=""
            className="   flex flex-col gap-3"
          >
            <div>
              <input
                id="name"
                value={name}
                onChange={onChange}
                type="text"
                placeholder="Full Name"
                className="mb-5  text-gray-400 bg-white  font-semibold px-4 py-2 rounded border w-full  border-gray-200 transition ease-in-out"
              />
              <input
                id="email"
                value={email}
                onChange={onChange}
                type="email"
                placeholder="Email Address"
                className="mb-4  text-gray-400 bg-white  font-semibold px-4 py-2 rounded border w-full  border-gray-200 transition ease-in-out"
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={onChange}
                placeholder="Password"
                id="password"
                className="  text-gray-400 bg-white  font-semibold px-4 py-2 rounded border w-full  border-gray-200 transition ease-in-out"
              />
              {showPassword ? (
                <FaEye
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              ) : (
                <FaEyeSlash
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              )}
            </div>
            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
              <p className="mb-5">
                {" "}
                Have an account?{" "}
                <Link
                  to="/sign-in"
                  className="text-red-600 hover:text-red-700 cursor-pointer transition duration-200 ease-in-out ml-1"
                >
                  {" "}
                  Sing In
                </Link>
              </p>
              <p>
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-800 cursor-pointer transition duration-200 ease-in-out ml-1"
                >
                  Forgot Password
                </Link>
              </p>
            </div>{" "}
            <button
              className="w-full bg-blue-600 text-white px-7 py-3 rounded-lg text-sm font-medium uppercase shadow-md  hover:bg-blue-700 transition duration-200 ease-in-out hover:shadow-lg active:bg-blue-800 "
              type="submit"
            >
              {" "}
              Sign-Up
            </button>
            <div className=" flex items-center my-2 before:border-t  before:flex-1  before:border-gray-300  after:border-t after:flex-1 after:border-gray-300">
              <p className="text-center font-semibold mx-3 ">Or</p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
