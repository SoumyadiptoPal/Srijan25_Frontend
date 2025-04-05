/* eslint-disable react/prop-types */
import { useState } from "react";
import eventData from "../Events/allevents/data.json"; // Adjust path if necessary
import {
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import toast from "react-hot-toast";
import { redirect, useNavigate, useParams } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
//import Confetti from "react-confetti";
// import { useWindowSize } from "react-use";
import { env } from "../../config/config";
import axios from "axios";
import { useEffect } from "react";
import data from "./allevents/data.json";
import { getImageUrl } from "../../utils/image-util";
import GridLines from "../GridLines";

// TeamMembers Component for dynamically adding/removing team member email fields
const TeamMembers = ({ membersEmails, setMembersEmails, maxMembers }) => {
  // Email validation using a basic regex
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Check if the current email is a duplicate (case insensitive)
  const isDuplicate = (email) => {
    return (
      membersEmails.filter(
        (e) => e.trim().toLowerCase() === email.trim().toLowerCase(),
      ).length > 1
    );
  };

  const handleMemberChange = (index, event) => {
    const newMembers = [...membersEmails];
    newMembers[index] = event.target.value;
    setMembersEmails(newMembers);
  };

  const handleAddMember = () => {
    setMembersEmails([...membersEmails, ""]);
  };

  const handleRemoveMember = (index) => {
    const newMembers = [...membersEmails];
    newMembers.splice(index, 1);
    setMembersEmails(newMembers);
  };

  return (
    <div>
      <h3>
        Team Members Emails:
      </h3>
      {membersEmails.map((email, index) => {
        const valid = email && isValidEmail(email);
        const duplicate = email && isDuplicate(email, index);
        const showSuccess = email && valid && !duplicate;
        return (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", mb: 1 }}
          >
            <TextField
              fullWidth
              size="medium"
              label={`Team Member ${index + 2} Email`}
              variant="outlined"
              margin="dense"
              value={email}
              onChange={(e) => handleMemberChange(index, e)}
              error={!!email && (!valid || duplicate)}
              helperText={
                email && !valid
                  ? "Invalid email format."
                  : email && duplicate
                    ? "Duplicate email."
                    : ""
              }
              InputLabelProps={{
                style: {
                  "fontFamily": "var(--font-sometypeMono)",
                  color: "#fff", fontSize: "1rem"
                },
              }}
              InputProps={{
                startAdornment: email ? (
                  showSuccess ? (
                    <InputAdornment position="start">
                      <CheckCircleIcon sx={{ color: "green", mr: 1 }} />
                    </InputAdornment>
                  ) : (
                    <InputAdornment position="start">
                      <CancelIcon sx={{ color: "red", mr: 1 }} />
                    </InputAdornment>
                  )
                ) : null,
              }}
              sx={{
                "mb": 1,
                "transition": "all 0.3s ease",
                "& .MuiOutlinedInput-root": {
                  "backgroundColor": "#141414",
                  "borderRadius": "5px",
                  "fontFamily": "var(--font-sometypeMono)",
                  "transition": "all 0.3s ease",
                  "boxShadow": "0 0 10px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(25, 255, 55, 0.05)",
                  "& fieldset": {
                    borderColor: "#94949440",
                    borderWidth: "2px",
                    transition: "all 0.3s ease"
                  },
                  "&:hover fieldset": {
                    borderColor: "#94949470",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#949494",
                    boxShadow: "0 0 8px rgba(25, 255, 55, 0.3)",
                  },
                },
                "& .MuiInputBase-input": {
                  fontSize: "1.1rem",
                  color: "white",
                  padding: "14px 16px",
                  "&::placeholder": {
                    color: "#949494",
                  },
                },
                "&:hover": {
                  transform: "translateY(-2px)",
                },

              }}
            />
            <IconButton
              onClick={() => handleRemoveMember(index)}
              sx={{ color: "red", ml: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      })}
      {maxMembers - 1 > membersEmails.length && (
        <button
          onClick={handleAddMember}
          className="text-white border border-greyBorder py-1 px-3 rounded-sm my-3"
        >
          Add Member
        </button>
      )}
    </div>
  );
};

const GroupInfo = ({ eventID, refresh, setRefresh }) => {
  const [groupInfo, setGroupInfo] = useState({});
  const getGroupInfoForEvent = async () => {
    try {
      const response = await axios.get(
        `${env.API_SERVER}/users/group-info-for-event/${eventID}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      const data = await response.data;
      return data;
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };
  useEffect(() => {
    const fetchGroupInfo = async () => {
      let groupInfo = await getGroupInfoForEvent();
      setGroupInfo(groupInfo.data);
      setRefresh(false);
    };
    fetchGroupInfo();
  }, [refresh]);

  const navigate = useNavigate();
  return (
    <div className="w-full h-full p-3 md:p-5 text-gray-100">
      {/* Back button */}
      <div className="mb-4 md:mb-6 flex justify-between items-center">
        <h1 className="text-lg md:text-xl font-medium tracking-wide">
          Team Information
        </h1>

        <button
          onClick={() => navigate(`/events/${eventID}`)}
          className="ml-3 flex items-center text-sm text-gray-300 hover:text-gray-100 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Event
        </button>
      </div>

      {groupInfo ? (
        <div className="space-y-3 md:space-y-2 rounded-sm px-3 md:px-5 border border-greyBorder shadow-md">
          {/* Group Name */}
          <div className="flex gap-x-4">
            <div className="bg-gray-750 rounded-lg p-3 md:p-4">
              <div className="flex items-center">
                <div className="mr-2 md:mr-3 text-blue-400 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="min-w-0 w-full">
                  <p className="text-xs text-gray-400 font-medium">TEAM NAME</p>
                  <p className="text-base font-medium text-gray-100 break-words">{groupInfo.name}</p>
                </div>
              </div>
            </div>
            {/* Group Status */}
            <div className="bg-gray-750 rounded-lg p-3 md:p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center">
                  <div className="mr-2 md:mr-3 text-blue-400 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">TEAM STATUS</p>
                  </div>
                </div>
                <div className="bg-blue-900/40 px-3 py-1 rounded-sm text-xs font-medium uppercase text-center">
                  {groupInfo.status}
                </div>
              </div>
            </div>
          </div>

          {/* Creator Info */}
          <div className="bg-gray-750 rounded-lg p-3 md:p-4">
            <div className="flex items-center">
              <div className="mr-2 md:mr-3 text-blue-400 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="min-w-0 w-full">
                <p className="text-xs text-gray-400 font-medium">TEAM LEADER</p>
                <p className="font-medium text-gray-100 break-words">{groupInfo?.creator?.name}</p>
                <p className="text-xs text-gray-400 break-words">{groupInfo?.creator?.email}</p>
              </div>
            </div>
          </div>

          {/* Members List */}
          <div className="bg-gray-750 rounded-lg p-3 md:p-4">
            <div className="flex items-center mb-2 md:mb-3">
              <div className="mr-2 md:mr-3 text-blue-400 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-xs text-gray-400 font-medium">TEAM MEMBERS</p>
            </div>

            <ul className="space-y-2 mt-2">
              {groupInfo?.members?.map(({ user, status }, index) => (
                <li
                  key={index}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 rounded-md ${status === 'accepted'
                    ? 'bg-green-900/20 border border-green-800'
                    : status === 'pending'
                      ? 'bg-yellow-900/20 border border-yellow-800'
                      : 'bg-red-900/20 border border-red-800'
                    }`}
                >
                  <div className="flex items-center overflow-hidden mb-1 sm:mb-0">
                    <div className={`h-2 w-2 rounded-full mr-2 md:mr-3 flex-shrink-0 ${status === 'accepted' ? 'bg-green-500' :
                      status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                      } ${status === 'pending' ? 'animate-pulse' : ''}`}></div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-100 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className={`text-xs font-medium px-2 py-1 rounded self-start sm:self-center flex-shrink-0 sm:ml-2 ${status === 'accepted' ? 'text-green-400 bg-green-900/40' :
                    status === 'pending' ? 'text-yellow-400 bg-yellow-900/40' : 'text-red-400 bg-red-900/40'
                    }`}>
                    {status.toUpperCase()}
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-5 md:p-8 bg-gray-800 rounded-lg border border-gray-700 shadow-md">
          <div className="text-blue-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 md:h-12 md:w-12 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-base md:text-lg font-medium text-gray-300 text-center">No group information available</p>
          <p className="text-sm text-gray-400 mt-2 text-center">You haven&apos;t joined a group yet or the data is still loading.</p>
        </div>
      )}
    </div>
  );
};

const BackButton = ({ eventSlug }) => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(`/events/${eventSlug}`)
  }
  return (
    <button
      onClick={handleBack}
      className="text-lg border border-greyBorder px-2 py-3 rounded-sm self-end">
      Back
    </button >
  )

}
const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  // const { width, height } = useWindowSize();
  const userId = localStorage.getItem("sid");
  const [isVerified, setIsVerified] = useState(false);

  const navigate = useNavigate();
  if (!userId) {
    navigate("/login");
    // return;
  }
  const [teamName, setTeamName] = useState("");
  const [email, setEmail] = useState("");
  const [membersEmails, setMembersEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSoloEvent, setIsSoloEvent] = useState(false);
  const [maxMembersAllowed, setMaxMembersAllowed] = useState(1);
  const [participationStatus, setParticipationStatus] =
    useState("not-participating");
  const [canUnregisterStatus, setCanUnregisterStatus] = useState(null);
  const [invitationInfo, setInvitationInfo] = useState(null);
  const [refreshGroupInfo, setRefreshGroupInfo] = useState(false);

  // Store the complete response from the backend.
  const [registrationResponse, setRegistrationResponse] = useState(null);

  // Retrieve the event slug from the URL parameters
  const { eventID } = useParams();
  const eventDetails = eventData.find(e => e.eventID === eventID);
  const getUserById = async (userId) => {
    try {
      const response = await axios.get(`${env.API_SERVER}/users/${userId}`, {
        withCredentials: true,
      });
      const data = await response.data;
      //console.log(data);
      return data;
    } catch (error) {
      console.error("Error during getting user info:", error);
    }
  };

  const getParticipationStatus = async () => {
    try {
      const response = await axios.get(
        `${env.API_SERVER}/users/get-participation-status/${eventID}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      const data = await response.data;
      //console.log(data);
      return data;
    } catch (error) {
      console.error("Error during registration:", error);
      if (error?.response?.data?.error.includes("Event not found")) {
        toast("Event not found");
        navigate("/events");
      }
    }
  };

  const canUnregister = async () => {
    try {
      let response = await axios.get(
        `${env.API_SERVER}/users/can-unregister/${eventID}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      //console.log({ canUnregister: response.data });
      return response.data?.canUnregister;
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const isInvited = async () => {
    try {
      let response = await axios.get(`${env.API_SERVER}/users/invitations`, {
        withCredentials: true,
      });
      let invitations = response.data;
      //console.log({ invitations });
      for (const invitation of invitations.data) {
        if (invitation.event.slug == eventID && invitation.status != "rejected")
          return {
            invited: true,
            group: invitation.group._id,
            status: invitation.status,
          };
      }
      return false;
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const handleRegister = async () => {

    if(!isVerified){
      toast("Please verify email in Dashboard before registering.");
      redirect("/dashboard");
      return;
    }

    const payload = {
      userId: userId, // Adjust this as needed
      membersEmails: membersEmails,
      groupName: teamName,
    };

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${env.API_SERVER}/events/${eventID}/register`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      const data = await response.data;

      // If registration was successful, show the success toast.
      toast.success(
        "Successfully registered, now please confirm your team members",
        {
          removeDelay: 8000,
        },
      );
      setRegistrationResponse(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Registration failed: " + error.response?.data?.message, {
        removeDelay: 8000,
      });
      setRegistrationResponse({
        success: false,
        message: error.message || "An error occurred during registration.",
      });
      setIsLoading(false);
    }
  };

  // Function to unregister
  const handleUnregister = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${env.API_SERVER}/events/${eventID}/cancel-registration`,
        { userId },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      const data = await response.data;
      if (data.success) {
        toast.success("Successfully unregistered");
        setRegistrationResponse(null);
        setParticipationStatus("not-participating");
        setCanUnregisterStatus(false);
        setIsLoading(false);
      } else {
        toast.error("Failed to unregister: " + data.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error during unregister:", error);
      toast.error("Error during unregister: " + error.message);
    }
  };
  const acceptInvitation = async () => {

    if(!isVerified){
      toast("Please verify email in Dashboard before registering.");
      redirect("/dashboard");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${env.API_SERVER}/users/accept-invitation`,
        { groupId: invitationInfo.group },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      const data = await response.data;
      if (data.success) {
        toast.success("Successfully accepted invitation");
        setInvitationInfo({ ...invitationInfo, status: "accepted" });
        setRefreshGroupInfo(true);
        setIsLoading(false);
      } else {
        toast.error("Failed to accept invitation: " + data.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error during accept invitation:", error);
      toast.error("Error during accept invitation: " + error.message);
      setIsLoading(false);
    }
  };
  const declineInvitation = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${env.API_SERVER}/users/reject-invitation`,
        { groupId: invitationInfo.group },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      const data = await response.data;
      if (data.success) {
        toast.success("Successfully declined invitation");
        setInvitationInfo({ ...invitationInfo, status: "declined" });
        setRefreshGroupInfo(true);
      } else {
        toast.error("Failed to decline invitation: " + data.message);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error during decline invitation:", error);
      toast.error("Error during decline invitation: " + error.message);
      setIsLoading(false);
    }
  };
  const fetchParticipationStatusForUseEffect = async () => {
    setLoading(true);
    let status = await getParticipationStatus();
    let { email, emailVerified } = await getUserById(userId);
    setEmail(email);
    setIsVerified(emailVerified);
    // console.log(status);
    setParticipationStatus(status);
    setLoading(false);
  };

  useEffect(() => {
    fetchParticipationStatusForUseEffect();
    for (const event of data) {
      if (event.eventID == eventID) {
        //console.log("Event found");
        setIsSoloEvent(event.maxMembers == 1);
        setMaxMembersAllowed(event.maxMembers);
        break;
      }
    }
  }, []);

  useEffect(() => {
    if (registrationResponse && registrationResponse.success) {
      fetchParticipationStatusForUseEffect();
    }
  }, [registrationResponse]);

  useEffect(() => {
    const fetchCanUnregister = async () => {
      //console.log({ participationStatus });
      if (participationStatus != "not-participating") {
        let resp = await canUnregister();
        setCanUnregisterStatus(resp);
      }
    };
    fetchCanUnregister();
    const fetchIsInvited = async () => {
      let invited = await isInvited();
      //console.log({ invited });
      setInvitationInfo(invited);
    };
    fetchIsInvited();
  }, [participationStatus]);

  if (loading) {
    return (
      <div className="flex w-screen h-screen items-center justify-center">
        Loading...
      </div>
    );
  }
  return (
    <div className="w-full min-h-screen bg-background flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 relative p-2 pt-8 transition-all duration-500"
    >
      <GridLines />
      <img
        src={getImageUrl(eventDetails.eventPoster)}
        alt={eventDetails.eventName}
        className="w-auto md:h-[70vh] lg:h-[90vh] max-w-[90%] lg:max-w-[45%] rounded-sm object-contain z-50"
      />
      {/*      {/* Registration Box with improved styling and animations */}
      <div className="z-10 backdrop-blur-md bg-zinc-800/50 px-3 md:px-5 py-8 w-[95%] sm:w-[80%] md:w-[60%] lg:w-2/5 h-fit lg:min-h-9/10 font-sometypeMono rounded-md flex flex-col items-center">

        {/* Form Section with improved styling */}
        <div className="w-full max-w-[400px] flex flex-col gap-y-3">
          <h1 className="text-4xl font-semibold w-full text-center text-white">
            {eventDetails.eventName}
          </h1>

          {participationStatus == "not-participating" && !isSoloEvent && (
            <>
              <TextField
                fullWidth
                size="medium"
                label="Team Name"
                variant="outlined"
                margin="dense"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                InputLabelProps={{
                  style: {
                    color: "#fff",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    "fontFamily": "var(--font-sometypeMono)",
                  },
                }}
                sx={{
                  "mb": 1,
                  "transition": "all 0.3s ease",
                  "& .MuiOutlinedInput-root": {
                    "backgroundColor": "#141414",
                    "fontFamily": "var(--font-sometypeMono)",
                    "borderRadius": "5px",
                    "transition": "all 0.3s ease",
                    "boxShadow": "0 0 10px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(25, 255, 55, 0.05)",
                    "& fieldset": {
                      borderColor: "#94949440",
                      borderWidth: "2px",
                      transition: "all 0.3s ease"
                    },
                    "&:hover fieldset": {
                      borderColor: "#94949470",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#949494",
                      boxShadow: "0 0 8px rgba(25, 255, 55, 0.3)",
                    },
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "1.1rem",
                    color: "white",
                    padding: "14px 16px",
                    "&::placeholder": {
                      color: "rgba(255, 255, 255, 0.5)",
                    },
                  },
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                }}
              />

              <TextField
                fullWidth
                size="medium"
                label={`Team Member 1 (Leader) Email`}
                variant="outlined"
                margin="dense"
                value={email}
                InputProps={{
                  startAdornment: email ? (
                    <InputAdornment position="start">
                      <CheckCircleIcon
                        sx={{
                          color: "rgba(25, 255, 55, 0.8)",
                          mr: 1,
                          animation: "pulse 2s infinite",
                          "@keyframes pulse": {
                            "0%": { opacity: 0.7 },
                            "50%": { opacity: 1 },
                            "100%": { opacity: 0.7 }
                          }
                        }}
                      />
                    </InputAdornment>
                  ) : null,
                }}
                sx={{
                  "mb": 2,
                  "transition": "all 0.3s ease",
                  "& .MuiOutlinedInput-root": {
                    "fontFamily": "var(--font-sometypeMono)",
                    "backgroundColor": "#141414",
                    "borderRadius": "5px",
                    "transition": "all 0.3s ease",
                    "boxShadow": "0 0 10px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(25, 255, 55, 0.05)",
                    "& fieldset": {
                      borderColor: email ? "#94949440" : "rgba(255, 255, 255, 0.3)",
                      borderWidth: "2px"
                    },
                    "&:hover fieldset": {
                      borderColor: email ? "#94949470" : "rgba(255, 255, 255, 0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: email ? "#949494" : "rgba(255, 255, 255, 0.6)",
                    },
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "1.1rem",
                    color: "white",
                    padding: "14px 16px",
                  },
                  "input": {
                    color: "white",
                  }
                }}
                InputLabelProps={{
                  style: {
                    color: "#fff",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    "fontFamily": "var(--font-sometypeMono)",
                    textShadow: "0 0 5px rgba(25, 255, 55, 0.3)",
                  },
                }}
              />

              <TeamMembers
                membersEmails={membersEmails}
                setMembersEmails={setMembersEmails}
                maxMembers={maxMembersAllowed}
              />

              {/* REGISTER Button with improved styling */}
              <div className="grid grid-cols-4 gap-5 w-full">
                <button
                  onClick={handleRegister}
                  disabled={isLoading}
                  className="col-span-3 text-2xl border border-greyBorder bg-white text-background py-2 rounded-sm">
                  Register
                </button>
                <BackButton eventSlug={eventID}></BackButton>
              </div>
            </>
          )}

          {participationStatus == "not-participating" && isSoloEvent && (
            <div className="flex gap-2 text-white flex-col">
              <Typography
                variant="body1"
                sx={{
                  color: "white",
                  mb: 2,
                  textAlign: "center",
                  textShadow: "0 0 5px rgba(255, 255, 255, 0.3)"
                }}
              >
                Confirming once more before registering for solo event!
              </Typography>

              {/* REGISTER Solo Button with improved styling */}
              <Button
                variant="outlined"
                disabled={isLoading}
                onClick={handleRegister}
                sx={{
                  "mt": 1,
                  "py": 1.5,
                  "width": "100%",
                  "color": "white",
                  "borderColor": "rgba(25, 255, 55, 0.5)",
                  "borderWidth": "2px",
                  "fontWeight": "bold",
                  "fontSize": "1rem",
                  "letterSpacing": "3px",
                  "backgroundColor": "rgba(0, 0, 0, 0.6)",
                  "position": "relative",
                  "transition": "all 0.4s ease",
                  "overflow": "hidden",
                  "zIndex": 1,
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(25, 255, 55, 0.2), transparent)",
                    transition: "all 0.5s",
                    zIndex: -1,
                  },
                  "&:hover": {
                    borderColor: "rgba(25, 255, 55, 0.8)",
                    boxShadow: "0 0 20px rgba(25, 255, 55, 0.3)",
                    transform: "translateY(-3px)",
                    letterSpacing: "4px",
                    bgcolor: "rgba(25, 255, 55, 0.1)",
                    "&:before": {
                      left: "100%",
                    },
                  },
                  "&:active": {
                    transform: "translateY(0)",
                    boxShadow: "0 0 10px rgba(25, 255, 55, 0.2)",
                  }
                }}
              >
                REGISTER - SOLO
              </Button>
            </div>
          )}

          {participationStatus != "not-participating" && !isSoloEvent && (
            <GroupInfo
              userId={userId}
              eventID={eventID}
              refresh={refreshGroupInfo}
              setRefresh={setRefreshGroupInfo}
            />
          )}

          {participationStatus != "not-participating" && isSoloEvent && (
            <div className="flex gap-2 text-white flex-col">
              <Typography
                variant="body1"
                sx={{
                  color: "white",
                  p: 2,
                  textAlign: "center",
                  borderRadius: "8px",
                  background: "rgba(25, 255, 55, 0.1)",
                  border: "1px solid rgba(25, 255, 55, 0.3)",
                  boxShadow: "0 0 15px rgba(25, 255, 55, 0.1)",
                  animation: "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%": { boxShadow: "0 0 15px rgba(25, 255, 55, 0.1)" },
                    "50%": { boxShadow: "0 0 20px rgba(25, 255, 55, 0.3)" },
                    "100%": { boxShadow: "0 0 15px rgba(25, 255, 55, 0.1)" }
                  }
                }}
              >
                You are already registered for this event!
              </Typography>
            </div>
          )}

          {/* UNREGISTER Button with improved styling */}
          {canUnregisterStatus && (
            <Button
              variant="outlined"
              onClick={handleUnregister}
              disabled={isLoading}
              sx={{
                "mt": 3,
                "py": 1.5,
                "width": "100%",
                "color": "white",
                "borderColor": "rgba(255, 80, 80, 0.5)",
                "borderWidth": "2px",
                "fontWeight": "bold",
                "fontSize": "1rem",
                "letterSpacing": "3px",
                "backgroundColor": "rgba(255, 0, 0, 0.2)",
                "position": "relative",
                "transition": "all 0.4s ease",
                "overflow": "hidden",
                "fontFamily": "var(--font-sometypeMono)",
                "zIndex": 1,
                "&:before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255, 80, 80, 0.2), transparent)",
                  transition: "all 0.5s",
                  zIndex: -1,
                },
                "&:hover": {
                  borderColor: "rgba(255, 80, 80, 0.8)",
                  boxShadow: "0 0 20px rgba(255, 80, 80, 0.3)",
                  transform: "translateY(-3px)",
                  letterSpacing: "4px",
                  bgcolor: "rgba(255, 80, 80, 0.1)",
                  "&:before": {
                    left: "100%",
                  },
                },
                "&:active": {
                  transform: "translateY(0)",
                  boxShadow: "0 0 10px rgba(255, 80, 80, 0.2)",
                }
              }}
            >
              UNREGISTER
            </Button>
          )}

          {invitationInfo?.status == "pending" && (
            <div className="flex gap-3 mt-4 justify-center">
              <Button
                onClick={acceptInvitation}
                sx={{
                  "py": 1.2,
                  "px": 3,
                  "color": "white",
                  "borderColor": "rgba(25, 255, 55, 0.5)",
                  "borderWidth": "1px",
                  "fontSize": "0.9rem",
                  "fontFamily": "var(--font-sometypeMono)",
                  "bgcolor": "rgba(25, 255, 55, 0.1)",
                  "borderRadius": "6px",
                  "transition": "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "rgba(25, 255, 55, 0.2)",
                    boxShadow: "0 0 5px rgba(25, 255, 55, 0.3)",
                    transform: "translateY(-2px)",
                  },
                }}
                variant="outlined"
              >
                Accept Invitation
              </Button>
              <Button
                onClick={declineInvitation}
                disabled={isLoading}
                sx={{
                  "py": 1.2,
                  "px": 3,
                  "color": "white",
                  "borderColor": "rgba(255, 80, 80, 0.5)",
                  "borderWidth": "1px",
                  "fontFamily": "var(--font-sometypeMono)",
                  "fontSize": "0.9rem",
                  "bgcolor": "rgba(255, 80, 80, 0.1)",
                  "borderRadius": "6px",
                  "transition": "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "rgba(255, 80, 80, 0.2)",
                    boxShadow: "0 0 5px rgba(255, 80, 80, 0.3)",
                    transform: "translateY(-2px)",
                  },
                }}
                variant="outlined"
              >
                Decline Invitation
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
};

export default App;
