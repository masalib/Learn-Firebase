import React ,{useMemo}  from 'react'
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Paper, } from '@material-ui/core';
import {TextInput} from './TextInput.js';
import {MessageLeft,MessageRight} from './Message';
import { useFetchAllData } from './firebaseDB';
import { useAuth } from "../../contexts/AuthContext"
import moment from 'moment';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
        paper: {
            width: '80vw',
            height: '80vh',
            maxWidth: '500px',
            maxHeight: '700px',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            position: 'relative'
        },
        paper2: {
            width: '80vw',
            maxWidth: '500px',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            position: 'relative'
        },
        container: {
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        messagesBody: {
            width: 'calc( 100% - 20px )', 
            margin: 10,
            overflowY: 'scroll', 
            height: 'calc( 100% - 80px )'
        },
    })
);



export const Index = () => {
    const classes = useStyles();
    const { currentUser} = useAuth()   //Firebaseの共通変数と変更などの関数

    const { data } = useFetchAllData();
    // object形式なので使いやすいように{key, value}形式のリストに変換する
    // また、データが変わらない限り結果は同じなのでメモ化しておく
    const dataList = useMemo(() => Object.entries(data || {}).map(([key, value]) => ({ key, value })), [data]);
    console.log(dataList)
    let viewdate = '';

    return (
            <div className={classes.container}>
                <Paper className={classes.paper} >
                    <Paper id="style-1" className={classes.messagesBody}>
                    {dataList.length === 0  && "loading..."}   
                    {dataList.map(({ key, value }) =>
                            <React.Fragment key={`${key}`}>
                                {
                                //日付がちがった場合は日付を出力する（jsxだと単純にif文をかけないのでアロー関数で逃げる）
                                (() => {
                                if (viewdate !== moment(value.createAt).format('YYYY/MM/DD')) {
                                    viewdate = moment(value.createAt).format('YYYY/MM/DD')
                                    return(viewdate);
                                    } 
                                })()
                                }
                                { currentUser.uid !== value.uid &&
                                <MessageLeft 
                                    message={value.message + '　　'}
                                    timestamp={moment(value.createAt).format('HH:mm') }
                                    photoURL={value.photoURL}
                                    displayName={value.displayName}
                                />
                                }
                                { currentUser.uid === value.uid &&
                                <MessageRight 
                                    message={value.message + '　　'}
                                    timestamp={moment(value.createAt).format('HH:mm') }
                                    photoURL={value.photoURL}
                                    displayName={value.displayName}
                                />
                                }
                            </React.Fragment>
                        )}
                    </Paper>
                    <TextInput />
                </Paper>
            </div>
    )
}
