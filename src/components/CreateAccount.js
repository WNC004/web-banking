import React, { Component } from "react";
import { getCookie } from "tiny-cookie";
import axios from "axios";
import { Button, Paper, TextField, Typography } from "@material-ui/core";
import Message from "./Message";
import validator from "validator";
export default class CreateAccount extends Component {
  state = {
    username: "",
    password: "",
    email: "",
    name: "",
    phone: "",
    // for notify message
    isMessageOpen: false,
    messageType: "",
    message: ""
  };

  componentDidMount = () => {
    document.addEventListener("keyup", this.handleEnterKeyup);
    
  };

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleEnterKeyup);
  }

  // submit form pressing Enter key rather than button
  handleEnterKeyup = ({ keyCode }) => +keyCode === 13 && this.handleSignUp();

  handleInputChange = e => {
    const { name, value } = e.target;
    const { phone } = this.state;
    // validate phone
    const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\./0-9]*$/;
    if (name === "phone" && phoneRegex.test(phone + value.toString()) === false)
      return;

    this.setState({ [name]: value });
  };

  handleSignUp = () => {
    const { username, email, name, password, phone } = this.state;
    // validate email
    if (!validator.isEmail(email))
      return this.setState({
        messageType: "warning",
        isMessageOpen: true,
        message: "Check if email were in invalid format or empty"
      });
    //validate phone number
    const phoneRegex = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
    if(phoneRegex.test(phone) === false)
    return this.setState({
      messageType: "warning",
      isMessageOpen: true,
      message: "Check if phone number were in invalid format or empty"
    });
    //validate password length >=8
    if(validator.isLength(password, {min: 0, max: 7}))
    return this.setState({
      messageType: "warning",
      isMessageOpen: true,
      message: "Check if Your password is too weak or empty"
    });
    // validate address, name, password, phone is empty?
    if (validator.isEmpty(username) ||
      validator.isEmpty(name) ||
      validator.isEmpty(password) ||
      validator.isEmpty(phone)
    )
      return this.setState({
        messageType: "warning",
        isMessageOpen: true,
        message: "Check if any required filed were empty"
      });
    //validate name is string
    const symbol = /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/;
    const number = /[0-9]/;
    var i;
    for ( i = 0; i < name.length; i++) {
      if (number.test(name[i]) === true || symbol.test(name[i]) === true)
      return this.setState({
        messageType: "warning",
        isMessageOpen: true,
        message: "Checks if The Name uses special characters or numbers"
      });
    }
    axios
      .post(
        "http://localhost:3001/auth/user",
        {
          Username: username,
          Password: password,
          Name: name,
          Phone: phone,
          Email: email,
          Type: "1"
        },
        {
          headers: {
            "x-access-token": getCookie("access_token")
          }
        }
      )
      .then(resp => {
        const { status } = resp;
        
        if (status === 201) {
          this.setState({
            messageType: "success",
            isMessageOpen: true,
            message: "Successfully created customer account"
          });
          this.props.onCreateAccountSucceed();
        } else if(status===204){
          console.log(resp);
          this.setState({
            messageType: "error",
            isMessageOpen: true,
            message: "This username does already exists!"
          });
        } else if (status === 202) {
          this.setState({
            messageType: "error",
            isMessageOpen: true,
            message: "This Email does already exists!"
          });
        }
        else{
          this.setState({
            messageType: "error",
            isMessageOpen: true,
            message: "Failed creating customer account"
          });
        }
      })
      .catch(err => {
        this.setState({
          messageType: "error",
          isMessageOpen: true,
          message: "Failed creating customer account"
        });
        console.log(err);
      });
  };

  handleCloseMessage = () => {
    this.setState({ isMessageOpen: false, message: "" });
  };

  render() {
    const { isMessageOpen, messageType, message } = this.state;

    return (
      <React.Fragment>
        <Paper className="sign-up paper form-2-cols">
          <div>
            <Typography variant="title" component="h1">
              Create customer account
            </Typography>
            <div>
              <TextField
                id="signUpName"
                label="Name *"
                autoFocus
                fullWidth
                inputProps={{ maxLength: 45 }}
                margin="normal"
                onChange={this.handleInputChange}
                name="name"
              />
              <TextField
                id="signUpEmail"
                label="Email *"
                type="email"
                fullWidth
                margin="normal"
                onChange={this.handleInputChange}
                name="email"
              />
              <TextField
                id="signUpPhone"
                label="Phone *"
              inputProps={{ maxLength: 10 }}
                fullWidth
                margin="normal"
                onChange={this.handleInputChange}
                name="phone"
                value={this.state.phone}
              />
            </div>
            <div>
              <div>
                <TextField
                  id="signUpUsername"
                  label="Username *"
                  fullWidth
                  inputProps={{ maxLength: 45 }}
                  margin="normal"
                  onChange={this.handleInputChange}
                  name="username"
                />
                <TextField
                  id="signUpPassword"
                  label="Password *"
                  type="password"
                  fullWidth
                  margin="normal"
                  onChange={this.handleInputChange}
                  name="password"
                />
              </div>
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={this.handleSignUp}
                >
                  create account
                </Button>
              </div>
            </div>
          </div>
        </Paper>

        <Message
          variant={messageType}
          message={message}
          open={isMessageOpen}
          onClose={this.handleCloseMessage}
        />
      </React.Fragment>
    );
  }
}
