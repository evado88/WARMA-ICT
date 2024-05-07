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
  Editing,
  ColumnChooser,
} from 'devextreme-react/data-grid';

import Assist from '../assist';


const Discussions = () => {

  // Your web app's Firebase configuration
  // Initialize Firebase
  const app = initializeApp(Assist.firebaseConfig);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading data...');


  const pageConfig = {
    currentUrl: 'discussion/list',
    deleteUrl: 'discussion/delete',
    single: 'discussion',
    title: 'Discussions',
  }

  useEffect(() => {

    async function loadData() {

      Assist.log("Starting to discussions from firestore");
      //invalid url will trigger an 404 error

      const db = getFirestore(app);

      const discussionsCol = collection(db, 'twyshe/twyshe-discussions/twyshe-discussions');
      const discussionsSnapshot = await getDocs(discussionsCol);

      if (discussionsSnapshot) {

        const discussionsList = discussionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          date: new Date(doc.data().posted.seconds * 1000),
          allPosts: `${doc.data().posts} Post(s)`,
          posts: doc.data().posts,
          statusName: doc.data().status === 1 ? 'Active' : 'Disabled',
          title: doc.data().title,
          description: doc.data().description,
          nickname: doc.data().nickname,
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
          dataField={'id'}
          caption={'ID'}
          hidingPriority={8}
        />
        <Column
          dataField={'title'}
          caption={'Title'}
          hidingPriority={8}
          cellRender={(e) => {
            return <a href={`#/discussion/edit/${e.data.id}`}>{e.data.title}</a>;
          }}
        />
        <Column
          dataField={'description'}
          caption={'Description'}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={'statusName'}
          caption={'Status'}
          hidingPriority={8}
        />
        <Column
          dataField={'allPosts'}
          caption={'Posts'}
          hidingPriority={8}
          cellRender={(e) => {
            return <a href={`#/discussion/chat/${e.data.id}`}>{e.data.allPosts}</a>;
          }}
        />
        <Column
          dataField={'nickname'}
          caption={'Nickname'}
          format={'dd MMMM yyy'}
          hidingPriority={5}
        />
        <Column
          dataField={'date'}
          caption={'Date'}
          format={'dd MMM yyy HH:mm'}
          hidingPriority={5}
        />

      </DataGrid>
    </React.Fragment>
  )
};

export default Discussions;