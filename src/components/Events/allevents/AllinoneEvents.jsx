
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  FaTrophy,
  FaCalendarAlt,
  FaGamepad,
  FaPhoneAlt,
  FaEnvelope,
  FaHeart,
  FaFacebookF,
  FaWhatsapp,
} from "react-icons/fa";
import Confetti from "../Confetti"
import { MdShare } from "react-icons/md";
import { ReactTyped } from "react-typed";
import { useParams, useNavigate } from "react-router-dom";
import eventsData from "./data.json";
import "./Event.css";
import { useWindowSize } from "react-use";
import { Button } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../Navbar";
import PageReveal from "../../PageReveal";
import { getImageUrl } from "../../../utils/image-util";
import { env } from "../../../config/config";
import axios from "axios";
import { SiGoogledrive } from "react-icons/si";

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

const AllEvents = () => {
  const { width, height } = useWindowSize();
  const { eventID } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const rulesRef = useRef(null);

  const [overlayStyle, setOverlayStyle] = useState({ top: 0, height: 0 });
  const [eventData, setEventData] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const getWishlist = async () => {
    try {
      let response = await axios.get(`${env.API_SERVER}/users/wishlist`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log({ wishlist: response.data });
      // Ensure wishlist is always an array
      setWishlist(response.data.data || []);
      return response.data;
    } catch (error) {
      console.error("Error during fetching wishlist:", error);
      setWishlist([]); // fallback to an empty array
    }
  };

  const addToWishlist = async () => {
    try {
      let response = await axios.post(
        `${env.API_SERVER}/users/wishlist/${eventID}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log({ wishlist: response.data });
      await getWishlist();
      toast.success("Added to Wishlist successfully");
      return response.data;
    } catch (error) {
      console.error("Error during adding to wishlist:", error);
    }
  };

  const removeFromWishlist = async () => {
    try {
      let response = await axios.delete(
        `${env.API_SERVER}/users/wishlist/${eventID}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log({ wishlist: response.data });
      await getWishlist();
      toast.success("Removed from Wishlist successfully");
      return response.data;
    } catch (error) {
      console.error("Error during removing from wishlist:", error);
    }
  };

  // Update overlay position based on the rules section
  useEffect(() => {
    const updateOverlay = () => {
      if (rulesRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const rulesRect = rulesRef.current.getBoundingClientRect();
        const top = rulesRect.top - containerRect.top;
        const height = rulesRect.height;
        setOverlayStyle({ top, height });
      }
    };

    updateOverlay();
    window.addEventListener("scroll", updateOverlay);
    window.addEventListener("resize", updateOverlay);
    return () => {
      window.removeEventListener("scroll", updateOverlay);
      window.removeEventListener("resize", updateOverlay);
    };
  }, []);

  // Fetch event data based on URL parameters
  useEffect(() => {
    if (!eventID) {
      console.error("Missing eventID from URL parameters");
      return;
    }
    const eventItem = eventsData.find((item) => item.eventID === eventID);
    if (eventItem) {
      setEventData(eventItem);
      getWishlist();
    } else {
      console.error(`Event with eventID '${eventID}' not found`);
    }
  }, [eventID]);

  if (!eventData) {
    return <div className="text-center text-white">Loading...</div>;
  }

  
  // const eventDetails = {
  //   prelims: Array.isArray(eventData.eventDate.prelims)
  //     ? eventData.eventDate.prelims.join(" ")
  //     : eventData.eventDate.prelims,
  //   finals: eventData.eventDate.finals || "__-__-2025",
  //   teamSize:
  //     eventData.minMembers === eventData.maxMembers
  //       ? "individual event"
  //       : `${eventData.minMembers}-${eventData.maxMembers} members`,
  // };
  const eventDetails = {
  prelims: Array.isArray(eventData.eventDate.prelims)
    ? eventData.eventDate.prelims.join(" ")
    : eventData.eventDate.prelims,
  finals: eventData.eventDate.finals || "__-__-2025",
  teamSize:
    eventData.minMembers === eventData.maxMembers
      ? (eventData.minMembers === 1
          ? "individual event"
          : `${eventData.minMembers} members`)
      : `${eventData.minMembers}-${eventData.maxMembers} members`,
};


  
  // Parse prize pool from prize array
  const parsedPrizePool = { first: "", second: "", third: "" };
  if (Array.isArray(eventData.prize)) {
    eventData.prize.forEach((prizeStr) => {
      const parts = prizeStr.split(":");
      if (parts.length === 2) {
        const key = parts[0].trim().toLowerCase();
        const value = parts[1].trim();
        if (key.startsWith("1st")) parsedPrizePool.first = value;
        else if (key.startsWith("2nd")) parsedPrizePool.second = value;
        else if (key.startsWith("3rd")) parsedPrizePool.third = value;
      } else {
        if (!parsedPrizePool.first) parsedPrizePool.first = prizeStr.trim();
      }
    });
  }

  // Event description as a joined string
  const description = Array.isArray(eventData.eventDescription)
    ? eventData.eventDescription.join(" ")
    : eventData.eventDescription;

  // Merge event rules (flatten arrays)
  const mergedRules = eventData.eventRules
    ? Object.values(eventData.eventRules).flat()
    : [];

  // Parse event coordinators
  const eventOrganizers = eventData.eventCoordinators
    ? eventData.eventCoordinators.map((coordinator) => {
        const match = coordinator.match(/(.*)\[\s*([^\]]+)\s*\]/);
        if (match) {
          return { name: match[1].trim(), phone: match[2].trim(), email: "" };
        }
        return { name: coordinator, phone: "", email: "" };
      })
    : [];

  const organizersTitle = "EVENT ORGANIZERS";
  const staticLineClasses =
    "absolute top-0 h-full w-px bg-greyBorder z-0 transition duration-300";

  const notify = () => toast.success("Link copied to clipboard!");

  return (
    <>
      <Suspense fallback={<Loading />}>
        <div className="font-sometypeMono">
          <Navbar />
          {/* <Confetti/> */}
        </div>
        <PageReveal />
        <Helmet>
          <link rel="canonical" href="https://srijanju.in/events" />
          <title>Events | Srijan'25</title>
          <meta
            name="description"
            content="Event Details for Srijan'25 - The Annual Techno-Management Fest of Jadavpur University"
          />
        </Helmet>
        <div
          ref={containerRef}
          className="relative bg-background text-white p-4 md:p-6 min-h-screen font-sometypeMono overflow-x-hidden"
        >
          {/* Static Vertical Lines */}
          <div className={`${staticLineClasses} left-[5%] sm:left-[20%]`}></div>
          <div className={`${staticLineClasses} right-[5%] sm:right-[20%]`}></div>

          {/* Overlay Element */}
          <div
            style={{
              top: overlayStyle.top,
              height: overlayStyle.height,
              left: "50%",
              transform: "translateX(-50%)",
              width: "0.1px",
              backgroundColor: "white",
              filter: "blur(100px)",
              pointerEvents: "none",
              transition: "all 0.3s ease",
            }}
            className="absolute z-10"
          ></div>

          {/* Main Content Container */}
          <div className="relative z-10 max-w-screen-xl mx-auto">
            {/* Event Title */}
            <div className="text-center text-4xl md:text-6xl mb-4">
              <ReactTyped
                strings={[eventData.eventName]}
                typeSpeed={40}
                backSpeed={50}
                loop
                className="text-center"
              />
            </div>

            {/* Registration Deadline */}
            <h2 className="font-bold text-center mb-4 text-red-700 text-xl md:text-2xl">
              LAST DATE FOR REGISTRATION: TBD
            </h2>

            {/* Grid for Left & Right Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Registration Card */}
              <div className="border p-8 rounded-lg text-center bg-background">
                <img
                  src={getImageUrl(eventData.eventPoster)}
                  alt={eventData.eventName}
                  className="w-full rounded-lg"
                />
                              <Button
                  variant="outlined"
                  onClick={() => {
                    if (eventID === "HackForge") {
                      window.location.href =
                        "https://unstop.com/hackathons/hackforge-forging-the-future-srijan-2025-jadavpur-university-kolkata-1416437"; // Replace with your specific URL for HackForge events
                    } else {
                      navigate(`/events/${eventID}/registration`);
                    }
                  }}
                  sx={{
                    "mt": 2.5,
                    "py": { xs: 2, md: 1 },
                    "color": "white",
                    "borderColor": "white",
                    "fontWeight": "bold",
                    "fontSize": { xs: "1.2rem", md: "1.1rem" },
                    "bgcolor": "black",
                    "position": "relative",
                    "transition": "all 0.3s ease-in-out",
                    "boxShadow": "inset 0 0 0px rgba(255, 255, 255, 0)",
                    "mx": "auto",
                    "display": "block",
                    "&:hover": {
                      boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
                      bgcolor: "black",
                      transform: "scale(1.02)",
                    },
                }}
                >
                  REGISTER
                </Button>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                  <button
                    className="flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-lg px-6 py-3 rounded-full shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300"
                    onClick={() => setShowShareOptions(true)}
                  >
                    <MdShare className="mr-2" size={28} />
                    Share
                  </button>
                  {(wishlist || [])
                    .filter((item) => item.slug === eventID)
                    .length > 0 ? (
                    <button
                      className="flex items-center justify-center bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold text-lg px-6 py-3 rounded-full shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300"
                      onClick={removeFromWishlist}
                    >
                      <FaHeart className="mr-2" size={24} />
                      Remove from Wishlist
                    </button>
                  ) : (
                    <button
                      className="flex items-center justify-center bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold text-lg px-6 py-3 rounded-full shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300"
                      onClick={addToWishlist}
                    >
                      <FaHeart className="mr-2" size={24} />
                      Add to Wishlist
                    </button>
                  )}
                </div>
              </div>

              {/* Right: Event Details, Prize Pool & Description */}
              <div className="space-y-6">
                <div className="border p-8 rounded-lg bg-background">
                  <h3 className="text-lg md:text-2xl font-bold flex items-center gap-2 text-red-500">
                    <FaCalendarAlt /> EVENT DETAILS
                  </h3>
                  <p>
                    <span className="text-yellow-400">
                      Event Date (Prelims):{" "}
                    </span>
                    {eventDetails.prelims}
                  </p>
                  <p>
                    <span className="text-yellow-400">
                      Event Date (Finals):{" "}
                    </span>
                    {eventDetails.finals}
                  </p>
                  <p>
                    <span className="text-yellow-400">Team Size: </span>
                    {eventDetails.teamSize}
                  </p>
                </div>
                <div className="border p-8 rounded-lg bg-background">
                  <h3 className="text-lg md:text-2xl font-bold flex items-center gap-2 text-red-500">
                    <FaTrophy /> PRIZE POOL
                  </h3>
                  <p>
                    1ST PRIZE:{" "}
                    <span className="animate-greenPulse font-bold text-2xl">
                      {parsedPrizePool.first}
                    </span>
                  </p>
                  <p>
                    2ND PRIZE:{" "}
                    <span className="animate-greenPulse font-bold text-2xl">
                      {parsedPrizePool.second}
                    </span>
                  </p>
                  <p>
                    3RD PRIZE:{" "}
                    <span className="animate-greenPulse font-bold text-2xl">
                      {parsedPrizePool.third}
                    </span>
                  </p>
                </div>
                <div className="border p-8 rounded-lg bg-background">
                  <h3 className="text-lg md:text-xl font-bold text-blue-400 flex items-center gap-2">
                    <FaGamepad /> EVENT DESCRIPTION
                  </h3>
                  <p>{description}</p>
                </div>
              </div>
            </div>

            {/* Event Format */}
            {eventData.eventFormat && (
              <div className="border p-8 mt-6 md:mt-8 rounded-lg bg-background">
                <h3 className="text-lg md:text-2xl font-bold text-center text-blue-400">
                  EVENT FORMAT
                </h3>
                <p>{eventData.eventFormat}</p>
              </div>
            )}

            {/* Submission Criteria */}
            {eventData.submissionCriteria && (
              <div className="border p-8 mt-6 md:mt-8 rounded-lg bg-background">
                <h3 className="text-lg md:text-2xl font-bold text-center text-blue-400">
                  SUBMISSION CRITERIA
                </h3>
                {eventData.submissionCriteria.submissionInstructions && (
                  <div className="mt-4">
                    <h4 className="text-lg md:text-xl font-bold">
                      Submission Instructions
                    </h4>
                    <ul className="list-disc pl-6 space-y-2">
                      {eventData.submissionCriteria.submissionInstructions.map(
                        (instruction, index) => (
                          <li key={index}>{instruction}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
                {eventData.submissionCriteria.evaluationCriteria && (
                  <div className="mt-4">
                    <h4 className="text-lg md:text-xl font-bold">
                      Evaluation Criteria
                    </h4>
                    <ul className="list-disc pl-6 space-y-2">
                      {eventData.submissionCriteria.evaluationCriteria.map(
                        (criteria, index) => (
                          <li key={index}>{criteria}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Google Drive Link */}
            {eventData.driveLink && (
              <div className="border p-8 mt-6 md:mt-8 rounded-lg text-center shadow-2xl bg-background hover:scale-105 transition duration-500 ease-in-out">
                <h3 className="text-lg md:text-xl font-bold text-green-700 flex items-center justify-center gap-2 animate-pulse">
                  <SiGoogledrive className="text-green-600" /> Event Brochure
                </h3>
                <p className="mt-4">
                  <a
                    href={eventData.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-8 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
                  >
                    Click here to access the drive link
                  </a>
                </p>
              </div>
            )}

            {/* Event Rules */}
            <div
              ref={rulesRef}
              className="border p-8 mt-6 md:mt-8 rounded-lg transition duration-300 bg-background"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-center animate-rainbow">
                EVENT RULES
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                {mergedRules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>

            {/* Event Organizers */}
            <div className="border p-8 mt-6 md:mt-8 rounded-lg bg-background">
              <h3 className="text-lg md:text-2xl font-bold text-center text-blue-400">
                {organizersTitle}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {eventOrganizers.map((organizer, index) => (
                  <div
                    key={index}
                    className="border p-4 rounded-lg hover:bg-gray-800 transition"
                  >
                    <h4 className="text-lg md:text-xl font-bold">
                      {organizer.name}
                    </h4>
                    <p className="flex items-center gap-2">
                      <FaPhoneAlt /> {organizer.phone}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Share Options Modal */}
            {showShareOptions && (
              <div
                className="fixed inset-0 flex items-center justify-center z-50"
                style={{
                  background: "rgba(0, 0, 0, 0.8)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="bg-white text-black rounded p-4 w-80">
                  <h3 className="text-xl font-bold mb-4">Share this event</h3>
                  <div className="flex flex-col gap-4">
                    <a
                      href={`mailto:?subject=${encodeURIComponent(
                        eventData.eventName
                      )}&body=${encodeURIComponent(window.location.href)}`}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <FaEnvelope size={20} /> Email
                    </a>
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        eventData.eventName + " " + window.location.href
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      <FaWhatsapp size={20} /> WhatsApp
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        window.location.href
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                    >
                      <FaFacebookF size={20} /> Facebook
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        notify();
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      <MdShare size={20} /> Copy Link
                    </button>
                  </div>
                  <button
                    onClick={() => setShowShareOptions(false)}
                    className="mt-4 text-red-500 hover:underline"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default AllEvents;
