import { useState } from "react";
import { useAppContext } from "../context/AppContext";

const LoginSignup = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { axios, navigate } = useAppContext();
  const [error, setError] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let endpoint = state === "login" ? "/api/user/login" : "/api/user/signup";
      const payload =
        state === "login" ? { email, password } : { name, email, password };

      const { data } = await axios.post(endpoint, payload);
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user)); // Stringify object
        navigate("/");
        window.location.reload();
      } else {
        alert(data.msg);
      }

      // Store token (assuming your backend returns { token, user })

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.msg);
      console.error("Authentication error:", err);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col gap-4 mx-auto mb-20 mt-30 items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
    >
      <p className="text-2xl font-medium m-auto">
        <span className="text-indigo-500">User</span>{" "}
        {state === "login" ? "Login" : "Sign Up"}
      </p>

      {error && (
        <div className="w-full p-2 bg-red-100 text-red-600 rounded text-sm">
          {error}
        </div>
      )}

      {state === "register" && (
        <div className="w-full">
          <p>Name</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Type your name"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
            type="text"
            required
          />
        </div>
      )}

      <div className="w-full">
        <p>Email</p>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Type your email"
          className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
          type="email"
          required
        />
      </div>

      <div className="w-full">
        <p>Password</p>
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Type your password"
          className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
          type="password"
          required
          minLength={6}
        />
      </div>

      {state === "register" ? (
        <p>
          Already have account?{" "}
          <span
            onClick={() => setState("login")}
            className="text-indigo-500 cursor-pointer"
          >
            Click here
          </span>
        </p>
      ) : (
        <p>
          Create an account?{" "}
          <span
            onClick={() => setState("register")}
            className="text-indigo-500 cursor-pointer"
          >
            Click here
          </span>
        </p>
      )}

      <button
        type="submit"
        className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md cursor-pointer"
      >
        {state === "register" ? "Create Account" : "Login"}
      </button>
    </form>
  );
};

export default LoginSignup;
