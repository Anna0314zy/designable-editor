/*
 * @Date: 2023-12-05 17:47:48
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-02-26 11:18:39
 * @FilePath: /slides-engine/common/slide-editor/src/index.tsx
 */
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './styles/index.scss';
// import App from './App';

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
// export { default as Button } from './components/Button';
export { default as RichTextComponent } from './components/Input';
export { default as GroupComponent } from './components/Group'
export * from './components/Camera'
export * from './components/Camera/types'
