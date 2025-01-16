import Dashboard from './components/Dashboard';
import Login from './components/Login'
import { Routes, Route } from "react-router";


function App() {

  return (
    <>
      <div 
        className='w-screen h-screen'
      >
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      </div>
    </>
  )
}

export default App
