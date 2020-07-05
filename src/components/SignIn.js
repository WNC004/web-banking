import React from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Button, Grid, Paper, TextField, Typography,  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText } from "@material-ui/core";
import Recaptcha from "react-recaptcha";
import Message from "./Message";
import { checkAuth, signIn } from "../utils/authHelper";

export default class SignIn extends React.Component {
  state = {
    captcha: false,
    username: "",
    password: "",
    redirectToReferrer: checkAuth(),
    // for notify message
    isMessageOpen: false,
    messageType: "",
    message: "",
    isDialogClosePayAccOpen: false,
    isDialogConfirmOTP: false,
    yourEmail: "",
    newPasswordConfirm: "",
    newPassword: "",
    otp:"",
    checkOtp: null
  };

  componentDidMount() {
    document.addEventListener("keyup", this.handleEnterKeyup);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleEnterKeyup);
  }

  // submit form by pressing Enter key rather than button
  handleEnterKeyup = ({ keyCode }) => +keyCode === 13 && this.handleSignIn();

  handleInputChange = e => this.setState({ [e.target.name]: e.target.value });

  handleCaptchaVerify = res => this.setState({ captcha: true });

  handleOpenPopup = () => {
    this.setState({
      isDialogClosePayAccOpen: true,
      isDialogConfirmOTP: false
    });
  }

  handleCloseClosePayAccDialog = () => {
    this.setState({
      isDialogClosePayAccOpen: false,
      isDialogConfirmOTP: false,
      yourEmail: "",
      newPasswordConfirm: "",
      newPassword: ""
    });
  };

  handleClosePayAcc = () => {
    const { yourEmail, newPassword, newPasswordConfirm } = this.state;
    if (newPassword === "" || newPasswordConfirm === "") return;

    const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRegEx.test(yourEmail) === false)
      return this.setState({
        messageType: "warning",
        isMessageOpen: true,
        message: "Check if email were in invalid format or empty"
      });

    if (newPassword !== newPasswordConfirm){
      this.setState({
        messageType: "error",
        isMessageOpen: true,
        message: "New Password confirm and New Password are difficult!"
      });
      return;
    }
    axios.post(
      "http://localhost:3001/forgot-password/send-otp",
      {
        clientEmail: yourEmail,
        clientName : "Sir/Madam"
      }
    )
    .then(resp => {
      console.log(resp);
      if (resp.status !== 201) {
        this.setState({
          messageType: "error",
          isMessageOpen: true,
          message:
            "Sorry, failed sending request for OTP, please try again later"
        });
        throw new Error(
          "Something went wrong when requesting for OTP, status ",
          resp.status
        );
      }
      else{
        this.setState({
          isDialogConfirmOTP: true,
          checkOtp: resp.data.otp
        });
      }
      
    });
  }

  handleCloseAll = () =>{
    const { yourEmail, newPassword} = this.state;
    
    axios.post(
      "http://localhost:3001/forgot-password/save-change",
      {
        email: yourEmail,
        password: newPassword
      }
    )
    .then(resp => {
      console.log(resp);
      if (resp.status !== 201) {
        this.setState({
          messageType: "error",
          isMessageOpen: true,
          message:
            "Sorry, failed changing Password, please try again later"
        });
        throw new Error(
          "Something went wrong when requesting for OTP, status ",
          resp.status
        );
      }
      else{
        this.setState({
          messageType: "success",
          isMessageOpen: true,
          message: "Successful changing password. Please login with new password!",
          isDialogClosePayAccOpen: false,
          isDialogConfirmOTP: false,
          checkOtp: null,
          newPasswordConfirm:"",
          newPassword:"",
          otp: ""
        });
      }
      
    });
  }


  handleSignIn = () => {
    const { username, password, captcha } = this.state;
    // validate captcha
    if (captcha === false) return this.setState({
      messageType: "warning",
      isMessageOpen:true,
      message: "Please check captcha"
    });
    // validate username, password
    if (username === "" || password === "") return;

    // submit data
    axios
      .post("http://localhost:3001/auth/login", {
        username,
        pwd: password
        // type: 2
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
            message: "Username or password was wrong"
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
          message: "Username or password was wrong"
        });
        console.log(err);
      });
  };

  handleCloseMessage = () => {
    this.setState({ isMessageOpen: false, message: "" });
  };

  render() {
    const {
      redirectToReferrer,
      messageType,
      isMessageOpen,
      message,
      isDialogClosePayAccOpen,
      yourEmail,
      newPasswordConfirm,
      newPassword,
      otp,
      isDialogConfirmOTP,
      checkOtp
    } = this.state;
    const { from } = this.props.location.state || {
      from: { pathname: "/" }
    };

    return redirectToReferrer === true ? (
      <Redirect to={from} />
    ) : (
      <Grid
        className="page__account"
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Paper className="form-panel">
          <div>
            <div>
              <Typography variant="title" component="h1">
                INTERNET BANKING
              </Typography>
              <TextField
                id="signInUsername"
                label="Username"
                type="text"
                autoFocus
                fullWidth
                margin="normal"
                onChange={this.handleInputChange}
                name="username"
              />
              <TextField
                id="signInPassword"
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                onChange={this.handleInputChange}
                name="password"
              />
              <div className="captcha-container">
                <Recaptcha
                  sitekey="6Ld9paMZAAAAABRo0ITeyF3bZLnGf47y0k9bVJy_"
                  render="explicit"
                  onloadCallback={() => true}
                  verifyCallback={this.handleCaptchaVerify}
                />
              </div>
              <div style={{ display: "flex", flexDirection: 'row-reverse'}}>
                <Button
                  variant="contained"
                  width= "100"
                  height="100"
                  onClick={this.handleOpenPopup}
                >
                  Forgot Password?
                </Button>
              </div>
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={this.handleSignIn}
                >
                  SIGN IN
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

        <Dialog
          open={isDialogClosePayAccOpen}
          onClose={this.handleCloseClosePayAccDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Forgot Password`}
          </DialogTitle>
          <DialogContent
            style={{ width: "600px", height: "auto", maxHeight: "1000px" }}
          >
           
              <React.Fragment>
              <TextField
                  id="yourEmail"
                  label="Email"
                  autoFocus
                  fullWidth
                  margin="normal"
                  onChange={this.handleInputChange}
                  name="yourEmail"
                  value={yourEmail}
                />
                <TextField
                  id="newPassword"
                  type="password"
                  label="New Password"
                  autoFocus
                  fullWidth
                  margin="normal"
                  onChange={this.handleInputChange}
                  name="newPassword"
                  value={newPassword}
                />
                <TextField
                  id="newPasswordConfirm"
                  type="password"
                  label="New PasswordCofirm"
                  autoFocus
                  fullWidth
                  margin="normal"
                  onChange={this.handleInputChange}
                  name="newPasswordConfirm"
                  value={newPasswordConfirm}
                />
              </React.Fragment>
            
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseClosePayAccDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClosePayAcc} color="primary" autoFocus>
              Send
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isDialogConfirmOTP}
          onClose={this.handleCloseClosePayAccDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Forgot Password`}
          </DialogTitle>
          <DialogContent
            style={{ width: "600px", height: "auto", maxHeight: "1000px" }}
          >
           
              <React.Fragment>
              <TextField
                  id="otp"
                  label="OTP"
                  autoFocus
                  fullWidth
                  margin="normal"
                  onChange={this.handleInputChange}
                  name="otp"
                  value={otp}
                />
                <FormHelperText style={{ color: otp.length > 6 && "red" }}>
                  OTP code is 6 characters long
                </FormHelperText>
                {otp.length === 6 && otp !== checkOtp && (
                  <FormHelperText style={{ color: "red" }}>
                    OTP unmatched
                  </FormHelperText>
                )}
              </React.Fragment>
            
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseClosePayAccDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleCloseAll} color="primary" autoFocus
            disabled={otp.length !== 6 || otp !== checkOtp}>
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  }
}
