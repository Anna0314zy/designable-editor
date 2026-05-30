/*
 * @Date: 2023-02-23 11:14:09
 * @LastEditors: wangpeng
 * @LastEditTime: 2023-12-11 16:07:07
 * @FilePath: /slides-engine/slide-editor/src/App.tsx
 */
// import './App.css';
import React from 'react'
// import Button from './components/Button'
import Input from './components/Input'

function App() {
  return (
    <div className="App">
      <Input />
      {/* <header className="App-header">
        <p>1111</p>
        <Button>按钮</Button>
        <Button btnType='primary' onClick={() => console.log(1)}>按钮</Button>
        <Button btnType='primary' size='lg'>按钮</Button>
        <Button btnType='primary' size='sm'>按钮</Button>
        <Button btnType='primary' disabled onClick={() => console.log(1)}>按钮</Button>
        <Button btnType='danger'>按钮</Button>
        <Button btnType='link' href="https://www.baidu.com" target="_blank">按钮</Button>
        <Button btnType='link' href="https://www.baidu.com" target="_blank" disabled>按钮</Button>
        <Button btnType='primary'>按钮</Button>
      </header> */}
    </div>
  );
}

export default App;
