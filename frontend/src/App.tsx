
import { Route, Routes } from 'react-router-dom'

import { GoogleOAuthProvider } from "@react-oauth/google";
import UserSignup from './pages/userSignup.tsx'
import LoginPage from './pages/userLogin.tsx'
import ForgotPassword from './pages/forgetPassword.tsx';
import Dashboard from './pages/userPages/dashboard.tsx';
import EachGroup from './pages/userPages/eachGroup.tsx';
import Header from './components/header.tsx';
import JoinGroups from './pages/userPages/joinGroups.tsx';
import ProfilePage from './pages/userPages/profilePage.tsx';
import LiveRoom from './pages/userPages/liveCoding.tsx';


const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID; // apna Google client ID

function App() {
 

  return (
   <>
   <Header/>
   <GoogleOAuthProvider clientId={clientId}>
        <Routes>
            <Route path='/register' element={<UserSignup/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/forgetPassword' element={<ForgotPassword/>}/>

            <Route path='/user' >
                <Route path='dashboard' element={<Dashboard/>}/>
                <Route path=':id' element={<EachGroup/>}/>
                <Route path='joinGroups' element={<JoinGroups/>}/>
                <Route path='profileDetails' element={<ProfilePage/>}/>
                <Route path=':groupId/live' element={<LiveRoom/>}/>
            </Route>
        </Routes>
   </GoogleOAuthProvider>
    
   </>
  )
}

export default App
