import React, { useState,useReducer, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Button from "@material-ui/core/Button";
import { useAuth } from "../contexts/AuthContext"
import { Link , useHistory} from "react-router-dom"
import {TwitterSingUpLogin }  from "./firebaseprovider/Twitter"
import {GoogleSingUpLogin }  from "./firebaseprovider/Google"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap",
      width: 400,
      margin: `${theme.spacing(0)} auto`
    },
    loginBtn: {
      marginTop: theme.spacing(2),
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

//state type
type State = {
  username: string,
  password:  string,
  isButtonDisabled: boolean,
  helperText: string,
  isError: boolean
};


const initialState: State = {
  username: "",
  password: "",
  isButtonDisabled: true,
  helperText: "",
  isError: false
};

type Action =
  | { type: "setEmail", payload: string }
  | { type: "setPassword", payload: string }
  | { type: "setIsButtonDisabled", payload: boolean }
  | { type: "loginSuccess", payload: string }
  | { type: "loginFailed", payload: string }
  | { type: "setIsError", payload: boolean };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "setEmail":
      return {
        ...state,
        username: action.payload
      };
    case "setPassword":
      return {
        ...state,
        password: action.payload
      };
    case "setIsButtonDisabled":
      return {
        ...state,
        isButtonDisabled: action.payload
      };
    case "loginSuccess":
      return {
        ...state,
        helperText: action.payload,
        isError: false
      };
    case "loginFailed":
      return {
        ...state,
        helperText: action.payload,
        isError: true
      };
    case "setIsError":
      return {
        ...state,
        isError: action.payload
      };
    default:
       return state;
  }
};

const Login = () => {
    const classes = useStyles();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [error, setError] = useState("")
    const { login } = useAuth()
    const { register, handleSubmit, errors, trigger  } = useForm();
    const history = useHistory()

    useEffect(() => {
      if (state.username.trim() && state.password.trim()){
          //trigger();
          dispatch({
            type: "setIsButtonDisabled",
            payload: false
          });
      } else {
          //clearErrors()
          dispatch({
            type: "setIsButtonDisabled",
            payload: true
          });
      }
    }, [state.username, state.password]);

    async function handleLogin (data) {  //react-hook-formを導入したためevent -> dataに変更
        //event.preventDefault()      //react-hook-formを導入したため削除

        try {
            setError("")
            //sing up ボタンの無効化
            dispatch({
                type: "setIsButtonDisabled",
                payload: true
            });

            await login(state.username, state.password)
            history.push("/dashboard")

        } catch (e){
            //エラーのメッセージの表示

            switch (e.code) {
                case "auth/network-request-failed":
                    setError("通信がエラーになったのか、またはタイムアウトになりました。通信環境がいい所で再度やり直してください。");
                    break;
                case "auth/weak-password":	
                    setError("メールアドレスまたはパスワードが間違えています。");
                    break;
                case "auth/invalid-email":	
                    setError("メールアドレスまたはパスワードが間違えています。");
                    break;
                case "auth/user-not-found":	
                    setError("メールアドレスまたはパスワードが間違えています。");
                    break;
                case "auth/user-disabled":	
                    setError("入力されたメールアドレスは無効（BAN）になっています。");
                    break;                    
                case "auth/wrong-password":	
                    setError("メールアドレスまたはパスワードが間違えています。");
                    break;                    
                default:	//想定外
                    setError("ログインに失敗しました。通信環境がいい所で再度やり直してください。");
                    console.log(e)
            }
            //dispatch({
            //    type: "loginFailed",
            //    payload: "Incorrect username or password"
            //});
            //sing up ボタンの有効化
            dispatch({
                type: "setIsButtonDisabled",
                payload: false
            });
            
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.keyCode === 13 || event.which === 13) {

          if (!state.isButtonDisabled){
            handleKeyPresstrigger()
            if (errors) {
              //errorメッセージを表示する
            } else {
              handleLogin()  
            }
          }
        }
    };

    async function handleKeyPresstrigger () {
      const result = await trigger();
      return result

    }

  const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    dispatch({
      type: "setEmail",
      payload: event.target.value
    });
  };

  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    dispatch({
      type: "setPassword",
      payload: event.target.value
    });
  };

  return (
    <form className={classes.container} noValidate autoComplete="off">
      <Card className={classes.card}>
        <CardHeader className={classes.header} title="Login" />
        <CardContent>
        <div>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <TextField
                error={state.isError}
                fullWidth
                id="username"
                name="username"
                type="email"
                label="Email"
                placeholder="Email"
                margin="normal"
                onChange={handleEmailChange}
                onKeyPress={handleKeyPress}
                inputRef={register({pattern: /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/ })}
            />
            {errors.username?.type === "pattern" &&
            <div style={{ color: "red" }}>メールアドレスの形式で入力されていません</div>}

            <TextField
                error={state.isError}
                fullWidth
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder="Password"
                margin="normal"
                onChange={handlePasswordChange}
                onKeyPress={handleKeyPress}
                inputRef={register({ required: true, minLength: 6 })}
            />
            {errors.password?.type === "minLength" &&
            <div style={{ color: "red" }}>パスワードは6文字以上で入力してください</div>}
          </div>
            もしアカウントがないなら<Link to="/signup">こちら</Link>からアカウントを作成してください。パスワードを忘れた方は<Link to="/forgotPassword">こちら</Link>から初期化をおこなってください
            <Button
              fullWidth
              variant="contained"
              size="large"
              color="secondary"
              className={classes.loginBtn}
              onClick={handleSubmit(handleLogin)}
              disabled={state.isButtonDisabled}
            >
              Login
            </Button>
            もしくは
            <TwitterSingUpLogin title="TwitterでLoginする"/>
            <GoogleSingUpLogin title="GoogleでLoginする"/>

          </CardContent>
      </Card>
    </form>
  );
};

export default Login;
