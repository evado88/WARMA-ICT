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
} from 'devextreme-react/validator';

import AppInfo from '../app-info.js';
import Assist from '../assist.js';

const Country = (props) => {

    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [status, setStatus] = useState('');

    const title = 'Country';
    const id = props.match.params.eid === undefined ? 0 : props.match.params.eid;
    const action = id === 0 ? 'Add' : 'Update';
    const verb = id === 0 ? 'adding' : 'Updating';

    useEffect(() => {


        const loadData = () => {

            setLoading(true);

            const url = AppInfo.apiUrl + 'country/id/' + id;

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

                        setName(response.data.items[0].country_name);
                        setCode(response.data.items[0].country_code);
                        setStatus(response.data.items[0].c_status);

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
           Assist.addAudit(window.sessionStorage.getItem("ruser"), 'Country', verb, id).then((res) => {

            Assist.log(res.Message, "info");

        }).catch((x) => {

            Assist.log(x.Message, "warn");
        });

    }, [id, verb]);


    const onFormSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        const url = AppInfo.apiUrl + 'country/update';

        const fields = {
            uid: id,
            uname: name,
            ucode: code,
            ustatus: status === 'Active' ? 1 : 2,
            user: window.sessionStorage.getItem('ruser')
        }

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

                    setName(response.data.items[0].country_name);
                    setCode(response.data.items[0].country_code);
                    setStatus(response.data.items[0].c_status);

                    //check if user was adding and redirect
                    if (id === 0) {
                        history.push(`/country/edit/${response.data.items[0].country_id}`);
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
                <form action="your-action" onSubmit={onFormSubmit}>

                    <div className="dx-fieldset">
                        <div className="dx-fieldset-header">Properties</div>

                        <div className="dx-field">
                            <div className="dx-field-label">Name</div>
                            <div className="dx-field-value">
                                <SelectBox  dataSource={AppInfo.countryList} validationMessagePosition="left" onValueChanged={(e) => setName(e.value)}
                                    inputAttr={{ 'aria-label': 'Name' }} value={name} disabled={error}>
                                    <Validator>
                                        <RequiredRule message="Name is required" />
                                    </Validator>
                                </SelectBox >
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">Phone Code</div>
                            <div className="dx-field-value">
                                <TextBox disabled={error} onValueChanged={(e) => setCode(e.value)}
                                    value={code}
                                    inputAttr={{ 'aria-label': 'Code' }}
                                >
                                    <Validator>
                                        <RequiredRule message="Phone code is required" />
                                    </Validator>
                                </TextBox>
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">Status</div>
                            <div className="dx-field-value">
                                <SelectBox dataSource={AppInfo.statusList} onValueChanged={(e) => setStatus(e.value)}
                                    validationMessagePosition="left" value={status} disabled={error}>
                                    <Validator>
                                        <RequiredRule message="Status is required" />
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

export default Country;
