import React , { useState } from 'react'
import { Link } from "react-router-dom"
import app,{ storage } from "../firebase"


const UpLoadTest = () => {
        //const storageUrl = "gs//" + process.env.REACT_APP_STORAGE_BUCKET
        const storageUrl = "gs//learn-firebase-masalib.appspot.com" //+ process.env.REACT_APP_STORAGE_BUCKET

        console.log("storageUrl:"+ storageUrl);

        const [image, setImage] = useState("");
        const [imageUrl, setImageUrl] = useState("");
        const handleImage = event => {
            const image = event.target.files[0];
            setImage(image);
        };
        const onSubmit = event => {
            event.preventDefault();
            if (image === "") {
            console.log("ファイルが選択されていません");
            }
            // アップロード処理
            console.log("アップロード処理");

            console.log("storageを参照");

            const storages = app.storage(storageUrl);//storageを参照
            console.log(storages)
            console.log("どのフォルダの配下に入れるか");
            const storageRef = storages.ref("images");//どのフォルダの配下に入れるか

            console.log("ファイル名");
            const imagesRef = storageRef.child(`${image.name}`);//ファイル名

            console.log("ファイルをアップする行為");
            const upLoadTask = imagesRef.put(image);

            console.log("タスク実行前");

            upLoadTask.on(
                "state_changed",
                (snapshot) => {
                    console.log("snapshot", snapshot);
                },
                (error) => {
                    console.log("err", error);
                },
                () => {
                    upLoadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    console.log("File available at", downloadURL);
                    });
                }
            );
        }
        
    return (
        <div>
            uploadtestあとで消す：
            <h2>
                <Link to="/">home</Link>
            </h2>
            <div>{`REACT_APP_STORAGEBUCKET:${process.env.REACT_APP_STORAGEBUCKET}`}</div>

            <form onSubmit={onSubmit}>
                 <input type="file" onChange={handleImage} />
                <button>Upload</button>
            </form>
             <img src={imageUrl} alt="uploaded" />
        </div>
    )
}

export default UpLoadTest
