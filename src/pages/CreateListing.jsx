import React, { useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [geoLocationEnabled, setGeoLocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {},
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
    images,
  } = formData;
  function onChange(e) {
    // files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    // convert true and false string to boolean
    let boolean = null;

    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }

    // text/boolean/number
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (discountedPrice >= regularPrice) {
      setLoading(false);
      toast.error("The Discounted Price must be less than regular Price");
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("Maximum of 6 images are allowed. ");
      return;
    }
    let geoLocation = {};
    // let location;

    if (geoLocationEnabled) {
      // Fetch geolocation from Google Maps API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address,
        )}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`,
      );

      const data = await response.json();
      console.log("GEOCODE RESULT:", data);

      // If Google can't find the address
      if (data.status !== "OK") {
        setLoading(false);
        toast.error("Please enter the correct address.");
        return;
      }

      // Extract lat/lng
      geoLocation.lat = data.results[0]?.geometry.location.lat;
      geoLocation.lng = data.results[0]?.geometry.location.lng;
    } else {
      // Use manual lat/lng
      geoLocation.lat = latitude;
      geoLocation.lng = longitude;
    }

    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage(); // MUST be called
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`; // NO spaces
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            reject(error); // MUST reject
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL); // MUST resolve
            });
          },
        );
      });
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image)),
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      geoLocation,
      timeStamp: serverTimestamp(),
    };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listing created");
    navigate(`/catagory/${formDataCopy.type}/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <h1 className="text-3xl text-center mt-6 font-bold ">Create a Listing</h1>

      <form onSubmit={onSubmit} className="max-w-md px-2 mx-auto">
        <p className="text-lg mt-6 mb-4 font-semibold ">Sell/Rent</p>
        <div className="flex  space-x-4">
          <button
            type="button"
            id="type"
            value="sale"
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg  focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${type === "rent" ? "bg-white text-black" : "bg-slate-600 text-white"}`}
          >
            Sell
          </button>
          <button
            type="button"
            id="type"
            value="rent"
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg  focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${type === "sale" ? "bg-white text-black" : "bg-slate-600 text-white"}`}
          >
            rent
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold"> Name </p>
        <input
          type="text"
          id="name"
          placeholder="Name"
          value={name}
          onChange={onChange}
          maxLength="32"
          minLength="4"
          required
          className=" w-full px-4 py-2 text-xl text-gray-600 bg-white border border-gray-300 rounded my-2 transition duration-150 ease-in-out focus:text-gray-800 focus:bg-white focus:border-slate-600 mb-6"
        />
        <div className="flex space-x-6 mb-6">
          <div>
            <p className="text-lg font-semibold ">Beds</p>
            <input
              type="number"
              id="bedrooms"
              value={bedrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
            />
          </div>
          <div>
            <p className="text-lg font-semibold ">Baths</p>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
            />
          </div>
        </div>
        <p className="text-lg mt-6 mb-4 font-semibold ">Parking Spot</p>
        <div className="flex  space-x-4 my-4">
          <button
            type="button"
            id="parking"
            value={true}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg  focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!parking ? "bg-white text-black" : "bg-slate-600 text-white"}`}
          >
            Yes
          </button>
          <button
            type="button"
            id="parking"
            value={false}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg  focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${parking ? "bg-white text-black" : "bg-slate-600 text-white"}`}
          >
            No
          </button>
        </div>
        <p className="text-lg mt-6 mb-4 font-semibold ">Furnished</p>
        <div className="flex  space-x-4">
          <button
            type="button"
            id="furnished"
            value={true}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg  focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${furnished ? "bg-slate-600 text-white" : "bg-white text-black"}`}
          >
            Yes
          </button>
          <button
            type="button"
            id="furnished"
            value={false}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg  focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!furnished ? "bg-slate-600 text-white" : "bg-white text-black"}`}
          >
            no
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold"> Address </p>
        <textarea
          type="text"
          id="address"
          placeholder="Address"
          value={address}
          onChange={onChange}
          maxLength="32"
          minLength="4"
          required
          className=" w-full px-4 py-2 text-xl text-gray-600 bg-white border border-gray-300 rounded my-2 transition duration-150 ease-in-out focus:text-gray-800 focus:bg-white focus:border-slate-600 mb-6"
        />
        {!geoLocationEnabled && (
          <div className="flex space-x-6 justify-start mb-6">
            <div>
              <p className="text-lg font-semibold ">Latitude</p>
              <input
                className="w-full bg-white border border-slate-300 px-4 py-2 rounded text-xl text-gray-700 transition duration-150 ease-in-out shadow focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"
                type="number"
                id="latitude"
                value={latitude}
                onChange={onChange}
                required
                min="-90"
                max="90"
              />
            </div>
            <div>
              <p className="text-lg font-semibold ">Longitude</p>
              <input
                className="w-full bg-white border border-slate-300 px-4 py-2 rounded text-xl text-gray-700 transition duration-150 ease-in-out shadow focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"
                type="number"
                id="longitude"
                value={longitude}
                onChange={onChange}
                required
                min="-180"
                max="180"
              />
            </div>
          </div>
        )}
        <p className="text-lg  font-semibold"> Description </p>
        <textarea
          type="text"
          id="description"
          placeholder="Description"
          value={description}
          onChange={onChange}
          maxLength="32"
          minLength="4"
          required
          className=" w-full px-4 py-2 text-xl text-gray-600 bg-white border border-gray-300 rounded my-2 transition duration-150 ease-in-out focus:text-gray-800 focus:bg-white focus:border-slate-600 mb-6"
        />
        <p className="text-lg  mb-4 font-semibold ">Offer</p>
        <div className="flex  space-x-4">
          <button
            type="button"
            id="offer"
            value={true}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg  focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${offer ? "bg-slate-600 text-white" : "bg-white text-black"}`}
          >
            Yes
          </button>
          <button
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg  focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!offer ? "bg-slate-600 text-white" : "bg-white text-black"}`}
          >
            no
          </button>
        </div>
        <div className="">
          <p className="text-lg font-semibold mt-6 mb-2"> Regular Price </p>
          <div className="flex w-full  items-center space-x-6">
            <div>
              <input
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onChange}
                min="50"
                max="40000000000"
                required
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center "
              />
            </div>
            {type === "rent" && (
              <div>
                <p className="text-md w-full  whitespace-nowrap">/Month</p>
              </div>
            )}
          </div>
        </div>
        {offer && (
          <div className="">
            <p className="text-lg font-semibold mt-6 mb-2">
              {" "}
              Discounted Price{" "}
            </p>
            <div className="flex w-full  items-center space-x-6">
              <div>
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onChange}
                  min="50"
                  max="40000000000"
                  required={offer}
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center "
                />
              </div>
              {type === "rent" && (
                <div>
                  <p className="text-md w-full  whitespace-nowrap">/Month</p>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="my-6">
          <p className="text-lg font-semibold">Images</p>
          <p className="text-gray-600 ">The image will be the cover (max- 6)</p>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg, .png, .jpeg"
            multiple
            required
            className="w-full bg-white py-2 px-4 rounded border border-gray-300 text-gray-600 transition duration-150 ease-in-out cursor-pointer focus:bg-white focus:border-slate-600 "
          />
        </div>
        <button
          type="submit"
          className="mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium rounded text-sm uppercase shadow-m hover:bg-blue-800 hover:shadow-lg  focus:bg-blue-800 focus:shadow-lg active:bg-blue-900 active:shadow-lg transition duration-150 ease-in-out"
        >
          Create Listing
        </button>
      </form>
    </main>
  );
};

export default CreateListing;
