import React, { useState, useEffect, useRef } from 'react';
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


const ConversationsPage = () => {

  // Your web app's Firebase configuration
  // Initialize Firebase
  const app = initializeApp(Assist.firebaseConfig);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading data...');
  const isMounted = useRef(false)

  const pageConfig = {
    currentUrl: 'phone/list',
    deleteUrl: 'phone/delete',
    single: 'conversation',
    title: 'Conversations',
  }

  async function processData(phoneList) {
    const db = getFirestore(app);

    Assist.log('Starting to process data', "info");

    for (let i = 0; i < phoneList.length; i++) {

      Assist.log(`Processing data ${i} of ${phoneList.length} for ${phoneList[i].phone_number}`, "info");
      setLoadingText(`Processing data ${i + 1} of ${phoneList.length}`);

      const discussionsCol = collection(db, `twyshe/twyshe-conversations/twyshe-conversations/${phoneList[i].phone_number}/twyshe-conversations`);
      const discussionsSnapshot = await getDocs(discussionsCol);

      if (discussionsSnapshot && discussionsSnapshot.docs.length !== 0) {

        phoneList[i].conversations = discussionsSnapshot.docs.length;
       // Assist.log(`Retrieved ${discussionsSnapshot.docs.length} conversations for ${phoneList[i].phone_number}`, "info");

        let sent = 0;
        let received = 0;


        for (let j = 0; j < discussionsSnapshot.docs.length; j++) {

          const convdoc = discussionsSnapshot.docs[j];

          //Assist.log(`Retrieving messages for conversation ${convdoc.data().id} for ${phoneList[i].phone_number}`, "info");

          const chatsCol = collection(db, `twyshe/twyshe-chats/twyshe-chats/${convdoc.data().id}/twyshe-chats`);
          const chatsSnapshot = await getDocs(chatsCol);

          if (chatsSnapshot) {

            //Assist.log(`Retrieved ${chatsSnapshot.docs.length} chats for conversation ${convdoc.data().id} for ${phoneList[i].phone_number}`, "info");


            for (let k = 0; k < chatsSnapshot.docs.length; k++) {
              const chatdoc = chatsSnapshot.docs[k];


              if (chatdoc.data().sender === phoneList[i].phone_number) {
                sent++;
              } else {
                received++;
              }

             // Assist.log(`sent ${sent}, received ${received}, Sender ${chatdoc.data().sender} chats for conversation ${convdoc.data().id} for ${phoneList[i].phone_number}`, "info");

            }
          }


        }

        phoneList[i].sent = sent;
        phoneList[i].received = received;
      }

      if (!isMounted.current) {
        Assist.log('Conversations is nolonger mounted and load process has been cancelled', "info");
        break;
      }
    }

    if (!isMounted.current) {
      return;
    }
    setData(phoneList);

    window.sessionStorage.setItem('lastConversationTime', new Date().getTime());
    window.sessionStorage.setItem('lastConversationData', JSON.stringify(phoneList));

    setLoading(false);

    if (phoneList.length === 0) {
      setLoadingText('No Data')
    } else {
      setLoadingText('')
    }

    Assist.log('Finished to process data', "info");
  }

  useEffect(() => {
    isMounted.current = true;

    async function fetchData() {

      //check if data has been loaded before
      const lastTime = window.sessionStorage.getItem('lastConversationTime');
      let proceed = true;

      if (lastTime === null) {
        Assist.log("No previous conversation data has been set before in storage");
      } else {
        Assist.log(`Previous conversation data has been set before in storage and is ${lastTime}`);

        const currentTime = new Date().getTime();
        const difference = (currentTime - lastTime) / 1000;
        const minutes = 60;

        if (difference >= (60 * minutes)) {
          Assist.log(`Conversation Data will be refreshed since difference is >=${minutes} and is ${difference}s and ${difference / 60}m`);
        }
        else {
          Assist.log(`Conversation Data will not be refreshed since difference is <${minutes} and is ${difference}s and ${difference / 60}m}`);
          proceed = false;
        }

      }

      //check if to load data
      if (!proceed) {
        //use existing data
        const phoneList = JSON.parse(window.sessionStorage.getItem('lastConversationData'));
        setData(phoneList);

      } else {
        //load data
        Assist.loadData(pageConfig.title, pageConfig.currentUrl).then((res) => {

          const phoneList = res.Result.map((phone) => ({
            id: phone.phone_id,
            conversations: 0,
            sent: 0,
            received: 0,
            ...phone
          }))

          processData(phoneList);

        }).catch((ex) => {

          Assist.showMessage(ex.Message, "error");
          setLoadingText('Could not show information')

        });
      }

    }

    fetchData();

    //audit
    Assist.addAudit(window.sessionStorage.getItem("ruser"), 'Users', 'View', '').then((res) => {

      Assist.log(res.Message, "info");

    }).catch((x) => {

      Assist.log(x.Message, "warn");
    });

    return () => { isMounted.current = false }
    // eslint-disable-next-line
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
        <Item location="before"
          locateInMenu="auto"
          widget="dxButton"
          options={{
            icon: 'revert',
            onClick: () => {
              sessionStorage.removeItem("lastConversationTime");
              Assist.showMessage('The saved data for conversatiosn has been cleared!', "success");
            }
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
            return <a href={`#/phone/conversations/${e.data.phone_number}`}>{e.data.phone_name}</a>;
          }}
        />
        <Column
          dataField={'phone_number'}
          caption={'Number'}
          hidingPriority={8}
        />
        <Column
          dataField={'n_participants'}
          caption={'Participants'}
          hidingPriority={8}
        />
        <Column
          dataField={'conversations'}
          caption={'Conversations'}
          hidingPriority={8}
        />
        <Column
          dataField={'sent'}
          caption={'Sent Messages'}
          hidingPriority={8}
        />
        <Column
          dataField={'received'}
          caption={'Received Messages'}
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
          visible={false}
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
          visible={false}
        />
        <Column
          dataField={'phone_lastupdateuser'}
          caption={'Last Update User'}
          hidingPriority={6}
          visible={false}
        />
      </DataGrid>
    </React.Fragment>
  )
};

export default ConversationsPage;