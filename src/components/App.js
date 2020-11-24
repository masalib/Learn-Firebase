import Signup from "./Signup"
import Home from "./Home"
import Dashboard  from "./Dashboard"
import Login  from "./Login"


import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

function App() {
  return (
    <>
    <Router>
      <AuthProvider>
        <Switch>
          <Route path="/signup" component={Signup} />
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </AuthProvider>
    </Router>
    </>
  );
}

export default App;
