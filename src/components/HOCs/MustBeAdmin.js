import React from "react";
import { Redirect } from "react-router-dom";
import { getUserInfo } from "../../utils/authHelper";

export default function MustBeAdmin(PassedComp) {
  return class extends React.Component {
    render() {
      const userType = +(getUserInfo("f_type") || -1);

      return userType === 3 ? (
        <PassedComp {...this.props} />
      ) : userType === -1 ? (
        <Redirect to="/sign-in" />
      ) : (
        <Redirect to="/somewhere-only-God-knows" />
      );
    }
  };
}
