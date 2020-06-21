import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import Message from "./Message";
import CreateStaff from "./CreateStaff";
import MustBeAdmin from "./HOCs/MustBeAdmin";
import * as messageActions from "../redux/actions/messageActions";
import * as staffsActions from "../redux/actions/staffsActions";
import EditStaff from "./EditStaff";


class Staffs extends Component {
  componentDidMount = () => {
    this.props.getStaffsList();
  };

  render() {
    const {
      staffs
    } = this.props;

    console.log(staffs);

    const data = staffs.map((staff, index) => [
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
      </Button>
    ]);

    const columns = ["#", "Email", "Name", "Phone", "Created at", "Action"];

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
