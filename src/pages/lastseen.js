import React, { useState, useEffect } from 'react';
import 'devextreme/data/odata/store';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
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


const LastSeenPage = () => {

   // Your web app's Firebase configuration
  // Initialize Firebase
  const app = initializeApp(Assist.firebaseConfig);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading data...');


  const pageConfig = {
    currentUrl: 'discussion/list',
    deleteUrl: 'discussion/delete',
    single: 'last seen',
    title: 'Last Seen',
  }

  useEffect(() => {

    async function loadData() {

      Assist.log("Starting to discussions from firestore");
      //invalid url will trigger an 404 error

      const db = getFirestore(app);

      const discussionsCol = collection(db, 'twyshe/twyshe-users/twyshe-users');
      const discussionsSnapshot = await getDocs(discussionsCol);

      if (discussionsSnapshot) {

        const discussionsList = discussionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          date: new Date(doc.data().timestamp.seconds * 1000),
          name: doc.data().name,
          type: Assist.getTypeName(doc.data().status) ,
          pin: doc.data().pin,
          color: doc.data().color,
          typing: doc.data().typing,
        }));

        setData(discussionsList);
        setLoading(false);

    

      } else {
        // docSnap.data() will be undefined in this case
        setLoading(false);
        setLoadingText('Dicussions could not be loaded')
      }
    }


    loadData();

    //audit
    Assist.addAudit(window.sessionStorage.getItem("ruser"), 'Forum', 'View', '').then((res) => {

      Assist.log(res.Message, "info");

    }).catch((x) => {

      Assist.log(x.Message, "warn");
    });

  }, [app]);

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
            if (e.column.dataField === "color") {
              e.cellElement.style.cssText = `color: white; background-color: ${e.data.color}`;
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
          dataField={'id'}
          caption={'ID'}
          hidingPriority={8}
        />
        <Column
          dataField={'name'}
          caption={'Name'}
          hidingPriority={8}
        />
        <Column
          dataField={'id'}
          caption={'Number'}
          hidingPriority={8}
        />
        <Column
          dataField={'type'}
          caption={'Type'}
          hidingPriority={8}
        />
        <Column
          dataField={'pin'}
          caption={'PIN'}
          hidingPriority={8}
        />
        <Column
          dataField={'color'}
          caption={'Color'}
          hidingPriority={8}
        />
        <Column
          dataField={'typing'}
          caption={'Typing'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'date'}
          caption={'Last Seen'}
          dataType={'date'}
          format={'dd MMMM yyy HH:mm'}
          hidingPriority={5}
        />
  

      </DataGrid>
    </React.Fragment>
  )
};

export default LastSeenPage;