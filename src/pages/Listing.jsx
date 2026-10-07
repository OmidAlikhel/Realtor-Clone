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
import { FaShare } from "react-icons/fa";
const Listing = () => {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

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

  if (loading) {
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
              className=" relative w-full overflow-hidden h-[300px]"
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

      <div> {listing.name}</div>
    </main>
  );
};

export default Listing;
