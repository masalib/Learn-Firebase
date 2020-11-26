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
import { Link } from "react-router-dom"


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap",
      width: 400,
      margin: `${theme.spacing(0)} auto`
    },
    forgotBtn: {
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
  isButtonDisabled: boolean,
  helperText: string,
  isError: boolean
};

const initialState: State = {
  username: "",
  isButtonDisabled: true,
  helperText: "",
  isError: false
};

type Action =
  | { type: "setUsername", payload: string }
  | { type: "setIsButtonDisabled", payload: boolean }
  | { type: "setIsError", payload: boolean };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "setUsername":
      return {
        ...state,
        username: action.payload
      };
    case "setIsButtonDisabled":
      return {
        ...state,
        isButtonDisabled: action.payload
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

const ForgotPassword = () => {
    const classes = useStyles();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const { resetPassword } = useAuth()
    const { register, handleSubmit, errors  } = useForm();

    useEffect(() => {
      if (state.username.trim() ){
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
    }, [state.username]);

    async function handleForgotPassword (data) {  //react-hook-formを導入したためevent -> dataに変更
        //event.preventDefault()      //react-hook-formを導入したため削除

        try {
            setError("")
            setSuccessMessage("")
            //ボタンの無効化
            dispatch({
                type: "setIsButtonDisabled",
                payload: true
            });

            //FirebaseのメールテンプレートがJP（日本語）になっている事が前提です。
            //メールテンプレートで

            await resetPassword(state.username)
            setSuccessMessage("パスワードを初期化しました。")

            dispatch({
                type: "setIsButtonDisabled",
                payload: false
            });

        } catch (e){
            //エラーのメッセージの表示
            console.log(e)
            switch (e.code) {
                case "auth/network-request-failed":
                    setError("通信がエラーになったのか、またはタイムアウトになりました。通信環境がいい所で再度やり直してください。");
                    break;
                case "auth/invalid-email":	
                    setError("メールアドレスが間違えています。");
                    break;
                case "auth/user-not-found":	
                    setError("メールアドレスが間違えています。");
                    break;
                case "auth/user-disabled":	
                    setError("入力されたメールアドレスは無効（BAN）になっています。");
                    break;                    
                default:	//想定外
                    setError("処理に失敗しました。通信環境がいい所で再度やり直してください。");
            }
            //ボタンの有効化
            dispatch({
                type: "setIsButtonDisabled",
                payload: false
            });
            
        }
    };

  const handleUsernameChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    dispatch({
      type: "setUsername",
      payload: event.target.value
    });
  };

  return (
    <form className={classes.container} noValidate autoComplete="off">
      <Card className={classes.card}>
        <CardHeader className={classes.header} title="ForgotPassword" />
        <CardContent>
        <div>

            <div>登録されてメールアドレスのパスワードを初期化します。メールアドレスを入力してください。</div>
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
                inputRef={register({pattern: /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/ })}
            />
            {errors.username?.type === "pattern" &&
            <div style={{ color: "red" }}>メールアドレスの形式で入力されていません</div>}
          </div>
          もしアカウントがないなら<Link to="/signup">こちら</Link>からアカウントを作成してください
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            className={classes.forgotBtn}
            onClick={handleSubmit(handleForgotPassword)}
            disabled={state.isButtonDisabled}
          >
            Reset Password
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

export default ForgotPassword;
