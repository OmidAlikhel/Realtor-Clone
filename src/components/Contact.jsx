import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { toast } from "react-toastify";

const Contact = ({ userRef, listing }) => {
  const [LandLord, setLandLord] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    async function fetchLandLordInfo() {
      const docRef = doc(db, "users", userRef);
      const docSnap = await getDoc(docRef);
      console.log("fetch data", docSnap.data());
      if (docSnap.exists()) {
        setLandLord(docSnap.data());
      } else {
        toast.error("Could not get Landlord data");
      }
    }
    fetchLandLordInfo();
  }, [userRef]);

  function onChange(e) {
    e.preventDefault();
    setMessage(e.target.value);
  }
  return (
    <>
      {LandLord !== null && (
        <div className="flex flex-col w-full mt-6  ">
          <p className="">
            Contact The LandLord, {LandLord.name} for:{" "}
            {listing.name.toLowerCase()}
          </p>
          <div>
            <textarea
              name="message"
              id="message"
              rows="3"
              value={message}
              onChange={onChange}
              className="w-full mt-3 mb-3 px-4 py-2 rounded text-xl text-gray-700 bg-white border border-gray-300 transition duration-150 ease-in-out focus:text-gray-700 focus:bg-slate-600"
            ></textarea>
          </div>
          <a
            href={`mailto: ${LandLord.email} ? Subject = ${listing.name} & Body=${message}`}
          >
            <button
              type="button"
              className="px-7 py-3 w-full bg-blue-600 text-white rounded-md  text-sm uppercase shadow-md hover:bg-blue-700 hover:shadow-lg  focus:bg-blue-800 focus:shadow-lg active:bg-blue-900 active active:shadow-xl transition duration-150 ease-in-out text-center"
            >
              Send Message
            </button>
          </a>
        </div>
      )}
    </>
  );
};

export default Contact;
