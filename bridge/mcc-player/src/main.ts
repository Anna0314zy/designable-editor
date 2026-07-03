/*
 * @Date: 2023-11-02 14:00:52
 * @LastEditors: 周东晨 
 * @LastEditTime: 2024-03-20 14:07:26
 * @FilePath: /microfrontend/vite-react-main/src/main.tsx
 */
import '@/utils/eventTargetPolyfill.ts';
import '@/components/game-manage/game-msg.ts'
import App from './App.ts'
import './index.css'
import './assets/font.css'
import { EventCenterForMicroApp } from '@ld/micro-app'
import {fetch as fetchPolyfill} from 'whatwg-fetch'


window.eventCenterForCocos = new EventCenterForMicroApp('cocos')

window.fetch = fetchPolyfill;

new App(document.getElementById('root')!)