import React, { useState, useEffect } from 'react'
import {Route, Switch } from "react-router-dom";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import Home from "./Pages/Home.jsx";
import {getToken} from "./utils/api";
import "antd/dist/antd.css";
import "./index.css";

export default () => {
    const [logged, setLogged] = useState(false);

    useEffect(() => {
        if(getToken()){
            setLogged(true)
        }
    }, [])

    return(
       <div className="App">
            <Switch>
                {!logged ?
                    <>
                        <Route exact path="/" render={({history}) => <Login onDone={setLogged} history={history}/>}/>
                        <Route exact path="/register" component={Register}/>
                    </> : <>
                        <Route path="/" component={Home}/>
                    </>
                }
            </Switch>
       </div>
    )
}