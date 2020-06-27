import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button, Typography,Paper,TextField, Grid
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import Message from "./Message";
import MustBeAdmin from "./HOCs/MustBeAdmin";
import { getUserInfo } from "../utils/authHelper";
import axios from "axios";
import { getCookie } from "tiny-cookie";

class Reports extends Component {

  state = {
    messageType: "",
    isMessageOpen: "",
    message: "",
    bankName:"",
    from:"",
    to:"",
    totalAmount: 0,
    hisrories: []
  };

  getTotalAmount = () =>{
    const {bankName, from, to} = this.state;
    axios
      .post(`http://localhost:3001/histories/received`, 
      {
        bankName,
        from,
        to
      },
      {
        headers: {
          "x-access-token": getCookie("access_token")
        }
      })
      .then(resp => {
        const { status, data: sumAmount } = resp;
        if (status === 200) {
           this.setState({
            messageType: "success",
            totalAmount: sumAmount
          });
        } else {
          this.setState({
            messageType: "error",
            message: "Failed get total amount"
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
          message: "Failed get total amount"
        });
      });
  }

  getList = () =>{
    const {bankName, from, to} = this.state;
    axios
      .post(`http://localhost:3001/histories/received-list`, 
      {
        bankName,
        from,
        to
      },
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
            hisrories: list
          });
        } else {
          this.setState({
            messageType: "error",
            message: "Failed get total amount"
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
          message: "Failed get total amount"
        });
      });
  }

  handleInputChange = e => this.setState({ [e.target.name]: e.target.value });

  filter = () => {
    this.getTotalAmount();
    this.getList();
  }

  componentDidMount = () => {
    this.getTotalAmount();
    this.getList();
  };

  render() {
    const {
      messageType,
      isMessageOpen,
      message,
      bankName,
      from,
      to,
      totalAmount,
      hisrories
    } = this.state;

    // console.log(staffs);

    const data = hisrories.map((history, index) => {
     const{fromAccNumber, toAccNumber, amount, createdAt, bank_id, transactionType} = history;
      return [
        index + 1,
        fromAccNumber, 
        toAccNumber, 
        bank_id,
        new Date(createdAt).toLocaleString(),
        transactionType,
        amount
      ]
    }
    );


    const columns = ["#", "fromAccNumber", "toAccNumber", "bankName", "createdAt", "transactionType", "amount"];

    const options = {
      selectableRows: false,
      responsive: "scroll",
      print: false,
      download: false,
      viewColumns: false,
      filter: false
    };

    return (
      <React.Fragment>
        <Paper className="sign-up paper form-4-cols">
        <Typography variant="title" component="h1">
              Filter
            </Typography>
        <Grid container>
          <Grid item xs={3}>
            <TextField
                  id="bankName"
                  label="Bank Name"
                  autoFocus
                  fullWidth
                  margin="normal"
                  onChange={this.handleInputChange}
                  name="bankName"
                />
          </Grid>
          <Grid item xs={3}>
          <TextField item xs={3}
            type="date"
                  id="from"
                  label="From"
                  fullWidth
                  margin="normal"
                  onChange={this.handleInputChange}
                  name="from"
                />
          </Grid>
          <Grid item xs={3}>
          <TextField
           type="date"
                  id="to"
                  label="To"
                  fullWidth
                  margin="normal"
                  onChange={this.handleInputChange}
                  name="to"
                />
          </Grid>
          <Grid item xs={3} mb={0} pd={0}>
          <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => this.filter()}
                >
                  Filter
                </Button>
          </Grid>
          </Grid>
        </Paper> 
        <Paper className="sign-up paper form-2-cols">
          <Typography variant="title" component="h1">
            Total amount: {totalAmount.toLocaleString('vi', {style : 'currency', currency : 'VND'})}
          </Typography>
        </Paper>
        <MUIDataTable
          title={"Histories"}
          data={data}
          columns={columns}
          options={options}
        />
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

export default MustBeAdmin(
 Reports
);
