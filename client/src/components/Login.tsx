import { Button } from "@/components/ui/button"
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router';

function Login() {
  const [authUrl, setAuthUrl] = useState("")
  const navigate = useNavigate();
  const access_token: (string | null) = localStorage.getItem("access_token")

  // check if there is a accesstoken in the local storage,
  // if there is route to dashboard, else stay here 
  useEffect(()=>{
    if (!access_token) {
      axios.get("http://localhost:8080/loginurl")
      .then(response => {
        setAuthUrl(response.data)
      })
      .catch(err => {
        console.log(err)
      })
    } else {
      navigate('/dashboard');
    }
  },[])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <h1 className="text-5xl">
        Spotify Dashboard
      </h1>
      <div className="w-full max-w-sm text-center">  
        <Button
          className="bg-white"
        >
          <a href={authUrl}>Login</a>
        </Button>
      </div>
    </div>
  );
}

export default Login;