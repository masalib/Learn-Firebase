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
            const colRef = db.collection("members")
            .orderBy('createdAt', 'desc')
            .limit(10);
            const snapshots = await colRef.get();
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