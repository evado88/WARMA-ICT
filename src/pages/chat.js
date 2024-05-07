import React, { useState, useEffect } from 'react';
import 'devextreme/data/odata/store';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy, } from 'firebase/firestore/lite';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import DataGrid, {
  Column,
  Pager,
  Paging,
  FilterRow,
  LoadPanel,
  Editing,
  ColumnChooser,
} from 'devextreme-react/data-grid';

import Assist from '../assist';


const ChatPage = (props) => {

  // Your web app's Firebase configuration
  // Initialize Firebase
  const app = initializeApp(Assist.firebaseConfig);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading data...');


  const pageConfig = {
    currentUrl: 'discussion/list',
    deleteUrl: 'discussion/delete',
    single: 'chat',
    title: 'Chat',
  }

  const id = props.match.params.eid === undefined ? 0 : props.match.params.eid;

  useEffect(() => {



    async function loadData() {

      Assist.log("Starting to discussion chat from firestore");

      // invalid url will trigger an 404 error

      const db = getFirestore(app);



      const discussionsCol = collection(db, `twyshe/twyshe-chats/twyshe-chats/${id}/twyshe-chats`);

      const q = query(discussionsCol, orderBy("createdAt", "asc"));
      const discussionsSnapshot = await getDocs(q);

      if (discussionsSnapshot) {

        const discussionsList = discussionsSnapshot.docs.map((doc) => (

          {
            docId: doc.id,
            date: new Date(doc.data().createdAt.seconds * 1000),
            statusName: doc.data().state === 1 ? 'Active' : 'Deleted',
            text: doc.data().text,
            discussion: doc.data().discussion,
            firstName: doc.data().author.firstName,
            number: doc.data().author.id,
            color: doc.data().author.color,
            status: doc.data().status,
            type: doc.data().type,
            uri: doc.data().type === 'file' || doc.data().type === 'image' ? doc.data().uri : '#'
          }
        ));


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
    Assist.addAudit(window.sessionStorage.getItem("ruser"), 'Discussions', 'View', '').then((res) => {

      Assist.log(res.Message, "info");

    }).catch((x) => {

      Assist.log(x.Message, "warn");
    });

  }, [app, id]);

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
        keyExpr={'docId'}
        noDataText={loadingText}
        showBorders={false}
        focusedRowEnabled={true}
        defaultFocusedRowIndex={0}
        columnAutoWidth={true}
        columnHidingEnabled={true}

        onCellPrepared={(e) => {

          if (e.rowType === "data") {
            if (e.column.dataField === "firstName") {
              e.cellElement.style.cssText = `color: white; background-color: ${e.data.color}`;
            }
          }
        }}
      >
        <Editing
          mode="row"
          allowUpdating={false}
          allowDeleting={false}
          allowAdding={false} />
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
          dataField={'docId'}
          caption={'ID'}
          hidingPriority={8}
          allowEditing={false}
        />
        <Column
          dataField={'number'}
          caption={'Number'}
          hidingPriority={8}
          allowEditing={false}
        />
        <Column
          dataField={'firstName'}
          caption={'Name'}
          hidingPriority={8}
          allowEditing={false}
        />
        <Column
          dataField={'type'}
          caption={'Type'}
          hidingPriority={8}
          allowEditing={false}
        />
        <Column
          dataField={'text'}
          caption={'Text (F)'}
          hidingPriority={8}
        />
        <Column
          dataField={'uri'}
          caption={'URL'}
          hidingPriority={8}
          cellRender={(e) => {
            if(e.data.uri === '#'){
              return ''
            }
            return <a href={`${e.data.uri}`} target='_blank' rel='noreferrer'>Link</a>;
          }}
        />
        <Column
          dataField={'statusName'}
          caption={'State'}
          hidingPriority={8}
          allowEditing={false}
        />
        <Column
          dataField={'status'}
          caption={'Status'}
          hidingPriority={8}
          allowEditing={false}
        />
        <Column
          dataField={'date'}
          caption={'Sent'}
          format={'dd MMM yyy HH:mm'}
          hidingPriority={5}
          allowEditing={false}
        />
      </DataGrid>
    </React.Fragment>
  )
};

export default ChatPage;