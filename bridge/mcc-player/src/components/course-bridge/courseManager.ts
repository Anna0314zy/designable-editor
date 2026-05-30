/**
 * @description: 课件管理器
 * @description: 由于setData是异步的 这边封装了promise函数调用
 * @return {*}
 */
import { EventEmitter } from 'events';
import microApp from '@ld/micro-app'
import { CoursewareCommand, EventParam } from './type'
import { AllNotifyMessage } from '@/interface'
import CallPromisify from '../../libs/call-promisify';
import Logger from '@/libs/logger';
const logger = new Logger('[player]');
export default class CourseBridge extends EventEmitter {
    constructor() {
        super()
        this.addEventListener()
    }
    private callPromisify = new CallPromisify();

    addEventListener() {
        microApp.removeDataListener("course", this.handleGetData.bind(this))
        microApp.addDataListener("course", this.handleGetData.bind(this), true)
    }

    /**
     * @description: 传递给课件公共参数
     * @return {*}
     */
    getCommonParams() {
        return {
            timestamp: new Date().getTime()
        }
    }
    
    /**
     * @description: 接收课件传递信息
     * @param {*} event
     * @return {*}
     */
    handleGetData(data: EventParam) {
        const { type, param, msgId } = data
        if (msgId) {
            this.callPromisify.resolve(msgId, param);
        }
        this.emit(AllNotifyMessage, type, param);
        microApp.clearData('course')
    }

    /**
     * @description: 翻页 设置课件页id结果
     * @param {*} param
     * @return {*}
     */
    setPageId(param: any) {
        return new Promise(resolve => {
            logger.log('切页调用课件参数设置setPageId', param)
            microApp.setData('course', {type: CoursewareCommand.SetPageId, param, timestamp: this.getCommonParams()}, resolve)
        })      
    }


    /**
     * @description: 恢复课件信息
     * @param {*} param
     * @return {*}
     */
    recoverCWState(param = {}) {
        return new Promise(resolve => {
            console.log('recover 调用数据为', param)
            microApp.setData('course', {type: CoursewareCommand.RecoverCWState, param, timestamp: this.getCommonParams()}, resolve)
        })
    }


    SetPageUseAble() {
        return new Promise(resolve => {
            console.log('切页成功后调用', CoursewareCommand.SetPageUseAble)
            microApp.setData('course', {type: CoursewareCommand.SetPageUseAble, param: {}, timestamp: this.getCommonParams()}, resolve)
        })
    }


    /**
     * @description: 设置自课件匡高
     * @param {*} param
     * @return {*}
     */
    ResizeCW(param = {}) {
        return new Promise(resolve => {
            microApp.setData('course', {type: CoursewareCommand.ResizeCW, param, timestamp: this.getCommonParams()}, resolve)
        })
    }

    /**
     * @description: 获取实时课件数据 进行对比 若不同 需重置课件信息
     * @param {*} param
     * @return {*}
     */
    transferMessageReceive(param: any) {
        return new Promise(resolve => {
            microApp.setData('course', {type: CoursewareCommand.TransferMessageReceive, param, timestamp: this.getCommonParams()}, resolve)
        })
    }


    /**
     * @description: 设置uid
     * @param {*} param
     * @return {*}
     */
    setUid(param: any) {
        return new Promise(resolve => {
            microApp.setData('course', {type: CoursewareCommand.SetUid, param, timestamp: this.getCommonParams()}, resolve)
        })
    }

}