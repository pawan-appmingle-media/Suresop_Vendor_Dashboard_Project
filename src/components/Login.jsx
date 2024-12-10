import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import image from "../images/loginImage.png";

const Login = () => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState("");
  // const [deviceId, setdeviceId] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const fetchLogin = async (mobileNumber) => {
    try {
      const response = await axios.post(
        "https://uvfolderking.com/suresop/api/vendor/login",
        { phone_number: mobileNumber },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      console.log("the data is ", data.vendor);
      const token = response.data.vendor.api_token;
      const userId = response.data.vendor.id;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      console.log("the id is ", userId);

      return token;
    } catch (error) {
      console.error("Error in login: ", error);
      alert(
        "Error in sending OTP, Try SignUP First",
        error.response ? error.response.data : error.message
      );
    }
  }; // Function to send OTP

  const handleSendOtp = async () => {
    if (mobileNumber && mobileNumber.length === 10) {
      const token = await fetchLogin(mobileNumber);
      setOtpSent(true);

      // localStorage.setItem("token", token);
      console.log("the token is ", token);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log(
        "Auth Header",
        axios.defaults.headers.common["Authorization"]
      );
    } else {
      alert("Please enter a valid 10-digit mobile number");
    }
  }; // Function to verify OTP

  const handleLogin = async () => {
    if (otp) {
      try {
        const response = await axios.post(
          "https://uvfolderking.com/suresop/api/vendor/verify-otp",
          {
            phone_number: mobileNumber,
            otp: otp,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("OTP Verification Response:", response.data);
        alert("OTP Verified! Logging in...");

        // Store login status
        localStorage.setItem("login", true); // This flag can be used to check login status

        navigate("/dashboard");
      } catch (error) {
        console.error("Error in OTP verification: ", error);
        alert(
          "Error in OTP verification",
          error.response ? error.response.data : error.message
        );
      }
    } else {
      alert("Please enter the OTP sent to your mobile");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white p-3 shadow-lg rounded-lg">
        {/* Image Div */}
        <div className=" md:w-1/2">
          <img
            src={image}
            alt="Login Illustration"
            width={500}
            height={500}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Login Form Div */}
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Seller Login
          </h2>
          {/* Mobile Number Input */}
          <div className="mb-4">
            <label htmlFor="mobile_number" className="block mb-2 text-gray-600">
              Mobile Number
            </label>
            <input
              type="text"
              id="mobile"
              name="mobile_number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Enter your mobile number"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          {/* <div className="mb-4">
            <label htmlFor="mobile_number" className="block mb-2 text-gray-600">
              Device Id
            </label>
            <input
              type="text"
              id="mobile"
              name="device_id"
              value={deviceId}
              onChange={(e) => setdeviceId(e.target.value)}
              placeholder="Enter your mobile number"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div> */}
          {/* Send OTP Button */}
          {!otpSent && (
            <button
              onClick={handleSendOtp}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Send OTP
            </button>
          )}
          {/* OTP Input */}
          {otpSent && (
            <>
              <div className="mb-4 mt-4">
                <label htmlFor="otp" className="block mb-2 text-gray-600">
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              {/* Login Button */}
              <button
                onClick={handleLogin}
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
              >
                Login
              </button>
            </>
          )}
          {/* Signup Link */}
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Don't have an account ?
              <Link to="/signup">
                <span className="text-blue-500 hover:underline">Sign Up</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
