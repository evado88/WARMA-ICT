import React, { useState, useEffect , useCallback} from 'react';
import axios from "axios";
import SelectBox from 'devextreme-react/select-box';
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

import DataGrid, {
    Column,
    Pager,
    Paging,
    FilterRow,
    Editing,
} from 'devextreme-react/data-grid';

const PhoneParticipants = (props) => {

    const history = useHistory();

    const [data, setData] = useState([]);

    const [participants, setParticipants] = useState([]);
    const [participant, setParticipant] = useState('');

    const [loading, setLoading] = useState(true);
    const [loadingText, setLoadingText] = useState('Loading data...');

    const [error, setError] = useState(false);



    const title = 'Phone Participants';
    const id = props.match.params.eid === undefined ? 0 : props.match.params.eid;
    const action = id === 0 ? 'Add' : 'Update';
    const verb = id === 0 ? 'adding' : 'Updating';


   const fetchData = useCallback(() => {

        Assist.loadData(title, 'peer/list/participant/' + id).then((res) => {

            setData(res.Result);

            if (res.Result.length === 0) {
                setLoadingText('No Data')
            } else {
                setLoadingText('')
            }

            Assist.loadData(title, 'phone-participant/list').then((result) => {

                setLoading(false);

                const list = result.Result.map((item) => (
                    item.phone_number
                ));

                setParticipants(list);

            }).catch((ex) => {

                Assist.showMessage(ex.Message, "error");
                setLoadingText('Could not show available participants')

            });

        }).catch((ex) => {

            Assist.showMessage(ex.Message, "error");
            setLoadingText('Could not show linked participants')

        });
    }, [id]);

    useEffect(() => {

        fetchData();

        //audit
        Assist.addAudit(window.sessionStorage.getItem("ruser"), 'User', verb, id).then((res) => {

            Assist.log(res.Message, "info");

        }).catch((x) => {

            Assist.log(x.Message, "warn");
        });

    }, [id, verb, fetchData]);

    const unlinkPeerParticipant = (e) => {

        Assist.unlinkParticipant(e.data.part_number, e.data.part_peer).then((res) => {

            e.cancel = false;
            Assist.showMessage(res.message, 'success');

        }).catch((ex) => {

            Assist.showMessage(ex.Message, "error");
            e.cancel = true;
        });

    }

    const onFormSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        const url = AppInfo.apiUrl + 'peer/add/participant';

        const fields = {
            unumber: id,
            uparticipant: participant,
            uuser: window.sessionStorage.getItem('ruser')
        }

        console.log('param ax', fields);

        Assist.log(`Starting to link ${participant} to ${id} on server ${url}`);

        axios({
            method: 'post',
            url: url,
            data: fields,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then((response) => {

            Assist.log(`Response for linking ${participant} to ${id} has completed on server`);

            setLoading(false);

            if (typeof response.data == 'string') {

                Assist.showMessage(`Unable to process server response for linking ${participant} to ${id} on server`);

            } else {

                if (response.data.succeeded) {


                    fetchData();


                    Assist.showMessage(response.data.message, 'success');

                } else {

                    Assist.showMessage(response.data.message, 'error');
                    setError(true);
                }
            }

        }).catch(error => {

            setLoading(false);

            Assist.log(`An error occoured when linking ${participant} to ${id} on server: ${error}`);
            Assist.showMessage(`An error occured when linking ${participant} to ${id}. Please try again`, 'error');

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
                        <div className="dx-fieldset-header">Link New Participant</div>
                        <div className="dx-field">
                            <div className="dx-field-label">Choose Participant</div>
                            <div className="dx-field-value">
                                <SelectBox dataSource={participants} onValueChanged={(e) => setParticipant(e.value)}
                                    validationMessagePosition="left" value={participant} disabled={error}>
                                    <Validator>
                                        <RequiredRule message="Participant is required" />
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
                            text="Link"
                            type="danger"
                            disabled={error}
                            useSubmitBehavior={true} />
                    </div>
                </form>
                <div className="dx-fieldset">
                    <div className="dx-fieldset-header">Linked Participants - {id}</div>
                    <div className="dx-field">
                        <DataGrid
                            className={'dx-card wide-card'}
                            dataSource={data}
                            keyExpr={'phone_id'}
                            noDataText={loadingText}
                            showBorders={false}
                            focusedRowEnabled={true}
                            defaultFocusedRowIndex={0}
                            columnAutoWidth={true}
                            columnHidingEnabled={true}
                            onRowRemoving={unlinkPeerParticipant}
                            onCellPrepared={(e) => {

                                if (e.rowType === "data") {
                                    if (e.column.dataField === "phone_color") {
                                        e.cellElement.style.cssText = `color: white; background-color: ${e.data.phone_color}`;
                                    }
                                }
                            }}>
                            <Paging defaultPageSize={5} />
                            <Editing
                                mode="row"
                                allowUpdating={false}
                                allowDeleting={true}
                                allowAdding={false} />
                            <Pager showPageSizeSelector={true} showInfo={true} />
                            <FilterRow visible={true} />
                            <LoadPanel enabled={loading} />
                            <Column
                                dataField={'phone_id'}
                                caption={'ID'}
                                hidingPriority={8}
                            />
                            <Column
                                dataField={'phone_name'}
                                caption={'Name'}
                                hidingPriority={8}
                            />
                            <Column
                                dataField={'phone_number'}
                                caption={'Number'}
                                hidingPriority={8}
                            />
                            <Column
                                dataField={'phone_pin'}
                                caption={'PIN'}
                                hidingPriority={8}
                                visible={false}
                            />
                            <Column
                                dataField={'phone_color'}
                                caption={'Color'}
                                hidingPriority={8}
                            />

                            <Column
                                dataField={'p_status'}
                                caption={'Status'}
                                hidingPriority={8}
                            />
                            <Column
                                dataField={'phone_email'}
                                caption={'Email'}
                                hidingPriority={6}
                            />
                            <Column
                                dataField={'phone_createdate'}
                                caption={'Registration Date'}
                                dataType={'date'}
                                format={'dd MMMM yyy'}
                                hidingPriority={5}
                            />
                            <Column
                                dataField={'phone_lastupdatedate'}
                                caption={'Last Update Date'}
                                dataType={'date'}
                                format={'dd MMMM yyy'}
                                hidingPriority={5}
                            />
                            <Column
                                dataField={'phone_lastupdateuser'}
                                caption={'Last Update User'}
                                hidingPriority={6}
                                visible={false}
                            />
                            <Column
                                dataField={'phone_token'}
                                caption={'Token'}
                                hidingPriority={6}
                                visible={false}
                            />
                        </DataGrid>
                    </div>
                </div>



            </div>
        </React.Fragment>
    );
}


export default PhoneParticipants;
