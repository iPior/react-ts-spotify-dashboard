import {useEffect, useState} from 'react'
import axios from 'axios'

export default function Dashboard() {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();

  // maybe move this to Login ??
  useEffect(()=>{
    axios.get("http://localhost:8080/tokens")
    .then(response => {
      setAccessToken(response.data.accessToken);
      localStorage.setItem('access_token', response.data.accessToken);
      setRefreshToken(response.data.setRefreshToken);
      localStorage.setItem('refresh_token', response.data.refreshToken);
    })
    .catch(err => {
      console.log(err)
    })
  },[])

  useEffect(() => {
    if (!accessToken) return;
    
    console.log("am i in here yet?")
  },[accessToken])


  return (
    <div>You made it!</div>
  )
}
