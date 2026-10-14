import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";

const Offers = () => {
  const [offerListing, setOfferListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchListing, setLastFetchListing] = useState(null);
  useEffect(() => {
    async function fetchOfferListing() {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("offer", "==", true),
          orderBy("timeStamp", "desc"),
          limit(8),
        );
        const querySnap = await getDocs(q);
        // only this part belongs to the morefetchng button
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchListing(lastVisible);
        //  untill here,
        const listing = querySnap.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));

        setOfferListing(listing);
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch the offers listings");
      }
    }
    fetchOfferListing();
  }, []);

  // fetch more listing
  async function onFetchMoreListing() {
    try {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("offer", "==", true),
        orderBy("timeStamp", "desc"),
        startAfter(lastFetchListing),
        limit(4),
      );
      const querySnap = await getDocs(q);
      // this part belongs to the load more bttton
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchListing(lastVisible);
      // until here
      const listings = querySnap.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setOfferListing((prevState) => [...prevState, ...listings]);
    } catch (error) {
      toast.error("There are sees to be no more offers at the moment");
    }
  }

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="max-w-6xl mx-auto pt-4 space-y-6 ">
      <h1 className="mt-4 text-3xl text-center text-gray-900 font-bold ml-2">
        {" "}
        offers
      </h1>
      {offerListing && offerListing.length > 0 && (
        <main>
          <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {offerListing.map((listing) => (
              <ListingItem
                key={listing.id}
                listing={listing.data}
                id={listing.id}
              />
            ))}
          </ul>
        </main>
      )}
      {lastFetchListing && (
        <div className="flex justify-center items-center">
          <button
            onClick={() => onFetchMoreListing()}
            className="bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out"
          >
            {" "}
            Load More
          </button>
        </div>
      )}
      {!offerListing && (
        <p className="text-gray-800 text-center items-center justify-center font-bold text-2xl uppercase">
          {" "}
          There are No current Offers
        </p>
      )}
    </div>
  );
};

export default Offers;
