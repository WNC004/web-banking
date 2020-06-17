import React from "react";
import { Redirect } from "react-router-dom";
import { getUserInfo } from "../utils/authHelper";

export default function Home() {
  const userType = +getUserInfo("f_type");
  // 1: client, 2: staff , 3: admin
  // const redirectTo = userType === 1 ? "/payment-accounts" : "/customers";
  let redirectTo ;
  function directScreen () {
    if(userType===1)
      redirectTo = "/payment-accounts";
    else if(userType===2)
      redirectTo = "/customers";
    else 
      redirectTo = "/staffs";
  }  
  directScreen();
  console.log(redirectTo);
  return <Redirect to={redirectTo} />;
}
