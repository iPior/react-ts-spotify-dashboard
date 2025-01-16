import { Button } from "@/components/ui/button"
import axios from "axios";
import { useEffect, useState } from "react";

function Login() {
  const [authUrl, setAuthUrl] = useState("")

  // check if there is a accesstoken in the local storage,
  // if there is route to dashboard, else stay here

  useEffect(()=>{
    axios.get("http://localhost:8080/loginurl")
    .then(response => {
      setAuthUrl(response.data)
    })
    .catch(err => {
      console.log(err)
    })
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