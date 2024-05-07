import Assist from '../assist';
import TaskResult from "../classes/taskresult.js";
import AppInfo from '../app-info.js';
import axios from "axios";

export async function signIn(useremail, userpassword) {

  // Send request
  const url = 'login';

  Assist.log(`Starting to login user ${useremail} on server using url ${AppInfo.apiUrl + url}`, 'log');

  return new Promise(function (myResolve) {

    axios({
      method: 'post',
      url: AppInfo.apiUrl + url,
      data: { username: useremail, password: userpassword },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then((response) => {

      Assist.log(`Response has completed for logging in ${useremail} from server`);

      if (typeof response.data == 'string') {

        Assist.log(`Unable to process response for logging in ${useremail} from server: ${JSON.stringify(response)}`);

        myResolve(new TaskResult(false, 'Unable to process server response from server', null));

      } else {

        if (response.data.succeeded) {

          sessionStorage.setItem('ruser', useremail);
          myResolve(new TaskResult(true, '', response.data.items[0]));



        } else {

          Assist.log(`Unable to login ${useremail}} from server: ${response.data.message}`);
          myResolve(new TaskResult(false, response.data.message, null));

        }
      }
    }).catch(error => {

      Assist.log(`An error occured when logging in ${useremail} from server: ${JSON.stringify(error)}`);
      myResolve(new TaskResult(false, `An error occured. Please try again`, null));

    });

  });




}

export async function getUser() {

  // Send request
  const currentUser = sessionStorage.getItem('ruser');

  if (currentUser == null) {

    return {
      isOk: false
    };

  } else {

    return {
      isOk: true,
      data: currentUser
    };
  }
}

export async function createAccount(email, password) {
  try {
    // Send request
    console.log(email, password);

    return {
      isOk: true
    };
  }
  catch {
    return {
      isOk: false,
      message: "Failed to create account"
    };
  }
}

export async function changePassword(email, recoveryCode) {

  // Send request

  return {
    isOk: true
  };

}

export async function resetPassword(email) {
  try {
    // Send request
    console.log(email);

    return {
      isOk: true
    };
  }
  catch {
    return {
      isOk: false,
      message: "Failed to reset password"
    };
  }
}
