import React, {useEffect, useRef, useState } from "react";
import "./admin.style.css";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Login from "../login/login.component";
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
function Admin() {
  const numberScreenRef = useRef();
  const numberSavedRef = useRef();
  const [logined, setLogin] = useState(false);
  const [loding,setLoding] = useState(false);
  const [user, setUser] = useState({});
  const handleCreateNumber = () => {
    const id = uuidv4();
    console.log(numberScreenRef.current);
    numberScreenRef.current.innerHTML = `<span>${id}<span/>`;
    const options = {
      headers: {
        authorization: `bearer ${JSON.parse(
          localStorage.getItem("adminUserAccessToken")
        )}`,
      },
    };
    axios.post("http://localhost:4002/secretNumber" ,{secretNumber:id},options).then(response=>{
      numberSavedRef.current.innerHTML=`the number is saved in data base successfully`
    }).catch(error=>{
      console.log(error);
    })
  };

  useEffect(() => {
    setLoding(true);
  if (localStorage.getItem("adminUserAccessToken")) {
    (() => {
      const options = {
        headers: {
          authorization: `bearer ${JSON.parse(
            localStorage.getItem("adminUserAccessToken")
          )}`,
        },
      };
      axios
        .get(
          "http://localhost:4002/auth",
          options
        )
        .then((response) => {
          setUser(response.data);
          setLogin((prv) => true);
          setLoding(false)
        })
        .catch((error) => {
          console.log(error);
          setLogin((prv) => false);
          setLoding(false)
        });
    })();
  }else{
      setLoding(false);
  }
}, []);
  const logIn = async (email, password) => {
    try {
      setLoding(true);
      const loginData = await axios.post(
        "http://localhost:4002/login",
        { email: email, password: password }
      );
      localStorage.setItem(
        "adminUserAccessToken",
        JSON.stringify(loginData.data.accessToken)
      );
      setLogin(true);
      setLoding(false);
    } catch (err) {
      console.log(err);
      setLoding(false);
    }
    setLoding(false);
  };
  return (
    <>
    {loding ? (
         <Box sx={{ width: '100%' }}>
         <LinearProgress />
       </Box>
      ) : !logined ? (
        <Login logIn={logIn} loding={loding} />
      ) : (
        <div className="admin">
          <h1>Welcom Admin</h1>
          <div className="secret-number-generator">
            <input
              type="button"
              value="creat-number"
              onClick={handleCreateNumber}
            />
            <div ref={numberScreenRef} className="number-screen"></div>
            <div ref={numberSavedRef} className="number-saved"></div>
          </div>
        </div>
      )}
    </>
  );
}

export default Admin;
