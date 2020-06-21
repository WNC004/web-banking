import React, { Component } from "react";
import {
  Button,
  Paper,
  Typography,
  TextField
} from "@material-ui/core";
import axios from "axios";
import Message from "./Message";
import { getUserInfo } from "../utils/authHelper";
import { getCookie } from "tiny-cookie";

class ChangePassword extends Component {
  state = {
    id : getUserInfo("f_id"),
    messageType: "",
    isMessageOpen: "",
    message: "",
    newPassword: "",
    newPasswordConfirm: ""
  };

  // submit form by pressing Enter key rather than button

  handleCloseMessage = () => {
    this.setState({ isMessageOpen: false, message: "" });
  };

  handleInputChange = e => this.setState({ [e.target.name]: e.target.value });
 
  handleSaveChangePassword = () => {
    const {newPassword, newPasswordConfirm, id } = this.state;
    
    console.log(newPassword);
    // validate username, password
    if (newPassword === "" || newPasswordConfirm === "") return;

    if (newPassword != newPasswordConfirm){
      this.setState({
        messageType: "error",
        isMessageOpen: true,
        message: "New Password confirm and New Password are difficult!"
      });
      return;
    }
    console.log(newPassword);
    // submit data
    axios
      .post("http://localhost:3001/customer/change-password", {
        id,
        newPassword,
        newPasswordConfirm
      },
      {
        headers: {
          "x-access-token": getCookie("access_token")
        }
      })
      .then(resp => {
        const {
          status
        } = resp;
        if (status === 201) {
          this.setState({
            messageType: "success",
            isMessageOpen: true,
            message: "Successfully Change Password!"
          });
                  
        } else {
          this.setState({
            messageType: "error",
            isMessageOpen: true,
            message: "Failed Change Password!"
          });
          throw new Error(
            "Something went wrong when signing in, status ",
            status
          );
        }
      })
      .catch(err => {
        this.setState({
          messageType: "error",
          isMessageOpen: true,
          message: "Failed Change Password!"
        });
        console.log(err);
      });
  };

  
  render() {
    // // const {
    // //   newPassword,
    // //   newPasswordConfirm
    // // } = this.props;
    // console.log(newPassword);

    return (
      <React.Fragment>
        <Paper className="paper">
          <div>
            <Typography variant="title" component="h1">
              Change password
            </Typography>
            
              <div>
                <TextField
                  id="newPassword"
                  label="New Password *"
                  type="password"
                  fullWidth
                  margin="normal"
                  onChange={this.handleInputChange}
                  name="newPassword"
                />
              </div>
              <div>
                <TextField
                  id="newPasswordConfirm"
                  label="New Password Confirm *"
                  type="password"
                  fullWidth
                  margin="normal"
                  onChange={this.handleInputChange}
                  name="newPasswordConfirm"
                />
              </div>
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={this.handleSaveChangePassword}
                >
                  Save change
                </Button>
              </div>
            </div>
        </Paper>
        <Message
          variant={this.state.messageType}
          message={this.state.message}
          open={this.state.isMessageOpen}
          onClose={this.handleCloseMessage}
        />
      </React.Fragment>
    );
  }
}


export default (ChangePassword);
