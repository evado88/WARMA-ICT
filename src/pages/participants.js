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

const Participants = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading data...');

  const pageConfig = {
    currentUrl: 'participant/list/1/0/na',
    deleteUrl: 'participant/delete',
    single: 'Participant',
    title: 'Participants',
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
    Assist.addAudit(window.sessionStorage.getItem("ruser"), 'Participants', 'View', '').then((res) => {

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
        columnHidingEnabled={true}
        onCellPrepared={(e) => {

          if (e.rowType === "data") {
            if (e.column.dataField === "color_code") {
              e.cellElement.style.cssText = `color: white; background-color: ${e.data.color_code}`;
            }
          }
        }}>
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
          dataField={'status'}
          caption={'Status'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'parent'}
          caption={'Parent'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'username'}
          caption={'Peer Navigator'}
          hidingPriority={8}
        />
        <Column
          dataField={'upload'}
          caption={'Upload ID'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'enrollment_date'}
          caption={'Enroll Date'}
          hidingPriority={8}
        />
        <Column
          dataField={'study_number'}
          caption={'Study No'}
          hidingPriority={8}
        />
        <Column
          dataField={'names'}
          caption={'Name'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'birthday'}
          caption={'DOB'}
          hidingPriority={8}
        />
        <Column
          dataField={'downloaded_messenger'}
          caption={'Downloaded Messenger'}
          hidingPriority={8}
        />
        <Column
          dataField={'no_download_messenger_reason'}
          caption={'No Download Messenger Reason'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'no_download_messenger_reason_specify'}
          caption={'No Download Messenger Reason Specify'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'phone_number'}
          caption={'Phone Number'}
          hidingPriority={8}
        />
        <Column
          dataField={'own_phone'}
          caption={'Own Phone'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'residency'}
          caption={'Residency'}
          hidingPriority={8}
        />
        <Column
          dataField={'prefered_contact_method'}
          caption={'Prefered Contact Method'}
          hidingPriority={8}
        />
        <Column
          dataField={'contact_frequency'}
          caption={'Contact Frequency'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_modern_contraception_use'}
          caption={'Modern Contraception Use'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_contraception_male_condom'}
          caption={'Contraception Male Condom'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_contraception_female_condom'}
          caption={'Contraception Female Condom'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_contraception_implant'}
          caption={'Contraception Implant'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_contraception_injection'}
          caption={'Contraception Injection'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_contraception_iud'}
          caption={'Contraception IUD'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_contraception_ius'}
          caption={'Contraception IUS'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_contraception_pills'}
          caption={'Contraception Pills'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_contraception_other'}
          caption={'Contraception Other'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_contraception_other_specify'}
          caption={'Contraception Other Specify'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_contraception_satisfaction'}
          caption={'Contraception Satisfaction'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_contraception_satisfaction_reason'}
          caption={'Contraception Satisfaction Reason'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_contraception_stop_reason'}
          caption={'Contraception Stop Reason'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_contraception_no_use_reason'}
          caption={'Contraception None Use Reason'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_know_status'}
          caption={'HIV Know Status'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_last_test'}
          caption={'HIV Last Test'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_used_prep'}
          caption={'HIV Used Prep'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_prep_last_refil'}
          caption={'HIV Prep Last Refil Date'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_prep_last_refil_source'}
          caption={'HIV Prep Last Refil Source'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_prep_last_refil_source_specify'}
          caption={'HIV Prep Last Refil Source Specify'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_prep_problems'}
          caption={'HIV Prep Problems'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_prep_questions'}
          caption={'HIV Prep Questions'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_taking_art'}
          caption={'HIV Taking ART'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_last_refil'}
          caption={'HIV Last ART Refil Date'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_last_refil_source'}
          caption={'HIV Last Refil Source'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_last_refil_source_specify'}
          caption={'HIV Last Refil Source Specify'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_art_problems'}
          caption={'HIV ART Problems'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_art_questions'}
          caption={'HIV ART Questions'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_desired_support_reminders_appointments'}
          caption={'HIV Desired Support Refils Reminders '}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_desired_support_reminders_checkins'}
          caption={'HIV Desired Support Reminders Adherence'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_desired_support_refil_accompany'}
          caption={'HIV Desired Support PN Refil Accompany'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_desired_support_refil_pn_accompany'}
          caption={'HIV Desired Support PN Clinic Visit'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_desired_support_other'}
          caption={'HIV Desired Support Other'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_desired_support_other_specify'}
          caption={'HIV Desired Support Other Specify'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_prep_desired_support_reminders_appointments'}
          caption={'Prep Desired Support Refils Reminders '}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_prep_desired_support_reminders_adherence'}
          caption={'Prep Desired Support Reminders Adherence'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_prep_desired_support_refil_pn_accompany'}
          caption={'Prep Desired Support PN Refil Accompany'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_prep_desired_support_pn_hiv_kit'}
          caption={'Prep Desired Support PN Self Test'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_prep_desired_support_other'}
          caption={'Prep Desired Support Other'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_prep_desired_support_other_specify'}
          caption={'Prep Desired Support Other Specify'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'history_hiv_prep_stop_reason'}
          caption={'Prep Stop Reason'}
          hidingPriority={8}
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
          dataField={'p_status'}
          caption={'Status'}
          hidingPriority={8}
          visible={false}
        />

      </DataGrid>
    </React.Fragment>
  )
};

export default Participants;