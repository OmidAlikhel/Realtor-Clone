import React, { useState } from "react";

const CreateListing = () => {
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
  } = formData;
  function onChange() {}
  return (
    <main>
      <h1 className="text-3xl text-center mt-6 font-bold ">Create a Listing</h1>

      <form className="max-w-md px-2 mx-auto">
        <p className="text-lg mt-6 mb-4 font-semibold ">Sell/Rent</p>
        <div className="flex  space-x-4">
          <button
            type="button"
            id="type"
            value="rent"
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg  focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${type === "rent" ? "bg-white text-black" : "bg-slate-600 text-white"}`}
          >
            Sell
          </button>
          <button
            type="button"
            id="type"
            value="sale"
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
            id="type"
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
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg  focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!furnished ? "bg-white text-black" : "bg-slate-600 text-white"}`}
          >
            Yes
          </button>
          <button
            type="button"
            id="furnished"
            value={false}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg  focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${furnished === "sale" ? "bg-white text-black" : "bg-slate-600 text-white"}`}
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
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg  focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!furnished ? "bg-white text-black" : "bg-slate-600 text-white"}`}
          >
            Yes
          </button>
          <button
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg  focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!offer === "sale" ? "bg-white text-black" : "bg-slate-600 text-white"}`}
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
