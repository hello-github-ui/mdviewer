import React, { useState } from 'react';
import SidebarToggle from '../../components/SidebarToggle';
import OriginalDocSidebar from '@theme-original/DocSidebar';
import './style.css';

export default function DocSidebar(props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <SidebarToggle collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className={collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'} style={{height: '100%'}}>
        <OriginalDocSidebar {...props} />
      </div>
    </>
  );
} 