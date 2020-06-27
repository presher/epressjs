import React, { Component } from "react";
import axios from 'axios'
class MyForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        username: '',
        age: null,
      };
    }
    mySubmitHandler = (event) => {
      event.preventDefault();
     axios.post({

     })
    }
    myChangeHandler = (event) => {
      let nam = event.target.name;
      let val = event.target.value;
      this.setState({[nam]: val});
    }
    render() {
      return (
        <form onSubmit={this.mySubmitHandler}>
        <h1>Hello {this.state.username} {this.state.age}</h1>
        <p>Enter your name:</p>
        <input
          type='text'
          name='username'
          onChange={this.myChangeHandler}
        />
        <p>Enter your age:</p>
        <input
          type='text'
          name='password'
          onChange={this.myChangeHandler}
        />
        <br/>
        <br/>
        <input type='submit' />
        </form>
      );
    }
  }
  
  export default MyForm