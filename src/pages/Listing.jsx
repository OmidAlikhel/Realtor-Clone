import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import {
  FaShare,
  FaMapMarkerAlt,
  FaParking,
  FaBed,
  FaBath,
  FaChair,
} from "react-icons/fa";
import { getAuth } from "firebase/auth";
import Contact from "../components/Contact";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// below imports are related to the map location icon showing functionality it, was just copied and pasted
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Listing = () => {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const auth = getAuth();
  const [contactLandLord, setContactLandLord] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      // console.log("fetched listing", docSnap.data());
      if (docSnap.exists) {
        setListing(docSnap.data());

        setLoading(false);
      }
    }

    fetchListing();
  }, [params.listingId]);
  // below line shows if loading is not true show swiper

  // if (loading) {
  //   return <Spinner />;
  // }

  if (loading) {
    return <Spinner />;
  }

  if (!listing || !listing.geoLocation) {
    return <Spinner />;
  }
  return (
    <main>
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        autoplay={{ delay: 3000 }}
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className=" relative w-full overflow-hidden h-[300px] md:h-[400px] lg:h0[500px]"
              style={{
                backgroundImage: `url(${listing.imgUrls[index]})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
        className="fixed top-[10%] right-[3%] z-10 bg-white cursor-pointer text-gray-600 border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center"
      >
        <FaShare className="text-lg text-slate-500 " />
      </div>

      {shareLinkCopied && (
        <p className="fixed top-[18%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10  py-2 px-1  ">
          Link Copied
        </p>
      )}

      <div className="m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg  shadow-lg bg-white lg:space-x-5 ">
        {/*  */}
        <div className="w-full md:w-1/2">
          <p className="text-2xl font-bold  mb-3 text-blue-900">
            {listing.name} - $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" ? " / month" : ""}
          </p>
          <p className="flex items-center mt-6 mb-3 font-semibold">
            <FaMapMarkerAlt className="text-green-900 mr-1  text-lg " />{" "}
            {listing.address}
          </p>
          <div className="flex  justify-start items-center space-x-4  w-[75%]">
            <p className=" bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md ">
              For {listing.type === "rent" ? "Rent" : "Sale"}{" "}
            </p>
            <p className="w-full max-w-[200px] bg-green-800 rounded-md p-1 text-white text-center font-semibold shadow-md">
              {" "}
              {listing.offer && (
                <span>
                  {" "}
                  $ {+listing.regularPrice - +listing.discountedPrice}{" "}
                  Discount{" "}
                </span>
              )}{" "}
            </p>
          </div>
          <p className="mt-3 mb-3 ">
            {" "}
            <span className="font-semibold "> Description: </span>{" "}
            {listing.description}
          </p>

          <ul className="flex  space-x-2 items-center lg:space-x-10 text-sm font-semibold ">
            <li className="flex items-center whitespace-nowrap">
              <FaBed className="text-lg mr-1.5 " />{" "}
              {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaBath className="text-lg mr-1" />
              {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaParking className="text-lg mr-1" />
              {listing.parking ? "Parking" : "No Parking"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaChair className="text-lg mr-1" />
              {listing.furnished ? "Furnished" : "Not Furnished"}
            </li>
          </ul>
          {listing.userRef !== auth.currentUser?.uid && !contactLandLord && (
            <div className="mt-6 ">
              <button
                className="px-7 py-3 bg-blue-600  rounded text-white font-medium text-sm uppercase w-full shadow-md hover:bg-blue-700 hover:shadow-lg   focus:bg-blue-700 focus:shadow:lg  text-center transition duration-150 ease-in-out "
                onClick={() => {
                  setContactLandLord(true);
                }}
              >
                Contact LandLord
              </button>
            </div>
          )}
          {contactLandLord && (
            <Contact userRef={listing.userRef} listing={listing} />
          )}
        </div>
        <div className="z-10 sm:ml-2 h-[300px] lg:h-[400px] overflow-x-hidden rounded mt-6 md:w-1/2">
          <MapContainer
            center={[listing.geoLocation.lat, listing.geoLocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[listing.geoLocation.lat, listing.geoLocation.lng]}
            >
              <Popup>{listing.address}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </main>
  );
};

export default Listing;
