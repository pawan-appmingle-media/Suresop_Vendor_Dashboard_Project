import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import signup from "../images/signup.png";
const SignUp = () => {
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    gstin: "",
    documents: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);

  const resendOTP = async (phone_number) => {
    try {
      const response = await axios.post(
        "https://uvfolderking.com/suresop/api/vendor/resend-otp",
        { phone_number },
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("otp data is ", response);
      setOtpSent(true);
      alert("OTP has been resent to your mobile number.");
    } catch (error) {
      console.error(
        "Error in resending OTP:",
        error.response?.data || error.message
      );
    }
  };
  const handleResendOTP = () => {
    if (signupData.phone_number) {
      resendOTP(signupData.phone_number);
    } else {
      alert("Mobile number not found");
    }
  };

  const signupUser = async (signupData) => {
    try {
      const formData = new FormData();
      Object.keys(signupData).forEach((key) => {
        formData.append(key, signupData[key]);
      });
      console.log("FormData being sent: ", signupData);

      const response = await axios.post(
        "https://uvfolderking.com/suresop/api/vendor/signup",
        signupData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("the userDetail is ", response.data);
      setOtpSent(true);
      alert("OTP has been sent to your mobile number.");
    } catch (error) {
      console.error(
        "Error during signup:",
        error.response?.data || error.message
      );

      alert(error.response.data.error.phone_number[0]);
    }
  };

  const verifyOtp = async (otp) => {
    try {
      const { phone_number } = signupData;
      console.log("Verifying OTP: ", { otp, phone_number });
      const response = await axios.post(
        "https://uvfolderking.com/suresop/api/vendor/verify-otp",
        { otp, phone_number }
      );
      alert("OTP verified successfully!");
      navigate("/");
    } catch (error) {
      console.error(
        "Error during OTP verification:",
        error.response?.data || error.message
      );
    }
  };

  const handleSignup = () => {
    const { first_name, last_name, email, phone_number, documents, gstin } =
      signupData;
    if (
      first_name &&
      last_name &&
      email &&
      phone_number &&
      documents &&
      gstin
    ) {
      signupUser(signupData);
    } else {
      alert("Please fill all fields");
    }
  };

  const handleOtpVerification = () => {
    if (signupData.otp) {
      verifyOtp(signupData.otp);
    } else {
      alert("Please enter the OTP sent to your mobile number");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setSignupData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value, // Handle file uploads
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-[30px]">
      <div className="flex flex-col sm:flex-row  bg-white gap-5 p-[10px] w-[100%] sm:pt-5 shadow-lg rounded-lg">
        {/* Image Div */}
        <div className="w-full sm:w-1/2 flex justify-center mb-6 sm:mb-0">
          <img
            src={signup} // Placeholder for signup image
            alt="Signup Illustration"
            className="w-full sm:w-[350px] sm:w-[400px] h-auto object-cover rounded-lg"
          />
        </div>

        {/* Signup Form Div */}
        <div className="w-full sm:w-1/2 flex flex-col justify-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-center mb-4">
            Sign Up
          </h2>

          {/* First Name Input */}
          <div className="flex justify-between max-sm:flex-wrap ">
            <div className="mb-4  w-[48%]  max-sm:w-[100%]">
              <label htmlFor="first_name" className="block mb-2text-gray-600">
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={signupData.first_name}
                onChange={handleChange}
                placeholder="Enter your first name"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Last Name Input */}
            <div className="mb-4 w-[48%] max-sm:w-[100%]">
              <label htmlFor="last_name" className="block mb-2 text-gray-600">
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={signupData.last_name}
                onChange={handleChange}
                placeholder="Enter your last name"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={signupData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Mobile Number Input */}
          <div className="flex justify-between max-sm:flex-wrap ">
            <div className="mb-4 w-[48%]  max-sm:w-[100%]">
              <label
                htmlFor="phone_number"
                className="block mb-2 text-gray-600"
              >
                Mobile Number
              </label>
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                value={signupData.phone_number}
                onChange={handleChange}
                placeholder="Enter your mobile number"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* GSTIN Input */}
            <div className="mb-4 w-[48%] max-sm:w-[100%]">
              <label htmlFor="gstin" className="block mb-2 text-gray-600">
                GST Number
              </label>
              <input
                type="text"
                id="gstin"
                name="gstin"
                value={signupData.gstin}
                onChange={handleChange}
                placeholder="Enter your GST number"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Documents Upload */}
          <div className="mb-4">
            <label htmlFor="documents" className="block mb-2 text-gray-600">
              Documents
            </label>
            <input
              type="file"
              id="documents"
              name="documents"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Signup Button */}
          <button
            onClick={handleSignup}
            className="w-full bg-[#B22222]  text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            Sign Up
          </button>

          {/* OTP Input and Verification */}
          {otpSent && (
            <>
              <div className="mb-4 mt-4">
                <label
                  htmlFor="otp"
                  className="block mb-2 text-gray-600 flex justify-between items-end"
                >
                  Enter OTP
                  <span onClick={handleResendOTP} className="text-xs">
                    Resend OTP
                  </span>
                </label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={signupData.otp}
                  onChange={handleChange}
                  placeholder="Enter OTP"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <button
                onClick={handleOtpVerification}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Verify OTP
              </button>
            </>
          )}

          {/* Login Link */}
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Already have an account?
              <Link to="/">
                <span className="text-blue-500 hover:underline">Login</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
