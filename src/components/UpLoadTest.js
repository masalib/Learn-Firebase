import React , { useState } from 'react'
import { Link } from "react-router-dom"
import app  from "../firebase"
import { useAuth } from "../contexts/AuthContext"

//import { v4 as uuid } from 'uuid';

const UpLoadTest = () => {
        const [image, setImage] = useState("");
        const [imageUrl, setImageUrl] = useState("");
        const { currentUser} = useAuth()



        const handleImage = event => {
            const image = event.target.files[0];
            setImage(image);

            currentUser.getIdToken(true)
            .then((idToken) => {
              console.log(idToken);
            })
            .catch((error) => {
              console.log(error);
            });

        };

        const onSubmit = event => {
            event.preventDefault();
            if (image === "") {
                console.log("ファイルが選択されていません");
            }
            // アップロード処理
            console.log("アップロード処理");
            const storages = app.storage();//storageを参照
            const storageRef = storages.ref("images/users/" + currentUser.uid + "/");//どのフォルダの配下に入れるか
            const imagesRef = storageRef.child("profilePicture.png");//ファイル名

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
                    setImageUrl(downloadURL )
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
            <form onSubmit={onSubmit}>
                 <input type="file" onChange={handleImage} />
                <button>Upload</button>
            </form>
            {imageUrl && <div ><img src={imageUrl} alt="uploaded" /></div>}
             
        </div>
    )
}

export default UpLoadTest
