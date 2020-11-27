
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

        </Switch>
      </AuthProvider>
    </Router>
    </>
  );
}

export default App;
