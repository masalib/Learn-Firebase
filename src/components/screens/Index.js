import React, { useState, useEffect,useRef } from "react";
import  { db }  from "../../firebase"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
    Typography,
    Table,			
    TableBody,		
    TableCell,		
    TableContainer,	
    TableHead,		
    TableRow,		
    Paper,			
  } from '@material-ui/core';
import { Link } from "react-router-dom"
import moment from 'moment';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
        padding: 16, 
        margin: 'auto',
        maxWidth: 480
    },
    table: {
        margin: 'auto',
        minWidth: 600,
        maxWidth: 960

    },
  })
);



export const Index = () => {

    // 入力用DOMノードへの参照を保持する
    const inputRef = useRef();
    const classes = useStyles();//Material-ui
    //const history = useHistory()
    const [list, setList] = useState([])

    useEffect(() => {
         async function fetchData() { // featchDataという関数を定義し、それにasyncをつける

            /*複数の条件
            const collectionRef = db.collection("members")
            var query = await collectionRef.where("email", "==", "masalib@gmail.com").where("displayName", ">=", "masaddd").get();
            const result = query.docs.map(doc => doc.data());
            console.log(result)
            //indexを作っていないと => FirebaseError: The query requires an index. You can create it hereと表示される
            */

            /* like文
            const keyword = "masa";
            const query = await db.collection("members").orderBy("displayName").startAt(keyword).endAt(keyword + '\uf8ff').get();
            const result = query.docs.map(doc => doc.data());
            console.log(result);
            */

            /*同じカラムに条件 test1
            const collectionRef = db.collection("members")
            var query = await collectionRef.where("email", "<=", "masalib@gmail.com").where("email", ">=", "masalib@gmail.com").get();
            const result = query.docs.map(doc => doc.data());
            console.log(result)
            */

            /*同じカラムに条件 test2
            const collectionRef = db.collection("members")
            var query = await collectionRef.where("email", "!=", "xxxxmasalib@gmail.com").where("email", "==", "masalib@gmail.com").get();
            const result = query.docs.map(doc => doc.data());
            console.log(result)
            */

            /*Whereとorderbyが違う場合
            const collectionRef = db.collection("members")
            var query = await collectionRef.where("email", "==", "masalib@gmail.com").get();
            const result = query.docs.map(doc => doc.data());
            //sort処理
            result.sort(function(a,b){
                if(a.createdAt>b.createdAt) return -1;
                if(a.createdAt < b.createdAt) return 1;
                return 0;
            });
            console.log(result)
            */

            /* offset文は動かない・・・https://googleapis.dev/nodejs/firestore/latest/Query.html#offset webのモジュールにはないのか？？

            const query = await db.collection("members")
                    .orderBy('createdAt', 'desc')
                    .limit(2)
                    .offset(3)
                    .get();
            const result = query.docs.map(doc => doc.data());
            console.log(result);
            => TypeError: _firebase__WEBPACK_IMPORTED_MODULE_2__.db.collection(...).orderBy(...).limit(...).offset is not a function
            */

            /* 次ページ取得処理
            //startAfter('ooOG2p7FvaqghvXGzndX')は取得したデータの最後のデータを設定する事で次のページのデータを取得する事ができる
            const query = await db.collection("members")
                    .orderBy('docId', 'desc')
                    .limit(2)
                    .startAfter('KQBNkui64BK2FuITUgcM')
                    .get();
            const result = query.docs.map(doc => doc.data());
            console.log(result);
            */


            /*
            // 前ページ取得処理 test1  失敗策
            //startAfter('ooOG2p7FvaqghvXGzndX')は取得したデータの最後のデータを設定する事で次のページのデータを取得する事ができる
            const query = await db.collection("members")
                    .orderBy('docId', 'desc')
                    .limit(2)
                    .endAt('Pe2YFWvdhXXXskjFw1Qr')
                    .get();
            const result = query.docs.map(doc => doc.data());
            console.log(result);
            //例
            //　1,2,3,4,5,6,7,8というデータがある    
            //　現在表示しているのは5,6だった場合に
            // .endAt(5)にすると自分のイメージだと 3,4のデータ取得されると思っていたが
            // 実際には1,2のデータ取得された。使えない
            */

            /*
            // 前ページ取得処理　test2  
            //startAfter('ooOG2p7FvaqghvXGzndX')は取得したデータの最初のデータを設定する事で前のページのデータを取得する事ができる
            const query = await db.collection("members")
                    .orderBy('docId' )
                    .limit(2)
                    .startAfter('Pe2YFWvdhXXXskjFw1Qr')
                    .get();
            console.log(query.size);
            const result = query.docs.map(doc => doc.data());
            //sort処理
            result.sort(function(a,b){
                if(a.docId>b.docId) return -1;
                if(a.docId < b.docId) return 1;
                return 0;
            });
            console.log(result);
            */

            /*
            //limitToLast(1)このレコードが来たら最後のページになる、最初はないので自前で組む
            const query = await db.collection("members")
                    .orderBy('docId', 'desc')
                    .limitToLast(1);
            console.log(query);
            const queryget = await query.get();       
            const result = queryget.docs.map(doc => doc.data());
            console.log(result);
            */



            /*
            const query = await db.collection("members")
                    .limit(2)
                    .offset(2)
                    .get();
            const result = query.docs.map(doc => doc.data());
            console.log(result);
            */

            //var query = await collectionRef.where("docId", "!=", "0w9ZviC6D60yR6QVcEjv").where("docId", "!=", "ooOG2p7FvaqghvXGzndX").get();
            // => Unhandled Rejection (FirebaseError): Invalid query. You cannot use more than one '!=' filter.
            //var query = await collectionRef.where("email", "!=", "masalib@gmail.com").where("displayName", "==", "masaddd").get();
            //The query requires an index. You can create it here https://firebase.google.com/docs/firestore/query-data/indexing?hl=ja
            /*    

            var query = await collectionRef.where("email", "==", "xxxmasalib@gmail.com").where("displayName", "==", "masaddd").get();
            const result = query.docs.map(doc => doc.data());
            sort処理
            result.sort(function(a,b){
                if(a.createdAt>b.createdAt) return -1;
                if(a.createdAt < b.createdAt) return 1;
                return 0;
            });
            console.log(result)
            */
            const colRef = db.collection("members")
            .orderBy('docId', 'desc')
            .limit(10);
            const snapshots = await colRef.get();
            //console.log("snapshots",snapshots)
            //console.log("snapshots.docs",snapshots.docs)
            //console.log("snapshots.empty",snapshots.empty)
            //console.log("snapshots.metadata",snapshots.metadata)
            //console.log("snapshots.query",snapshots.query)
            //console.log("snapshots.size",snapshots.size)

            const docs = snapshots.docs.map(doc => doc.data());
            console.log(docs)
            setList(docs)
        }
        fetchData();
    },[inputRef]);
    
    return (
        <>
            <Typography variant="h4" align="center" component="h1" gutterBottom>
                一覧表示
            </Typography>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>ハンドル名</TableCell>
                            <TableCell>作成日</TableCell>
                            <TableCell>操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {
                    list.map((item, index) => {
                        //console.log(item)    
                        // {item.docId}
                        return (
                            <TableRow key={item.docId}>
                                <TableCell component="th" scope="row">
                                    {item.docId}
                                </TableCell>
                                <TableCell >{item.email}</TableCell>
                                <TableCell >{item.displayName}</TableCell> 
                                <TableCell >
                                  { moment(item.createdAt.seconds * 1000).format('YYYY-MM-DD HH:mm:ss')}
                                </TableCell> 
                                <TableCell ><Link to={`./edit/${item.docId}`}>編集</Link></TableCell> 
                            </TableRow>
                            )
                        })
                    }
                    </TableBody>
                </Table>
                </TableContainer>

            <Typography className={classes.subtitle2} variant="subtitle2"><Link to="/screens/edit">新規作成</Link></Typography>
            <Typography className={classes.subtitle2} variant="subtitle2"><Link to="/">Homeに戻る</Link></Typography>

        </>

    );
}