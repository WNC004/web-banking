import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import Message from "./Message";
import CreateStaff from "./CreateStaff";
import MustBeAdmin from "./HOCs/MustBeAdmin";
import * as messageActions from "../redux/actions/messageActions";
import * as staffsActions from "../redux/actions/staffsActions";
import { getUserInfo } from "../utils/authHelper";
  import { getCookie } from "tiny-cookie";
import axios from "axios";




class Staffs extends Component {

  state = {
        modalIsOpen: false,
        staffId: getUserInfo("f_id"),
        staffs: [],
        messageType: "",
        isMessageOpen: "",
        message: "",
        isDialogClosePayAccOpen: true,
    }

  componentDidMount = () => {
    this.props.getStaffsList();
  };

  handleClosePayAcc = () => {
    const {
      staffId
    } = this.state;
    console.log("Handle Close Payacc");
    axios
          .post(`http://localhost:3001/staffs/delete/`, 
          {
            staffId,
          },
          {
            headers: {
              "x-access-token": getCookie("access_token")
            }
          })
          .then(resp => {
            const { status } = resp;
            if (status === 200) {
              this.setState({
              messageType: "success",
              isMessageOpen: false,
              message: "You deleted this staff",
              isDialogClosePayAccOpen: true,
              debtId: ""
            });
            this.getStaffsList();
            } else {
              this.setState({
                messageType: "error",
                isMessageOpen: true,
                message: "Failed deleted this staff",
                isDialogClosePayAccOpen: false,
                debtId: ""
              });
              throw new Error(
                "Something went wrong when getting contacts list, status ",
                status
              );
            }
          })
  }


handleCloseClosePayAccDialog = () => {
  this.setState({
    isDialogClosePayAccOpen: false,
    staffId: ""
  });
};

onClosePayAcc = (staffId) => {
  if (staffId === undefined)
    return this.setState({
      messageType: "error",
      isMessageOpen: true,
      message: "Sorry, could not get this payment account information"
    });

  this.setState({
    staffId,
    isDialogClosePayAccOpen: true
  });
  console.log(staffId);
};

handleCloseMessage = () => {
  this.setState({ isMessageOpen: false, message: "" });
};

handleInputChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const {
      staffs,
      isMessageOpen,
      message,
      messageType,
      isDialogClosePayAccOpen,
    } = this.props;

    console.log(staffs);

    const data = staffs.map((staff, index) => {
      const id = staff.staffId;
      // console.log(id);
      return [
        index + 1,
        staff.email,
        staff.name,
        staff.phone,
        staff.createdAt,
        <Button
          variant="contained"
          color="primary"
        >
          Edit
        </Button>,
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.onClosePayAcc(id)}      
          >
        Delete
      </Button>
      ]
    }
      );


    const columns = ["#", "Email", "Name", "Phone", "Created at", "Action","Delete"];

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
        <CreateStaff onCreateAccountSucceed={this.props.getStaffsList}/>
        <MUIDataTable
          title={"Staffs list"}
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
        <Dialog
          open={isDialogClosePayAccOpen}
          onClose={this.handleCloseClosePayAccDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Are you sure to deleted this debt`}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <span>The balance of new payment account is 0 by default</span>
              <br />
              <span>It may need paying in afterward</span>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseClosePayAccDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClosePayAcc} color="primary" autoFocus>
              Yes, I'm sure
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  ...state.staffs
});

const mapDispatchToProps = dispatch => ({
  getStaffsList: () => dispatch(staffsActions.getStaffsList()),
  closeMessage: () => dispatch(messageActions.closeMessage())
});

export default MustBeAdmin(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Staffs)
);
