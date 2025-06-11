---
id: 51CTO网站解除禁止复制
title: 51CTO网站解除禁止复制脚本开发
tags: [油猴脚本]
---

```js
// ==UserScript==
// @name         51CTO博客解除复制限制
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  解除51CTO博客的复制限制，移除登录弹窗
// @author       You
// @match        https://blog.51cto.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 阻止所有复制相关的事件监听器
    function removeAllEventListeners() {
        const events = ['copy', 'cut', 'paste', 'selectstart', 'contextmenu', 'dragstart', 'mousedown', 'mouseup', 'mousemove', 'keydown', 'keyup'];
        
        events.forEach(eventType => {
            document.addEventListener(eventType, function(e) {
                e.stopImmediatePropagation();
                e.stopPropagation();
            }, true);
        });
    }

    // 移除CSS样式限制
    function removeCSSRestrictions() {
        const style = document.createElement('style');
        style.innerHTML = `
            * {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
                -webkit-touch-callout: default !important;
                -webkit-tap-highlight-color: rgba(0,0,0,0) !important;
            }
            
            body {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                user-select: text !important;
            }
            
            /* 移除可能的遮罩层 */
            .mask, .overlay, .login-mask, .copy-mask {
                display: none !important;
                visibility: hidden !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 重写document的事件监听器添加方法
    function overrideEventListeners() {
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            // 阻止添加复制相关的事件监听器
            const blockedEvents = ['copy', 'cut', 'paste', 'selectstart', 'contextmenu', 'dragstart', 'mousedown', 'mouseup', 'keydown', 'keyup'];
            if (blockedEvents.includes(type)) {
                console.log(`阻止添加事件监听器: ${type}`);
                return;
            }
            return originalAddEventListener.call(this, type, listener, options);
        };
    }

    // 移除登录弹窗
    function removeLoginModal() {
        const selectors = [
            '.login-modal',
            '.modal',
            '.popup',
            '.dialog',
            '.overlay',
            '.mask',
            '[class*="login"]',
            '[class*="modal"]',
            '[class*="popup"]',
            '[id*="login"]',
            '[id*="modal"]',
            '[id*="popup"]'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el.style.display !== 'none' && 
                    (el.textContent.includes('登录') || 
                     el.textContent.includes('注册') || 
                     el.textContent.includes('复制') ||
                     el.style.zIndex > 1000)) {
                    el.remove();
                }
            });
        });
    }

    // 恢复文本选择功能
    function restoreTextSelection() {
        document.onselectstart = null;
        document.oncontextmenu = null;
        document.ondragstart = null;
        document.onmousedown = null;
        document.onmouseup = null;
        document.body.onselectstart = null;
        document.body.oncontextmenu = null;
        
        // 移除所有禁用选择的属性
        document.querySelectorAll('*').forEach(el => {
            el.style.userSelect = 'text';
            el.style.webkitUserSelect = 'text';
            el.style.mozUserSelect = 'text';
            el.style.msUserSelect = 'text';
            el.unselectable = 'off';
            el.removeAttribute('unselectable');
        });
    }

    // 清理定时器和间隔器
    function clearTimersAndIntervals() {
        // 重写setInterval和setTimeout来阻止可能的反复检查
        const originalSetInterval = window.setInterval;
        const originalSetTimeout = window.setTimeout;
        
        window.setInterval = function(callback, delay) {
            // 如果回调函数包含复制限制相关代码，则不执行
            if (callback.toString().includes('selectstart') || 
                callback.toString().includes('copy') ||
                callback.toString().includes('contextmenu')) {
                console.log('阻止潜在的复制限制定时器');
                return;
            }
            return originalSetInterval.call(this, callback, delay);
        };
        
        window.setTimeout = function(callback, delay) {
            if (callback.toString().includes('selectstart') || 
                callback.toString().includes('copy') ||
                callback.toString().includes('contextmenu')) {
                console.log('阻止潜在的复制限制延时器');
                return;
            }
            return originalSetTimeout.call(this, callback, delay);
        };
    }

    // 主函数
    function init() {
        console.log('51CTO博客解除复制限制脚本已启动');
        
        // 立即执行
        overrideEventListeners();
        removeCSSRestrictions();
        clearTimersAndIntervals();
        
        // DOM加载完成后执行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                removeAllEventListeners();
                restoreTextSelection();
                removeLoginModal();
            });
        } else {
            removeAllEventListeners();
            restoreTextSelection();
            removeLoginModal();
        }
        
        // 页面完全加载后再次执行
        window.addEventListener('load', function() {
            restoreTextSelection();
            removeLoginModal();
        });
        
        // 定期清理登录弹窗（某些网站会动态添加）
        setInterval(function() {
            removeLoginModal();
            restoreTextSelection();
        }, 1000);
    }

    // 启动脚本
    init();

})();
```

这个油猴脚本的主要功能包括：

## 脚本功能说明：

1. **阻止事件监听器** - 阻止网站添加复制、选择、右键等限制事件
2. **移除CSS限制** - 强制允许文本选择，移除用户选择限制
3. **清除登录弹窗** - 自动检测并移除登录相关的弹窗和遮罩层
4. **恢复文本选择** - 重新启用文本选择和复制功能
5. **阻止反复检查** - 拦截网站的定时检查机制

## 安装使用方法：

1. 确保你已经安装了 **Tampermonkey** 或 **Greasemonkey** 等油猴扩展
2. 点击扩展图标，选择"创建新脚本"
3. 将上面的代码完整复制粘贴进去
4. 保存脚本（Ctrl+S）
5. 访问 https://blog.51cto.com 的任何页面，脚本会自动生效

## 脚本特点：

- **预防性拦截** - 在文档加载开始就阻止限制代码执行
- **多重保护** - 从CSS、JavaScript事件、DOM操作等多个层面解除限制
- **自动清理** - 每秒检查并移除可能出现的登录弹窗
- **兼容性好** - 适用于大多数类似的复制限制网站

安装后，你就可以在51CTO博客上自由复制文本内容了，不会再弹出登录要求的窗口。