import { useEffect, useState } from "react";
import Slider from "../components/Slider";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import ListingItem from "../components/ListingItem";
import { Link } from "react-router-dom";

const Home = () => {
  // offers
  const [offerListing, setOfferListing] = useState(null);

  useEffect(() => {
    async function fetchOfferListing() {
      try {
        // get refernce
        const rentListingsRef = collection(db, "listings");
        const q = query(
          rentListingsRef,
          where("offer", "==", true),
          orderBy("timeStamp", "desc"),
          limit(4),
        );
        //  execute query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setOfferListing(listings);
        console.log("this is the offer listing ", listings);
      } catch (error) {
        console.log("there is a problem ", error);
      }
    }
    fetchOfferListing();
  }, []);

  //  sell listing
  const [saleListing, setSaleListing] = useState(null);

  useEffect(() => {
    async function fetchSaleListing() {
      try {
        const saleListingRef = collection(db, "listings");
        const q = query(
          saleListingRef,
          where("type", "==", "sale"),
          orderBy("timeStamp", "desc"),
          limit(4),
        );
        const querySnap = await getDocs(q);
        const saleListings = [];

        querySnap.forEach((doc) => {
          return saleListings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setSaleListing(saleListings);
        console.log("this is my sale listing", saleListings);
      } catch (error) {
        console.log("there was a problem ", error);
      }
    }
    fetchSaleListing();
  }, []);

  //  Rent listing
  const [rentListing, setRentListing] = useState(null);

  useEffect(() => {
    async function fetchRentListing() {
      try {
        const rentListingRef = collection(db, "listings");
        const q = query(
          rentListingRef,
          where("type", "==", "rent"),
          orderBy("timeStamp", "desc"),
          limit(4),
        );
        const querySnap = await getDocs(q);
        const rentListings = [];

        querySnap.forEach((doc) => {
          return rentListings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setRentListing(rentListings);
      } catch (error) {
        console.log("there was an error related to ", error);
      }
    }
    fetchRentListing();
  }, []);

  return (
    <div>
      <Slider />
      <div className="max-w-6xl mx-auto pt-4 space-y-6">
        {offerListing && offerListing.length > 0 && (
          <div className="m-2 mb-6 ">
            <h2 className="px-3 text-2xl font-semibold mt-6 ">Recent Offers</h2>
            <Link to="/offers">
              <p className="px-3  mt-2 text-blue-500 cursor-pointer text-sm hover:text-blue-700 transition duration-150 ease-in-out ">
                Show More Offers
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4">
              {offerListing.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="max-w-6xl mx-auto pt-2 space-y-6">
        {saleListing && saleListing.length > 0 && (
          <div className="m-2 mb-6 ">
            <h2 className="px-3 text-2xl font-semibold mt-6 ">
              Recent Sale listings
            </h2>
            <Link to="/category/sales">
              <p className="px-3  mt-2 text-blue-500 cursor-pointer text-sm hover:text-blue-700 transition duration-150 ease-in-out ">
                Show More Sales
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4">
              {saleListing.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="max-w-6xl mx-auto pt-2 space-y-6">
        {rentListing && rentListing.length > 0 && (
          <div className="m-2 mb-6 ">
            <h2 className="px-3 text-2xl font-semibold mt-6 ">
              Recent Rental listings
            </h2>
            <Link to="/category/rent">
              <p className="px-3  mt-2 text-blue-500 cursor-pointer text-sm hover:text-blue-700 transition duration-150 ease-in-out ">
                Show More Rentals
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4">
              {rentListing.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
