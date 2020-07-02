import React, { useState } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import axios from 'axios'
import config from '../config/config.test.json'
import { useAppContext } from "../libs/contextLib";
import { useHistory } from "react-router-dom";
import "./Login.css";


    const apiURL = config.EXPRESS_APP_URL;

    axios.interceptors.request.use(
      config => {
        const { origin } = new URL(config.url);
        const allowedOrigins = [apiURL];
        const token = localStorage.getItem('token');

        if (allowedOrigins.includes(origin)) {
          config.headers.authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    )


export default function Login() {
  const { userHasAuthenticated } = useAppContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    try{
    getJwt();
    userHasAuthenticated(true);
    history.push("/");
    }
    catch(e){
      alert(e.message)
    }
  }

  const storedJwt = localStorage.getItem('token');
  const [jwt, setJwt] = useState(storedJwt || null);
  const getJwt = async () => {
      // const { data } = await axios.get(`${apiURL}/auth`);
      console.log(username);
      let token = await axios({
        method: 'post',
        url: `${apiURL}/auth`,
        data: {
          username,
          password
        }
      })
      console.log(token.data);
      localStorage.setItem('token', token.data);
      setJwt(token.data);
    };
  
    return (
           
          <div className="Login">
          <form onSubmit={handleSubmit}>
            <FormGroup controlId="username" bsSize="large">
              <ControlLabel>username</ControlLabel>
              <FormControl
                autoFocus
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </FormGroup>
            <FormGroup controlId="password" bsSize="large">
              <ControlLabel>Password</ControlLabel>
              <FormControl
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
              />
            </FormGroup>
            <Button block bsSize="large" disabled={!validateForm()} type="submit">
              Login
            </Button>
          </form>
        </div>
        );
}