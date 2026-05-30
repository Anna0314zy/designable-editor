import { isRemoteResourceExist } from "@slide/render-components";
import { nodeSchemaToSchema } from "@play/render";
import { sendLog } from "./index";
import { LogAct, LogName, LogState, ResourceType } from "../const";

// 获取本地url
const getLocalUrl = async (
    local: {
        localRootPath: string;
        pathConfigList: [{ path: string; type: string }];
        cdnPathList: [];
    },
    fileItem
) => {
    const res = [];
    const type = fileItem.resourceType;
    const pathItem = local.pathConfigList.find((item) => item.type === type);
    if (pathItem) {
        const path = pathItem.path;
        const rootPath = local.localRootPath;
        const { derivativeList } = fileItem;
        if (derivativeList && derivativeList.length > 0) {
            derivativeList.forEach((item) => {
                res.push(`${rootPath}${path}/${item.ossFileName}`);
            });
        }
    }
    return res;
};

// 获取远程URL
const getRemoteUrl = async (
    remote: {
        pathConfigList: [{ path: string; type: string }];
        cdnPathList: string[];
    },
    fileItem
) => {
    const res = [];
    if (remote.pathConfigList && remote.pathConfigList.length > 0) {
        const name = fileItem.ossFileName;
        const type = fileItem.resourceType;
        const pathItem = remote.pathConfigList.find((item) => item.type === type);
        if (pathItem) {
            const path = pathItem.path;
            const { derivativeList } = fileItem;
            if (derivativeList && derivativeList.length > 0) {
                const res = [];
                derivativeList.forEach((item) => {
                    remote.cdnPathList.forEach((host) => {
                        res.push(`${host}${path}/${item.ossFileName}`);
                    });
                });
                return res;
            } else {
                const cdnPathList = remote.cdnPathList || [];
                cdnPathList.forEach((host) => {
                    res.push(`${host}${path}/${name}`);
                });
            }
        }
    }
    return res;
};

// 获取背景图url
export const fetchUrl = async (src: string, globalConfig, globalProps) => {
    const { resourceData } = globalConfig;
    const { local, remote } = resourceData;
    const { fileList } = globalProps;
    const fileItem = fileList.find(
        (item: { fileMd5: string }) => item.fileMd5 === src
    );
    const urls = [];
    if (fileItem) {
        if (local) {
            const localUrl = await getLocalUrl(local, fileItem);
            console.log(
                "file: EventSequence.tsx:237 ~ fetchUrl ~ localUrl:",
                localUrl
            );
            if (localUrl.length > 0) {
                urls.push(...localUrl);
            }
        }
        if (remote) {
            if (!Array.isArray(remote.cdnPathList)) {
                urls.push(remote.cdnPathList[0] + fileItem.cosFullPath);
            }
            const remoteUrlArr = await getRemoteUrl(remote, fileItem);
            if (remoteUrlArr.length > 0) {
                urls.push(...remoteUrlArr);
            }
        }
    }
    console.log("file: EventSequence.tsx:253 ~ fetchUrl ~ urls:", urls);
    if (urls.length > 0) {
        let index = 0;
        for (; index < urls.length; index++) {
            const isExist = await isRemoteResourceExist(urls[index], {
                timeout: 2000,
                retryCount: 3,
                retryDelay: 50,
            });
            console.log(
                "file: EventSequence.tsx:257 ~ fetchUrl ~ isExist:",
                isExist
            );
            if (isExist) {
                return urls[index];
            }
        }
    }
    return "";
};

// 格式化pageInfo中的背景图
export function handleBackgroundImage(schema, globalConfig, globalProps) {
    return new Promise((resolve, reject) => {
        if (schema.props?.style?.backgroundImage) {
            const style = schema.props.style;
            const backgroundImage = style.backgroundImage;
            if (backgroundImage) {
                // 埋点-资源加载开始
                sendLog({name: LogName.LoadResource, act: LogAct.Start, id: schema.id, option:{ resource_type: ResourceType.Img, md5: backgroundImage }})
                fetchUrl(style.backgroundImage, globalConfig, globalProps)
                    .then((url) => {
                        // 埋点-资源加载结束
                        sendLog({name: LogName.LoadResource, act: LogAct.End, id: schema.id, option:{ resource_type: ResourceType.Img, md5: backgroundImage, url:url, state: LogState.Success }})
                        const formatStyle = {
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center center",
                            ...style,
                            backgroundImage: `url(${url})`,
                        };
                        schema.props.style = Object.assign(
                            schema.props.style,
                            formatStyle
                        );
                        resolve(schema);
                    })
                    .catch((error) => {
                        console.log("file: App.tsx:216 ~ transUrl ~ error:", error);
                        // 埋点-资源加载失败
                        sendLog({name: LogName.LoadResource, act: LogAct.End, id: schema.id, option:{ resource_type: ResourceType.Img, md5: backgroundImage, state: LogState.Error }})
                        reject(error);
                    });
            } else {
                resolve(schema);
            }
        } else {
            resolve(schema);
        }
    });
}

export function getPageInfoById(id: string) {
    return new Promise((resolve, reject) => {
    const globalData = window.microApp.getGlobalData() as unknown as any;
    try {
        const pageInfo = globalData[id];
        const globalConfig = { resourceData: globalData["resource"] };
        const globalProps = { fileList: pageInfo.fileResourceDtoList };
        const content = JSON.parse(pageInfo.mainContentStructure);
        const schema = nodeSchemaToSchema(content.pageInfo);
        handleBackgroundImage(schema, globalConfig, globalProps)
            .then((result) => {
                console.log('getPageInfoById', result)
                resolve(result);
            })
            .catch((err) => {
                console.log(
                    "file: EventSequence.tsx:296 ~ setPageController ~ formatSchema:",
                    err
                );
                reject(null);
            });
    } catch (error) {
        console.error("pageInfo解析失败", error);
        reject(null);
    }
    });
}