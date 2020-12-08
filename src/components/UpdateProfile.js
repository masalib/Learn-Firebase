import React, { useState,useReducer, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
    Typography,
    Paper,
    Button,
    TextField,
    Fab,
    Modal,
    Backdrop,
    CircularProgress,
    InputLabel,MenuItem,Select,
  } from '@material-ui/core';

import { useAuth } from "../contexts/AuthContext"
import { Link , useHistory} from "react-router-dom"
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import firebase , {db} from "../firebase"
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
        padding: 16, 
        margin: 'auto',
        maxWidth: 480
    },
    updateProfileBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1,
      color:'primary'
    },
    imagephotoURL: {
        width: "80%",
        margin: '10px',
        borderRadius: '50%'
    },
    inputFile: {
        display: "none"
    },
    subtitle2: {
        color:"#757575"
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    inputFilebtn: {
        position: "absolute",
        top: "80%",
        left: "55%",
    },


  })
);

//state type
type State = {
  username: string,
  password:  string,
  passwordconfirm:  string,
  displayName:  string,
  photoURL:  string,
  uid:  string,
  departmentId:  string,
  isButtonDisabled: boolean,
  helperText: string,
  isError: boolean
};


let initialState: State = {
  username: "",
  password: "",
  passwordconfirm: "",
  displayName: "",
  photoURL: "",
  uid:"",
  departmentId:"",
  isButtonDisabled: true,
  helperText: "",
  isError: false
};

let updatProfileData = {
    displayName: "",
    photoURL: ""
};


