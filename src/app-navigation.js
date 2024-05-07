export const navigation = [
  {
    text: 'Home',
    path: '/home',
    icon: 'home'
  },
  {
    text: 'Administration',
    icon: 'folder',
    items: [
      {
        text: 'Users',
        path: '/users'
      },
      {
        text: 'Resources',
        path: '/resources'
      },
      {
        text: 'Countries',
        path: '/countries'
      }
      ,
      {
        text: 'Colors',
        path: '/colors'
      },
      {
        text: 'Notifications',
        path: '/notifications'
      }
    ]
  },
  {
    text: 'Twyshe App',
    icon: 'product',
    items: [
      {
        text: 'Peer Navigators',
        path: '/peer-navigators'
      },
      {
        text: 'Participants',
        path: '/participants'
      },
      {
        text: 'Followups',
        path: '/follow-ups'
      },
      {
        text: 'Usage Analytics',
        path: '/analytics'
      },
    ]
  },
  {
    text: 'Twyshe Messenger',
    icon: 'message',
    items: [
      {
        text: 'Phones',
        path: '/phones'
      },
      {
        text: 'Last Seen',
        path: '/last-seen'
      },
      {
        text: 'Discussions',
        path: '/discussions'
      },
      {
        text: 'Conversations',
        path: '/conversations'
      }
    ]
  }
];
