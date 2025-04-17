// GoogleLogin.jsx
import { useEffect } from "react";

const GoogleLoginSetup = () => {
  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: "132542767032-94p8picl3smfru566dfm47v3vqcl2r65.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    window.google.accounts.id.renderButton(document.getElementById("googleSignInDiv"), {
      theme: "outline",
      size: "large",
    });
  }, []);

  const handleCallbackResponse = async (response) => {
    const { credential } = response;

    // Send credential (JWT from Google) to your backend for verification
    const res = await fetch("http://localhost:8000/api/auth/verify-google-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: credential }),
    });

    const data = await res.json();
    console.log(data); // Contains your own app JWT
  };

  return <div id="googleSignInDiv"></div>;
};

export default GoogleLoginSetup;
