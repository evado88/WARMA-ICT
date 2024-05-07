import AppInfo from './app-info.js';
import notify from 'devextreme/ui/notify';
import axios from "axios";
import TaskResult from "./classes/taskresult.js";

class Assist {

    static firebaseConfig = {
        apiKey: "AIzaSyCbH2wyJmcqTQU3gIl_raQwr0AmVuG_bhA",
        authDomain: "myzambia-5c62c.firebaseapp.com",
        databaseURL: "https://myzambia-5c62c.firebaseio.com",
        projectId: "myzambia-5c62c",
        storageBucket: "myzambia-5c62c.appspot.com",
        messagingSenderId: "878075714362",
        appId: "1:878075714362:web:55575ac3647ff7d3cd0e03"
    };

    static getTypeId(type = 'Public') {

        if (type === 'Public') {

            return 1;
        }
        else if (type === 'Peer Navigator') {

            return 2;
        }
        else if (type === 'Participant') {

            return 3;
        }
        else {
            return 4;
        }
    }

    static getTypeName(type = 1) {

        if (type === 1) {

            return 'Public';
        }
        else if (type === 2) {

            return 'Peer Navigator';
        }
        else if (type === 3) {

            return 'Participant';
        }
        else {
            return 'Public';
        }
    }


    ///Logs a message to the console
    static log(message, type = 'log') {

        const current = new Date();

        const date = current.toDateString() +
            ' ' + current.toLocaleTimeString() + ' ';

        if (type === 'info') {

            console.info(date + AppInfo.appName + ": " + message);
        }
        else if (type === 'warn') {

            console.warn(date + AppInfo.appName + ": " + message);
        }
        else if (type === 'error') {

            console.error(date + AppInfo.appName + ": " + message);
        }
        else {
            console.log(date + AppInfo.appName + ": " + message);
        }
    }

    static showMessage(message, type = 'info') {

        notify({
            message: message,
            position: {
                my: 'center top',
                at: 'center top',
            },
        }, type, 4000);
    }

    ///Deletes data from the specified url
    static async loadData(title, url) {

        Assist.log(`Starting to load ${title} from server using url ${AppInfo.apiUrl + url}`, 'log');

        return new Promise(function (resolve, reject) {


            axios.get(AppInfo.apiUrl + url).then((response) => {

                Assist.log(`Response has completed for loading ${title} from server`);

                if (typeof response.data == 'string') {

                    Assist.log(`Unable to process response for loading ${title} from server: ${JSON.stringify(response)}`);

                    reject(new TaskResult(false, 'Unable to process server response from server', null));

                } else {

                    if (response.data.succeeded) {

                        resolve(new TaskResult(true, '', response.data.items));

                    } else {

                        Assist.log(`Unable to laod ${title} from server: ${response.data.message}`);
                        reject(new TaskResult(false, response.data.message, null));

                    }
                }
            }).catch(error => {

                Assist.log(`An error occured when loading ${title} from server: ${JSON.stringify(error)}`);
                reject(new TaskResult(false, `An error occured when loading ${title} from server`, null));

            });

        });



    }

