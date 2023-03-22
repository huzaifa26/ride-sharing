import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/Layout/Navbar"
import Driver from "./components/Signup/Driver"
import Parent from "./components/Signup/Parent"
import Type from "./components/Signup/Type"
import Login from "./pages/Login"
import Signup from "./pages/Signup"


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar/>}>
            <Route index element={<Login />}></Route>
            <Route path="signup" element={<Signup />}>
              <Route index element={<Type/>}></Route>
              <Route path="parent" element={<Parent/>}></Route>
              <Route path="driver" element={<Driver/>}></Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
