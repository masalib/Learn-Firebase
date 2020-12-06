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
    Fab,
  } from '@material-ui/core';
import { Link } from "react-router-dom"
import moment from 'moment';
import {
    NavigateBefore,
    NavigateNext
 } from "@material-ui/icons";

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
    largeIcon: {
        width: 60,
        height: 60,
    },
  })
);

const LIMIT_COUNT = 5

export const Index = () => {

    // 入力用DOMノードへの参照を保持する
    const inputRef = useRef();
    const classes = useStyles();//Material-ui
    //const history = useHistory()
    const [list, setList] = useState([])
    const [firstRecord, setFirstRecord] = useState()
    const [lastRecord, setLastRecord] = useState()
    const [currentfirstRecord, setCurrentFirstRecord] = useState()
    const [currentlastRecord, setCurrentLastRecord] = useState()
    const [hasPreviousPage, sethasPreviousPage] = useState()
    const [hasNextPage, sethasNextPage] = useState()
    const [departmentList, setDepartmentList] = useState([])//部署データ
   
    useEffect(() => {
        if (lastRecord && list) {
            if (list.length > 0 ){
                sethasNextPage(true)
                list.forEach((item) => {
                    //console.log("useEffect:list.item", item.docId)
                    if ( item.docId === lastRecord.docId){
                        console.log("useEffect:lastRecord _ari", lastRecord)
                        sethasNextPage(false)
                    }
                })
                //最後のレコードを取得する
                setCurrentLastRecord(list.slice(-1)[0]);
            }
        }

        if (firstRecord && list) {
            if (list.length > 0 ){
                //console.log("useEffect:list",list)
                //console.log("useEffect:firstRecord",firstRecord)
                sethasPreviousPage(true)
                list.forEach((item) => {
                    //console.log("useEffect:list.item", item.docId)
                    if ( item.docId === firstRecord.docId){
                        console.log("useEffect:firstRecord _ari", firstRecord)
                        sethasPreviousPage(false)
                    }
                })
            }
            //最初のレコードを取得する
            setCurrentFirstRecord(list[0]);

        }
    },[firstRecord,lastRecord,list]);


    useEffect(() => {
         async function fetchData() { // featchDataという関数を定義し、それにasyncをつける
            //最初のページを取得する

            //部署データ
            const colDepartmentsRef = db.collection("departments")
            .orderBy('departmentId');

            //メンバーデータ
            const colRef = db.collection("members")
            .orderBy('updatedAt', 'desc')
            .limit(LIMIT_COUNT);

            colDepartmentsRef.get()
            .then((docSnaps) => {
                //const departments = docSnaps.docs;
                var departments = docSnaps.docs.map(function (doc) {
                    return doc.data();
                });
                setDepartmentList(departments)  //部署データを設定する

                let departmentName = "";
                colRef.get()
                .then((docSnaps) => {
                    //console.log("departmentsList" , departments)
                    const members = docSnaps.docs.map(function (doc) {
                        //console.log("doc.data()",doc.data())
                        //console.log("doc.data().departmentId",doc.data().departmentId)

                        departments.forEach(function(department) {
                            //console.log("departments.departmentId",department.departmentId)
                            if ( doc.data().departmentId === department.departmentId  ){
                                departmentName = department.departmentName;
                            }
                        });
                        //console.log(departmentName);
                        return {...doc.data() , departmentName: departmentName};    //memberデータの配列にdepartmentNameを追加するして返す
                    });
                    //console.log("members",members)
                    setList(members)
                });
            });

        }

        async function initialData() { // featchDataという関数を定義し、それにasyncをつける
            //最後のレコードをセットする
            await db.collection("members").orderBy('updatedAt', 'desc').limitToLast(1)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    setLastRecord(doc.data())
                });
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
            //最初のレコードをセットする
            await db.collection("members").orderBy('updatedAt', 'desc').limit(1)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    setFirstRecord(doc.data())
                });
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
        }
        initialData();
        fetchData();
    },[inputRef]);

    async function handleNextPage () {  
        //console.log("handleNextPage")
        //console.log("currentfirstRecord",currentfirstRecord)
        //console.log("currentlastRecord",currentlastRecord)
        //次のページを取得する
        const colRef = db.collection("members")
        .orderBy('updatedAt', 'desc')
        .limit(LIMIT_COUNT)
        .startAfter(currentlastRecord.updatedAt);

        const snapshots = await colRef.get();
        var docs = snapshots.docs.map(function (doc) {
            let departmentName = "";
            //console.log("doc.data().departmentId",doc.data().departmentId)
            //console.log("doc.data()",doc.data())

            departmentList.forEach(function(department) {
                //console.log("department.departmentId",department.departmentId)
                //console.log("departments.forEach",department.departmentName)
                if ( doc.data().departmentId === department.departmentId  ){
                    departmentName = department.departmentName;
                }
            });
            return {...doc.data() , departmentName: departmentName};    //memberデータの配列にdepartmentNameを追加するして返す
        });
        setList(docs)
    }

    async function handlePreviousPage () {  
        //console.log("handlePreviousPage")
        //console.log("currentfirstRecord",currentfirstRecord)
        //console.log("currentlastRecord",currentlastRecord)
        //前のページを取得する
        const colRef = db.collection("members")
        .orderBy('updatedAt')
        .limit(LIMIT_COUNT)
        .startAfter(currentfirstRecord.updatedAt);

        const snapshots = await colRef.get();
        var docs = snapshots.docs.map(function (doc) {

            let departmentName = "";
            departmentList.forEach(function(department) {
                //console.log("departments.forEach",department.departmentName)
                if ( doc.data().departmentId === department.departmentId  ){
                    departmentName = department.departmentName;
                }
            });
            return {...doc.data() , departmentName: departmentName};    //memberデータの配列にdepartmentNameを追加するして返す
        });
        //sort処理
        docs.sort(function(a,b){
            if(a.updatedAt>b.updatedAt) return -1;
            if(a.updatedAt < b.updatedAt) return 1;
            return 0;
        });
        setList(docs)

    }

    return (
        <>
            <Typography variant="h4" align="center" component="h1" gutterBottom>
                一覧表示
            </Typography>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>ハンドル名</TableCell>
                            <TableCell>部署名</TableCell>
                            <TableCell>更新日</TableCell>
                            <TableCell>操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {
                    list.map((item, index) => {
                        return (
                            <TableRow key={item.docId}>
                                <TableCell >{item.email}</TableCell>
                                <TableCell >{item.displayName}</TableCell> 
                                <TableCell >{item.departmentName}</TableCell> 

                                <TableCell >
                                  { moment(item.updatedAt.seconds * 1000).format('YYYY-MM-DD HH:mm:ss')}
                                </TableCell> 
                                <TableCell ><Link to={`./edit/${item.docId}`}>編集</Link></TableCell> 
                            </TableRow>
                            )
                        })
                    }
                    </TableBody>
                </Table>
                </TableContainer>
            <div variant="subtitle1" align="center" justify="center" component="h1" >
                {hasPreviousPage && <><Fab component="span" className={classes.button} onClick={handlePreviousPage} ><NavigateBefore className={classes.largeIcon} color={"primary"} /></Fab>　</>}
                {!hasPreviousPage && <><Fab component="span" className={classes.button}><NavigateBefore className={classes.largeIcon} color={"disabled"}/></Fab>　</>}
                {hasNextPage && <><Fab component="span" className={classes.button}  onClick={handleNextPage}   ><NavigateNext className={classes.largeIcon} color={"primary"} /></Fab></>}
                {!hasNextPage && <><Fab component="span" className={classes.button}><NavigateNext className={classes.largeIcon} color={"disabled"} /></Fab></>}
            </div>
            <Typography className={classes.subtitle2} variant="subtitle2"><Link to="/screens/edit">新規作成</Link></Typography>
            <Typography className={classes.subtitle2} variant="subtitle2"><Link to="/">Homeに戻る</Link></Typography>

        </>

    );
}