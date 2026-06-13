import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/api";

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      try {
        setLoading(true);
    
        if (!isLogin) {
    
          if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
          }
    
          const result = await registerUser({
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
          });

          console.log("REGISTER RESPONSE:", result);
    
          localStorage.setItem(
            "dtx_token",
            result.data.token
          );
          
          localStorage.setItem(
            "dtx_user",
            JSON.stringify(result.data.user)
          );
    
          navigate("/dashboard");
    
        } else {
    
          const result = await loginUser({
            email: formData.email,
            password: formData.password,
          });

          console.log("LOGIN RESPONSE:", result);
    
          localStorage.setItem(
            "dtx_token",
            result.data.token
          );
          
          localStorage.setItem(
            "dtx_user",
            JSON.stringify(result.data.user)
          );
    
          navigate("/dashboard");
        }
    
      } catch (error) {
    
        console.error(error);
    
        alert(error.message || "Authentication failed");
    
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          Data TwinX
        </div>

        <h1>
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>

        <p>
          {isLogin
            ? "Sign in to access your documents"
            : "Start securing your documents today"}
        </p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          {!isLogin && (
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          )}

        <button
          type="submit"
          className="btn btn-primary auth-btn"
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : isLogin
              ? "Login"
              : "Register"}
        </button>

        </form>

        <div className="auth-switch">

          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </button>

        </div>

      </div>

    </div>
  );
}