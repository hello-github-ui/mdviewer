import React from 'react';

export default function SidebarToggle({ collapsed, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        position: 'fixed',
        top: 75,
        left: collapsed ? 0 : 240,
        zIndex: 1000,
        width: 32,
        height: 32,
        background: '#fff',
        border: '1px solid #eee',
        borderRadius: '50%',
        cursor: 'pointer',
        transition: 'left 0.3s',
        color: 'green'
      }}
      aria-label={collapsed ? '展开侧边栏' : '收起侧边栏'}
    >
      {collapsed ? '>' : '<'}
    </button>
  );
} 