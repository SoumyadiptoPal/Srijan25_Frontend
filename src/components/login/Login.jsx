/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { SignUpButton, GoogleSignInButton } from "./ui/buttons";
import { EmailInput, PasswordInput } from "./ui/inputs";
import { useNavigate } from "react-router-dom";
import GridLines from "../GridLines";
import { authController, serviceController } from "../../services/http";
import { CONST } from "../../config";
import MascotAnimation from "../home/MascotAnimation";
import toast from "react-hot-toast";
import Navbar from "../Navbar";

const Login = ({ user }) => {
  const navigate = useNavigate();

  const [imageSrc, setImageSrc] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    loginPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    loginPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleInputFocus = () => {
    setImageSrc("/mascot_right.png");
  };

  const handleInputBlur = () => {
    setImageSrc("");
  };

  const handleForgotPassword = async () => {
    try {
      navigate("/forgotPassword");
    } catch (err) {
      console.error(err);
    }
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
    //console.log(sid);
    if (!sid) {
      let error = "An error occurred during the login process";
      //console.log(error);
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

    let newErrors = { ...errors };

    if (!formData.loginPassword) {
      newErrors.loginPassword = "Please enter a password";
    } else {
      newErrors.loginPassword = "";
    }

    if (!formData.email) {
      newErrors.email = "Please enter an email";
    } else {
      newErrors.email = "";
    }

    setErrors(newErrors);

    // Prevent submission if there are errors
    if (!Object.values(errors).every((error) => error === "")) return;

    // Set loading state to true while the API request is in progress
    setLoading(true);

    try {
      const response = await authController.startWithCredentials({
        email: formData.email,
        password: formData.loginPassword,
      });

      const { sid } = response.data;

      localStorage.setItem("sid", sid.id);

      // Redirect to EmailVerify page with formData (including email)
      navigate("/", { state: { userData: response.data } });
    } catch (error) {
      if (error.response && error.response.data.error) {
        const { message, field } = error.response.data.error;
        
        // Set the error message for the specific field
        setErrors((prev) => ({
          ...prev,
          [field]: message,
        }));
      } else {
        setMessage("Error logging the user in. Try again.");
      }
    } finally {
      // Set loading state to false once the request is complete (success or error)
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative font-sometypeMono">
      <GridLines />
      <Navbar />
      <div className="min-h-screen flex items-center justify-center p-4 font-['Source_Code_Pro']">
        <div className="w-full max-w-2xl bg-black/20 rounded-2xl backdrop-blur-sm border border-white flex flex-col p-8 text-left">
          <h1 className="font-bold lg:text-2xl">
            Welcome to Srijan - 2025!
            <br />
            Let&apos;s continue the adventure
          </h1>

          <div className="mt-6 mb-4 flex flex-wrap">
            <div className="w-full lg:w-1/2 flex flex-col ">
              <GoogleSignInButton
                onClick={startWithGoogle}
              ></GoogleSignInButton>

              <h1 className="italic font-bold mt-4">
                Not signed up yet?{" "}
                <span
                  onClick={() => navigate("/signup")}
                  className="text-[#8420FF] cursor-pointer"
                >
                  Sign up
                </span>
              </h1>
              <form
                id="signupForm"
                className="space-y-4 mt-4"
                onSubmit={handleSubmit}
              >
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
                <PasswordInput
                  labelContent={
                    <>
                      <span className="text-[#8420FF]">Enter</span> password
                    </>
                  }
                  name="loginPassword"
                  placeholder={"Password..."}
                  value={formData.loginPassword}
                  error={errors.loginPassword}
                  setErrors={setErrors}
                  onChange={handleChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </form>
              <h1
                onClick={() => handleForgotPassword()}
                className="italic font-bold mt-4 cursor-pointer"
              >
                <span className="text-[#8420FF] cursor-pointer">Forgot </span>
                Password?
              </h1>
              {/* LOGIN BUTTON */}
              <div className="w-full flex justify-center mt-8 lg:-ml-4">
                <SignUpButton
                  onClick={handleSubmit}
                  textContent={loading ? "Logging In..." : "Login"}
                />
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col items-center">
              {imageSrc && (
                <div className="hidden lg:flex mt-10 w-1/2 flex-col items-center robot-container">
                  <img
                    src={imageSrc}
                    alt="Robot mascot"
                    className="w-72 h-72 object-contain transition-all duration-900"
                  />
                </div>
              )}

              <div
                className={`w-full h-full hidden  ${imageSrc ? "hidden" : "lg:block"}`}
              >
                <MascotAnimation scale={5} wave={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
