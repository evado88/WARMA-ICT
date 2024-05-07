import React, { useState, useEffect } from 'react';
import axios from "axios";
import SelectBox from 'devextreme-react/select-box';
import { TextBox } from 'devextreme-react/text-box';
import Button from 'devextreme-react/button';
import ValidationSummary from 'devextreme-react/validation-summary';
import { LoadPanel } from 'devextreme-react/load-panel';
import { useHistory } from "react-router-dom";
import Toolbar, { Item } from 'devextreme-react/toolbar';
import {
    Validator,
    RequiredRule,
    EmailRule
} from 'devextreme-react/validator';

import AppInfo from '../app-info.js';
import Assist from '../assist.js';

const UpdatePhonePage = (props) => {

    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [pin, setPIN] = useState('');
    const [color, setColor] = useState('');
    const [email, setEmail] = useState('');
    const [type, setType] = useState('');

    const title = 'Phone';
    const id = props.match.params.eid === undefined ? 0 : props.match.params.eid;
    const action = id === 0 ? 'Add' : 'Update';
    const verb = id === 0 ? 'adding' : 'Updating';

    useEffect(() => {


        const loadData = () => {

            setLoading(true);

            const url = AppInfo.apiUrl + '/phone/number/' + id;

            Assist.log(`Starting to load ${title} from server ${url}`);

            // invalid url will trigger an 404 error
            axios.get(url).then((response) => {

                Assist.log(`Response for loading ${title} has completed from server`);
                setLoading(false);

                if (typeof response.data == 'string') {

                    Assist.showMessage("Unable to process server response from server");
                    setError(true);

                } else {

                    if (response.data.succeeded) {
                        setError(false);
                        setName(response.data.items[0].phone_name);
                        setNumber(response.data.items[0].phone_number);
                        setPIN(response.data.items[0].phone_pin);
                        setColor(response.data.items[0].phone_color);
                        setEmail(response.data.items[0].phone_email);
                        setType(response.data.items[0].p_status);

                    } else {

                        Assist.showMessage(response.data.message);
                        setError(true);
                    }
                }
            }).catch(error => {

                setLoading(false);
                setError(true);

                Assist.log(`An errocooured when loading ${title} from server: ${error}`);
                Assist.showMessage(`An error occured when loading ${title} from server`);


            });
        }

        if (id !== 0) {

            loadData();
        }

        //audit
        Assist.addAudit(window.sessionStorage.getItem("ruser"), 'User', verb, id).then((res) => {

            Assist.log(res.Message, "info");

        }).catch((x) => {

            Assist.log(x.Message, "warn");
        });

    }, [id, verb]);


    const onFormSubmit = async (e) => {

        e.preventDefault();


        setLoading(true);

        const url = AppInfo.apiUrl + 'phone/update';


        const fields = {
            uid: id,
            ustatus: Assist.getTypeId(type),
            user: window.sessionStorage.getItem('ruser')
        }

        console.log('param ax', fields);

        Assist.log(`Starting to ${verb} ${title} on server ${url}`);

        axios({
            method: 'post',
            url: url,
            data: fields,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then((response) => {

            Assist.log(`Response for ${verb} ${title} has completed on server`);

            setLoading(false);

            if (typeof response.data == 'string') {

                Assist.showMessage(`Unable to process server response for ${verb} ${title} from server`);

            } else {

                if (response.data.succeeded) {

                    setName(response.data.items[0].phone_name);
                    setNumber(response.data.items[0].phone_number);
                    setPIN(response.data.items[0].phone_pin);
                    setColor(response.data.items[0].phone_color);
                    setEmail(response.data.items[0].phone_email);
                    setType(response.data.items[0].p_status);


                    //check if user was adding and redirect
                    if (id === 0) {
                        history.push(`/phone/edit/${response.data.items[0].phone_number}`);
                    }

                    Assist.showMessage(`The ${title.toLowerCase()} has been successfully saved!`, 'success');

                } else {

                    Assist.showMessage(response.data.message, 'error');
                    setError(true);
                }
            }

        }).catch(error => {

            setLoading(false);

            Assist.log(`An error occoured when ${verb} ${title.toLowerCase()} on server: ${error}`);
            Assist.showMessage(`An error occured when ${verb} ${title.toLowerCase()}. Please try again`, 'error');

        });
    }


    return (
        <React.Fragment>
            <h2 className={'content-block'}>{action} {title}</h2>
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
                <form action="your-action" onSubmit={onFormSubmit} disabled={error || loading}>
                    <div className="dx-fieldset">
                        <div className="dx-fieldset-header">Properties</div>

                        <div className="dx-field">
                            <div className="dx-field-label">Names</div>
                            <div className="dx-field-value">
                                <TextBox validationMessagePosition="left" onValueChanged={(e) => setName(e.value)}
                                    inputAttr={{ 'aria-label': 'Names' }} value={name}
                                    disabled={true} readOnly={id === 0 ? false : true}>
                                    <Validator>
                                        <RequiredRule message="name is required" />

                                    </Validator>
                                </TextBox>
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">Phone Number</div>
                            <div className="dx-field-value">
                                <TextBox disabled={true} onValueChanged={(e) => setNumber(e.value)}
                                    value={number}
                                    inputAttr={{ 'aria-label': 'Phone Number' }}
                                >
                                    <Validator>
                                        <RequiredRule message="Phone number is required" />
                                    </Validator>
                                </TextBox>
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">PIN</div>
                            <div className="dx-field-value">
                                <TextBox disabled={true} onValueChanged={(e) => setPIN(e.value)}
                                    value={pin}
                                    inputAttr={{ 'aria-label': 'PIN' }}
                                >
                                    <Validator>
                                        <RequiredRule message="PIN is required" />
                                    </Validator>
                                </TextBox>
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">Color</div>
                            <div className="dx-field-value">
                                <TextBox disabled={true} onValueChanged={(e) => setColor(e.value)}
                                    value={color}
                                    inputAttr={{ 'aria-label': 'Color' }}
                                >
                                </TextBox>
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">Email</div>
                            <div className="dx-field-value">
                                <TextBox disabled={true} onValueChanged={(e) => setEmail(e.value)}
                                    value={email}
                                    inputAttr={{ 'aria-label': 'Email' }}
                                >
                                    <Validator>
                                        <RequiredRule message="Email is required" />
                                        <EmailRule message="Please enter a valid email address" />
                                    </Validator>
                                </TextBox>
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">Type</div>
                            <div className="dx-field-value">
                                <SelectBox dataSource={AppInfo.phoneTypeList} onValueChanged={(e) => setType(e.value)}
                                    validationMessagePosition="left" value={type} disabled={error}>
                                    <Validator>
                                        <RequiredRule message="Type is required" />
                                    </Validator>
                                </SelectBox>
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


export default UpdatePhonePage;
