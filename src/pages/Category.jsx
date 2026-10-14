import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { toast } from "react-toastify";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "../components/Spinner";

const Category = () => {
  const params = useParams();
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchListing, setLastFetchListing] = useState(null);
  useEffect(() => {
    async function fetchListing() {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("type", "==", params.categoryName),
          orderBy("timeStamp", "desc"),
          limit(8),
        );
        const querySnap = await getDocs(q);
        // part belongs to more fetching
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchListing(lastVisible);
        // this part is over

        const listings = querySnap.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));

        setListing(listings);
        setLoading(false);
      } catch (error) {
        toast.error("There was a problem fetching listing ");
      }
    }
    fetchListing();
  }, [params.categoryName]);

  async function onFetchMoreListing() {
    try {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("type", "==", params.categoryName),
        orderBy("timeStamp", "desc"),
        startAfter(lastFetchListing),
        limit(4),
      );
      const querySnap = await getDocs(q);

      if (querySnap.docs.length === 0) {
        toast.info("There are no more listings to show");
        return;
      }
      // part related to fetch more
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchListing(lastVisible);
      //

      const listings = querySnap.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setListing((prevState) => [...prevState, ...listings]);
    } catch (error) {
      toast.error("No more listings available to show");
    }
  }

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="max-w-6xl mx-auto pt-4 space-y-6 ">
      <h1 className="mt-4 text-3xl text-center text-gray-900 font-bold ml-2">
        {params.categoryName === "rent" ? "Places for Rent" : "Places for Sale"}
      </h1>
      {listing && listing.length > 0 && (
        <main>
          <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {listing.map((listing) => (
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
      {listing && listing.length === 0 && (
        <p className="text-gray-800 text-center font-bold text-2xl uppercase">
          There are no listings
        </p>
      )}
    </div>
  );
};

export default Category;
