import React, { useState, useEffect } from "react";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { AppContext } from "./libs/contextLib";
import Routes from "./Routes";
import { Link, useHistory } from "react-router-dom";
import "./App.css";


function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const history = useHistory();

  useEffect(() => {
    onLoad();
  }, []);
  
  async function onLoad() {
    try {
      // console.log(login.getJwt())
      // await login.
      userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }
    setIsAuthenticating(false);
  }
  

  function handleLogout() {
    localStorage.removeItem("token")
    userHasAuthenticated(false);
    history.push("/login");
  }

  async function handleInsert() {
    history.push("/insert");
  }
  // async function handleEdit() {
  //   history.push("/edit");
  // }
    return (
      !isAuthenticating &&
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Images</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {isAuthenticated
                ? <NavItem onClick={handleLogout}>Logout</NavItem>
                : <>
                    <LinkContainer to="/login">
                      <NavItem>Login</NavItem>
                    </LinkContainer>
                  </>
              }
              {
                isAuthenticated ? <NavItem onClick={handleInsert}>Upload Image</NavItem> : ""
              }
              
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <AppContext.Provider
          value={{ isAuthenticated, userHasAuthenticated }}
        >
          <Routes />
        </AppContext.Provider>
      </div>
    );
}

export default App;
