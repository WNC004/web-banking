import React, { Component } from "react";
import axios from "axios";
import { getCookie } from "tiny-cookie";
import {
  Button, Checkbox, Dialog,  DialogActions,  DialogContent,  DialogTitle,  FormControl,  FormControlLabel,  FormHelperText,  FormLabel,  Grid,  
  InputLabel,  MenuItem,  Paper,  Radio,  RadioGroup,  Select,  Table,  TableBody,  TableCell,  TableRow,  TextField,  Typography
} from "@material-ui/core";
import Message from "./Message";
import MustBeCustomer from "./HOCs/MustBeCustomer";
import { getUserInfo } from "../utils/authHelper";
import * as cryptoJS from "crypto-js";

class ExternalTransfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payAccs: [],
      payAccsTransferable: [],
      bankName: "",
      payAccId: "",
      currentBalance: 0,
      accNumber: "",
      // for notify message
      isMessageOpen: false,
      messageType: "",
      message: "",
      receiverPayAccId: "",
      receiverPayAccNumber:
        (props.location.state && props.location.state.receiverPayAccNumber) ||
        "",
      receiverName: "",
      receiverEmail: "",
      receiverPhone: "",
      receiverCurrentBalance: 0,
      transferAmount: "",
      transferMsg: "",
      transferBank: "",
      feeType: "1",
      isDialogOTPOpen: false,
      OTP: "",
      checkOTP: null,
      isInContacts: true,
      saveContact: true,
      banks: []
    };
  }

  getListBanks = () =>{
    axios
      .post("http://localhost:3001/pay-acc/banks",
      {},
      {
        headers: {
          "x-access-token": getCookie("access_token")
        }
      })
      .then(resp => {
        const { status, data: list } = resp;
        if (status === 200) {
          this.setState({
            messageType: "success",
            banks: list
          });
        } else {
          this.setState({
            messageType: "error",
            message: "Failed get list banks"
          });
          throw new Error(
            "Something went wrong when getting contacts list, status ",
            status
          );
        }
      })
      .catch(err => {
        this.setState({
          messageType: "error",
          message: "Failed get list banks"
        });
      });
  }

  getPayAccsList = () => {
    const customerId = getUserInfo("f_id");

    if (customerId === null)
      return this.setState({
        messageType: "error",
        isMessageOpen: true,
        message: "Sorry, could not get your entity, please sign in again"
      });

    axios
      .get(`http://localhost:3001/pay-accs/${customerId}`, {
        headers: {
          "x-access-token": getCookie("access_token")
        }
      })
      .then(resp => {
        const { status, data } = resp;
        if (status === 200) {
          // only accounts with balance > 0
          const payAccs = data,
            payAccsTransferable = data.filter(payAcc => +payAcc.balance > 0);
          if (payAccs.length > 0)
            // default selected payment account
            this.setState({
              payAccs,
              payAccsTransferable
            });
        } else {
          this.setState({
            messageType: "error",
            isMessageOpen: true,
            message: "Sorry, failed getting your payment accounts list"
          });
          throw new Error(
            "Something went wrong when getting payment accounts list, status ",
            status
          );
        }
      })
      .catch(err => {
        this.setState({
          messageType: "error",
          isMessageOpen: true,
          message: "Sorry, failed getting your payment accounts list"
        });
        console.log(err);
      });
  };

  componentDidMount = () => {
    this.getPayAccsList();
    this.getListBanks();
  };

  handleInputChange = e => {
    const { name, value } = e.target;
    if (name === "payAccId")
      return this.setState({
        [name]: value,
        accNumber: this.state.payAccs.find(payAcc => payAcc.id === value)
          .accNumber,
        currentBalance: +this.state.payAccs.find(payAcc => payAcc.id === value)
          .balance
      });

    this.setState({ [name]: value });
  };

  handleCloseMessage = () => {
    this.setState({ isMessageOpen: false, message: "" });
  };

  handleCloseOTPDialog = () => {
    this.setState({
      isDialogOTPOpen: false,
      checkOTP: null,
      OTP: "",
      receiverPayAccId: "",
      receiverName: "",
      receiverEmail: "",
      receiverPhone: "",
      receiverCurrentBalance: 0,
      saveContact: true,
      isInContacts: true
    });
  };

  handleOpenOTPDialog = () => {
    const clientName = getUserInfo("f_name"),
      clientEmail = getUserInfo("f_email");

    const {
      receiverPayAccNumber,
      feeType,
      currentBalance,
      transferAmount,
      transferBank,
      receiverPhone
    } = this.state;

    console.log(
      getUserInfo("f_id"),
      `http://localhost:3001/contact/${receiverPayAccNumber}/is-existed`
    );

    console.log(transferBank);
    console.log(receiverPayAccNumber);

    var cardRSA = +receiverPayAccNumber; 
    console.log(cardRSA);

    var ts = Date.now();
    console.log(ts);
    var dataRSA = ts + JSON.stringify({card_number: cardRSA})
    var signature = "";
    var url = "";

    if(transferBank === "Truong Bank")
    {
      signature = cryptoJS.HmacSHA256(dataRSA, "secretKey").toString();
      url = `https://internet-banking-api-17.herokuapp.com/api/users`;
      console.log(signature);
    }
    else if(transferBank ==="PGP Bank")
    {
      url = "http://localhost:3001/pay-acc/PGP/user";
    }
    else 
    {
      console.log("Not a bank !!!");
    }    
    console.log(ts);

    axios
      .all([
        axios.post(
          "http://localhost:3001/send-otp",
          {
            clientEmail,
            clientName
          },
          {
            headers: {
              "x-access-token": getCookie("access_token")
            }
          }
        ),
        axios.post(url, {
          card_number: cardRSA
        },{
          headers: {
            "x-access-token": getCookie("access_token"),
            "ts": ts,
            "partner_code": 2,
            "sign": signature
        },
        }),
        axios.get(
          `http://localhost:3001/contact/${receiverPayAccNumber}/is-existed?customerId=${getUserInfo(
            "f_id"
          )}`,
          {
            headers: {
              "content-type": "application/json",
              "x-access-token": getCookie("access_token")
            }
          }
        )
      ])
      .then(
        axios.spread((getOTP, getReceiver, getContactExisted) => {
          if (getOTP.status !== 201) {
            this.setState({
              messageType: "error",
              isMessageOpen: true,
              message:
                "Sorry, failed sending request for OTP, please try again later"
            });
            throw new Error(
              "Something went wrong when requesting for OTP, status ",
              getOTP.status
            );
          }

          console.log(getReceiver);
          console.log(getReceiver.status);

          
          if (getReceiver.status === 500) {
            this.setState({
              messageType: "error",
              isMessageOpen: true,
              message:
                "Sorry, failed getting receiver details , please try again later"
            });
            throw new Error(
              "Something went wrong when getting receiver details, status ",
              getOTP.status
            );
          }

          const {
            data: { otp: checkOTP }
          } = getOTP;

          if (getReceiver.data.length < 1)
            return this.setState({
              messageType: "warning",
              isMessageOpen: true,
              message: `No payment account attached to ${receiverPayAccNumber}, please try another one`
            });
          
          // const {
          //   full_name: receiverName,
          //   email: receiverEmail,
          //   phone_number: receiverPhone,
          // } = getReceiver.data;

          const {
            full_name: receiverName,
            email: receiverEmail,
            phone_number: receiverPhone
          } = getReceiver.data;
          

          const senderFee = +feeType === 1 ? 10000 : 0,
            receiverFee = +feeType === 2 ? 10000 : 0;
          if (+feeType === 1 && +senderFee > +currentBalance - +transferAmount)
            return this.setState({
              messageType: "error",
              isMessageOpen: true,
              message: "Remaining balance is not enough for extra fee"
            });
          if (
            +feeType === 2 &&
            // +receiverFee > +receiverCurrentBalance + +transferAmount
            +receiverFee >  +transferAmount

          )
            return this.setState({
              messageType: "error",
              isMessageOpen: true,
              message: "Transaction failed. Contact your receiver for detail."
            });

          const isInContacts = +getContactExisted.data.existed === 1;
          console.log(getContactExisted.data.existed);
          this.setState({
            checkOTP,
            // receiverPayAccId,
            receiverName,
            receiverEmail,
            receiverPhone,
            receiverPayAccNumber,
            isDialogOTPOpen: true,
            isInContacts
          });
        })
      )
      .catch(err => {
        this.setState({
          messageType: "error",
          isMessageOpen: true,
          message:
            "Sorry, failed sending request for OTP or getting receiver details, please try again later"
        });
        console.log(err);
      });
  };

  handleCheckChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleTransfer = () => {
    // check inputs
    const {
      payAccId,
      accNumber,
      currentBalance,
      transferAmount,
      receiverPayAccId,
      receiverPayAccNumber,
      receiverName,
      feeType,
      transferMsg,
      transferBank,
      saveContact,
      isInContacts
    } = this.state;

    console.log(accNumber);
    console.log(transferBank);

    // call API
    const senderFee = +feeType === 1 ? 10000 : 0,
      receiverFee = +feeType === 2 ? 10000 : 0;

    console.log(feeType);

    var urlTransfer = "";

    if(transferBank === "Truong Bank")
    {
      urlTransfer = "http://localhost:3001/pay-acc/RSA/balance";
    }
    else if(transferBank ==="PGP Bank")
    {
      urlTransfer =  "http://localhost:3001/pay-acc/PGP/balance";
    }
    else 
    {
      console.log("Not a transfer  !!!");
    }    

    
    const axiosArr = [
      axios.patch(
        urlTransfer,
        {
          payAccId,
          senderCard: accNumber,
          newBalance: +transferAmount,
          message: transferMsg,
          receiveCard: receiverPayAccNumber,
          updateBalance: currentBalance - +transferAmount - senderFee
        },  
        {
          headers: {
            "x-access-token": getCookie("access_token")
          }
        }
      ),
      axios.patch(
        urlTransfer,
        {
          payAccId,
          senderCard: accNumber,
          newBalance: transferAmount - receiverFee,
          message: transferMsg,
          receiveCard: receiverPayAccNumber,
          updateBalance: currentBalance - +transferAmount
        },
        {
          headers: {
            "x-access-token": getCookie("access_token")
          }
        }
      ),
      axios.post(
        "http://localhost:3001/historyConnect",
        {
          payAccId,
          fromAccNumber: accNumber,
          toAccNumber: receiverPayAccNumber,
          amount: +transferAmount,
          transactionType: "sent",
          feeType: -+senderFee,
          message: transferMsg,
          bank_id: transferBank
        },
        {
          headers: {
            "x-access-token": getCookie("access_token")
          }
        }
      ),
      // axios.post(
      //   "http://localhost:3001/history",
      //   {
      //     payAccId: receiverPayAccId,
      //     fromAccNumber: accNumber,
      //     toAccNumber: receiverPayAccNumber,
      //     amount: +transferAmount,
      //     transactionType: "received",
      //     feeType: -+receiverFee,
      //     message: transferMsg
      //   },
      //   {
      //     headers: {
      //       "x-access-token": getCookie("access_token")
      //     }
      //   }
      // )
    ];

    if (saveContact === true && isInContacts === false)
      axiosArr.push(
        axios.post(
          "http://localhost:3001/contact",
          {
            customerId: getUserInfo("f_id"),
            toAccNumber: receiverPayAccNumber,
            toNickName: receiverName
          },
          {
            headers: {
              "x-access-token": getCookie("access_token")
            }
          }
        )
      );

    axios
      .all([...axiosArr])
      .then(
        axios.spread(
          (
            updateSenderPayAcc,
            updateReceiverPayAcc,
            sendHistory,
            // receiveHistory
          ) => {
            if (
              updateSenderPayAcc.status !== 201 ||
              updateReceiverPayAcc.status !== 201
            ) {
              this.setState({
                messageType: "error",
                isMessageOpen: true,
                message: "Sorry, transaction failed"
              });
              throw new Error(
                "Something went wrong operating transaction, status ",
                updateSenderPayAcc.status
              );
            }

            // if (sendHistory.status !== 201 || receiveHistory.status !== 201) 
            if (sendHistory.status !== 201 ) 
            {
              this.setState({
                messageType: "error",
                isMessageOpen: true,
                message: "Sorry, failed updating history of the transaction"
              });
              throw new Error(
                "Something went wrong when updating history of the transaction, status ",
                updateSenderPayAcc.status
              );
            }

            if (
              updateSenderPayAcc.status === 201 &&
              updateReceiverPayAcc.status === 201 &&
              sendHistory.status === 201 
              // && receiveHistory.status === 201
            )
              this.setState(
                {
                  isDialogOTPOpen: false,
                  messageType: "success",
                  isMessageOpen: true,
                  message: "Successfully operated the transaction",
                  // reset form
                  receiverPayAccNumber: "",
                  transferAmount: "",
                  transferMsg: "",
                  transferBank: "",
                  OTP: "",
                  checkOTP: "",
                  currentBalance:
                    +currentBalance -
                    +transferAmount -
                    (+feeType === 1 ? 10000 : 0),
                  saveContact: true,
                  isInContacts: true
                }, // refresh payment accounts
                this.setState({ feeType: "1" }, this.getPayAccsList)
              );

              
          }
        )
      )
      .catch(err => {
        console.log(err);
      });
  };

  checkValidInputs = () => {
    const {
      payAccs,
      currentBalance,
      receiverPayAccNumber,
      transferAmount,
      transferMsg,
      transferBank
    } = this.state;

    if (receiverPayAccNumber === "") return true;

    if (transferBank  === "") return true;

    if (
      transferAmount === "" ||
      +transferAmount < 1 ||
      +transferAmount > +currentBalance
    )
      return true;

    if (transferMsg === "") return true;

    if (
      payAccs.length > 0 &&
      payAccs.map(payAcc => payAcc.accNumber).includes(receiverPayAccNumber)
    )
      return true;

    return false;
  };

  render() {
    const {
      payAccs,
      payAccsTransferable,
      payAccId,
      accNumber,
      currentBalance,
      transferAmount,
      transferMsg,
      transferBank,
      receiverName,
      receiverEmail,
      receiverPhone,
      receiverPayAccNumber,
      isMessageOpen,
      messageType,
      message,
      feeType,
      isDialogOTPOpen,
      OTP,
      checkOTP,
      saveContact,
      isInContacts,
      banks
    } = this.state;

    return (
      <React.Fragment>
        <Grid container direction="row" justify="center" alignItems="center">
          <Paper className="paper inner-trans">
            {payAccsTransferable.length < 1 ? (
              <FormControl fullWidth>
                <Typography
                  variant="title"
                  component="h1"
                  style={{ marginBottom: "25px" }}
                >
                  No payment account available
                </Typography>
                <FormHelperText>
                  Your account may either not has any payment account yet, or
                  none of them has enough balance to make a transaction <br />
                  Please contact a staff for more details
                </FormHelperText>
              </FormControl>
            ) : (
              <div>
                <Typography
                  variant="title"
                  component="h1"
                  style={{ marginBottom: "25px" }}
                >
                  Transaction details
                </Typography>
                <div>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="payAccId">
                      Payments accounts list
                    </InputLabel>

                    <Select
                      value={payAccId}
                      onChange={this.handleInputChange}
                      inputProps={{
                        name: "payAccId",
                        id: "payAccId"
                      }}
                      autoFocus
                    >
                      {payAccsTransferable.map((payAcc, index) => (
                        <MenuItem key={index} value={payAcc.id}>
                          {payAcc.accNumber}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      Current balance: {currentBalance}
                    </FormHelperText>
                    {payAccId !== "" && currentBalance < 10000 && (
                      <FormHelperText style={{ color: "red" }}>
                        Current balance is not enough for the extra fee
                      </FormHelperText>
                    )}
                  </FormControl>
                  <TextField
                    id="receiverPayAccNumber"
                    label="Account number of receiver *"
                    fullWidth
                    margin="normal"
                    onChange={this.handleInputChange}
                    name="receiverPayAccNumber"
                    value={receiverPayAccNumber}
                    disabled={currentBalance < 10000}
                  />
                  {payAccs
                    .map(payAcc => payAcc.accNumber)
                    .includes(receiverPayAccNumber) && (
                    <FormHelperText style={{ color: "red" }}>
                      Cannot make this transaction type for your own payment
                      accounts
                    </FormHelperText>
                  )}
                  <TextField
                    id="transferAmount"
                    label="Amount *"
                    type="number"
                    fullWidth
                    margin="normal"
                    onChange={this.handleInputChange}
                    name="transferAmount"
                    value={transferAmount}
                    disabled={currentBalance < 10000}
                  />
                  {+transferAmount > +currentBalance && (
                    <FormHelperText style={{ color: "red" }}>
                      Amount of the transaction must not be greater than current
                      balance
                    </FormHelperText>
                  )}
                  <TextField
                    id="transferMsg"
                    label="Message *"
                    fullWidth
                    margin="normal"
                    onChange={this.handleInputChange}
                    name="transferMsg"
                    value={transferMsg}
                    disabled={currentBalance < 10000}
                  />
                  <FormControl fullWidth>
                    <InputLabel htmlFor="payAccId">
                      Bank Name *
                    </InputLabel>
                    <Select
                      value={transferBank}
                      onChange={this.handleInputChange}
                      inputProps={{
                        name: "transferBank",
                        id: "transferBank"
                      }}
                      autoFocus
                      disabled={currentBalance < 10000}
                    >
                      {banks.map((bank, index) => (
                        <MenuItem key={index} value={bank.bank_name}>
                          {bank.bank_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <div style={{ textAlign: "left" }}>
                    <FormControl component="div">
                      <FormLabel component="legend">
                        Fee payment type (-10.000)
                      </FormLabel>
                      <RadioGroup
                        aria-label="Fee payment type (-10.000)"
                        name="feeType"
                        value={feeType}
                        onChange={this.handleInputChange}
                      >
                        <FormControlLabel
                          value="1"
                          control={<Radio />}
                          label="Sender"
                          disabled={currentBalance < 10000}
                        />
                        <FormControlLabel
                          value="2"
                          control={<Radio />}
                          label="Receiver"
                          disabled={currentBalance < 10000}
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={this.handleOpenOTPDialog}
                      disabled={this.checkValidInputs()}
                    >
                      Transfer
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Paper>
        </Grid>

        {/* dialog to confirm and input OTP */}
        <Dialog
          open={isDialogOTPOpen}
          onClose={this.handleCloseOTPDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            <Typography variant="title" component="span">
              Confirm the transaction
              <br />
              {(!accNumber ||
                isNaN(currentBalance) ||
                !receiverName ||
                !receiverEmail ||
                !receiverPhone ||
                !receiverPayAccNumber) && (
                <FormHelperText style={{ color: "red" }}>
                  Something went wrong, please try again later
                </FormHelperText>
              )}
            </Typography>
          </DialogTitle>
          <DialogContent style={{ width: "480px" }}>
            <div>
              <FormControl fullWidth>
                <Typography variant="body2" component="p">
                  Payment account number
                </Typography>
                <Typography variant="subtitle1" component="span">
                  {accNumber}
                </Typography>
                {!isNaN(currentBalance) && (
                  <FormHelperText
                    style={{ marginTop: "0", marginBottom: "15px" }}
                  >
                    Current balance: {+currentBalance}
                  </FormHelperText>
                )}
              </FormControl>
              <div>
                <Typography variant="body2" component="p">
                  Receiver details
                </Typography>
                <Table style={{ width: "100%" }}>
                  <TableBody>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>{receiverName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>{receiverEmail}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Phone</TableCell>
                      <TableCell>{receiverPhone}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Payment account number</TableCell>
                      <TableCell>{receiverPayAccNumber}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            {isInContacts === false && (
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={saveContact}
                      onChange={this.handleCheckChange("saveContact")}
                      value="true"
                    />
                  }
                  label="Save this receiver's account to your contact?"
                />
              </div>
            )}
            <div>
              <TextField
                id="OTP"
                label="OTP *"
                fullWidth
                margin="normal"
                onChange={this.handleInputChange}
                name="OTP"
                value={OTP}
                autoFocus
              />
              <FormHelperText style={{ color: OTP.length > 6 && "red" }}>
                OTP code is 6 characters long
              </FormHelperText>
              {OTP.length === 6 && OTP !== checkOTP && (
                <FormHelperText style={{ color: "red" }}>
                  OTP unmatched
                </FormHelperText>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseOTPDialog} color="secondary">
              cancel
            </Button>
            <Button
              onClick={this.handleTransfer}
              color="primary"
              autoFocus
              disabled={OTP.length !== 6 || OTP !== checkOTP}
            >
              confirm
            </Button>
          </DialogActions>
        </Dialog>

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

export default MustBeCustomer(ExternalTransfer);
