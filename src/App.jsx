import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/Layout/Navbar"
import CompleteProfile from "./components/Signup/CompleteProfile"
import Driver from "./components/Signup/Driver"
import Parent from "./components/Signup/Parent"
import Type from "./components/Signup/Type"
import Protected from "./components/Utils/Protected"
import BookRide from "./pages/BookRide"
import DriverRide from "./pages/DriverRide"
import HistoryPage from "./pages/HistoryPage"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import Signup from "./pages/Signup"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route index element={<Login />}></Route>
            <Route path="signup" element={<Signup />}>
              <Route index element={<Type />}></Route>
              <Route path="parent" element={<Parent />}></Route>
              <Route path="driver" element={<Driver />}></Route>
            </Route>
            <Route path="/" element={<Protected />}>
              <Route path="complete-profile" element={<CompleteProfile />}></Route>
              <Route path="book-ride" element={<BookRide />}></Route>
              <Route path="rides" element={<DriverRide />}></Route>
              <Route path="history-page" element={<HistoryPage />}></Route>
              <Route path="profile" element={<Profile />}></Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
