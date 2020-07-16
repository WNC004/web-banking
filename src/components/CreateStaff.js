import React, { Component } from "react";
import { getCookie } from "tiny-cookie";
import axios from "axios";
import { Button, Paper, TextField, Typography } from "@material-ui/core";
import Message from "./Message";
import validator from "validator";
export default class CreateStaff extends Component {
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

    axios
      .post(
        "http://localhost:3001/auth/staff",
        {
          Username: username,
          Password: password,
          Name: name,
          Phone: phone,
          Email: email,
          Type: "2"
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
            message: "Successfully created staff account"
          });
          this.props.onCreateAccountSucceed();
        } else if(status===204){
          this.setState({
            messageType: "error",
            isMessageOpen: true,
            message: "This username does already exists!"
          });
        }
        else {
          this.setState({
            messageType: "error",
            isMessageOpen: true,
            message: "Failed creating staff account"
          });
        }
      })
      .catch(err => {
        this.setState({
          messageType: "error",
          isMessageOpen: true,
          message: "Failed creating staff account"
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
              Create staff account
            </Typography>
            <div>
              <TextField
                id="signUpName"
                label="Name *"
                inputProps={{ maxLength: 45 }}
                autoFocus
                fullWidth
                margin="normal"
                onChange={this.handleInputChange}
                name="name"
              />
              <TextField
                id="signUpEmail"
                label="Email *"
                type="email"
                inputProps={{ maxLength: 45 }}
                fullWidth
                margin="normal"
                onChange={this.handleInputChange}
                name="email"
              />
              <TextField
                id="signUpPhone"
                label="Phone *"
                fullWidth
                inputProps={{ maxLength: 10 }}
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
                  inputProps={{ maxLength: 45 }}
                  fullWidth
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
