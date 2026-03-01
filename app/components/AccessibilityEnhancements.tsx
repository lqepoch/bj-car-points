"use client";

import { useEffect } from 'react';

// 可访问性增强组件
export default function AccessibilityEnhancements() {
  useEffect(() => {
    // 添加键盘导航支持
    const handleKeyDown = (event: KeyboardEvent) => {
      // ESC键关闭模态框
      if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal-overlay');
        if (modals.length > 0) {
          const lastModal = modals[modals.length - 1] as HTMLElement;
          const closeButton = lastModal.querySelector('.modal-close') as HTMLButtonElement;
          if (closeButton) {
            closeButton.click();
          }
        }
      }

      // Tab键循环焦点管理
      if (event.key === 'Tab') {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
          const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (event.shiftKey) {
            // Shift+Tab - 向前循环
            if (document.activeElement === firstElement) {
              event.preventDefault();
              lastElement.focus();
            }
          } else {
            // Tab - 向后循环
            if (document.activeElement === lastElement) {
              event.preventDefault();
              firstElement.focus();
            }
          }
        }
      }
    };

    // 添加跳转链接支持
    const addSkipLinks = () => {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.textContent = '跳转到主要内容';
      skipLink.className = 'skip-link';
      skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--brand);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1001;
        transition: top 0.3s;
      `;
      
      skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
      });
      
      skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
      });

      document.body.insertBefore(skipLink, document.body.firstChild);

      // 为主要内容添加ID
      const mainContent = document.querySelector('main');
      if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
        mainContent.setAttribute('tabindex', '-1');
      }
    };

    // 添加焦点指示器增强
    const enhanceFocusIndicators = () => {
      const style = document.createElement('style');
      style.textContent = `
        .focus-visible {
          outline: 3px solid var(--brand);
          outline-offset: 2px;
        }
        
        button:focus-visible,
        input:focus-visible,
        select:focus-visible {
          outline: 3px solid var(--brand);
          outline-offset: 2px;
        }
        
        .member:focus-within {
          border-color: var(--brand);
          box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
        }
      `;
      document.head.appendChild(style);
    };

    // 添加屏幕阅读器公告区域
    const addAriaLiveRegion = () => {
      let liveRegion = document.getElementById('aria-live-region');
      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'aria-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.cssText = `
          position: absolute;
          left: -10000px;
          width: 1px;
          height: 1px;
          overflow: hidden;
        `;
        document.body.appendChild(liveRegion);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    addSkipLinks();
    enhanceFocusIndicators();
    addAriaLiveRegion();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null; // 这是一个无渲染组件
}

// 工具函数：向屏幕阅读器公告消息
export function announceToScreenReader(message: string) {
  const liveRegion = document.getElementById('aria-live-region');
  if (liveRegion) {
    liveRegion.textContent = message;
    // 清除消息，以便下次相同消息也能被读出
    setTimeout(() => {
      liveRegion.textContent = '';
    }, 1000);
  }
}

// 工具函数：管理焦点
export function manageFocus(element: HTMLElement | null) {
  if (element) {
    element.focus();
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// 工具函数：陷阱焦点在模态框内
export function trapFocus(container: HTMLElement) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  // 聚焦到第一个元素
  firstElement.focus();

  const handleTabKey = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  container.addEventListener('keydown', handleTabKey);
  
  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
}