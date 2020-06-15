import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Button,
  Paper,
  Typography,
  TextField,
  FormHelperText
} from "@material-ui/core";
import axios from "axios";
import { signIn } from "../utils/authHelper";
import MustBeCustomer from "./HOCs/MustBeCustomer";
import { getUserInfo } from "../utils/authHelper";
import * as contactsActions from "../redux/actions/contactsActions";
import * as messageActions from "../redux/actions/messageActions";
import { getCookie } from "tiny-cookie";

class ChangePassword extends Component {
  state = {
    redirectToReferrer: true,
    newPassword: "",
    newPasswordConfirm: ""
  };

  // submit form by pressing Enter key rather than button

  handleInputChange = e => this.setState({ [e.target.name]: e.target.value });
  componentDidMount = () => {
    const customerId = getUserInfo("f_id");
    this.props.getContactsList(customerId);
  };

  handleSaveChangePassword = () => {
    const {newPassword, newPasswordConfirm } = this.state;
    
    console.log("aaaa");
    // validate username, password
    if (newPassword === "" || newPasswordConfirm === "") return;

    console.log(newPassword);
    // submit data
    axios
      .post("http://localhost:3001/user/change-password", {
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
          status,
          data: { auth, access_token, refresh_token }
        } = resp;
        if (status === 200 && auth === true) {
          signIn(access_token, refresh_token);
          this.setState({ redirectToReferrer: true });
        } else {
          this.setState({
            messageType: "error",
            isMessageOpen: true,
            message: "Email or password was wrong"
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
          message: "Email or password was wrong"
        });
        console.log(err);
      });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.reload !== this.props.reload) {
      const customerId = getUserInfo("f_id");
      this.props.getContactsList(customerId);
    }
  };

  render() {
    const {
      contacts,
      toAccNumber,
      toNickName,
      reload
    } = this.props;
    console.log(contacts);

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
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  ...state.contacts
});

const mapDispatchToProps = dispatch => ({
  getContactsList: customerId =>
    dispatch(contactsActions.getContactsList(customerId)),
  handleCreateContact: (customerId, toAccNumber, toNickName, reload) =>
    dispatch(
      contactsActions.handleCreateContact(
        customerId,
        toAccNumber,
        toNickName,
        reload
      )
    ),
  handleInputChange: e => dispatch(contactsActions.handleInputChange(e)),
  closeMessage: () => dispatch(messageActions.closeMessage())
});

export default MustBeCustomer(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ChangePassword)
);
