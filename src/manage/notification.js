import React, { useState, useEffect } from 'react';
import axios from "axios";
import { TextBox } from 'devextreme-react/text-box';
import Button from 'devextreme-react/button';
import ValidationSummary from 'devextreme-react/validation-summary';
import { LoadPanel } from 'devextreme-react/load-panel';
import { useHistory } from "react-router-dom";
import Toolbar, { Item } from 'devextreme-react/toolbar';

import {
    Validator,
    RequiredRule,
} from 'devextreme-react/validator';

import AppInfo from '../app-info.js';
import Assist from '../assist.js';

const Notification = (props) => {

    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [type, setType] = useState('');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [description, setDescription] = useState('');

    const pageTitle = 'Notification';
    const id = props.match.params.eid === undefined ? 0 : props.match.params.eid;
    const action = id === 0 ? 'Add' : 'Update';
    const verb = id === 0 ? 'adding' : 'Updating';

    useEffect(() => {


        const loadData = () => {

            setLoading(true);

            const url = AppInfo.apiUrl + 'notification/id/' + id;

            Assist.log(`Starting to load ${pageTitle} from server ${url}`);

            // invalid url will trigger an 404 error
            axios.get(url).then((response) => {

                Assist.log(`Response for loading ${pageTitle} has completed from server`);
                setLoading(false);

                if (typeof response.data == 'string') {

                    Assist.showMessage("Unable to process server response from server");
                    setError(true);

                } else {

                    if (response.data.succeeded) {
                        setError(false);

                        setType(response.data.items[0].notification_type);
                        setTitle(response.data.items[0].notification_title);
                        setBody(response.data.items[0].notification_body);
                        setDescription(response.data.items[0].notification_description);
                    } else {

                        Assist.showMessage(response.data.message);
                        setError(true);
                    }
                }
            }).catch(error => {

                setLoading(false);
                setError(true);

                Assist.log(`An errocooured when loading ${pageTitle} from server: ${error}`);
                Assist.showMessage(`An error occured when loading ${pageTitle} from server`);


            });
        }

        if (id !== 0) {

            loadData();
        }

            //audit
            Assist.addAudit(window.sessionStorage.getItem("ruser"), 'Notification', verb, id).then((res) => {

                Assist.log(res.Message, "info");
    
            }).catch((x) => {
    
                Assist.log(x.Message, "warn");
            });

    }, [id, verb]);


    const onFormSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        const url = AppInfo.apiUrl + 'notification/update';

        const fields = {
            uid: id,
            utype: type,
            utitle: title,
            ubody: body,
            udescription: description,
            user: window.sessionStorage.getItem('ruser')
        }

        Assist.log(`Starting to ${verb} ${pageTitle} on server ${url}`);

        axios({
            method: 'post',
            url: url,
            data: fields,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then((response) => {

            Assist.log(`Response for ${verb} ${pageTitle} has completed on server`);

            setLoading(false);

            if (typeof response.data == 'string') {

                Assist.showMessage(`Unable to process server response for ${verb} ${pageTitle} from server`);

            } else {

                if (response.data.succeeded) {


                    setType(response.data.items[0].notification_type);
                    setTitle(response.data.items[0].notification_title);
                    setBody(response.data.items[0].notification_body);
                    setDescription(response.data.items[0].notification_description);

                    //check if user was adding and redirect
                    if (id === 0) {

                        Assist.sendTopicMessage(title, body).then((res) => {

                            Assist.log(res.Message, "info");

                        }).catch((x) => {
                            Assist.showMessage(x.Message, "error");
                        }).finally(() => {
                            history.push(`/notification/edit/${response.data.items[0].notification_id}`);
                        })


                    }

                    Assist.showMessage(`The ${pageTitle.toLowerCase()} has been successfully saved!`, 'success');

                } else {

                    Assist.showMessage(response.data.message, 'error');
                    setError(true);
                }
            }

        }).catch(error => {

            setLoading(false);

            Assist.log(`An error occoured when ${verb} ${pageTitle.toLowerCase()} on server: ${error}`);
            Assist.showMessage(`An error occured when ${verb} ${pageTitle.toLowerCase()}. Please try again`, 'error');

        });
    }


    return (
        <React.Fragment>
            <h2 className={'content-block'}>{action} {pageTitle}</h2>
            <LoadPanel
                shadingColor="rgba(0,0,0,0.4)"
                position={{ of: '#currentForm' }}
                visible={loading}
                showIndicator={true}
                shading={true}
                showPane={true}
                hideOnOutsideClick={false}
            />
            <div className={'content-block dx-card responsive-paddings'} id="currentForm">
                <Toolbar>
                    <Item location="before"
                        locateInMenu="auto"
                        widget="dxButton"
                        options={{
                            icon: 'revert',
                            onClick: () => {
                                history.goBack();
                            },
                        }} />
                </Toolbar>
                <form action="your-action" onSubmit={onFormSubmit}>

                    <div className="dx-fieldset">
                        <div className="dx-fieldset-header">Properties</div>

                        <div className="dx-field">
                            <div className="dx-field-label">Type</div>
                            <div className="dx-field-value">
                                <TextBox validationMessagePosition="left" onValueChanged={(e) => setType(e.value)}
                                    inputAttr={{ 'aria-label': 'Type' }} value={type} disabled={error}>
                                    <Validator>
                                        <RequiredRule message="Type is required" />
                                    </Validator>
                                </TextBox>
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">Title</div>
                            <div className="dx-field-value">
                                <TextBox disabled={error} onValueChanged={(e) => setTitle(e.value)}
                                    value={title}
                                    inputAttr={{ 'aria-label': 'Title' }}
                                >
                                    <Validator>
                                        <RequiredRule message="Title is required" />
                                    </Validator>
                                </TextBox>
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">Body</div>
                            <div className="dx-field-value">
                                <TextBox disabled={error} onValueChanged={(e) => setBody(e.value)}
                                    value={body}
                                    inputAttr={{ 'aria-label': 'Body' }}
                                >
                                    <Validator>
                                        <RequiredRule message="Body is required" />
                                    </Validator>
                                </TextBox>
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">Description</div>
                            <div className="dx-field-value">
                                <TextBox disabled={error} onValueChanged={(e) => setDescription(e.value)}
                                    value={description}
                                    inputAttr={{ 'aria-label': 'Description' }}
                                >
                                    <Validator>
                                        <RequiredRule message="Description is required" />
                                    </Validator>
                                </TextBox>
                            </div>
                        </div>
                    </div>

                    <div className="dx-fieldset">
                        <ValidationSummary id="summary" />
                        <br></br>
                        <Button
                            width="100%"
                            id="button"
                            text="Save"
                            type="danger"
                            disabled={error}
                            useSubmitBehavior={true} />
                    </div>
                </form>
            </div>
        </React.Fragment>
    );
}

export default Notification;
