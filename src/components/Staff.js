import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
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

  // componentDidUpdate  = () => {
  //   this.props.getStaffsList();
  // }
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
      isDeleteDialogOpen,
      isEditDialogOpen
    } = this.props;

    console.log(staffs);

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
          onClose={this.handleCloseMessage}
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
                  phone
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
    //Edit
    handleEditDialog: (staffId, staffEmail, staffName, phone) =>
    dispatch(
      staffsActions.handleEditDialog(
        staffId,
        staffEmail,
        staffName,
        phone
      )
    ),
  openEditConfirmDialog: (staffId, staffEmail, staffName, phone) =>
    dispatch(
      staffsActions.openEditConfirmDialog(
        staffId,
        staffEmail,
        staffName,
        phone
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
