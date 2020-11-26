import Signup from "./Signup"
import Home from "./Home"
import Dashboard  from "./Dashboard"
import Login  from "./Login"

import ForgotPassword  from "./ForgotPassword"

import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import AuthFirebaseRoute from './AuthFirebaseRoute'

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

        </Switch>
      </AuthProvider>
    </Router>
    </>
  );
}

export default App;
