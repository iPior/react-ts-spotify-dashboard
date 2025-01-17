import {useEffect, useState} from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router';

export default function Dashboard() {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"));
  const [profileUrl, setProfileUrl] = useState("")
  const [profileName, setProfileName] = useState("")
  const navigate = useNavigate();

  // maybe move this to Login ??
  useEffect(()=>{
    if (accessToken){
      axios.get("http://localhost:8080/refresh")
      .then(response => {
        setAccessToken(response.data.accessToken);
        localStorage.setItem('access_token', response.data.accessToken);
      })
      .catch(err => {
        console.log(err)
      })
    } else {
    axios.get("http://localhost:8080/tokens")
    .then(response => {
      setAccessToken(response.data.accessToken);
      localStorage.setItem('access_token', response.data.accessToken);
    })
    .catch(err => {
      console.log(err)
    })
    }
  },[])

  useEffect(() => {
    if (!accessToken) return;
    console.log("am i in here yet?")
    
    axios.get("http://localhost:8080/getdata")
    .then(response => {
      setProfileName(response.data.displayName)
      setProfileUrl(response.data.profilePic)
    })
    .catch(err => {
      console.log(err)
    })

  },[accessToken])

    const handleButton = () => {
      localStorage.removeItem("access_token")
      axios.get("http://localhost:8080/clear")
      navigate('/');
    }

  return (
    <div>
      <h1>You made it {profileName}!</h1>
      <img src={profileUrl}></img>
      <Button
        onClick={handleButton}
      >
        <a> Log out</a>
      </Button>
    </div>
    
  )
}
