
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import { AuthProvider } from "../contexts/AuthContext"  //共有用
import AuthFirebaseRoute from './AuthFirebaseRoute' //ログイン認証

//認証なし
import Signup from "./Signup"
import Home from "./Home"
import Login  from "./Login"
import ForgotPassword  from "./ForgotPassword"

//認証あり
import Dashboard  from "./Dashboard"
import UpdateProfile  from "./UpdateProfile"



//テスト用なのであとで消す
import UpLoadTest  from "./UpLoadTest"
import {Index as screensIndex }  from "./screens/Index"
import {Edit as screensEdit }  from "./screens/Edit"
import {Index as chatIndex }  from "./chat/Index"
import {TextInput as chatTextInput }  from "./chat/TextInput"



function App() {
  return (
    <>
    <Router>
      <AuthProvider>
        <Switch>
          <Route path="/signup" component={Signup} />
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/forgotPassword" component={ForgotPassword} />



          <AuthFirebaseRoute path="/dashboard" component={Dashboard} />
          <AuthFirebaseRoute path="/upLoadTest" component={UpLoadTest} />
          <AuthFirebaseRoute path="/UpdateProfile" component={UpdateProfile} />

          <AuthFirebaseRoute path="/chat/index" component={chatIndex} />
          <AuthFirebaseRoute path="/chat/textinput" component={chatTextInput} />


          <Route path="/screens/index" component={screensIndex} />
          <Route path="/screens/edit/:docId" component={screensEdit} />
          <Route path="/screens/edit" component={screensEdit} />



        </Switch>
      </AuthProvider>
    </Router>
    </>
  );
}

export default App;
