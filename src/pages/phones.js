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
  Editing,
} from 'devextreme-react/data-grid';
import Assist from '../assist.js';
const Phones = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading data...');

  const pageConfig = {
    currentUrl: 'phone/list',
    deleteUrl: 'phone/delete',
    single: 'phone',
    title: 'Phones',
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
    Assist.addAudit(window.sessionStorage.getItem("ruser"), 'Users', 'View', '').then((res) => {

      Assist.log(res.Message, "info");

    }).catch((x) => {

      Assist.log(x.Message, "warn");
    });

  }, [pageConfig.title, pageConfig.currentUrl]);


  const deleteItem = (e) => {



    Assist.deleteItem(pageConfig.title, pageConfig.deleteUrl, e.key).then((res) => {

      e.cancel = false;
      Assist.showMessage(`The ${pageConfig.single} has been successfully deleted!`);

    }).catch((ex) => {

      e.cancel = true;
      Assist.showMessage(ex.Message, "error");
    });

  }

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
        keyExpr={'phone_id'}
        noDataText={loadingText}
        showBorders={false}
        focusedRowEnabled={true}
        defaultFocusedRowIndex={0}
        columnAutoWidth={true}
        columnHidingEnabled={true}
        onRowRemoving={deleteItem}
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
          allowDeleting={false}
          allowAdding={false} />
        <Pager showPageSizeSelector={true} showInfo={true} />
        <FilterRow visible={true} />
        <LoadPanel enabled={loading} />
        <ColumnChooser
          enabled={true}
          mode='select'
        >
        </ColumnChooser>
        <Column
          dataField={'phone_id'}
          caption={'ID'}
          hidingPriority={8}
        />
        <Column
          dataField={'phone_name'}
          caption={'Name'}
          hidingPriority={8}
          cellRender={(e) => {
            return <a href={`#/phone/edit/${e.data.phone_number}`}>{e.data.phone_name}</a>;
          }}
        />
        <Column
          dataField={'phone_number'}
          caption={'Number'}
          hidingPriority={8}
          cellRender={(e) => {
            if (e.data.phone_status === 2) {
              return <a href={`#/phone/participants/${e.data.phone_number}`}>{e.data.phone_number}</a>;
            } else {
              return e.data.phone_number;
            }

          }}
        />
        <Column
          dataField={'n_participants'}
          caption={'Assigned Participants'}
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
    </React.Fragment>
  )
};

export default Phones;