    /**Deletes the specified item
     * @param {string} title The tile of the item being deleted
     * @param {string} key The id of the record to delete
     * @param {string} url The url used for the post method
     * @returns TaskResult
     */
    static async deleteItem(title, url, key) {

        Assist.log(`Starting to delete ${title} with id {key} from server using url ${AppInfo.apiUrl + url}`, 'log');

        return new Promise(function (myResolve, myReject) {

            axios({
                method: 'post',
                url: AppInfo.apiUrl + url,
                data: { uid: key },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then((response) => {

                Assist.log(`Response has completed for deleting ${title} from server`);

                if (typeof response.data == 'string') {

                    Assist.log(`Unable to process response for deleting ${title} from server: ${JSON.stringify(response)}`);

                    myReject(new TaskResult(false, 'Unable to process server response from server', null));

                } else {

                    if (response.data.succeeded) {

                        myResolve(new TaskResult(true, '', response.data.items));

                    } else {

                        Assist.log(`Unable to delete ${title} from server: ${response.data.message}`);
                        myReject(new TaskResult(false, response.data.message, null));

                    }
                }
            }).catch(error => {

                Assist.log(`An error occured when deleting ${title} from server: ${JSON.stringify(error)}`);
                myReject(new TaskResult(false, `An error occured when deleting ${title} from server`, null));

            });

        });

    }

    static async unlinkParticipant(participant, number) {

        const url = 'peer/remove/participant';

        Assist.log(`Starting to unlink participant ${participant} and peer ${number} from server using url ${AppInfo.apiUrl + url}`, 'log');

        return new Promise(function (myResolve, myReject) {

            axios({
                method: 'post',
                url: AppInfo.apiUrl + url,
                data: { uparticipant: participant, unumber: number },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then((response) => {

                Assist.log(`Response has completed for unlinking participant ${participant} and peer ${number} from server`);

                if (typeof response.data == 'string') {

                    Assist.log(`Unable to process response for unlinking participant ${participant} and peer ${number} from server: ${JSON.stringify(response)}`);

                    myReject(new TaskResult(false, 'Unable to process server response from server', null));

                } else {

                    if (response.data.succeeded) {

                        myResolve(response.data);

                    } else {

                        Assist.log(`Unable to unlinking participant ${participant} and peer ${number} from server: ${response.data.message}`);
                        myReject(response.data);

                    }
                }
            }).catch(error => {

                Assist.log(`An error occured when unlinking participant ${participant} and peer ${number} from server: ${JSON.stringify(error)}`);
                myReject(new TaskResult(false, `An error occured when unlinking participant ${participant} and peer ${number} from server`, null));

            });

        });

    }

    static async downloadJson(filename, jsonData) {

        const url = 'downloadJson';

        Assist.log(`Starting to download JSON with filename ${filename} and except ${jsonData.substring(0, 10)} from server using url ${AppInfo.apiUrl + url}`, 'log');

        return new Promise(function (myResolve, myReject) {

            axios({
                method: 'post',
                url: AppInfo.apiUrl + url,
                data: { ufilename: filename, ujson: jsonData },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                responseType: 'blob'
            }).then((response) => {

                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);

                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                link.href = href;
                link.setAttribute('download', `${filename}.csv`); //or any other extension
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);
                URL.revokeObjectURL(href);

            }).catch(error => {

                Assist.log(`An error occured when downloading JSON with filename ${filename} and except ${jsonData.substring(0, 10)} from server: ${JSON.stringify(error)}`);
                myReject(new TaskResult(false, `An error occured when downloading the file`, null));

            });

        });

    }
    /**Logs the login for the specified user
 * @param {string} username The username of the user
 * @param {string} source The source of the login
 * @returns TaskResult
 */
    static async addLogin(username, source) {

        const url = 'login/update';

        Assist.log(`Starting to login ${username} with source ${source} from server using url ${AppInfo.apiUrl + url}`, 'log');

        return new Promise(function (myResolve, myReject) {

            axios({
                method: 'post',
                url: AppInfo.apiUrl + url,
                data: { uid: 0, uusername: username, usource: source },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then((response) => {

                Assist.log(`Response has completed for logging login for ${username} from server`);

                if (typeof response.data == 'string') {

                    Assist.log(`Unable to process response for logging login ${username} from server: ${JSON.stringify(response)}`);

                    myReject(new TaskResult(false, 'Unable to process server response from server', null));

                } else {

                    if (response.data.succeeded) {

                        myResolve(new TaskResult(true, `Successfully logged the login event for ${username}`, response.data.items));

                    } else {

                        Assist.log(`Unable to log login for ${username} from server: ${response.data.message}`);
                        myReject(new TaskResult(false, response.data.message, null));

                    }
                }
            }).catch(error => {

                Assist.log(`An error occured when logging login for ${username} from server: ${JSON.stringify(error)}`);
                myReject(new TaskResult(false, `An error occured when logging login for ${username} from server`, null));

            });

        });



    }

    /**Adds the specified audit action in the database
 * @param {string} title The title of the audit
 * @param {string} action The action of the log
 * @param {string} description The description of the log
 * @param {string} exception The exception of the log
 * @returns TaskResult
 */
    static async addAudit(username, title, action, description) {

        const url = 'audit/update';

        Assist.log(`Starting to audit ${title} with from server using url ${AppInfo.apiUrl + url}`, 'log');

        return new Promise(function (myResolve, myReject) {

            axios({
                method: 'post',
                url: AppInfo.apiUrl + url,
                data: {
                    uid: 0,
                    uusername: username,
                    utitle: title,
                    uaction: action,
                    udescription: description,
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then((response) => {

                Assist.log(`Response has completed for audit ${title} from server`);

                if (typeof response.data == 'string') {

                    Assist.log(`Unable to process response for audit ${title} from server: ${JSON.stringify(response)}`);

                    myReject(new TaskResult(false, 'Unable to process server response from server', null));

                } else {

                    if (response.data.succeeded) {

                        myResolve(new TaskResult(true, `Successfully added the audit for ${title}`, response.data.items));

                    } else {

                        Assist.log(`Unable to audit ${title} from server: ${response.data.message}`);
                        myReject(new TaskResult(false, response.data.message, null));

                    }
                }
            }).catch(error => {

                Assist.log(`An error occured when auditing ${title} from server: ${JSON.stringify(error)}`);
                myReject(new TaskResult(false, `An error occured when auditting ${title} from server`, null));

            });

        });
    }

    /**Logs the specified action in the database
* @param {string} title The title of the log
* @param {string} action The action of the log
* @param {string} description The description of the log
* @param {string} exception The exception of the log
* @returns TaskResult
*/
    static async addLog(username, title, action, description, exception) {

        const url = 'log/update';

        Assist.log(`Starting to log ${title} with from server using url ${AppInfo.apiUrl + url}`, 'log');

        return new Promise(function (myResolve, myReject) {

            axios({
                method: 'post',
                url: AppInfo.apiUrl + url,
                data: {
                    uid: 0,
                    uusername: username,
                    utitle: title,
                    uaction: action,
                    udescription: description,
                    uexception: exception === null ? '' : JSON.stringify(exception)
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then((response) => {

                Assist.log(`Response has completed for log ${title} from server`);

                if (typeof response.data == 'string') {

                    Assist.log(`Unable to process response for log ${title} from server: ${JSON.stringify(response)}`);

                    myReject(new TaskResult(false, 'Unable to process server response from server', null));

                } else {

                    if (response.data.succeeded) {

                        myResolve(new TaskResult(true, '', response.data.items));

                    } else {

                        Assist.log(`Unable to log ${title} from server: ${response.data.message}`);
                        myReject(new TaskResult(false, response.data.message, null));

                    }
                }
            }).catch(error => {

                Assist.log(`An error occured when logging ${title} from server: ${JSON.stringify(error)}`);
                myReject(new TaskResult(false, `An error occured when logging ${title} from server`, null));

            });

        });
    }

    static processFileUpload(e) {

        const result = new TaskResult();

        if (e.request.status === 200) {

            try {

                const res = JSON.parse(e.request.response);

                console.log('runq', res)

                if (res === null) {

                    Assist.showMessage(`The response from the server is invalid. Please try again`, 'error');
                } else {
                    if (res.Succeeded) {

                        result.Succeeded = true;
                        result.Result = `${AppInfo.fileServer}${res.Data}`;
                    }
                    else {
                        Assist.showMessage(res.Message, 'error');
                    }

                }

            } catch (x) {
                Assist.showMessage(`Unable to process response from server. Please try again`, 'error');
            }

        } else {
            Assist.showMessage(`Unable to upload thumbnail image. Please try again`, 'error');
        }

        return result;
    }

    /**Sends a message to all devices with the specified title and body
    * @param {string} utitle The title of the notification
    * @param {string} ubody The body for the notification
    * @param {string} utopic The topic of the message
    * @returns TaskResult
    */
    static async sendTopicMessage(utitle, ubody, utopic = 'Twyshe') {

        const url = 'send-fcm-topic-message';

        Assist.log(`Starting to send notiofication with ${utitle} with topic {topic} from server using url ${AppInfo.apiUrl + url}`, 'log');

        return new Promise(function (myResolve) {

            axios({
                method: 'post',
                url: AppInfo.apiUrl + url,
                data: {
                    topic: utopic,
                    title: utitle,
                    body: ubody
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then((response) => {

                Assist.log(`Response has completed for sending notification ${utitle} from server`);

                myResolve(new TaskResult(true, 'The notification has been sent successfully!', response.data.items));

            }).catch(error => {

                Assist.log(`An error occured when sending notification ${utitle} from server: ${JSON.stringify(error)}`);
                myResolve(new TaskResult(false, `An error occured when sending notification ${utitle} from server`, null));

            });

        });



    }

}

export default Assist