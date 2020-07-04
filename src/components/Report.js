import React, { Component } from "react";
import {
  Button, Typography,Paper,TextField, Grid, Select, MenuItem, FormControl, InputLabel
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import Message from "./Message";
import MustBeAdmin from "./HOCs/MustBeAdmin";
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
    hisrories: [],
    banks: []
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

  getListBanks = () =>{
    axios
      .post("http://localhost:3001/histories/banks",
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

  handleInputChange = e => this.setState({ [e.target.name]: e.target.value });

  filter = () => {
    this.getTotalAmount();
    this.getList();
  }

  componentDidMount = () => {
    this.getTotalAmount();
    this.getList();
    this.getListBanks();
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
      hisrories,
      banks
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
        // transactionType,
        <span style={{ 
          color: transactionType === "sent" ? "#66ff99" :  transactionType === "received" ? "#ff9933" : "#ff0066"
        }}>
          {history.transactionType.toUpperCase()}
        </span>,
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
          <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="payAccId">
                      Bank Name
                    </InputLabel>
          <Select
                      value={bankName}
                      onChange={this.handleInputChange}
                      inputProps={{
                        name: "bankName",
                        id: "bankName"
                      }}
                      autoFocus
                      // InputLabelProps={{
                      //   shrink: true,
                      // }}
                    
                    >
                      {banks.map((bank, index) => (
                        <MenuItem key={index} value={bank.id}>
                          {bank.bank_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
            
          </Grid>
          <Grid item xs={3}>
          <FormControl fullWidth>
                    <InputLabel htmlFor="payAccId">
                      
                    </InputLabel>
          <TextField item xs={3}
          style={{marginLeft:"30px"}}
            type="date"
                  id="from"
                  placeholder="From"
                  fullWidth
                  margin="normal"
                  label="From"
                  onChange={this.handleInputChange}
                  name="from"
                  value={from}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
          </Grid>
          <Grid item xs={3}>
          <FormControl fullWidth>
                    <InputLabel htmlFor="payAccId" >
                    
                    </InputLabel>
          <TextField
          style={{marginLeft:"60px"}}
           type="date"
                  id="to"
                  placeholder="To"
                  fullWidth
                  label="To"
                  margin="normal"
                  onChange={this.handleInputChange}
                  name="to"
                  value={to}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                </FormControl>
          </Grid>
          <Grid item xs={3} mb={0} pd={0}>
          <FormControl fullWidth margin="normal">
          {/* <InputLabel htmlFor="payAccId" >
                    asâsasasasasasasasas
                    </InputLabel> */}
          <Button
                  variant="contained"
                  color="primary"
                  size="large"
          
                  style={{marginTop:"10px", marginLeft:"90px", width:"100px"}}
                  onClick={() => this.filter()}
                >
                  Filter
                </Button>
          </FormControl>
          </Grid>
          </Grid>
        </Paper> 
        <Paper className="sign-up paper form-2-cols">
          <Typography variant="title" component="h1">
            Total amount: {totalAmount=== null ?"0 đ":totalAmount.toLocaleString('vi', {style : 'currency', currency : 'VND'})}
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
