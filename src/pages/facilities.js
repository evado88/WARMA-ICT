import React, { useState, useEffect } from 'react';
import 'devextreme/data/odata/store';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import { useHistory } from "react-router-dom";

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

const Facilities = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading data...');

  const history = useHistory();

  const pageConfig = {
    currentUrl: 'facility/list',
    deleteUrl: 'facility/delete',
    single: 'facility',
    title: 'Facilities',
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
     Assist.addAudit(window.sessionStorage.getItem("ruser"), 'Facilities', 'View', '').then((res) => {

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

      Assist.showMessage(ex.Message, "error");
      e.cancel = true;
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
            icon: 'plus',
            onClick: () => {
              history.push('/facility/add');
            },
          }} />
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
        keyExpr={'facility_id'}
        noDataText={loadingText}
        showBorders={false}
        focusedRowEnabled={true}
        defaultFocusedRowIndex={0}
        columnAutoWidth={true}
        columnHidingEnabled={true}
        onRowRemoving={deleteItem}
        onCellPrepared={(e) => {

          if (e.rowType === "data") {
            if (e.column.dataField === "color_code") {
              e.cellElement.style.cssText = `color: white; background-color: ${e.data.color_code}`;
            }
          }
        }}>
        <Paging defaultPageSize={10} />
        <Editing
          mode="row"
          allowUpdating={false}
          allowDeleting={true}
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
          dataField={'facility_id'}
          caption={'ID'}
          hidingPriority={8}
        />
        <Column
          dataField={'facility_name'}
          caption={'Name'}
          hidingPriority={8}
          cellRender={(e) => {
            return <a href={`#/facility/edit/${e.data.facility_id}`}>{e.data.facility_name}</a>;
          }}
        />
        <Column
          dataField={'facility_address'}
          caption={'Address'}
          hidingPriority={8}
        />
        <Column
          dataField={'facility_phone'}
          caption={'Phone'}
          hidingPriority={6}
        />

        <Column
          dataField={'facility_website'}
          caption={'Website'}
          hidingPriority={6}
          visible={false}
        />
        <Column
          dataField={'facility_email'}
          caption={'Email'}
          hidingPriority={6}
        />
        <Column
          dataField={'f_status'}
          caption={'Status'}
          hidingPriority={8}
        />
        <Column
          dataField={'facility_createdate'}
          caption={'Date'}
          dataType={'date'}
          format={'dd MMMM yyy'}
          hidingPriority={5}
        />

      </DataGrid>
    </React.Fragment>
  )
};

export default Facilities;