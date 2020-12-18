import React ,{ useState }from 'react'
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import SendIcon from '@material-ui/icons/Send';
import Button from '@material-ui/core/Button';
import { useAuth } from "../../contexts/AuthContext"
import {database} from "../../firebase"
import moment from 'moment';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapForm : {
        display: "flex",
        justifyContent: "center",
        width: "95%",
        margin: `${theme.spacing(0)} auto`
    },
    wrapText  : {
        width: "100%"
    },
    button: {
        //margin: theme.spacing(1),
    },
  })
);

export const TextInput = () => {
    const [message, setMessage] = useState("")
    const { currentUser} = useAuth()   //Firebaseの共通変数と変更などの関数
    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.keyCode === 13 || event.which === 13) {
            event.preventDefault()
            if (message === ""){
            } else {
                //console.log("handleKeyPress")
                handleMessageData()  
            }
        }
    };

    async function handleMessageData () {
        if (message === ""){
            console.log("message nothing")
        } else {
            console.log("handleMessageData start ")
            const displayName = currentUser.displayName ? currentUser.displayName : "名無しさん"
            const photoURL = currentUser.photoURL ? currentUser.photoURL : "/dummy.jpg"
            const uid = currentUser.uid ? currentUser.uid : "Guest"//本来ありえない
            //let timestamp = firebase.firestore.FieldValue.serverTimestamp()
            let timestamp = moment()
            //console.log(timestamp.format())
            database.ref('messages/' + timestamp.format('YYYYMMDDHHmmss') + uid ).set({
                uid: uid,
                displayName: displayName,
                photoURL : photoURL,
                message : message,
                createAt : timestamp.format('YYYY-MM-DD HH:mm:ss')
            }, (error) => {
                    if (error) {
                        console.log("error")
                        setMessage("errorになりました")
                    } else {
                        console.log("success")
                        setMessage("")
                    }
                }
            );
            
        }
    }


    const classes = useStyles();
    return (
        <>
            <form className={classes.wrapForm}  noValidate autoComplete="off">
            <TextField
                id="standard-text"
                label="メッセージを入力"
                className={classes.wrapText}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <Button variant="contained" color="primary" className={classes.button} onClick={handleMessageData}  >
                <SendIcon />
            </Button>
            </form>
        </>
    )
}



