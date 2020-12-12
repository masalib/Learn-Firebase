import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext"
import  firebase, {Google} from "../../firebase"
import { useHistory} from "react-router-dom"
import { Button,} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        googleBtn: {
            flexGrow: 1
        },
        googleloginBtn: {
            marginTop: theme.spacing(2),
            flexGrow: 1
        },
        googleIcon: {
            fontSize: "1.5rem",
        },
    })
);

export const GoogleSingUpLogin = (props) => {
    const classes = useStyles();//Material-ui
    const history = useHistory()
    const [googleMessage, setGoogleMessage] = useState("")
    async function handleGoogleSignup (event) {  
        console.log("handleGoogleSignup")
        Google.setCustomParameters({
            prompt: 'select_account', // 追加
        });
        setGoogleMessage("認証中")
        firebase
            .auth()
            .signInWithPopup(Google)
            .then((result) => {
                console.log(result);
                setGoogleMessage("認証に成功しました。ダッシュボードにリダレクトします")
                setTimeout(function(){
                    console.log("リダレクト処理")
                    history.push("/dashboard")
                },1000);
            }).catch(function(error) {
                switch (error.code) {
                    case "auth/network-request-failed":
                        setGoogleMessage("通信がエラーになったのか、またはタイムアウトになりました。通信環境がいい所で再度やり直してください。");
                        break;
                    case "auth/credential-already-in-use":	
                        setGoogleMessage("他のユーザーでGoogle認証しているため、認証ができませんでした。");
                        break;
                    case "auth/user-disabled":	
                        setGoogleMessage("入力されたアカウントまたはメールアドレスは無効（BAN）になっています。");
                        break;
                    case "auth/requires-recent-login":	
                        setGoogleMessage("別の端末でログインしているか、セッションが切れたので再度、ログインしてください。(ログインページにリダイレクトします）");
                        setTimeout(function(){
                            console.log("リダレクト処理")
                            history.push("/login")
                        },3000);
                        break;
                    default:	//想定外
                        setGoogleMessage("失敗しました。通信環境がいい所で再度やり直してください。");
                }
            });
    }
    return (
        <>
            {googleMessage && <div style={{ color: "red" }}>{googleMessage}</div>}
            <Button
                fullWidth
                variant="contained"
                size="large"
                color="primary"
                className={classes.googleloginBtn}
                onClick={handleGoogleSignup}
            >
                <FontAwesomeIcon className={classes.googleIcon}  icon={faGoogle} />{props.title}
            </Button>
        </>
    )
}

export const GoogleLink = () => {
    const classes = useStyles();//Material-ui
    const [isGoogleLink, setIsGoogleLink] = useState(false)
    const [googleMessage, setGoogleMessage] = useState("")
    const { currentUser, } = useAuth() 
    const history = useHistory()

    useEffect(() => {
        async function fetchData() { 
            //providerData Linkチェック
            setIsGoogleLink(false)
            currentUser.providerData.forEach(element => {
                if (element.providerId === "google.com" ){
                    setIsGoogleLink(true)
                }
            });
        }
        fetchData();
    },[currentUser]);

    function handleGoogleUnLink () {  
        console.log("handleGoogleUnLink")
        setGoogleMessage("")
        currentUser.unlink("google.com").then(function() {
            setGoogleMessage("Googleとのリンクを解除しました")
            setIsGoogleLink(false)
        }).catch(function(error) {
            console.log(error)
            switch (error.code) {
                case "auth/network-request-failed":
                    setGoogleMessage("通信がエラーになったのか、またはタイムアウトになりました。通信環境がいい所で再度やり直してください。");
                    break;
                case "auth/credential-already-in-use":	
                    setGoogleMessage("他のユーザーでGoogle認証しているため、認証ができませんでした。");
                    break;
                case "auth/requires-recent-login":	
                    setGoogleMessage("別の端末でログインしているか、セッションが切れたので再度、ログインしてください。(ログインページにリダイレクトします）");
                    setTimeout(function(){
                        console.log("リダレクト処理")
                        history.push("/login")
                    },3000);
                    break;
                default:	//想定外
                    setGoogleMessage("失敗しました。通信環境がいい所で再度やり直してください。");
            }
        });
    }

    async function handleGoogleLinkWithPopup (event) {  
        console.log("handleGoogleLinkWithPopup")
        setGoogleMessage("")
        Google.setCustomParameters({
            prompt: 'select_account', // 追加
        });
        currentUser.linkWithPopup(Google).then(function(result) {
            console.log("handleGoogleLinkWithPopup:result",result)
            setGoogleMessage("Googleとリンクしました")
            setIsGoogleLink(true)
        }).catch(function(error) {
            // Handle Errors here.
            switch (error.code) {
                case "auth/network-request-failed":
                    setGoogleMessage("通信がエラーになったのか、またはタイムアウトになりました。通信環境がいい所で再度やり直してください。");
                    break;
                case "auth/credential-already-in-use":	
                    setGoogleMessage("他のユーザーでGoogle認証しているため、認証ができませんでした。");
                    break;
                case "auth/requires-recent-login":	
                    setGoogleMessage("別の端末でログインしているか、セッションが切れたので再度、ログインしてください。(ログインページにリダイレクトします）");
                    setTimeout(function(){
                        console.log("リダレクト処理")
                        history.push("/login")
                    },3000);
                    break;
                default:	//想定外
                    setGoogleMessage("失敗しました。通信環境がいい所で再度やり直してください。");
            }
            console.log(error)
            // ...
        });
    }


    return (
        <>
            {googleMessage && <div style={{ color: "red" }}>{googleMessage}</div>}
            {isGoogleLink && 
                <>
                    <FontAwesomeIcon className={classes.googleIcon}  icon={faGoogle} />Google:{' '}{' '}{' '}認証されています
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        color="primary"
                        className={classes.googleBtn}
                        onClick={handleGoogleUnLink}
                        >
                        認証を解除する
                    </Button>
                </>
            }
            {!isGoogleLink && 
                <>
                    <FontAwesomeIcon className={classes.googleIcon}  icon={faGoogle} />Google:{' '}{' '}{' '}認証されていません
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        color="primary"
                        className={classes.googleBtn}
                        onClick={handleGoogleLinkWithPopup}
                        >
                        認証する
                    </Button>
                </>
            }
        </>
    )
}


