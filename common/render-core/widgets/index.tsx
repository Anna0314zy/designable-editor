/* eslint-disable */
// @ts-nocheck
import React, { useEffect, useReducer } from 'react';
import {ShapeComponent} from '@slide/slide-shape'
import { ImageComponent,VideoComponent } from '@slide/render-components'
import {RichTextComponent, GroupComponent} from '@ld/slide-editor'
import { withErrorBoundary } from 'react-error-boundary'
export const widgets:Record<string, any> = {
    Group: GroupComponent,
    Video: VideoComponent,
    RichText: RichTextComponent,
    Game: ({ gameUrl, gameId }) => {
        return <div></div>
    },
    Camera: () => {
        return (<div></div>)
    },
    Shape: ShapeComponent,
    Img: ImageComponent,
    // B: ({ useConnect, useReport, useEventStore, title, id }) => {
    //     const {
    //         instanceMap,
    //         registerInstance,
    //     } = useConnect(['aaa']);

    //     const {
    //         resourceList,
    //         resourceReport,
    //         ReportStatus,
    //         ResourceStatus
    //     } = useReport();

    //     // https://hox.js.org/zh/guide/performance 组件本身不响应状态更新，由外部信令通过 register 注册的逻辑来控制
    //     const { registerMsg } = useEventStore(() => [])
    //     // 组件中的指令注册
    //     const { notice, register } = registerMsg(id, 'pause', 'event')
    //     const { notice: notice2, register: register2 } = registerMsg(id, 'finished', 'state')

    //     useEffect(() => {
    //         register((msgInfo) => {
    //             console.log('file: index.tsx:42 ~ register ~ msgInfo: 状态展示', msgInfo)
    //             // 按照接收到的信息 执行【事件】或【状态变动】，还原组件事件 或 状态展示
    //         })
    //         register2((msgInfo) => {
    //             console.log('file: index.tsx:42 ~ register2 ~ msgInfo:', msgInfo)
    //             // 按照接收到的信息 执行【事件】或【状态变动】，还原组件事件 或 状态展示
    //         })
    //     }, [])


    //     window.setTimeout(() => {
    //         notice({"test":"这是一条测试数据111"})
    //     }, 1000)

    //     // notice 在特定【事件】或【状态变动】时调用
    //     // register 接收学生端接收到【事件】或【状态变动】 的处理函数 

    //     const [s, forceUpdate] = useReducer((preState) => {
    //         return preState + 1;
    //     }, 0);

    //     useEffect(() => {
    //         registerInstance(id, { forceUpdate });
    //     }, []);

    //     console.log('instanceMap: B');

    //     const handleClick = () => {
    //         notice2({ "test":"这是一条测试数据222" });
    //     }

    //     return (
    //         <b title={title} onClick={handleClick}>
    //             {id} {s}
    //         </b>
    //     );
    // },
    // I: ({ useConnect, useReport, title, content }) => {
    //     // 当 instanceMap 变动时会重新渲染
    //     const {
    //         instanceMap,
    //         registerInstance,
    //     } = useConnect(['bbb']);

    //     const {
    //         resourceList,
    //         resourceReport,
    //         ReportStatus,
    //         ResourceStatus
    //     } = useReport();

    //     // 这里是模拟组件执行过程中出错的情况
    //     // throw new Error('error');

    //     window.resourceReport = resourceReport;

    //     console.log('instanceMap: I');

    //     return <i title={title}>{content}</i>;
    // },
    // P: (props) => <p title={props.title}>{props.content}</p>,

    // Em: (props) => <em title={props.title}>{props.content}</em>,
    // H1: (props) => <h1 title={props.title}>{props.content}</h1>,
    // H2: (props) => <h2 title={props.title}>{props.content}</h2>,
    // H3: (props) => <h3 title={props.title}>{props.content}</h3>,
    // H4: (props) => <h4 title={props.title}>{props.content}</h4>,
    // H5: (props) => <h5 title={props.title}>{props.content}</h5>,
    // H6: (props) => <h6 title={props.title}>{props.content}</h6>,

    // Strong: (props) => <strong title={props.title}>{props.content}</strong>,
    // ErrorSchema: (props) => <strong>{props.content}</strong>,
};

export const buildInWidgets = Object.keys(widgets).reduce((acc, key) => {
    acc[key] = withErrorBoundary(widgets[key],{
        FallbackComponent: ({ error, resetErrorBoundary }) => (
            <div role="alert">
                <p>Something went wrong:</p>
                <pre>{error.message}</pre>
                <button onClick={resetErrorBoundary}>Try again</button>
            </div>
        ),
        onError: (error, info) => {
            console.log(error, info)
        }
    })
    return acc;
},{});
