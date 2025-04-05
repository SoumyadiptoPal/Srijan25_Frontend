import React, { Suspense } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import PageReveal from "../PageReveal";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Carousel from "./Carousel";
import roomTypes from "./roomTypes.json";

// const roomTypes = [
//   {
//     id: 1,
//     name: "Dormitory",
//     charges: "200",
//     facilities: "Non AC",
//     link: "gform link here",
//     images: [
//       "@/accommodation/dorm-poster.webp",
//       "/accommodation/dorm-photo.webp",
//     ],
//   },
// ];

function Loading() {
  return (
    <div className="h-screen w-screen bg-background fixed z-[300]">
      <img
        src="/fetsu-presents-srijan25.svg"
        alt="Srijan 25 Logo"
        height="auto"
        width="auto"
        className="absolute top-[30%] left-[51%] -translate-[50%] h-36 w-auto"
      />
      <div className="absolute top-[75%] left-[50%] -translate-[50%] p-3 animate-spin bg-gradient-to-bl from-red via-purple to-lavender h-24 w-24 aspect-square rounded-full">
        <img
          src="/techno-management-fest.webp"
          alt="The Annual Techno-Management Fest of Jadavpur University"
          height="auto"
          width="auto"
          className="text-center absolute top-[52.5%] left-[50%] -translate-[50%] border border-white p-2 w-2/3 sm:w-1/3"
        />
        <div className="rounded-full h-full w-full bg-background"></div>
      </div>
    </div>
  );
}

function AccommodationPage() {
  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen bg-background font-sometypeMono flex flex-col items-center">
        <Helmet>
          <link rel="canonical" href="https://srijanju.in/accommodation" />
          <title>Accommodation | Srijan'25</title>
          <meta
            name="description"
            content="Accommodation for Srijan'25 - The Annual Techno-Management Fest of Jadavpur University"
          />
        </Helmet>
        <Navbar />
        <PageReveal />
        <div className="flex flex-col gap-y-4 w-full sm:w-3/5 text-[0.925rem] sm:text-base border-greyBorder border-t-transparent sm:border border-b-transparent pt-4 sm:pt-6 sm:text-justify">
          <h1 className="text-3xl text-center">Accommodation</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 place-items-center gap-y-3 px-4 sm:px-6">
            <div className="flex flex-col gap-y-2 text-center sm:text-left">
            <p>Address of Accommodation:</p>
            <p>Nava Prajanma State Youth Hostel , HC84+WHW, Eastern Metropolitan Bypass, KA Block, Sector 3, Bidhannagar, Kolkata, West Bengal 700010.
            Entry through Gate number 3.</p>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1864.115832365385!2d88.40533588232218!3d22.56690284497539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0275d38009a435%3A0xcc4edd682431e9d2!2sState%20Youth%20Hostel!5e1!3m2!1sen!2sin!4v1743450488625!5m2!1sen!2sin"
              width="300"
              height="200"
              style={{ border: "0" }}
              allowFullScreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <ul className="flex flex-col gap-y-3 list-disc pl-8 pr-3 sm:px-10 my-4">
            <li>
              Room Bookings will be on the basis of first come first serve, you
              need to pay at the time of applying for accomodation, if the rooms
              are booked, the amount will be refunded to you.
            </li>
            <li>
              The accomodation is being provided at a location which is at a
              distance of 10 minutes walk from the event venue, the organising
              team won&apos;t be responsible or liable for any travel
              arrangements, food or refreshments.
            </li>
            <li>
              The state youth hostel isn&apos;t a part of the university, Srijan
              will be booking the specified number of rooms as per the
              availability and responses.
            </li>
            <li>
              Srijan will not be liable for any issues or requirements that the
              participants may have.
            </li>
            <li>
              Common Facilities at the accomodation venue: Drinking water
              coolers, Washrooms.
            </li>
            <li>Dormitories for males and females are different.</li>
            <li>
              The dormitories are of 38 capacities with 19 bunker beds. The
              rooms are of capacity 2 each, whoever wants to opt for it is
              suggested to do so in numbers of 2 for ease.
            </li>
          </ul>
          <ul className="flex flex-col gap-y-3 list-disc pl-8 pr-3 sm:px-10 mb-4">
            <h2 className="text-xl">Contacts</h2>
            <li>Washim Ahmed: +918335986644</li>
            <li>Harsham Mishra: +917980623712</li>
            <li>Dipayan Bhattacharyya: +917044836127</li>
          </ul>
        </div>
        {roomTypes.map((roomType) => (
          <div key={roomType.id} className="flex flex-col items-center w-full">
            <Carousel roomType={roomType} />
            <div className="flex flex-col gap-y-3 w-full sm:w-3/5 text-[0.925rem] sm:text-base border-greyBorder border-t sm:border border-b-transparent p-4 sm:p-6 sm:text-justify">
              <p>Charges: &#8377;{roomType.charges}</p>
              <p>Facilities: {roomType.facilities}</p>
              {roomType.link && (
                <p>
                  Limited Seats,&nbsp;
                  <Link
                    className="underline underline-offset-3"
                    target="_blank"
                    to={roomType.link}
                  >
                    Register Now!
                  </Link>
                </p>
              )}
            </div>
          </div>
        ))}
        <Footer />
      </div>
    </Suspense>
  );
}

export default AccommodationPage;
