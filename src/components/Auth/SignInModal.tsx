import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Mail, Lock, User, ArrowRight, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import loginImage from "../../images/image-login-desh.jpg";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();

  const [isVisible, setIsVisible] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [loginStep, setLoginStep] = useState(1);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Smooth opening animation
  useEffect(() => {
    if (isOpen) setIsVisible(true);
    else {
      const t = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  const handleLoginStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      setError("Enter email or mobile number");
      return;
    }
    setError("");
    setLoginStep(2);
  };

  const handleLoginFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(loginEmail, loginPassword);
      onClose();
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    }

    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupPassword !== signupConfirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      console.log("SIGN UP:", {
        signupName,
        signupEmail,
        signupPassword,
      });
      onClose();
    } catch (err: any) {
      setError(err.message);
    }

    setIsLoading(false);
  };

  const handleGoogleLogin = () => {
    console.log("Google Login");
  };

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden relative transition-all duration-500 
            ${isLoginView ? "w-[600px] h-[400px] md:flex-row" : "max-w-[380px]"}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 rounded-full hover:bg-gray-100 shadow-sm"
        >
          <X size={20} className="text-gray-600" />
        </button>

        {/* Left Side Image */}
        <div
          className={`relative bg-orange-100 transition-all duration-500 ${
            isLoginView ? "hidden md:block w-1/2" : "w-full h-40"
          }`}
        >
          <img
            src={loginImage}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {isLoginView ? (
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex flex-col justify-end p-12 text-white">
              <h2 className="text-4xl font-bold mb-4 font-serif">
                DarShana
              </h2>
              <p className="text-lg opacity-90">Discover India deeply.</p>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <h2 className="text-4xl font-bold font-serif text-white drop-shadow-lg">
                DarShana
              </h2>
            </div>
          )}
        </div>

        {/* Right Side */}
        <div
          className={`flex flex-col justify-center transition-all duration-500 ${
            isLoginView ? "w-full md:w-1/2 p-6" : "w-full p-6"
          }`}
        >
          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 font-serif mb-1">
                {isLoginView ? "Welcome Back" : "Create an Account"}
              </h2>
              <p className="text-gray-500 text-[10px]">
                {isLoginView ? "Login to continue" : "Start exploring India"}
              </p>
            </div>

            {/* Toggle */}
            {isLoginView && (
              <div className="flex bg-gray-100 p-1 rounded-full mb-4 relative">
                <div
                  className={`absolute w-1/2 h-full rounded-full bg-white shadow-sm transition-all left-0`}
                ></div>

                <button className="flex-1 py-2.5 text-sm font-medium text-orange-600 z-10">
                  Login
                </button>

                <button
                  onClick={() => setIsLoginView(false)}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-500 z-10"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg">
                {error}
              </div>
            )}

            {/* LOGIN FORM */}
            {isLoginView && (
              <>
                {/* Step 1 */}
                {loginStep === 1 ? (
                  <form onSubmit={handleLoginStep1} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Email / Mobile Number
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <input
                          type="text"
                          className="w-full pl-10 pr-3 py-2 border rounded-lg outline-none text-sm"
                          placeholder="Enter Email or Mobile"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <button className="w-full bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 text-sm">
                      Continue <ArrowRight size={16} />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleLoginFinal} className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-xs font-medium text-gray-700">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setLoginStep(1)}
                          className="text-[10px] text-orange-600"
                        >
                          Change Email
                        </button>
                      </div>

                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <input
                          type="password"
                          className="w-full pl-10 pr-3 py-2 border rounded-lg outline-none text-sm"
                          placeholder="Password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      disabled={isLoading}
                      className="w-full bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition-all text-sm"
                    >
                      {isLoading ? "Verifying..." : "Login"}
                    </button>
                  </form>
                )}

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-[10px]">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                {/* Google Login */}
                <button
                  onClick={handleGoogleLogin}
                  className="w-full bg-white border border-gray-200 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 text-sm"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    className="w-4 h-4"
                  />
                  Sign in with Google
                </button>

                <p className="text-center text-[10px] mt-2">
                  Don’t have an account?{" "}
                  <button
                    onClick={() => setIsLoginView(false)}
                    className="text-orange-600"
                  >
                    Sign Up
                  </button>
                </p>
              </>
            )}

            {/* SIGNUP FORM */}
            {!isLoginView && (
              <form onSubmit={handleSignUp} className="space-y-3">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 border rounded-full text-sm"
                    placeholder="Full Name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 border rounded-full text-sm"
                    placeholder="Email / Phone"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="password"
                    className="w-full pl-10 pr-4 py-2.5 border rounded-full text-sm"
                    placeholder="Password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="password"
                    className="w-full pl-10 pr-4 py-2.5 border rounded-full text-sm"
                    placeholder="Confirm Password"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-500 text-white py-3 rounded-full font-bold hover:bg-orange-600 transition"
                >
                  {isLoading ? "Creating..." : "Sign Up"}
                </button>

                <p className="text-center text-xs mt-1">
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsLoginView(true)}
                    className="text-orange-600"
                  >
                    Login
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SignInModal;
