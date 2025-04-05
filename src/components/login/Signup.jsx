import { useState, useEffect } from "react";
import { SignUpButton, GoogleSignInButton } from "./ui/buttons";
import { EmailInput, PhoneInput, PasswordInput, TextInput } from "./ui/inputs";
import { useNavigate } from "react-router-dom";
import GridLines from "../GridLines";
import { authController, serviceController } from "../../services/http";
import { CONST } from "../../config";
import MascotAnimation from "../home/MascotAnimation";
import toast from "react-hot-toast";
import Navbar from "../Navbar";

// eslint-disable-next-line react/prop-types
const Signup = ({ user }) => {
  const navigate = useNavigate();

  const [imageSrc, setImageSrc] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    campusReferralCode: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    consent: "",
    campusReferralCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleInputFocus = () => {
    setImageSrc("/mascot_right.png");
  };

  const handleInputBlur = () => {
    setImageSrc("");
  };

  useEffect(() => {
    if (user !== "") {
      navigate("/");
      return;
    }

    serviceController
      .isOAuth2GoogleAvailable()
      .then((response) => {
        let { serviceName, isActive } = response.data;
        // console.log(
        //   `${serviceName} status: ${isActive ? "Available" : "Not available"}`,
        // );
      })
      .catch((error) => {
        console.error("Error checking Google OAuth availability:", error);
      });
  }, [navigate, user]);

  useEffect(() => {
    if (message !== "") toast.error(message, { position: "bottom-right" });
  }, [message]);

  const startWithGoogle = function (e) {
    e.preventDefault();
    authController
      .startWithOAuth2(CONST.uri.auth.GOOGLE_LOGIN)
      .then(onSuccessLogin)
      .catch(onFailLogin);
  };

  const onSuccessLogin = function ({ data }) {
    let { sid } = data;
    // console.log(sid);
    if (!sid) {
      let error = "An error occurred during the login process";
      console.log(error);
      setMessage(error);
      return;
    }

    localStorage.setItem("sid", sid.id);
    localStorage.setItem("providerID", sid.providerId[0].providerUserId);
    if(sid.isNewUser == true){
      navigate("/referral", { state: { allowed: true } });
    }else{
      navigate("/");
    }
  };

  const onFailLogin = function (error) {
      console.error("Login failed:", error);
      toast.error("Login Rejected!")
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if there are errors
    if (!Object.values(errors).every((error) => error === "")) return;

    // Set loading state to true while the API request is in progress
    setLoading(true);

    try {
      const response = await authController.registerUser(formData);
      const { sid } = response.data;

      localStorage.setItem("sid", sid.id);
      // Redirect to EmailVerify page with formData (including email)
      navigate("/verify", { state: { formData } });
    } catch (error) {
      if (error.response && error.response.data.error) {
        const { keyPattern } = error.response.data.error;

        if (keyPattern.email) {
          setErrors((prev) => ({
            ...prev,
            email: "This email is already registered",
          }));
        }
        if (keyPattern.phone) {
          setErrors((prev) => ({
            ...prev,
            phone: "This phone number is already registered",
          }));
        }
        if (keyPattern.campusReferralCode) {
          setErrors((prev) => ({
            ...prev,
            campusReferralCode: "Invalid referral code",
          }));
        }
      } else {
        console.log(error);
        setMessage("Error registering user. Try again.");
      }
    } finally {
      // Set loading state to false once the request is complete (success or error)
      setLoading(false);
    }
  };

  const isFormValid =
  Object.entries(formData)
    .filter(([key]) => key !== "campusReferralCode") // Exclude campusReferralCode from validation
    .every(([_, value]) => value.trim() !== "") &&
  Object.values(errors).every((error) => error === "");


  return (
    <div className="w-full relative font-sometypeMono">
      <GridLines />
      <Navbar />
      <div className="min-h-screen flex items-center justify-center p-4 font-['Source_Code_Pro']">
        <div className="w-full max-w-2xl bg-black/20 rounded-2xl backdrop-blur-sm border border-white flex flex-col p-8 text-left">
          <h1 className="font-bold lg:text-2xl">
            Welcome to Srijan - 2025!
            <br />
            Let&apos;s begin the adventure
          </h1>

          <div className="mt-6 flex flex-wrap">
            <div className="w-full lg:w-1/2 flex flex-col text-sm">
              <GoogleSignInButton
                textContent="Sign up with Google"
                onClick={startWithGoogle}
              ></GoogleSignInButton>

              <h1 className="italic font-bold mt-4">
                Have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-[#8420FF] cursor-pointer"
                >
                  Log In
                </span>
              </h1>

              <form
                id="signupForm"
                className="space-y-4 mt-4"
                onSubmit={handleSubmit}
              >
                <TextInput
                  labelContent={
                    <>
                      <span className="text-[#8420FF] text-md">Enter your</span> name
                    </>
                  }
                  name="name"
                  type="text"
                  placeholder="Name..."
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
                <EmailInput
                  labelContent={
                    <>
                      <span className="text-[#8420FF]">Enter your</span> email
                    </>
                  }
                  name="email"
                  type="text"
                  placeholder="Email..."
                  value={formData.email}
                  error={errors.email}
                  setErrors={setErrors}
                  onChange={handleChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
                <PhoneInput
                  labelContent={
                    <>
                      <span className="text-[#8420FF]">Enter your</span> phone
                      number
                    </>
                  }
                  name="phone"
                  value={formData.phone}
                  error={errors.phone}
                  setErrors={setErrors}
                  onChange={handleChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
                <PasswordInput
                  labelContent={
                    <>
                      <span className="text-[#8420FF]">Create a</span> password
                    </>
                  }
                  name="password"
                  placeholder={"Password..."}
                  value={formData.password}
                  error={errors.password}
                  setErrors={setErrors}
                  onChange={handleChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
                <PasswordInput
                  labelContent={
                    <>
                      <span className="text-[#8420FF]">Confirm your</span>{" "}
                      password
                    </>
                  }
                  name="confirmPassword"
                  placeholder={"Confirm password..."}
                  value={formData.confirmPassword}
                  password={formData.password}
                  error={errors.confirmPassword}
                  setErrors={setErrors}
                  onChange={handleChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </form>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col items-center">
              {imageSrc && (
                <div className="hidden lg:flex mt-10 w-1/2 flex-col items-center robot-container">
                  <img
                    src={imageSrc}
                    alt="Robot mascot"
                    className="w-100 h-100 pt-10 object-contain transition-all duration-900"
                  />
                </div>
              )}

              <div
                className={`w-full h-full hidden  ${imageSrc ? "hidden" : "lg:block"}`}
              >
                <MascotAnimation scale={4.7} wave={false} />
              </div>
            </div>

            <div className="w-full mt-4">
              <TextInput
                labelContent={
                  <>
                    <span className="text-[#8420FF]">
                      Enter{" "}
                    </span>
                    Campus Referral <span className="text-[#8420FF]">Code</span>{" "}
                    {"(if any)"} 
                  </>
                }
                name="campusReferralCode"
                type="text"
                placeholder='Enter Referral Code...'
                value={formData.campusReferralCode}
                className="lg:w-2/5"
                error={errors.campusReferralCode}
                onChange={handleChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>

            {/* SIGN UP BUTTON */}
            {isFormValid && (
              <div className="w-full flex justify-center mt-6 cursor-pointer">
                <SignUpButton
                  onClick={handleSubmit}
                  textContent={loading ? "Submitting..." : "Sign Up"}
                ></SignUpButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
