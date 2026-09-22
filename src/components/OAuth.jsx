import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const OAuth = () => {
  const navigate = useNavigate();

  // async function onGoogleClick() {
  //   try {
  //     const auth = getAuth();
  //     const provider = new GoogleAuthProvider();
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user;
  //     console.log(user);
  //     navigate("/");
  //     // check for the user if he/she is already in the database.
  //     const docRef = doc(db, "users", user.uid);
  //     const docSnap = await getDoc(docRef);
  //     if (!docSnap.exists()) {
  //       await setDoc(docRef, {
  //         name: user.displayName,
  //         email: user.email,
  //         Timestamp: serverTimestamp(),
  //       });
  //     }
  //   } catch (error) {
  //     toast.error("could not authorize with google");
  //   }
  // }

  async function onGoogleClick() {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);
      navigate("/");

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          Timestamp: serverTimestamp(),
        });
      }
    } catch (error) {
      toast.error("could not login something went wrong. ");
    }
  }
  return (
    <button
      type="button"
      onClick={onGoogleClick}
      className="flex items-center justify-center bg-red-700 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-800 active:bg-red-900 rounded shadow-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out"
    >
      <FcGoogle className="bg-white rounded-full mr-2" /> Continue With Google
    </button>
  );
};

export default OAuth;