type Action =
  | { type: "setUsername", payload: string }
  | { type: "setPassword", payload: string }
  | { type: "setPasswordConfirm", payload: string }
  | { type: "setDisplayName", payload: string }
  | { type: "setPhotoURL", payload: string }
  | { type: "setDepartment", payload: string }
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
    case "setDisplayName":
    return {
        ...state,
        displayName: action.payload
    };
    case "setPhotoURL":
    return {
        ...state,
        photoURL: action.payload
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
    case "setDepartment":
    return {
        ...state,
        departmentId: action.payload + ""
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
    const { 
        currentUser,
        updatePassword,
        updateEmail,
        sendEmailVerification,
        updateProfile
    } = useAuth()   //Firebaseの共通変数と変更などの関数

    const classes = useStyles();//Material-ui

    //NULLだと@material-uiのButtonでエラーになったのでvalueに値をいれる
    currentUser.displayName ? initialState = {...initialState,displayName:currentUser.displayName} : initialState = {...initialState,displayName:""}
    currentUser.photoURL ? initialState = {...initialState,photoURL:currentUser.photoURL} : initialState = {...initialState,photoURL:""}
    currentUser.uid ? initialState = {...initialState,uid:currentUser.uid} : initialState = {...initialState,uid:""}

    //...initialStateはinitialStateの配列です。「,username:currentUser.email,displayName:currentUser.email」はinitialStateのusernameとdisplayNameだけを更新しています
    initialState = {...initialState,username:currentUser.email}

    const [state, dispatch] = useReducer(reducer, initialState);
    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const defaultSrc =  "";
    const [image, setImage] = useState(defaultSrc);
    const [cropper, setCropper] = useState();
    const [open, setOpen] = React.useState(false);      //モーダル用の変数
    const [openCircularProgress, setOpenCircularProgress] = React.useState(false);      //処理中みたいモーダル

    const { register, handleSubmit, errors ,formState} = useForm();
    const history = useHistory()
    const [departmentList, setDepartmentList] = useState([])
    const [expansionData, setExpansionData] = React.useState(false);      //拡張用のデータの有無
    const [expansionDocId, setExpansionDocId] = React.useState(false);      //拡張用のデータID


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

    useEffect(() => {
        async function fetchData() { 
            console.log("render")
            console.log(currentUser.uid)

            if (currentUser.uid){
                var query = await db.collection("members").where("uid", "==", currentUser.uid).get();
                console.log("query",query)
                console.log("query.empty",query.empty)

                if (!query.empty) {
                    //this.setState({
                    //    member: doc.data(),
                    //});

                    const result = query.docs.map(doc => doc.data());
                    console.log(result[0].departmentId)
                    dispatch({
                        type: "setDepartment",
                        payload: result[0].departmentId 
                    });
                    console.log("データ読み込み内部のrender")
                    setExpansionData(true)
                    setExpansionDocId(result[0].docId)

                } else {
                    console.log("データが存在しない")
                    setExpansionData(false)
                }
            }    
        }
        async function departmentData() { 
            const colRef = db.collection("departments")
            .orderBy('departmentId');

            const snapshots = await colRef.get();
            var docs = snapshots.docs.map(function (doc) {
                return doc.data();
            });
            setDepartmentList(docs)
        }
        departmentData();    //部署データ読み込み(セレクトボックスで使う方を先に読み込む)
        fetchData();
    },[currentUser.uid]);


    async function handleUpdateProfile (data) {  //react-hook-formを導入したためevent -> dataに変更
        //event.preventDefault()      //react-hook-formを導入したため削除

            setError("")
            setSuccessMessage("")
            //sing up ボタンの無効化
            dispatch({
                type: "setIsButtonDisabled",
                payload: true
            });
            setOpenCircularProgress(true);

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

            if (expansionData){
                let timestamp = firebase.firestore.FieldValue.serverTimestamp()
                promises.push(
                    db.collection("members").doc(expansionDocId).update({
                    uid: currentUser.uid,
                    displayName: state.displayName,
                    email: state.username,
                    photoURL:state.photoURL,
                    departmentId: state.departmentId,
                    updatedAt: timestamp,
                    })
                )
            } else {
                let timestamp = firebase.firestore.FieldValue.serverTimestamp()
                const docId = db.collection("members").doc().id;

                promises.push(
                    db.collection("members").doc(docId).set({
                        docId: docId,
                        uid: currentUser.uid,
                        displayName: state.displayName,
                        photoURL:state.photoURL,
                        email: state.username,
                        departmentId: state.departmentId,
                        createdAt: timestamp,
                        updatedAt: timestamp,
                    })
                )    
            }


            if (state.displayName !== currentUser.displayName || state.photoURL !== currentUser.photoURL) {
                updatProfileData = {...updatProfileData
                                    ,displayName:state.displayName
                                    ,photoURL:state.photoURL
                                    }
                promises.push(updateProfile(updatProfileData))
            }

            Promise.all(promises)
            .then(() => {

                setOpenCircularProgress(false);
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
                setOpenCircularProgress(false);
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

    const handleDisplayNameChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        dispatch({
            type: "setDisplayName",
            payload: event.target.value
        });
    };

    const handleDepartmentChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        dispatch({
            type: "setDepartment",
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

    const handleImage = e => {

        try {
            e.preventDefault();
            let files;
            if (e.dataTransfer) {
                files = e.dataTransfer.files;
            } else if (e.target) {
                files = e.target.files;
            }
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(files[0]);
            setOpen(true)
            e.target.value = null;//ファイル選択された内容をクリアする（クリアしないと同じファイルが編集できない）
    
        } catch (e){
            e.target.value = null;
            setError("画像の切り取りをキャンセルまたは失敗しました")
            setOpen(false)
        }

    };

    const getCropData  = async(e) => {
        e.preventDefault();
        if (typeof cropper !== "undefined") {
        //console.log(cropper.getCroppedCanvas().toDataURL())
            let imagedata = await cropper.getCroppedCanvas().toDataURL()
            console.log(imagedata)
            // アップロード処理
            console.log("アップロード処理");
            const storages = firebase.storage();//storageを参照
            const storageRef = storages.ref("images/users/" + currentUser.uid + "/");//どのフォルダの配下に入れるか
            const imagesRef = storageRef.child("profilePicture.png");//ファイル名

            console.log("ファイルをアップする行為");
            //const upLoadTask = imagesRef.put(imagedata);
            const upLoadTask = imagesRef.putString(imagedata, 'data_url');


            console.log("タスク実行前");
            setOpenCircularProgress(true);
            upLoadTask.on(
                "state_changed",
                (snapshot) => {
                    console.log("snapshot", snapshot);
                },
                (error) => {
                    console.log("err", error);
                    setError("ファイルのアップロードに失敗しました")
                    setOpenCircularProgress(false);
                },
                () => {
                    upLoadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    //console.log("File available at", downloadURL);
                    const url = new URL(downloadURL)
                    console.log(url.href + url.pathname + "?alt=media")
                    dispatch({
                        type: "setPhotoURL",
                        payload: url.href + url.pathname + "?alt=media"
                        });
                    });
                    setOpen(false);
                    setOpenCircularProgress(false);
                }
            );
        }
    };

    const handleClose = () => {setOpen(false);};
    const handleCircularProgressClose = () => {setOpenCircularProgress(false);};

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
                    <TextField
                        error={state.isError}
                        fullWidth
                        id="displayName"
                        name="displayName"
                        type="text"
                        label="表示名"
                        placeholder="ハンドル名を入力してください"
                        margin="normal"
                        value={state.displayName}
                        onChange={handleDisplayNameChange}
                        inputRef={register({ required: true, minLength: 4 })}
                    />
                    {errors.displayName?.type === "required" &&
                    <div style={{ color: "red" }}>表示名を入力してください</div>}
                    {errors.displayName?.type === "minLength" &&
                    <div style={{ color: "red" }}>表示名は4文字以上で入力してください</div>}


                    <Typography className={classes.subtitle2} variant="subtitle2">アバター</Typography>

                    {state.photoURL && 
                    <>
                    <div style={{ textAlign: "center" }}>
                        <img className={classes.imagephotoURL} src={state.photoURL} alt="photoURL" />
                    </div>
                    <div style={{ textAlign: "center", marginTop:"-30px" }}>
                        <label htmlFor="contained-button-file"><Fab component="span" className={classes.button}><AddPhotoAlternateIcon /></Fab></label>
                    </div>
                    </>
                    }

                    {!state.photoURL && 
                        <label htmlFor="contained-button-file">
                            <>アバターが登録されていません{' '}{' '}{' '}<Fab component="span" className={classes.button}><AddPhotoAlternateIcon /></Fab></>
                        </label>
                    }

                        <input
                            accept="image/*"
                            className={classes.inputFile}
                            id="contained-button-file"
                            multiple
                            type="file"
                            onChange={handleImage}
                        />

                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        className={classes.modal}
                        open={open}
                        onClose={handleClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                        timeout: 500,
                        }}
                    >

                        <div className={classes.paper}>
                            <h2 id="transition-modal-title">画像の切り抜き</h2>
                            <Cropper
                                style={{ height: 400, width: "100%" }}
                                initialAspectRatio={1}
                                aspectRatio={1}
                                preview=".img-preview"
                                src={image}
                                viewMode={1}
                                guides={true}
                                minCropBoxHeight={10}
                                minCropBoxWidth={10}
                                background={false}
                                responsive={true}
                                autoCropArea={1}
                                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                                onInitialized={(instance) => {
                                    setCropper(instance);
                                }}
                            />
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                color="primary"
                                className={classes.updateProfileBtn}
                                onClick={getCropData}
                            >
                                選択範囲で反映
                            </Button>

                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                className={classes.updateProfileBtn}
                                onClick={handleClose}
                            >
                                キャンセル
                            </Button>

                        </div>
                    </Modal>

                    <Modal
                        className={classes.modal}
                        open={openCircularProgress}
                        onClose={handleCircularProgressClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                        timeout: 500,
                        }}
                    >
                        
                        <div className={classes.paper} style={{ textAlign: "center" }} >
                            <div>現在処理中です。</div>
                            <CircularProgress />    
                        </div>
                        
                    </Modal>

                    {departmentList && <>
                        <InputLabel className={classes.InputLabel} id="department-select-label">部署</InputLabel>
                        <Select
                            fullWidth
                            labelId="department-select-label"
                            id="department-select"
                            value={state.departmentId}
                            onChange={handleDepartmentChange}
                            defaultValue={"0001"}
                        >
                            {
                                departmentList.map((item,index) => {
                                    return (
                                        <MenuItem key={item.departmentName} value={ item.departmentId }   >
                                            {item.departmentName}:
                                        </MenuItem>
                                    )
                                })
                            }
                            <MenuItem key={"9999"} value={"9999"} >未所属</MenuItem>
                        </Select>
                    </>
                    }        

                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        color="primary"
                        className={classes.updateProfileBtn}
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
