import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/mdviewer/__docusaurus/debug',
    component: ComponentCreator('/mdviewer/__docusaurus/debug', '822'),
    exact: true
  },
  {
    path: '/mdviewer/__docusaurus/debug/config',
    component: ComponentCreator('/mdviewer/__docusaurus/debug/config', '472'),
    exact: true
  },
  {
    path: '/mdviewer/__docusaurus/debug/content',
    component: ComponentCreator('/mdviewer/__docusaurus/debug/content', 'afd'),
    exact: true
  },
  {
    path: '/mdviewer/__docusaurus/debug/globalData',
    component: ComponentCreator('/mdviewer/__docusaurus/debug/globalData', '740'),
    exact: true
  },
  {
    path: '/mdviewer/__docusaurus/debug/metadata',
    component: ComponentCreator('/mdviewer/__docusaurus/debug/metadata', 'a7f'),
    exact: true
  },
  {
    path: '/mdviewer/__docusaurus/debug/registry',
    component: ComponentCreator('/mdviewer/__docusaurus/debug/registry', 'f3d'),
    exact: true
  },
  {
    path: '/mdviewer/__docusaurus/debug/routes',
    component: ComponentCreator('/mdviewer/__docusaurus/debug/routes', 'fcd'),
    exact: true
  },
  {
    path: '/mdviewer/docs',
    component: ComponentCreator('/mdviewer/docs', 'bf3'),
    routes: [
      {
        path: '/mdviewer/docs',
        component: ComponentCreator('/mdviewer/docs', '3a1'),
        routes: [
          {
            path: '/mdviewer/docs/tags',
            component: ComponentCreator('/mdviewer/docs/tags', '391'),
            exact: true
          },
          {
            path: '/mdviewer/docs/tags/人工智能',
            component: ComponentCreator('/mdviewer/docs/tags/人工智能', 'd87'),
            exact: true
          },
          {
            path: '/mdviewer/docs/tags/ai',
            component: ComponentCreator('/mdviewer/docs/tags/ai', '846'),
            exact: true
          },
          {
            path: '/mdviewer/docs',
            component: ComponentCreator('/mdviewer/docs', '70b'),
            routes: [
              {
                path: '/mdviewer/docs/AI/AI',
                component: ComponentCreator('/mdviewer/docs/AI/AI', 'a6b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/mdviewer/docs/intro',
                component: ComponentCreator('/mdviewer/docs/intro', '194'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/mdviewer/',
    component: ComponentCreator('/mdviewer/', '939'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
