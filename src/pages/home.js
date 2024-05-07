import React from 'react';

const Home = () => {

  /*
  useEffect(() => {

    console.log('home user', sessionStorage.getItem('ruser').email);
  }, []);
  */
  return (
    <React.Fragment>
      <h2 className={'content-block'}>Home</h2>
      <div className={'content-block'}>
        <div className={'dx-card responsive-paddings'}>
          <div className={'logos-container'}>
            <img src='../twyshe.png' alt='Twyshe Logo' style={{ width: '256px', height: 'auto' }} />
          </div>

          <p>Welcome to the control panel for Twyshe!</p>
          <p>You can use this application to perform the following functions: </p>
          <ul>
            <li><strong>Peer Navigators</strong> -  See the total number of peer navigators registered and their details</li>
            <li><strong>Active Devices</strong> - View the total number of tablets, phones and devices in use by peer navigators and participants</li>
            <li><strong>Enrolled Participants</strong> - Access all participants enrolled in the study and their details</li>
            <li><strong>SRH Services</strong> - View SRH services being accessed by each participant</li>
            <li><strong>Appointments</strong> - Manage and view appointments for all participants</li>
            <li><strong>Medication Refills</strong> - View medication refills and associated notifications</li>
            <li><strong>Visits & Events</strong> - Manage visits, events and interactions between peer navigators and participants</li>
            <li><strong>Chats and Converstions</strong> - Review chats and conversations between peer navigators and participants</li>
            <li><strong>Counselling Messages & Notifications</strong> - Create and send out counselling messages to participants and peer navigators</li>
            <li><strong>App Usage & Analytics</strong> - View usage of the apps for each user and how much time they are spending omn each screen and page</li>
          </ul>
          <p>
            <span>For technical assistance, please do not hesitate to contact the administrator </span>
            <a href="mailto: nkoleeevans@hotmail.com" target="_blank" rel="noreferrer">nkoleevans@hotmail.com</a>
            <span> or </span>
            <a href="mailto: support@r21app.online" target="_blank" rel="noreferrer">support@r21app.online</a>.
          </p>
        </div>
      </div>
    </React.Fragment>
  )
};

export default Home;
