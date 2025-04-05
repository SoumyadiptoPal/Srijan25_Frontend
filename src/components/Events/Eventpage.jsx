import React, {
  Suspense,
  lazy,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { ReactTyped } from "react-typed";
// import Snowfall from "react-snowfall";
import { Helmet } from "react-helmet-async";
import "./styles.css";
import eventData from "../Events/allevents/data.json"; 
import { getImageUrl } from "../../utils/image-util"; //
const Navbar = lazy(() => import("../Navbar"));
const Footer = lazy(() => import("../Footer"));
const PageReveal = lazy(() => import("../PageReveal"));
//Cursor  effect(Rainbow) here added
// const RainbowCursor =lazy(() => import ("./RainbowCursor"));
function Loading() {
  return (
    <div className="h-screen w-screen bg-background fixed z-[300] flex items-center justify-center">
      <img
        src="/fetsu-presents-srijan25.svg"
        alt="Srijan 25 Logo"
        className="absolute top-[30%] left-[51%] -translate-x-1/2 h-36 w-auto"
      />
      <div className="absolute top-[75%] left-[50%] -translate-x-1/2 p-3 animate-spin bg-gradient-to-bl from-red via-purple to-lavender h-24 w-24 aspect-square rounded-full">
        <img
          src="/techno-management-fest.webp"
          alt="The Annual Techno-Management Fest of Jadavpur University"
          className="absolute top-[52.5%] left-[50%] -translate-x-1/2 border border-white p-2 w-2/3 sm:w-1/3"
        />
        <div className="rounded-full h-full w-full bg-background"></div>
      </div>
    </div>
  );
}

/* FancyButton Component */
const FancyButton = React.memo(({ active, onClick, children }) => {
  const [ripples, setRipples] = useState([]);
 
  const createRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    const newRipple = { x, y, size, key: Date.now() };
    setRipples((prev) => [...prev, newRipple]);
    if (onClick) onClick(event);
  };

  const handleRippleAnimationEnd = (key) => {
    setRipples((prev) => prev.filter((r) => r.key !== key));
  };

  return (
    <div className="relative inline-block overflow-hidden rounded-md font-sometypeMono">
      <button
        onClick={createRipple}
        className={`relative px-6 py-2 rounded-md font-semibold transition-all duration-300 focus:outline-none border border-transparent ${
          active
            ? "bg-gradient-to-r from-black to-black text-green-300 shadow-xl transform scale-105"
            : "hover:shadow-lg"
        }`}
      >
        {children}
      </button>
      {ripples.map((ripple) => (
        <span
          key={ripple.key}
          onAnimationEnd={() => handleRippleAnimationEnd(ripple.key)}
          className="absolute bg-white opacity-30 rounded-full pointer-events-none animate-ripple"
          style={{
            width: ripple.size,
            height: ripple.size,
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}
    </div>
  );
});

/* GridLines Component */
const GridLines = React.memo(() => (
  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
    {/* Vertical decorative lines */}
    <div className="absolute top-0 left-[20%] w-[0.1px] h-full bg-greyBorder"></div>
    <div className="absolute top-0 left-[50%] w-[0.1px] h-full bg-greyBorder"></div>
    <div className="absolute top-0 right-[20%] mr-[1px] w-[0.1px] h-full bg-greyBorder"></div>
  </div>
));


const CategoryTabs = ({ activeCategory, onCategoryChange }) => {
  const categories = [
    "all",
    "coding",
    "circuits and robotics",
    "business",
    "brainstorming",
    "misc",
    "gaming",
  ];
  return (
    <div className="max-w-6xl mx-auto mb-7 p-4 rounded-xl bg-white/4 backdrop-blur-md">
      <nav className="flex flex-wrap justify-center gap-7">
        {categories.map((category) => (
          <FancyButton
            key={category}
            active={activeCategory === category}
            onClick={() => onCategoryChange(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </FancyButton>
        ))}
      </nav>
    </div>
  );
};

/* EventCardGrid Component with glassmorphism container and scroll */
const EventCardGrid = ({ events, truncateText, onCardClick }) => {
  return (
    <div className="max-w-[1600px] mx-auto p-6 rounded-2xl shadow-2xl bg-white/2 backdrop-blur-sm border">
      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-17">
        {events.map((event) => (
          <div
            key={event.eventID}
            onClick={() => onCardClick(event)}
            className="card group relative rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <img
              src={getImageUrl(event.imageUrl)}
              loading="lazy"
              alt={event.title}
              className="w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute left-0 right-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/60">
              <h3 className="text-xl font-bold mb-1">{event.title}</h3>
              <p className="text-sm">{truncateText(event.description, 310)}</p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};


const Events = () => {
  const truncateText = useCallback((text, maxLength = 310) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }, []);

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Transform and load event data from JSON once component mounts
  useEffect(() => {
    const transformed = eventData.map((item) => ({
      eventID: item.eventID,
      category: item.category,
      title: item.eventName,
      imageUrl: item.eventPoster,
      description: Array.isArray(item.eventDescription)
        ? item.eventDescription.join(" ")
        : item.eventDescription,
    }));
    setEvents(transformed);
    setLoading(false);
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory =
        activeCategory === "all" || event.category === activeCategory;
      let matchesSearch = true;
      if (searchQuery.trim() !== "") {
        try {
          const regex = new RegExp(searchQuery, "i");
          matchesSearch = regex.test(event.title);
        } catch (e) {
          matchesSearch = false;
        }
      }
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, events, searchQuery]);

  const handleCardClick = useCallback((eventData) => {
    window.location.href = `/events/${eventData.eventID}`;
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <div className="font-sometypeMono">
        <Navbar />
        {/* <RainbowCursor /> */}
        <PageReveal />
        <Helmet>
          <link rel="canonical" href="https://srijanju.in/events" />
          <title>Events | Srijan'25</title>
          <meta
            name="description"
            content="Event Details for Srijan'25 - The Annual Techno-Management Fest of Jadavpur University"
          />
        </Helmet>
        <div className="relative bg-gradient-to-r from-background to-background text-white min-h-screen py-2 px-2">
          <GridLines />
          {/* <Snowfall color="white" snowflakeCount={100} /> */}
          <header className="max-w-9xl mx-auto text-center mb-6">
            <h1 className="text-4xl md:text-xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-red-500 to-blue-600 drop-shadow-2xl">
              <ReactTyped
                strings={[" Explore Events"]}
                typeSpeed={120}
                backSpeed={60}
                loop
              />
            </h1>
          </header>
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
          <section className="max-w-md mx-auto mb-10 ">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 rounded-full text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                aria-label="Search Events"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </section>
          {loading ? (
            <div className="text-center text-xl">Loading events...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center text-red-500 text-xl">
              No events found. Please select the category correctly or check the spelling.
            </div>
          ) : (
            <EventCardGrid
              events={filteredEvents}
              truncateText={truncateText}
              onCardClick={handleCardClick}
            />
          )}
        </div>
        <Footer />
      </div>
    </Suspense>
  );
};

export default Events;
