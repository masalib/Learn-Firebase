import React from 'react'
import { Link } from "react-router-dom"


const Home = () => {
    return (
        <div>
            Home：
            テスト用のリンク（あとで治す）
            <h2>
                <Link to="/login">Login</Link>
            </h2>
            <h2>
                <Link to="/signup">signup</Link>
            </h2>
            <h2>
                <Link to="/screens/edit">screensの新規作成</Link>
            </h2>
            <h2>
                <Link to="/screens/index">screensの一覧</Link>
            </h2>
            <h2>
                <Link to="/chat/index">chat</Link>
            </h2>


            <h2>
                <Link to="/forgotPassword">forgotPassword</Link>
            </h2>
        </div>
    )
}

export default Home
