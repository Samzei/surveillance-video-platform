import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setIsAuthenticated }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    function handleLogin(event) {
        event.preventDefault();

        if (email === "demo@secureview.com" && password === "password") {
            setIsAuthenticated(true);
            navigate("/");
        } else {
            alert("Invalid login details. Try demo@secureview.com and password");
        }
    }

    return (
        <main className="login-page">
            <form className="login-card" onSubmit={handleLogin}>
                <h1>SecureView Login</h1>
                <p>Enter your details to access recordings.</p>

                <label>Email</label>
                <input 
                    type="email"
                    placeholder="demo@secureview.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />

                <label>Password</label>
                <input 
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)} 
                />

                <button type="submit">Login</button>
            </form>
        </main>
    );
}

export default Login;