import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import LoginPage from './pages/Login'


function App() {


  return (
    <>
      <BrowserRouter>
      <Routes>
        //login route
        <Route path='/login' element={<LoginPage/>}/>
        
        //root
        <Route path='/' element={<Home/>}/>
        
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
