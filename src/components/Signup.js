import React, { useState,useReducer, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import Button from "@material-ui/core/Button";
import { useAuth } from "../contexts/AuthContext"
import { Link , useHistory} from "react-router-dom"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap",
      width: 400,
      margin: `${theme.spacing(0)} auto`
    },
    signupBtn: {
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
  passwordconfirm:  string,
  isButtonDisabled: boolean,
  helperText: string,
  isError: boolean
};


const initialState: State = {
  username: "",
  password: "",
  passwordconfirm: "",
  isButtonDisabled: true,
  helperText: "",
  isError: false
};

type Action =
  | { type: "setUsername", payload: string }
  | { type: "setPassword", payload: string }
  | { type: "setPasswordConfirm", payload: string }
  | { type: "setIsButtonDisabled", payload: boolean }
  | { type: "signupSuccess", payload: string }
  | { type: "signupFailed", payload: string }
  | { type: "setIsError", payload: boolean };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "setUsername":
      return {
        ...state,
        username: action.payload
      };
    case "setPassword":
      return {
        ...state,
        password: action.payload
      };
    case "setPasswordConfirm":
    return {
        ...state,
        passwordconfirm: action.payload
    };
    case "setIsButtonDisabled":
      return {
        ...state,
        isButtonDisabled: action.payload
      };
    case "signupSuccess":
      return {
        ...state,
        helperText: action.payload,
        isError: false
      };
    case "signupFailed":
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

const Signup = () => {
    const classes = useStyles();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const { signup } = useAuth()
    const { register, handleSubmit, errors, trigger  } = useForm();
    const history = useHistory()

    useEffect(() => {
            if (state.password.trim() !== state.passwordconfirm.trim()){
                //clearErrors() 
                dispatch({
                  type: "setIsButtonDisabled",
                  payload: true
                });        
            } else if (state.username.trim() && state.password.trim()){
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
    }, [state.username, state.password, state.passwordconfirm]);

    async function handleSignup (data) {  //react-hook-formを導入したためevent -> dataに変更
        //event.preventDefault()      //react-hook-formを導入したため削除

        try {
            setError("")
            setSuccessMessage("")
            //sing up ボタンの無効化
            dispatch({
                type: "setIsButtonDisabled",
                payload: true
            });

            await signup(state.username, state.passwordconfirm)
            dispatch({
                type: "signupSuccess",
                payload: "Signup Successfully"
            });

            //sing up ボタンの有効化
            dispatch({
                type: "setIsButtonDisabled",
                payload: false
            });
            setSuccessMessage("アカウントの作成に成功しました。ダッシュボードにリダレクトします")
            setTimeout(function(){
                console.log("リダレクト処理")
                history.push("/dashboard")
            },2000);

        } catch (e){
            //エラーのメッセージの表示
            switch (e.code) {
                case "auth/network-request-failed":
                    setError("通信がエラーになったのか、またはタイムアウトになりました。通信環境がいい所で再度やり直してください。");
                    break;
                case "auth/weak-password":	//バリデーションでいかないようにするので、基本的にはこのコードはこない
                    setError("パスワードが短すぎます。6文字以上を入力してください。");
                    break;
                case "auth/invalid-email":	//バリデーションでいかないようにするので、基本的にはこのコードはこない
                    setError("メールアドレスが正しくありません");
                    break;
                case "auth/email-already-in-use":
                    setError("メールアドレスがすでに使用されています。ログインするか別のメールアドレスで作成してください");
                    break;
                default:	//想定外
                    setError("アカウントの作成に失敗しました。通信環境がいい所で再度やり直してください。");
            }
            //dispatch({
            //    type: "signupFailed",
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
              handleSignup()  
            }
          }
        }
    };

    async function handleKeyPresstrigger () {
      const result = await trigger();
      return result

    }

    const handleUsernameChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    dispatch({
      type: "setUsername",
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

  const handlePasswordConfirmChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    dispatch({
      type: "setPasswordConfirm",
      payload: event.target.value
    });
  };

  return (
    <form className={classes.container} noValidate autoComplete="off">
      <Card className={classes.card}>
        <CardHeader className={classes.header} title="Sign UP " />
        <CardContent>
        <div>
            {error && <div style={{ color: "red" }}>{error}</div>}
            {successMessage && <div variant="danger">{successMessage}</div>}
            <TextField
                error={state.isError}
                fullWidth
                id="username"
                name="username"
                type="email"
                label="Username"
                placeholder="Username"
                margin="normal"
                onChange={handleUsernameChange}
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
            <TextField
                error={state.isError}
                fullWidth
                id="password-confirm"
                name="password-confirm"
                type="password"
                label="Password-confirm"
                placeholder="Password-confirm"
                margin="normal"
                onChange={handlePasswordConfirmChange}
                onKeyPress={handleKeyPress}
                inputRef={register}
            />
          </div>
          もしアカウントがあるなら<Link to="/login">こちら</Link>からログインしてください
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            className={classes.signupBtn}
            onClick={handleSubmit(handleSignup)}
            disabled={state.isButtonDisabled}
          >
            Signup
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

export default Signup;
