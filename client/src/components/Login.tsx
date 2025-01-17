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
    <div className="w-full h-full flex justify-center align-middle"> 
      <Button>
        <a href={authUrl}>Login</a>
      </Button>
    </div>
  );
}

export default Login;