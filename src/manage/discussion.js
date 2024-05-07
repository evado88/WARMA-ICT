import React, { useState, useEffect } from 'react';
import SelectBox from 'devextreme-react/select-box';
import { TextBox } from 'devextreme-react/text-box';
import Button from 'devextreme-react/button';
import ValidationSummary from 'devextreme-react/validation-summary';
import { initializeApp } from "firebase/app";
import { useHistory } from "react-router-dom";
import Toolbar, { Item } from 'devextreme-react/toolbar';
import { getFirestore, getDoc, doc, updateDoc } from 'firebase/firestore/lite';
import { LoadPanel } from 'devextreme-react/load-panel';

import {
    Validator,
    RequiredRule,
} from 'devextreme-react/validator';

import AppInfo from '../app-info.js';
import Assist from '../assist.js';

const Discussion = (props) => {


    // Your web app's Firebase configuration
    // Initialize Firebase
    const app = initializeApp(Assist.firebaseConfig);

    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [utitle, setTitle] = useState('');
    const [udescription, setDescription] = useState('');
    const [ustatus, setStatus] = useState('');

    const pageTitle = 'Discussion';
    const id = props.match.params.eid === undefined ? 0 : props.match.params.eid;
    const action = id === 0 ? 'Add' : 'Update';
    const verb = id === 0 ? 'adding' : 'Updating';

    useEffect(() => {


        const loadData = async () => {

            setLoading(true);

            Assist.log(`Starting to load ${pageTitle} from server`);

            // invalid url will trigger an 404 error
            const db = getFirestore(app);

            const docRef = doc(db, 'twyshe/twyshe-discussions/twyshe-discussions', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setLoading(false);

                const item = { id: docSnap.id, statusName: docSnap.data().status === 1 ? 'Active' : 'Disabled', ...docSnap.data() };

                setTitle(item.title);
                setDescription(item.description);
                setStatus(item.statusName);

            } else {

                console.log('No such document!');
                Assist.showMessage(`Unable to find a discussion with the specified ID '${id}'`);
            }

        }

        if (id !== 0) {

            loadData();
        }

            //audit
            Assist.addAudit(window.sessionStorage.getItem("ruser"), 'Discussion', verb, id).then((res) => {

                Assist.log(res.Message, "info");
    
            }).catch((x) => {
    
                Assist.log(x.Message, "warn");
            });

    }, [id, app, verb]);


    const onFormSubmit = async (e) => {

        e.preventDefault();

        Assist.log(`Starting to ${verb} ${pageTitle} on server`);

        setLoading(true);

        // invalid url will trigger an 404 error
        const db = getFirestore(app);

        const docRef = doc(db, 'twyshe/twyshe-discussions/twyshe-discussions', id);
        await updateDoc(docRef, {
            title: utitle,
            description: udescription,
            status: ustatus === 'Active' ? 1 : 2,

        }).then((value) => {
            Assist.showMessage(`The ${pageTitle.toLowerCase()} has been successfully updated!`, 'success');
        }).catch((error) => {
            setError(true);

            Assist.log(`An error occoured when ${verb} ${pageTitle.toLowerCase()}: ${error}`);
            Assist.showMessage(`An error occured when ${verb} ${pageTitle.toLowerCase()}. Please try again`, 'error');
        }).finally(() => {
            setLoading(false);
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
                <form action="your-action" onSubmit={onFormSubmit} disabled={error || loading}>

                    <div className="dx-fieldset">
                        <div className="dx-fieldset-header">Properties</div>

                        <div className="dx-field">
                            <div className="dx-field-label">Name</div>
                            <div className="dx-field-value">
                                <TextBox validationMessagePosition="left" onValueChanged={(e) => setTitle(e.value)}
                                    inputAttr={{ 'aria-label': 'Name' }} value={utitle} disabled={error}>
                                    <Validator>
                                        <RequiredRule message="Name is required" />
                                    </Validator>
                                </TextBox>
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">Color</div>
                            <div className="dx-field-value">
                                <TextBox disabled={error} onValueChanged={(e) => setDescription(e.value)}
                                    value={udescription}
                                    inputAttr={{ 'aria-label': 'Color' }}
                                >
                                    <Validator>
                                        <RequiredRule message="Color is required" />
                                    </Validator>
                                </TextBox>
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">Status</div>
                            <div className="dx-field-value">
                                <SelectBox dataSource={AppInfo.statusList} onValueChanged={(e) => setStatus(e.value)}
                                    validationMessagePosition="left" value={ustatus} disabled={error}>
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

export default Discussion;
