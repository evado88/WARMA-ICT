import React, { useState, useEffect } from 'react';
import 'devextreme/data/odata/store';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import DataGrid, {
  Column,
  Pager,
  Paging,
  FilterRow,
  LoadPanel,
  ColumnChooser,
} from 'devextreme-react/data-grid';
import Assist from '../assist.js';

const Followups = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading data...');

  const pageConfig = {
    currentUrl: 'followup/list/1/0/na',
    deleteUrl: 'followup/delete',
    single: 'follow-up',
    title: 'Follow-ups',
  }


  useEffect(() => {

    async function fetchData() {

      Assist.loadData(pageConfig.title, pageConfig.currentUrl).then((res) => {

        setData(res.Result);
        setLoading(false);

        if (res.Result.length === 0) {
          setLoadingText('No Data')
        } else {
          setLoadingText('')
        }

      }).catch((ex) => {

        Assist.showMessage(ex.Message, "error");
        setLoadingText('Could not show information')

      });
    }

    fetchData();

    //audit
    Assist.addAudit(window.sessionStorage.getItem("ruser"), 'Follow-ups', 'View', '').then((res) => {

      Assist.log(res.Message, "info");

    }).catch((x) => {

      Assist.log(x.Message, "warn");
    });

  }, [pageConfig.title, pageConfig.currentUrl]);


  return (
    <React.Fragment>
      <h2 className={'content-block'}>{pageConfig.title}</h2>
      <Toolbar>
        <Item location="before"
          locateInMenu="auto"
          widget="dxButton"
          options={{
            icon: 'save',
            onClick: () => Assist.downloadJson(pageConfig.title, JSON.stringify(data))
          }} />
      </Toolbar>
      <DataGrid
        className={'dx-card wide-card'}
        dataSource={data}
        keyExpr={'id'}
        noDataText={loadingText}
        showBorders={false}
        focusedRowEnabled={true}
        defaultFocusedRowIndex={0}
        columnAutoWidth={true}
        columnHidingEnabled={true}>
        <Paging defaultPageSize={10} />
        <Pager showPageSizeSelector={true} showInfo={true} />
        <FilterRow visible={true} />
        <LoadPanel enabled={loading} />
        <ColumnChooser
          enabled={true}
          mode='select'
        >
        </ColumnChooser>
        <Column
          dataField={'id'}
          caption={'ID'}
          hidingPriority={8}
        />
        <Column
          dataField={'parent'}
          caption={'Parent ID'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'status'}
          caption={'Status ID'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'upload'}
          caption={'Upload ID'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'username'}
          caption={'Peer Navigator'}
          hidingPriority={8}
        />
        <Column
          dataField={'art_number'}
          caption={'Study No'}
          hidingPriority={8}
        />
        <Column
          dataField={'srh_contraception_started'}
          caption={'Started Contraception'}
          hidingPriority={6}
        />
        <Column
          dataField={'srh_prep_started'}
          caption={'Started Prep'}
          hidingPriority={6}
        />
        <Column
          dataField={'srh_contraception_started_problems'}
          caption={'Contraception Started Problems'}
          hidingPriority={5}
        />
        <Column
          dataField={'srh_prep_started_problems'}
          caption={'Prep Started Problems'}
          hidingPriority={5}
        />
        <Column
          dataField={'srh_contraception_started_side_effects'}
          caption={'Contraception Started Side-effects'}
          hidingPriority={6}
          visible={false}
        />
        <Column
          dataField={'srh_prep_started_side_effects'}
          caption={'Prep Started Side-effects'}
          hidingPriority={6}
          visible={false}
        />
        <Column
          dataField={'srh_contraception_started_other'}
          caption={'Contraception Started Other Problems'}
          hidingPriority={6}
          visible={false}
        />
        <Column
          dataField={'srh_prep_started_other'}
          caption={'Prep Started Other Problems'}
          hidingPriority={6}
          visible={false}
        />
        <Column
          dataField={'srh_contraception_interest'}
          caption={'Contraception Interest'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_contraception_started_evidence'}
          caption={'Contraception Started Evidence'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_contraception_no_interest_reason'}
          caption={'Contraception No Interest Reason'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_contraception_interest_male_condom'}
          caption={'Contraception Interest Male Condom'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_contraception_interest_female_condom'}
          caption={'Contraception Interest Female Condom'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_contraception_interest_implant'}
          caption={'Contraception Interest Implant'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_contraception_interest_injection'}
          caption={'Contraception Interest Injection'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_contraception_interest_iud'}
          caption={'Contraception Interest IUD'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_contraception_interest_ius'}
          caption={'Contraception Interest IUS'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_contraception_interest_pills'}
          caption={'Contraception Interest Pills'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_contraception_interest_other'}
          caption={'Contraception Interest Other'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_contraception_interest_other_specify'}
          caption={'Contraception Interest Other Specify'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_contraception_method_in_mind'}
          caption={'Contraception Method In Mind'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_contraception_information_methods'}
          caption={'Contraception Like Information Methods'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_contraception_find_schedule_facility'}
          caption={'Contraception Find Schedule Facility'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_contraception_find_schedule_facility_yes_date'}
          caption={'Contraception Find Schedule Facility Yes Date'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_contraception_find_schedule_facility_yes_pn_accompany'}
          caption={'Contraception Fnd Schedule Facility Yes PN Accompany'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_contraception_find_schedule_facility_no_date'}
          caption={'Contraception Find Schedule Facility No Date'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_contraception_find_schedule_facility_no_pick'}
          caption={'Contraception Find Schedule Facility No Pick'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_contraception_find_schedule_facility_selected'}
          caption={'Contraception Find Schedule Facility Selected'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_contraception_find_schedule_facility_other'}
          caption={'Contraception Find Schedule Facility Selected Other'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_contraception_information_app'}
          caption={'Contraception Like Information On App'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_contraception_information_app_sent'}
          caption={'Contraception Information App Sent'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_contraception_information_app_sent_date'}
          caption={'Contraception Information App Sent date'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_contraception_learn_methods'}
          caption={'Contraception Learn Methods'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_prep_interest'}
          caption={'Prep Interest'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_prep_started_evidence'}
          caption={'Prep Started Evidence'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_prep_no_interest_reason'}
          caption={'Prep No Interest Reason'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_prep_information_app'}
          caption={'Prep Like Information On App'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_prep_information_app_sent'}
          caption={'Prep Information Sent'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_prep_information_app_sent_date'}
          caption={'Prep Information Sent Date'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_prep_find_schedule_facility'}
          caption={'Prep Find Schedule Facility'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_prep_find_schedule_facility_yes_date'}
          caption={'Prep Find Schedule Facility Yes Date'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_prep_find_schedule_facility_yes_pn_accompany'}
          caption={'Prep Find Schedule Facility Yes PN Accompany'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_prep_find_schedule_facility_no_date'}
          caption={'Prep Find Schedule Facility No Date'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_prep_find_schedule_facility_no_pick'}
          caption={'Prep Find Schedule Facility No Pick'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_prep_find_schedule_facility_selected'}
          caption={'Prep Find Schedule Facility Selected'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_prep_find_schedule_facility_other'}
          caption={'Prep Find Schedule Facility Selected Other'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'srh_prep_information_read'}
          caption={'Prep Information On App Read'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'next_date'}
          caption={'Next Followup Date'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_used_prep_no_reason'}
          caption={'Prep No Use Reason'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'upload_id'}
          caption={'Upload ID'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'upload_username'}
          caption={'Upload Username'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'upload_status'}
          caption={'Uplaod Status'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'upload_date'}
          caption={'Upload Date'}
          hidingPriority={8}
        />
        <Column
          dataField={'f_status'}
          caption={'Status'}
          hidingPriority={8}
          visible={false}
        />

      </DataGrid>
    </React.Fragment>
  )
};

export default Followups;