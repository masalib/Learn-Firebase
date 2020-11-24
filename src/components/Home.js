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
        </div>
    )
}

export default Home
