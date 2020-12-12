import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext"
import  firebase, {Twitter} from "../../firebase"
import { useHistory} from "react-router-dom"
import TwitterIcon from '@material-ui/icons/Twitter';
import { Button,} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        twitterBtn: {
            flexGrow: 1
        },
        twitterloginBtn: {
            marginTop: theme.spacing(2),
            flexGrow: 1
        },
    })
);

export const TwitterSingUpLogin = (props) => {
    const classes = useStyles();//Material-ui
    const history = useHistory()
    const [twitterMessage, setTwitterMessage] = useState("")
    async function handleTwitterSignup (event) {  
        console.log("handleTwitterSignup")
        Twitter.setCustomParameters({
            prompt: 'select_account', // 追加
        });
        firebase
            .auth()
            .signInWithPopup(Twitter)
            .then((result) => {
                console.log(result);
                setTwitterMessage("認証に成功しました。ダッシュボードにリダレクトします")
                setTimeout(function(){
                    console.log("リダレクト処理")
                    history.push("/dashboard")
                },1000);
            }).catch(function(error) {
                switch (error.code) {
                    case "auth/network-request-failed":
                        setTwitterMessage("通信がエラーになったのか、またはタイムアウトになりました。通信環境がいい所で再度やり直してください。");
                        break;
                    case "auth/credential-already-in-use":	
                        setTwitterMessage("他のユーザーでGoogle認証しているため、認証ができませんでした。");
                        break;
                    case "auth/user-disabled":	
                        setTwitterMessage("入力されたアカウントまたはメールアドレスは無効（BAN）になっています。");
                        break;
                    case "auth/requires-recent-login":	
                        setTwitterMessage("別の端末でログインしているか、セッションが切れたので再度、ログインしてください。(ログインページにリダイレクトします）");
                        setTimeout(function(){
                            console.log("リダレクト処理")
                            history.push("/login")
                        },3000);
                        break;
                    default:	//想定外
                        setTwitterMessage("失敗しました。通信環境がいい所で再度やり直してください。");
                }
            });
    }
    return (
        <>
            {twitterMessage && <div style={{ color: "red" }}>{twitterMessage}</div>}
            <Button
                fullWidth
                variant="contained"
                size="large"
                color="primary"
                className={classes.twitterloginBtn}
                onClick={handleTwitterSignup}
            >
                <TwitterIcon />{props.title}
            </Button>
        </>
    )
}

export const TwitterLink = () => {
    const classes = useStyles();//Material-ui
    const [isTwitterLink, setIsTwitterLink] = useState(false)
    const [twitterMessage, setTwitterMessage] = useState("")
    const { currentUser, } = useAuth() 
    const history = useHistory()

    useEffect(() => {
        async function fetchData() { 
            //providerData Linkチェック
            setIsTwitterLink(false)
            currentUser.providerData.forEach(element => {
                if (element.providerId === "twitter.com" ){
                    setIsTwitterLink(true)
                }
            });
        }
        fetchData();
    },[currentUser]);

    function handleTwitterUnLink () {  
        console.log("handleTwitterUnLink")
        setTwitterMessage("")
        currentUser.unlink("twitter.com").then(function() {
            setTwitterMessage("Twitterとのリンクを解除しました")
            setIsTwitterLink(false)
        }).catch(function(error) {
            console.log(error)
            switch (error.code) {
                case "auth/network-request-failed":
                    setTwitterMessage("通信がエラーになったのか、またはタイムアウトになりました。通信環境がいい所で再度やり直してください。");
                    break;
                case "auth/credential-already-in-use":	
                    setTwitterMessage("他のユーザーでTwitter認証しているため、認証ができませんでした。");
                    break;
                case "auth/requires-recent-login":	
                    setTwitterMessage("別の端末でログインしているか、セッションが切れたので再度、ログインしてください。(ログインページにリダイレクトします）");
                    setTimeout(function(){
                        console.log("リダレクト処理")
                        history.push("/login")
                    },3000);
                    break;
                default:	//想定外
                    setTwitterMessage("失敗しました。通信環境がいい所で再度やり直してください。");
            }
        });
    }

    async function handleTwitterLinkWithPopup (event) {  
        console.log("handleTwitterLinkWithPopup")
        setTwitterMessage("")
        Twitter.setCustomParameters({
            prompt: 'select_account', // 追加
        });
        currentUser.linkWithPopup(Twitter).then(function(result) {
            console.log("handleTwitterLinkWithPopup:result",result)
            setTwitterMessage("Twitterとリンクしました")
            setIsTwitterLink(true)
        }).catch(function(error) {
            // Handle Errors here.
            switch (error.code) {
                case "auth/network-request-failed":
                    setTwitterMessage("通信がエラーになったのか、またはタイムアウトになりました。通信環境がいい所で再度やり直してください。");
                    break;
                case "auth/credential-already-in-use":	
                    setTwitterMessage("他のユーザーでTwitter認証しているため、認証ができませんでした。");
                    break;
                case "auth/requires-recent-login":	
                    setTwitterMessage("別の端末でログインしているか、セッションが切れたので再度、ログインしてください。(ログインページにリダイレクトします）");
                    setTimeout(function(){
                        console.log("リダレクト処理")
                        history.push("/login")
                    },3000);
                    break;
                default:	//想定外
                    setTwitterMessage("失敗しました。通信環境がいい所で再度やり直してください。");
            }
            console.log(error)
            // ...
        });
    }


    return (
        <>
            {twitterMessage && <div style={{ color: "red" }}>{twitterMessage}</div>}
            {isTwitterLink && 
                <>
                    <TwitterIcon />Twitter:{' '}{' '}{' '}認証されています
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        color="primary"
                        className={classes.twitterBtn}
                        onClick={handleTwitterUnLink}
                        >
                        認証を解除する
                    </Button>
                </>
            }
            {!isTwitterLink && 
                <>
                    <TwitterIcon />Twitter:{' '}{' '}{' '}認証されていません
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        color="primary"
                        className={classes.twitterBtn}
                        onClick={handleTwitterLinkWithPopup}
                        >
                        認証する
                    </Button>
                </>
            }
        </>
    )
}


