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


const PhoneConversationsPage = (props) => {

  // Your web app's Firebase configuration
  // Initialize Firebase
  const app = initializeApp(Assist.firebaseConfig);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading data...');


  const pageConfig = {
    currentUrl: 'discussion/list',
    deleteUrl: 'discussion/delete',
    single: 'phone conversations',
    title: 'Phone Conversations',
  }

  const id = props.match.params.eid === undefined ? 0 : props.match.params.eid;

  useEffect(() => {

    async function loadData() {

      Assist.log("Starting to discussions from firestore");
      //invalid url will trigger an 404 error

      const db = getFirestore(app);

      const discussionsCol = collection(db, `twyshe/twyshe-conversations/twyshe-conversations/${id}/twyshe-conversations`);
      const discussionsSnapshot = await getDocs(discussionsCol);

      if (discussionsSnapshot) {

        const discussionsList = discussionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          conversation: doc.data().id,
          posted: new Date(doc.data().posted.seconds * 1000),
          name: doc.data().name,
          status: doc.data().status === 1 ? 'Seen' : 'Unseen',
          unread: doc.data().count,
          owner: doc.data().owner,
          color: doc.data().color,
          typing: doc.data().typing,
          message: doc.data().message,
          messageShort: doc.data().message.length < 50 ? doc.data().message : `${doc.data().message.substring(0, 50)}...`,
          other_name: doc.data().other_name,
          other_phone: doc.data().other_phone,
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

  }, [app, id]);

  return (
    <React.Fragment>
      <h2 className={'content-block'}>{pageConfig.title} - {id}</h2>
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
          caption={'Number'}
          hidingPriority={8}
          cellRender={(e) => {
            return <a href={`#/phone/chat/${e.data.conversation}`}>{e.data.id}</a>;
          }}
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
          dataField={'messageShort'}
          caption={'Message (S)'}
          hidingPriority={8}
        />
        <Column
          dataField={'message'}
          caption={'Message (F)'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'status'}
          caption={'Status'}
          hidingPriority={8}
        />
         <Column
          dataField={'unread'}
          caption={'No Unread'}
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
        />
        <Column
          dataField={'posted'}
          caption={'Date'}
          dataType={'date'}
          format={'dd MMMM yyy HH:mm'}
          hidingPriority={5}
        />


      </DataGrid>
    </React.Fragment>
  )
};

export default PhoneConversationsPage;