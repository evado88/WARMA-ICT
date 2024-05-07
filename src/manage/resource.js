import React, { useState, useEffect } from 'react';
import axios from "axios";
import SelectBox from 'devextreme-react/select-box';
import { TextBox } from 'devextreme-react/text-box';
import Button from 'devextreme-react/button';
import ValidationSummary from 'devextreme-react/validation-summary';
import { LoadPanel } from 'devextreme-react/load-panel';
import { useHistory } from "react-router-dom";
import Toolbar, { Item } from 'devextreme-react/toolbar';
import FileUploader from 'devextreme-react/file-uploader';

import {
    Validator,
    RequiredRule,
} from 'devextreme-react/validator';

import AppInfo from '../app-info.js';
import Assist from '../assist.js';

const Resource = (props) => {

    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [resourceUrl, setResourceUrl] = useState('');
    const [thumbnail, setThumbnail] = useState(AppInfo.noImageUrl);
    const [status, setStatus] = useState('');

    const title = 'Resource';
    const id = props.match.params.eid === undefined ? 0 : props.match.params.eid;
    const action = id === 0 ? 'Add' : 'Update';
    const verb = id === 0 ? 'adding' : 'Updating';

    useEffect(() => {


        const loadData = () => {

            setLoading(true);

            const url = AppInfo.apiUrl + '/resource/id/' + id;

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

                        setName(response.data.items[0].resource_name);
                        setDescription(response.data.items[0].resource_description);
                        setResourceUrl(response.data.items[0].resource_url);
                        setThumbnail(response.data.items[0].resource_thumbnailUrl);
                        setStatus(response.data.items[0].r_status);

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
        Assist.addAudit(window.sessionStorage.getItem("ruser"), 'Resource', verb, id).then((res) => {

            Assist.log(res.Message, "info");

        }).catch((x) => {

            Assist.log(x.Message, "warn");
        });

    }, [id, verb]);


    const onFormSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        const url = AppInfo.apiUrl + 'resource/update';

        const fields = {
            uid: id,
            uname: name,
            udescription: description,
            uurl: resourceUrl,
            uthumbnail: thumbnail,
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

                    setName(response.data.items[0].resource_name);
                    setDescription(response.data.items[0].resource_description);
                    setResourceUrl(response.data.items[0].resource_url);
                    setThumbnail(response.data.items[0].resource_thumbnailUrl);
                    setStatus(response.data.items[0].r_status);

                    //check if user was adding and redirect
                    if (id === 0) {

                        Assist.sendTopicMessage(`New resource has been posted`, name).then((res) => {

                            Assist.log(res.Message, "info");

                        }).catch((x) => {
                            Assist.showMessage(x.Message, "error");
                        }).finally(() => {
                            history.push(`/resource/edit/${response.data.items[0].resource_id}`);
                        })

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
                                <TextBox validationMessagePosition="left" onValueChanged={(e) => setName(e.value)}
                                    inputAttr={{ 'aria-label': 'Name' }} value={name} disabled={error}>
                                    <Validator>
                                        <RequiredRule message="Name is required" />
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
                        <div className="dx-field">
                            <div className="dx-field-label">Attachment</div>
                            <div className="dx-field-value">

                                {resourceUrl === '' && <h6>No file attached</h6>}
                                {resourceUrl !== '' && <Button
                                    width={250}
                                    text="View Attachment"
                                    type="danger"
                                    stylingMode="outlined" onClick={(e) => {
                                        const win = window.open(resourceUrl, '_blank');
                                        win.focus();

                                    }} />}
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">Choose Attachment</div>
                            <div className="dx-field-value">
                                <FileUploader
                                    multiple={false}
                                    accept='*'
                                    name='file'
                                    uploadMode='instantly'
                                    onUploaded={(e) => {
                                        const result = Assist.processFileUpload(e);

                                        if (result.Succeeded) {
                                            setResourceUrl(result.Result);
                                        }
                                    }}
                                    uploadUrl={`${AppInfo.uploadUrl}${'Resource'}`} />
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">Thumbnail</div>
                            <div className="dx-field-value">
                                <img src={thumbnail} style={{ width: '160px', height: 'auto' }} alt='Resource Thumbnail' />
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">Choose thumbail</div>
                            <div className="dx-field-value">
                                <FileUploader
                                    multiple={false}
                                    accept='image/*'
                                    name='file'
                                    uploadMode='instantly'
                                    onUploaded={(e) => {
                                        const result = Assist.processFileUpload(e);

                                        if (result.Succeeded) {
                                            setThumbnail(result.Result);
                                        }
                                    }}
                                    uploadUrl={`${AppInfo.uploadUrl}${'Resource'}`} />
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

export default Resource;
