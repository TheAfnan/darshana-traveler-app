import { ArrowRight, Lock, Mail, User, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import loginImage from "../images/image-login-desh.jpg";
import { sendSignupEmail } from "../services/emailService";

interface LoginProps {
  onClose?: () => void;
  isModal?: boolean;
}

const Login: React.FC<LoginProps> = ({ onClose, isModal = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, loginWithGoogle, loginAsGuest } = useAuth();

  const [isLoginView, setIsLoginView] = useState(true);
  const [loginStep, setLoginStep] = useState(1);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [verificationNotice, setVerificationNotice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Switch view based on URL
  useEffect(() => {
    if (
      location.pathname.toLowerCase() === "/register" ||
      location.state?.view === "signup"
    ) {
      setIsLoginView(false);
      setLoginStep(1);
    } else {
      setIsLoginView(true);
      setLoginStep(1);
    }
  }, [location.pathname, location.state]);

  const handleLoginStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setError("Please enter your email");
      return;
    }
    setError("");
    setVerificationNotice("");
    setLoginStep(2);
  };

  const handleLoginFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setVerificationNotice("");
    setIsLoading(true);

    try {
      await login(loginEmail.trim(), loginPassword);

      if (loginEmail === 'admin@darshana.com') {
        navigate('/admin');
        if (onClose) onClose();
      } else {
        if (onClose) onClose(); // Close modal
        else navigate("/travelhub");
      }
    } catch (err: any) {
      if (err.message === 'EMAIL_NOT_VERIFIED') {
        setError(`Email verification required! We have sent a verification link to ${loginEmail.trim()}. Please open your Gmail, click the link, and then log in.`);
      } else {
        setError(err.message || "Invalid credentials");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setVerificationNotice("");

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setError("Name, email, and password are required");
      return;
    }

    if (!signupEmail.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await register(signupName.trim(), signupEmail.trim(), "", signupPassword);

      // Fire-and-forget welcome email; do not block UI on failure
      void sendSignupEmail({ name: signupName, email: signupEmail });

      setVerificationNotice(`🎉 Verification link sent to ${signupEmail.trim()}! Please open your Gmail, click the link to verify, and then enter your password to log in.`);
      setIsLoginView(true);
      setLoginEmail(signupEmail.trim());
      setLoginPassword("");
      setLoginStep(2);
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      await loginWithGoogle();
      if (onClose) onClose();
      else navigate("/travelhub");
    } catch (err: any) {
      console.warn("Google Sign-In caught error:", err);
      if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('unauthorized-domain')) {
        setError("Domain not whitelisted in Firebase Console yet. Logging in with Demo Traveler Access...");
        setTimeout(() => {
          loginAsGuest();
          if (onClose) onClose();
          else navigate("/travelhub");
        }, 1200);
      } else {
        setError(err?.message || "Google sign-in failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsGuest();
    if (onClose) onClose();
    else navigate("/travelhub");
  };

  const handleClose = () => {
    if (onClose) onClose(); // Modal close
    else navigate("/"); // Full page close → go home
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden transition-all duration-300 relative w-full max-w-md md:max-w-2xl my-auto max-h-[92vh] overflow-y-auto border border-white/20 shadow-slate-950/50 z-10"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2 bg-white/90 rounded-full hover:bg-stone-100 shadow-sm border border-stone-200/60 text-stone-600 transition"
        >
          <X size={18} />
        </button>

        {/* Left Traveler Illustration (Visible on both Login & Sign Up) */}
        <div
          className="relative bg-amber-50 transition-all duration-300 hidden md:block md:w-5/12 min-h-[420px]"
        >
          <img
            src={loginImage}
            alt="Darshana Cultural Traveler"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex flex-col justify-end p-6 text-white">
            <h2 className="text-2xl font-bold font-serif mb-1 text-white">DarShana</h2>
            <p className="text-xs text-amber-200 opacity-90 leading-relaxed font-sans">
              {isLoginView 
                ? "Discover India's living cultural traditions deeply." 
                : "Join thousands of travelers exploring India's heritage."}
            </p>
          </div>
        </div>

        {/* Right Form Section */}
        <div
          className="flex flex-col justify-center transition-all duration-300 w-full md:w-7/12 p-5 sm:p-7"
        >
          <div className="w-full">
            {/* Header */}
            <div className="text-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-sans tracking-tight mb-0.5">
                {isLoginView ? "Welcome to DarShana" : "Create Traveler Account"}
              </h2>
              <p className="text-stone-500 text-xs font-normal">
                {isLoginView ? "Login to access your cultural itineraries" : "Sign up to explore festivals, food & heritage"}
              </p>
            </div>

            {/* Toggle Tabs */}
            <div className="flex bg-stone-100 p-1 rounded-xl mb-4 relative">
              <button
                onClick={() => {
                  setIsLoginView(true);
                  setLoginStep(1);
                  setError("");
                  setVerificationNotice("");
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isLoginView ? "bg-white text-stone-900 shadow-xs" : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Login
              </button>

              <button
                onClick={() => {
                  setIsLoginView(false);
                  setError("");
                  setVerificationNotice("");
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  !isLoginView ? "bg-white text-stone-900 shadow-xs" : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Verification Notice */}
            {verificationNotice && (
              <div className="mb-3.5 p-3 bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs rounded-xl flex items-start gap-2 leading-relaxed">
                <span className="text-base leading-none shrink-0">📬</span>
                <span>{verificationNotice}</span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-3.5 p-3 bg-red-50 border border-red-200/80 text-red-600 text-xs rounded-xl flex items-start gap-2 leading-relaxed">
                <span className="text-base leading-none shrink-0">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {isLoginView && (
              <div className="space-y-3.5">
                {loginStep === 1 ? (
                  <form onSubmit={handleLoginStep1} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                          size={15}
                        />
                        <input
                          type="email"
                          className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-amber-600 focus:bg-white text-xs sm:text-sm transition"
                          placeholder="name@gmail.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>

                    <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer">
                      Continue <ArrowRight size={15} />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleLoginFinal} className="space-y-3.5">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-medium text-stone-700">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setLoginStep(1)}
                          className="text-[11px] text-amber-700 hover:underline cursor-pointer"
                        >
                          Change Email
                        </button>
                      </div>

                      <div className="relative">
                        <Lock
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                          size={15}
                        />
                        <input
                          type="password"
                          className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-amber-600 focus:bg-white text-xs sm:text-sm transition"
                          placeholder="Enter your password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>

                    <button
                      disabled={isLoading}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
                    >
                      {isLoading ? "Verifying..." : "Sign In"}
                    </button>
                  </form>
                )}

                {/* Divider */}
                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-200" />
                  </div>
                  <div className="relative flex justify-center text-[10px]">
                    <span className="px-2 bg-white text-stone-400 font-medium">OR</span>
                  </div>
                </div>

                {/* Google Login & Demo Login */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full bg-white border border-stone-200/90 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-stone-50 text-xs sm:text-sm font-medium text-stone-700 shadow-xs transition cursor-pointer"
                  >
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      className="w-4 h-4"
                      alt="Google"
                    />
                    Sign in with Google
                  </button>

                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    className="w-full bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 py-1.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-900 transition cursor-pointer"
                  >
                    <span>⚡ Instant Demo Login (1-Click Guest)</span>
                  </button>
                </div>
              </div>
            )}

            {/* SIGNUP FORM */}
            {!isLoginView && (
              <div className="space-y-3">
                <form onSubmit={handleSignUp} className="space-y-2.5">
                  <div className="relative">
                    <User
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                      size={15}
                    />
                    <input
                      type="text"
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-amber-600 focus:bg-white text-xs sm:text-sm transition"
                      placeholder="Full Name"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="relative">
                    <Mail
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                      size={15}
                    />
                    <input
                      type="email"
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-amber-600 focus:bg-white text-xs sm:text-sm transition"
                      placeholder="Gmail / Email Address"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="relative">
                    <Lock
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                      size={15}
                    />
                    <input
                      type="password"
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-amber-600 focus:bg-white text-xs sm:text-sm transition"
                      placeholder="Password (min 6 characters)"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="relative">
                    <Lock
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                      size={15}
                    />
                    <input
                      type="password"
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-amber-600 focus:bg-white text-xs sm:text-sm transition"
                      placeholder="Confirm Password"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
                  >
                    {isLoading ? "Sending Verification Link..." : "Create Account & Verify Gmail"}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-2.5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-200" />
                  </div>
                  <div className="relative flex justify-center text-[10px]">
                    <span className="px-2 bg-white text-stone-400 font-medium">OR</span>
                  </div>
                </div>

                {/* Social Sign up */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full bg-white border border-stone-200/90 py-1.5 rounded-xl flex items-center justify-center gap-2 hover:bg-stone-50 text-xs font-medium text-stone-700 shadow-xs transition cursor-pointer"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    className="w-4 h-4"
                    alt="Google"
                  />
                  Sign up with Google
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
