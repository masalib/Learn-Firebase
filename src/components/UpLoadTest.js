import React , { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import firebase, {storage}  from "../firebase"
import { useAuth } from "../contexts/AuthContext"
import axios from 'axios'
//import { v4 as uuid } from 'uuid';

const UpLoadTest = () => {
        const [image, setImage] = useState("");
        const [imageUrl, setImageUrl] = useState("");
        const { currentUser} = useAuth()

        useEffect(() => {
            async function fetchData() { 
                const idToken = await currentUser.getIdToken(true)   
                console.log(idToken) 
                //const {data}  = await axios.get('http://localhost:20001/openid/index.php', {
                //const {data}  = await axios.get('https://firebase-auth-app-masalib.herokuapp.com/index.php', {
                const {data}  = await axios.get('https://firebase-auth-app-masalib.herokuapp.com/index.php', {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    }
                })
                console.log(data)

            }
            fetchData();
        } ,[currentUser]);


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
            const storages = firebase.storage();//storageを参照
            const storageRef = storages.ref("images/users/" + currentUser.uid + "/");//どのフォルダの配下に入れるか
            const imagesRef = storageRef.child("tempprofilePicture.png");//ファイル名

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

        const handleMove = async event => {
            event.preventDefault();
            //ファイルを移動
            console.log("handleMove func start")

            const sourcePath   = "images/users/"+ currentUser.uid + "/tempprofilePicture.png" 
            const destinationPath  = "images/users/"+ currentUser.uid + "/profilePicture.png" //profilePicture.png

            console.log("source:"+ sourcePath )
            console.log("destination:"+ destinationPath )

            /*
            //元ファイルのダウンロード
            const storages = firebase.storage();//storageを参照
            const storageRef = storages.ref();
            var starsRef = storageRef.child(sourcePath);
            console.log(starsRef)

            let oldRef = storage.ref().child(sourcePath)

            oldRef.getDownloadURL().then(function(url) {
                console.log(url)
            }).catch(function(error) {
                console.log(error)
            })
            */
            let statusData = moveFirebaseFile(sourcePath, destinationPath)
            console.log(statusData)

        }




        function moveFirebaseFile(currentPath, destinationPath) {
            let oldRef = storage.ref().child(currentPath)

            var metadata = {
                contentType: 'image/jpeg',
              };


            oldRef.getDownloadURL().then(url => {
                console.log("url",url)
                fetch(url).then(htmlReturn => {
                    let fileArray = new Uint8Array()
                    const reader = htmlReturn.body.getReader()
        
                    //get the reader that reads the readable stream of data
                    reader
                        .read()
                        .then(function appendStreamChunk({ done, value }) {
                            //If the reader doesn't return "done = true" append the chunk that was returned to us
                            // rinse and repeat until it is done.
                            if (value) {
                                fileArray = mergeTypedArrays(fileArray, value)
                            }
                            if (done) {
                                console.log(fileArray)
                                return fileArray
                            } else {
                                // "Readout not complete, reading next chunk"
                                return reader.read().then(appendStreamChunk)
                            }
                        })
                        .then(file => {
                            //Write the file to the new storage place
                            let status = storage
                                .ref()
                                .child(destinationPath)
                                .put(file,metadata)
                            //Remove the old reference
                            oldRef.delete()
        
                            return status
                        })
                })
            })
        }

    function mergeTypedArrays(a, b) {
        // Checks for truthy values on both arrays
        //if(!a && !b) throw 'Please specify valid arguments for parameters a and b.';  
            // Checks for truthy values or empty arrays on each argument
        // to avoid the unnecessary construction of a new array and
        // the type comparison
        if(!b || b.length === 0) return a;
        if(!a || a.length === 0) return b;
    
        // Make sure that both typed arrays are of the same type
        if(Object.prototype.toString.call(a) !== Object.prototype.toString.call(b)){
            console.log(Error,'The types of the two arguments passed for parameters a and b do not match.')
        }
    
        var c = new a.constructor(a.length + b.length);
        c.set(a);
        c.set(b, a.length);
    
        return c;
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
                <input type="button" value="move" onClick={handleMove} />

            </form>
            {imageUrl && <div ><img src={imageUrl} alt="uploaded" /></div>}
             
        </div>
    )
}

export default UpLoadTest
