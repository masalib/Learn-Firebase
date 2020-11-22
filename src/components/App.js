function App() {
  return (
    <>
    <div>Hello,World </div>
    <div>{`REACT_APP_APIKEY:${process.env.REACT_APP_APIKEY}`}</div>
    <div>{`REACT_APP_AUTHDOMAIN:${process.env.REACT_APP_AUTHDOMAIN}`}</div>
    <div>{`REACT_APP_DATABASEURL:${process.env.REACT_APP_DATABASEURL}`}</div>
    <div>{`REACT_APP_PROJECTID:${process.env.REACT_APP_PROJECTID}`}</div>
    <div>{`REACT_APP_STORAGEBUCKET:${process.env.REACT_APP_STORAGEBUCKET}`}</div>
    <div>{`REACT_APP_MESSAGINGSENDERID:${process.env.REACT_APP_MESSAGINGSENDERID}`}</div>
    <div>{`REACT_APP_APPID:${process.env.REACT_APP_APPID}`}</div>
    <div>{`REACT_APP_MEASUREMENTID:${process.env.REACT_APP_MEASUREMENTID}`}</div>

    </>
  );
}

export default App;
