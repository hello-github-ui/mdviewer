import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/mdviewer/docs/tags',
    component: ComponentCreator('/mdviewer/docs/tags', 'c2e'),
    exact: true
  },
  {
    path: '/mdviewer/docs/tags/人工智能',
    component: ComponentCreator('/mdviewer/docs/tags/人工智能', '1c3'),
    exact: true
  },
  {
    path: '/mdviewer/docs/tags/ai',
    component: ComponentCreator('/mdviewer/docs/tags/ai', 'e65'),
    exact: true
  },
  {
    path: '/mdviewer/docs',
    component: ComponentCreator('/mdviewer/docs', '095'),
    routes: [
      {
        path: '/mdviewer/docs/AI/AI',
        component: ComponentCreator('/mdviewer/docs/AI/AI', 'e34'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/mdviewer/docs/intro',
        component: ComponentCreator('/mdviewer/docs/intro', 'e82'),
        exact: true,
        sidebar: "tutorialSidebar"
      }
    ]
  },
  {
    path: '/mdviewer/',
    component: ComponentCreator('/mdviewer/', 'f79'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
