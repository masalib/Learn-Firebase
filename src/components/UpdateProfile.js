import React, { useState,useReducer, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
    Typography,
    Paper,
    Button,
    TextField
  } from '@material-ui/core';

import { useAuth } from "../contexts/AuthContext"
import { Link , useHistory} from "react-router-dom"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
        padding: 16, 
        margin: 'auto',
        maxWidth: 480
    },
    signupBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1,
      color:'primary'
    },
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

const UpdateProfile = () => {
    const { currentUser, updatePassword, updateEmail,sendEmailVerification} = useAuth()
    const classes = useStyles();
    //const email = currentUser.email
    const [state, dispatch] = useReducer(reducer, {...initialState, username:currentUser.email});

    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const { register, handleSubmit, errors ,formState} = useForm();
    const history = useHistory()

    useEffect(() => {
            if (state.password.trim() !== state.passwordconfirm.trim()){
                //clearErrors() 
                dispatch({
                    type: "setIsButtonDisabled",
                    payload: true
                });        
            } else if (state.username.trim()){
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

    async function handleUpdateProfile (data) {  //react-hook-formを導入したためevent -> dataに変更
        //event.preventDefault()      //react-hook-formを導入したため削除

            setError("")
            setSuccessMessage("")
            //sing up ボタンの無効化
            dispatch({
                type: "setIsButtonDisabled",
                payload: true
            });

            //処理の初期化
            const promises = []

            //更新処理をセット
            if (state.username !== currentUser.email) {
                console.log("updateEmail")
                promises.push(updateEmail(state.username))
            }
            if (state.password) {
                console.log("updatePassword")
                promises.push(updatePassword(state.password))
            }

            Promise.all(promises)
            .then(() => {

                setSuccessMessage("プロフィールを更新しました。ダッシュボードにリダレクトします")
                //ボタンの有効化
                dispatch({
                    type: "setIsButtonDisabled",
                    payload: false
                });
                //history.push("/")
                setTimeout(function(){
                    console.log("リダレクト処理")
                    history.push("/dashboard")
                },2000);
                
            })
            .catch((e) => {
                console.log(e)

                switch (e.code) {
                    case "auth/network-request-failed":
                        setError("通信がエラーになったのか、またはタイムアウトになりました。通信環境がいい所で再度やり直してください。");
                        break;
                    case "auth/weak-password":	
                        setError("パスワードが正しくないです。");
                        break;
                    case "auth/invalid-email":	
                        setError("メールアドレスが正しくないです。");
                        break;
                    case "auth/requires-recent-login":	
                        setError("別の端末でログインしているか、セッションが切れたので再度、ログインしてください。(ログインページにリダイレクトします）");
                        setTimeout(function(){
                            console.log("リダレクト処理")
                            history.push("/login")
                        },3000);
                        break;
                    case "auth/user-disabled":	
                        setError("入力されたメールアドレスは無効（BAN）になっています。");
                        break;                    
                    default:	//想定外
                        setError("失敗しました。通信環境がいい所で再度やり直してください。");
                    }

                //ボタンの有効化
                dispatch({
                    type: "setIsButtonDisabled",
                    payload: false
                });
            })
            .finally(() => {
                dispatch({
                    type: "setIsButtonDisabled",
                    payload: false
                });
            })
    };

    const handleUsernameChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        dispatch({
            type: "setUsername",
            payload: event.target.value
        });
    };

    const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        dispatch({
            type: "setPassword",
            payload: event.target.value
        });
    };

    const handlePasswordConfirmChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        dispatch({
            type: "setPasswordConfirm",
            payload: event.target.value
        });
    };

    async function handlesendEmailVerification() {
        setError("")
        try {
          await sendEmailVerification()
          setError("メールをおくりました。メール有効化をお願いします")

        } catch (e){
            console.log(e)
            setError("有効化メールの送信に失敗しました")
        }
      }


    //あとで原因を調べる。わからない場合は別のツールを検討する
    formState.isSubmitted = false   //一回submittedになるとレンダリングが遅くなり、変な動きするので強制的にfalseにする

    return (
        <div className={classes.container} >
            <Typography variant="h4" align="center" component="h1" gutterBottom>
                プロフィールの更新
            </Typography>
            <form  noValidate autoComplete="off">
                <Paper style={{ padding: 16 }}>
                    {error && <div style={{ color: "red" }}>{error}</div>}
                    {successMessage && <div variant="danger">{successMessage}</div>}
                    <TextField
                        error={state.isError}
                        fullWidth
                        id="username"
                        name="username"
                        type="email"
                        label="Email"
                        //placeholder="Email"
                        margin="normal"
                        value={state.username}
                        onChange={handleUsernameChange}
                        inputRef={register({pattern: /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/ })}
                    />
                    {errors.username?.type === "pattern" &&
                    <div style={{ color: "red" }}>メールアドレスの形式で入力されていません</div>}
                    {!currentUser.emailVerified && <div>メールアドレスが有効化されていません{' '}<Button onClick={handlesendEmailVerification} variant="contained" color="primary">有効化</Button></div>}

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
                        inputRef={register({  minLength: 6 })}
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
                        inputRef={register}
                    />
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        color="primary"
                        className={classes.signupBtn}
                        onClick={handleSubmit(handleUpdateProfile)}
                        disabled={state.isButtonDisabled}
                    >
                        プロフィールを更新
                    </Button>
                </Paper>
                <Typography paragraph>
                    ※表示名とアバター以外は公表される事はありません
                </Typography>
                <Typography paragraph>
                   <Link to="/dashboard">dashboard</Link>に戻る
                </Typography>

            </form>
        </div>
    );
};

export default UpdateProfile;
