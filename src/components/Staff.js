import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import Message from "./Message";
import CreateStaff from "./CreateStaff";
import MustBeAdmin from "./HOCs/MustBeAdmin";
import * as messageActions from "../redux/actions/messageActions";
import * as staffsActions from "../redux/actions/staffsActions";

class Staffs extends Component {

  componentDidMount = () => {
    this.props.getStaffsList();
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.reload !== this.props.reload) {
      this.props.getStaffsList();
    }
  };

  // componentDidUpdate  = () => {
  //   this.props.getStaffsList();
  // }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  // handleChange = e => {
  //   const { name, value } = e.target;

  //   this.setState({ [name]: value });
  // };



  render() {
    const {
      staffs,
      isMessageOpen,
      message,
      messageType,
      staffId,
      staffEmail,
      staffName,
      phone,
      reload,
      isDeleteDialogOpen,
      isEditDialogOpen
    } = this.props;

    // console.log(staffs);

    const data = staffs.map((staff, index) => {
      const id = staff.staffId;
      console.log(id);
      return [
        index + 1,
        staff.email,
        staff.name,
        staff.phone,
        staff.createdAt,
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            this.props.openEditConfirmDialog(
              staff.staffId,
              staff.email,
              staff.name,
              staff.phone
            )
          }    
        >
          Edit
        </Button>,
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            this.props.openDeleteConfirmDialog(
              staff.staffId,
              staff.email,
              staff.name,
              staff.phone
            )
          }      
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
          onClose={this.props.closeMessage}
        />

        <Dialog
          open={isEditDialogOpen}
          onClose={this.props.closeEditConfirmDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Edit this staff"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <span>Edit</span>
              <br />
              <input
              type="text"
              name="staffEmail"
              defaultValue={this.props.staffEmail}
              placeholder="Email"
              onChange={this.props.handleInputChange}
              />
              <input
              type="text"
              name="staffName"
              defaultValue={this.props.staffName}
              placeholder="Name"
              onChange={this.props.handleInputChange}
              />
              <input
              type="text"
              name="phone"
              defaultValue={this.props.phone}
              placeholder="Phone"
              onChange={this.props.handleInputChange}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.props.closeEditConfirmDialog}
              color="primary"
            >
              cancel
            </Button>
            <Button
              onClick={() =>
                this.props.handleEditDialog(
                  staffId,
                  staffEmail,
                  staffName,
                  phone,
                  reload
                )
              }
              color="primary"
              autoFocus
            >
              Edit
            </Button>
          </DialogActions>
        </Dialog>
        
        <Dialog
          open={isDeleteDialogOpen}
          onClose={this.props.closeDeleteConfirmDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Delete this staff ?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <span>Delete</span>
              <br />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.props.closeDeleteConfirmDialog}
              color="primary"
            >
              cancel
            </Button>
            <Button
              onClick={() =>
                this.props.handleDeleteDialog(
                  staffId,
                  staffEmail,
                  staffName,
                  phone
                )
              }
              color="primary"
              autoFocus
            >
              delete
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
  closeMessage: () => dispatch(messageActions.closeMessage()),
  //Delete
  handleDeleteDialog: (staffId, staffEmail, staffName, phone) =>
    dispatch(
      staffsActions.handleDeleteDialog(
        staffId,
        staffEmail,
        staffName,
        phone
      )
    ),
  openDeleteConfirmDialog: (staffId, staffEmail, staffName, phone) =>
    dispatch(
      staffsActions.openDeleteConfirmDialog(
        staffId,
        staffEmail,
        staffName,
        phone
      )
    ),
    closeDeleteConfirmDialog: () =>
    dispatch(staffsActions.closeDeleteConfirmDialog()),
    handleInputChange: e => dispatch(staffsActions.handleInputChange(e)),
    closeMessage: () => dispatch(messageActions.closeMessage()),
    //Edit
    handleEditDialog: (staffId, staffEmail, staffName, phone, reload) =>
    dispatch(
      staffsActions.handleEditDialog(
        staffId,
        staffEmail,
        staffName,
        phone,
        reload
      )
    ),
  openEditConfirmDialog: (staffId, staffEmail, staffName, phone, reload) =>
    dispatch(
      staffsActions.openEditConfirmDialog(
        staffId,
        staffEmail,
        staffName,
        phone,
        reload
      )
    ),
    closeEditConfirmDialog: () =>
    dispatch(staffsActions.closeEditConfirmDialog())

});

export default MustBeAdmin(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Staffs)
);
