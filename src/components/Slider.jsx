import React, { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useNavigate } from "react-router-dom";

const Slider = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFirstFiveListing() {
      const listingRef = collection(db, "listings");
      const q = query(listingRef, orderBy("timeStamp", "desc"), limit(5));
      const querySnap = await getDocs(q);

      let listings = [];

      querySnap.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      console.log("FETCHED LISTINGS:", listings);

      setListings(listings);
      setLoading(false);
    }

    fetchFirstFiveListing();
  }, []);
  if (loading) {
    return <Spinner />;
  }
  if (listings.length === 0) {
    return <></>;
  }
  return (
    listings && (
      <>
        <Swiper
          slidesPerView={1}
          navigation
          pagination={{ type: "progressbar" }}
          effect="fade"
          autoplay={{ delay: 3000 }}
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
        >
          {listings.map((listing) => (
            <SwiperSlide
              key={listing.id}
              onClick={() =>
                navigate(`/category/${listing.data.type}/${listing.id}`)
              }
            >
              <div
                className="relative w-full overflow-hidden h-[300px] md:h-[400px] lg:h-[500px]"
                style={{
                  backgroundImage: `url(${listing.data.imgUrls[0]})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
              <p className=" top-2 left-2 text-[#f1faee] absolute  font-medium max-w[90%] bg-[#457b9d] rounded-br-3xl shadow-lg opacity-90 p-2 ">
                {listing.data.description}
              </p>
              <p className=" bottom-1 left-1 text-[#f1faee] absolute  font-medium max-w[90%] bg-[#e63946] rounded-tr-3xl shadow-lg opacity-90 p-2 ">
                $ {listing.data.discountedPrice ?? listing.data.regularPrice}${" "}
                {listing.data.type === "rent" && "/ Month"}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>

        <div>slider</div>
      </>
    )
  );
};

export default Slider;
