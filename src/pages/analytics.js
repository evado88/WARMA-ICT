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

const Analytics = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading data...');

  const pageConfig = {
    currentUrl: 'analytic/list',
    deleteUrl: 'analytic/delete',
    single: 'Analytic',
    title: 'Analytics',
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
    Assist.addAudit(window.sessionStorage.getItem("ruser"), 'Analytics', 'View', '').then((res) => {

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
          dataField={'type'}
          caption={'Type'}
          hidingPriority={8}
        />
        <Column
          dataField={'start_date'}
          caption={'Start Date'}
          dataType={'date'}
          format={'dd MMMM yyy HH:mm'}
          hidingPriority={5}
        />
        <Column
          dataField={'end_date'}
          caption={'End Date'}
          dataType={'date'}
          format={'dd MMMM yyy HH:mm'}
          hidingPriority={5}
        />
        <Column
          dataField={'duration'}
          caption={'Duration (Seconds)'}
          hidingPriority={6}
        />
        <Column
          dataField={'result'}
          caption={'Result'}
          hidingPriority={6}
        />
        <Column
          dataField={'subject'}
          caption={'Subject'}
          hidingPriority={6}
        />
        <Column
          dataField={'created_date'}
          caption={'Date'}
          dataType={'date'}
          format={'dd MMMM yyy HH:mm'}
          hidingPriority={5}
        />
        <Column
          dataField={'upload_date'}
          caption={'Date Uploaded'}
          dataType={'date'}
          format={'dd MMM yyy HH:mm'}
          hidingPriority={5} />
      </DataGrid>
    </React.Fragment>
  )
};

export default Analytics;