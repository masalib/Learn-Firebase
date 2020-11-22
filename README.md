# Learn-Firebase


## 初期設定(Initial setting)

1. もしFirebaseでプロジェクトがない場合はプロジェクトを作成する。
1. Firebaseにログインしてプロジェクトを選択する
1. 設定（歯車のアイコン）の設定を選択する
1. 全般の中のマイアプリの設定でAPIキーを取得する
1. reactのプロジェクトに戻ってきて「.env.local」または「.env.development.local」のファイルを作成してAPIキーなどを設定する

sample 

```
REACT_APP_APIKEY               =  
REACT_APP_AUTHDOMAIN           =  
REACT_APP_DATABASEURL          =  
REACT_APP_PROJECTID            =  
REACT_APP_STORAGEBUCKET        =  
REACT_APP_MESSAGINGSENDERID    =  
REACT_APP_APPID                =  
REACT_APP_MEASUREMENTID        =  
```
6. 環境ファイルなので、もしプロジェクトを実行している場合（npm start)は「Ctrl + c」でstopする。restartする


