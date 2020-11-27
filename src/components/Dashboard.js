import React, { useState }  from 'react'
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap",
      width: 400,
      margin: `${theme.spacing(0)} auto`
    },
    logoutBtn: {
      margin: theme.spacing(2),
      flexGrow: 1
    },
    header: {
      textAlign: "center",
      background: "#212121",
      color: "#fff"
    },
    card: {
      marginTop: theme.spacing(10)
    }
  })
);


const Dashboard = () => {
    const classes = useStyles();
    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const history = useHistory()
  
    async function handleLogout() {
      setError("")
  
      try {
        await logout()
        history.push("/")
      } catch {
        setError("Failed to log out")
      }
    }

      return (
        <div>
            Dashboard
            テスト用のリンク（あとで治す）
            {error && <div style={{ color: "red" }}>{error}</div>}
            <strong>Email:</strong> {currentUser.email}

            <h2>
                <Link to="/UpdateProfile">UpdateProfile</Link>
            </h2>

            <h2>
                <Link to="/upLoadTest">upLoadTest</Link>
            </h2>

            <div>
                <Button
                variant="contained"
                size="large"
                color="secondary"
                className={classes.logoutBtn}
                onClick={handleLogout}
            >
                    Logout
                </Button>

            </div>
        </div>
    )
}

export default Dashboard
