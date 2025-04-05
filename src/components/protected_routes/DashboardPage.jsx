/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import Contact from "../home/Contact";
import Navbar from "../Navbar";
import eventData from "../Events/allevents/event-ids";
import { CheckIcon } from '@heroicons/react/24/outline';
import {authController} from '../../services/http';
import LogoutIcon from "../../assets/icons/logout.svg";
import NotifsIcon from "../../assets/icons/notifications.svg";
import EditIcon from "../../assets/icons/pen.svg";
import { getUserById } from "../../services/http/users";
import { Box, Modal } from "@mui/material";
import { PhoneInput, TextInput } from "../login/ui/inputs";
import { SignUpButton } from "../login/ui/buttons";
import toast from "react-hot-toast";
import { usersController } from "../../services/http";
import { env } from "../../config/config";
import { Link, redirect } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 320,
  bgcolor: "var(--color-background)",
  border: "2px solid var(--color-greyBorder)",
  boxShadow: 24,
  p: 4,
};

const DashboardPage = ({ userDetails, logout }) => {
  const navigate = useNavigate();

  const handleVerifyClick = async () => {
    setOtpLoading(true);
    try {
      const response = await authController.resendOTP(user?.email);
      const result = response.data;
      if (result.success) {
        navigate("/verify", { state: { formData: { email: user?.email } } });
      } else {
          toast("Failed to Send OTP. Please try again.");
      }
    } catch (error) {
        console.error("Error sending OTP:", error);
    } finally {
      setOtpLoading(false);
    }
  };

  if (!userDetails || userDetails === "") redirect("/login");
  const [user, setUser] = useState(userDetails);
  const merchStatus = user.merchandise?.status ?? "Not ordered.";
  const merchColour = user.merchandise?.color;
  const merchSize = user.merchandise?.size;
  const merchPlaceholder = "/merchandise/merch-in-dashboard.svg";

  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [merchandise, setMerchandise] = useState([]);
  const allMerch = user.merchandise ? (user.merchandise2 && user.merchandise2.length > 0) ? [user.merchandise, ...user.merchandise2] : [user.merchandise] : [];

  useEffect(() => {

    if (user.merchandise) setMerchandise(prev => [...prev, user.merchandise]);

    if (user.merchandise2 && user.merchandise2.length > 0) {
      user.merchandise2.map((merch) => setMerchandise(prev => [...prev, merch]));
    }

    if (user.registeredEvents && user.registeredEvents.length > 0) {
      user.registeredEvents.map(eventId => {

        const newEvent = eventData.find((event) => event._id === eventId);

        setRegisteredEvents(prev => [...prev, newEvent])
      });
    }
    if (user.pendingEvents && user.pendingEvents.length > 0) {
      user.pendingEvents.map(eventId => {

        const newEvent = eventData.find((event) => event._id === eventId);

        setPendingEvents(prev => [...prev, newEvent])
      });
    }
    if (user.wishlist && user.wishlist.length > 0) {
      user.wishlist.map(eventId => {

        const newEvent = eventData.find((event) => {
          return event._id === eventId;
        });

        if (newEvent) setWishlist(prev => [...prev, newEvent])
      });
    }

  }, [])

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [formData, setFormData] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    institution: user?.userInstitution ?? "",
  });

  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    institution: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [loading, setLoading] = useState(false);
  const [Otploading, setOtpLoading] = useState(false);

  const isFormValid =
  Object.values(formData).some((field) => field.trim() !== "") &&
  Object.values(errors).every((error) => error === "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);

    try {
      const response = await usersController.editUser({
        name: formData.name,
        phone: formData.phone,
        institution: formData.institution,
      });

      setUser((prevUser) => ({
        ...prevUser, 
        name: response.data.user.name,
        phone: response.data.user.phone,
        userInstitution: response.data.user.institution, 
      }));
      toast.success("Your details were edited successfully!");
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      toast.error("Error while editing details. Try again.");
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <div className="font-sometypeMono">
      <Navbar />
      <main className="px-6 xms:px-16 md:px-[6vw]">
        <header className="flex gap-4 justify-around py-6 md:py-8">
          <button
            type="button"
            className="cursor-pointer p-1 rounded-xs transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus:outline-none"
            onClick={logout}
          >
            <img src={LogoutIcon} alt="logout of your account" />
          </button>
          <p className="text-2xl grid place-items-center">My Dashboard</p>
          <a
            type="button"
            href="/notifications"
            className="cursor-pointer p-1 rounded-xs transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus:outline-none"
          >
            <img src={NotifsIcon} alt="check notifications" />
          </a>
        </header>
        <p className="flex gap-4 py-6 md:py-8 text-2xl md:hidden">
          Hello, {user?.name}!
        </p>
        <div className="pb-6 md:pb-8 grid grid-cols-1 md:grid-cols-2 gap-6 xms:gap-x-16 md:gap-x-[6vw] md:gap-y-8">
          <div className="order-2 md:order-1">
            <p className="md:flex py-4 text-2xl hidden">Hello, {user?.name}!</p>
            <div className="rounded-md bg-gradient-to-r from-red-700 via-purple-800 to-blue-900 p-px">
              {allMerch.length === 0 &&
                <section className="flex flex-col items-center gap-6 p-6 rounded-md h-full w-full bg-[#141414]">
                  <p className="py-2 text-xl">My Merchandise</p>
                  <img
                    className="w-full max-w-3xs transition-all hover:-translate-y-0.5 active:translate-y-0"
                    src={merchPlaceholder}
                    alt="Merchandise placeholder"
                  />
                  <p className="flex text-lg">Status: Not ordered.</p>
                </section>}
              {allMerch.length > 0 &&
                <Carousel>
                  <CarouselContent>
                    {allMerch.map((merch, ind) => {
                      // console.log(JSON.stringify(merch),"test");
                      // const {status,color,size} = merch;
                      return <CarouselItem key={ind} className="flex flex-col items-center gap-6 p-6 rounded-md h-full  bg-[#141414]">
                        <p className="py-2 text-xl">My Merchandise</p>
                        <img
                          className="w-full max-w-3xs transition-all hover:-translate-y-0.5 active:translate-y-0"
                          src={merch.color.toLowerCase() === "black" ? '/merchandise/tshirt2.png' : '/merchandise/tshirt1.png'}
                          alt="Merchandise placeholder"
                        />
                        <p className="flex text-lg">Status: {merch.status}</p>
                        <p className="flex text-lg">{merch.color && `Colour: ${merch.color}`}</p>
                        <p className="flex text-lg">{merch.size && `Size: ${merch.size}`}</p>
                      </CarouselItem>
                    })}
                  </CarouselContent>
                  {merchandise.length > 1 && <>
                    <CarouselPrevious className="bg-transparent hover:bg-transparent hover:cursor-pointer ml-8 sm:ml-0 pl-2 border border-white" />
                    <CarouselNext className="bg-transparent hover:bg-transparent hover:cursor-pointer pl-2 mr-8 sm:mr-0 border border-white" />
                  </>}
                </Carousel>
              }
            </div>
          </div>
          <div className="rounded-md bg-gradient-to-r from-red-700 via-purple-800 to-blue-900 p-px order-1 md:order-2">
            <section className="flex flex-col items-center gap-6 p-6 rounded-md h-full w-full bg-[#141414] text-xl">
              <div className="flex justify-center items-center w-full">
                <p className="font-bold">My Profile</p>
                <button
                  type="button"
                  onClick={handleOpen}
                  className="cursor-pointer py-2 px-3 rounded-xs transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus:outline-none"
                >
                  <img src={EditIcon} alt="edit your profile picture" />
                </button>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <p className="font-bold text-xl">Edit Profile</p>
                    <form
                      id="signupForm"
                      className="space-y-4 mt-4"
                      onSubmit={handleSubmit}
                    >
                      <TextInput
                        labelContent={
                          <>
                            <span className="text-[#8420FF]">Enter your</span>{" "}
                            name
                          </>
                        }
                        name="name"
                        type="text"
                        placeholder="Name..."
                        value={formData.name}
                        onChange={handleChange}
                      />
                      <PhoneInput
                        labelContent={
                          <>
                            <span className="text-[#8420FF]">Enter your</span>{" "}
                            phone number
                          </>
                        }
                        name="phone"
                        value={formData.phone}
                        error={errors.phone}
                        setErrors={setErrors}
                        onChange={handleChange}
                      />
                      <TextInput
                        labelContent={
                          <>
                            <span className="text-[#8420FF]">Enter name of your</span>{" "}
                            institution
                          </>
                        }
                        name="institution"
                        type="text"
                        placeholder="Institution..."
                        value={formData.institution}
                        onChange={handleChange}
                      />
                      <div className="w-full flex justify-center mt-6">
                        <SignUpButton
                          onClick={handleSubmit}
                          textContent={loading ? "Confirming..." : "Confirm"}
                        />
                      </div>
                    </form>
                  </Box>
                </Modal>
              </div>
              <img
                className="w-full max-w-48 bg-zinc-300 rounded-full ring-1 ring-slate-400/70"
                src={user?.photo?.url ?? "/empty-user.svg"}
                alt="User profile picture"
              />
              <div className="flex flex-col items-start">
                <p>Name: {user?.name}</p>
                <p className="flex flex-wrap">
                  <span>Email:</span>
                  <span className="inline-flex flex-wrap items-center gap-2 break-all">
                    {user?.email}
                    {user?.emailVerified ? (
                      <CheckIcon className="h-5 w-5 text-green-500 hidden sm:inline" strokeWidth={3} />
                    ) : (
                      <button 
                        onClick={handleVerifyClick} 
                        disabled={Otploading}
                        className={`px-2 py-1 cursor-pointer rounded-sm text-sm border ${Otploading ? "opacity-50 cursor-not-allowed" : "text-red-500 border-red-500"}`}
                      >
                        {Otploading ? "Sending OTP..." : "Verify"}
                      </button>
                    )}
                  </span>
                </p>
                <p>Phone No.: {user?.phone ?? "Not available"}</p>
                <p>Institution.: {user?.userInstitution ?? "Not available"}</p>
              </div>
            </section>
          </div>
          <div className="col-span-full rounded-md bg-gradient-to-r from-red-700 via-purple-800 to-blue-900 p-px order-3">
            <section className="flex flex-col gap-6 md:gap-8 rounded-md h-full w-full bg-[#141414] py-6 md:py-8 px-[6vw]">
              <p className="text-2xl flex">Registered Events</p>
              {registeredEvents && registeredEvents.length > 0 ?
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {registeredEvents.map((event, ind) => <Link key={ind} to={`/events/${event.slug}`} className="border border-greyBorder p-3 shadow-lg rounded-md">{event.name}</Link>)}
                </ul> :
                <p className="flex text-lg">
                  No events have been registered to, as of now!
                </p>}
            </section>
          </div>
          <div className="col-span-full rounded-md bg-gradient-to-r from-red-700 via-purple-800 to-blue-900 p-px order-4">
            <section className="flex flex-col gap-6 md:gap-8 rounded-md h-full w-full bg-[#141414] py-6 md:py-8 px-[6vw]">
              <p className="text-2xl flex">Wishlisted Events</p>
              {wishlist && wishlist.length > 0 ?
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {wishlist.map((event, ind) => <Link key={ind} to={`/events/${event.slug}`} className="border border-greyBorder p-3 shadow-lg rounded-md">{event.name}</Link>)}
                </ul> :
                <p className="flex text-lg">
                  No events are in your wishlist, as of now!
                </p>}
            </section>
          </div>
          <div className="col-span-full rounded-md bg-gradient-to-r from-red-700 via-purple-800 to-blue-900 p-px order-5">
            <section className="flex flex-col gap-6 md:gap-8 rounded-md h-full w-full bg-[#141414] py-6 md:py-8 px-[6vw]">
              <p className="text-2xl flex">Pending Events</p>
              {pendingEvents && pendingEvents.length > 0 ?
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {pendingEvents.map((event, ind) => <Link key={ind} to={`/events/${event.slug}`} className="border border-greyBorder p-3 shadow-lg rounded-md">{event.name}</Link>)}
                </ul> :
                <p className="flex text-lg">
                  No events are pending, as of now!
                </p>}
            </section>
          </div>
        </div>
      </main>
      <Contact />
      <Footer />
    </div>
  );
};

export default DashboardPage;
