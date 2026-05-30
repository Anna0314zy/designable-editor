/*
 * @Date: 2023-11-02 14:00:52
 * @LastEditors: 周东晨 p_zhoudongchen@xuepeiyou.com
 * @LastEditTime: 2023-12-22 16:25:45
 * @FilePath: /microfrontend/vite-react-demo/src/main.tsx
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// import { defineMicroApp } from "../../micro-sub/dist/index";


// if (!import.meta.url.includes('microAppEnv')) {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
  )

// }

// const fun =  (element:HTMLElement) => {
//   const root = ReactDOM.createRoot(element)
//   function render() {
//     root.render(
//         <App />
//     )
//   }
//   return {
//     mount: render,
//     render: render,
//     unmount() {
//       root.unmount();
//     },
//     test: 'test'
//   };
// }

// const app = defineMicroApp({globalName:'test',callback:fun})
// export default app