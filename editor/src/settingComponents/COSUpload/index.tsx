import React, {useCallback, useMemo } from "react";
import { InputProps } from "antd/lib/input";
import { Upload, message, Button } from "antd";
import {
	IconWidget,
	usePrefix,
	useSelectedNode,
	useSetGlobalData,
	useGlobalData,
	useDesigner,
	useSetResourceData
} from "@editor/react";
import cls from "classnames";
import { TreeNode } from "@editor/core/src/models";
import { uploadType, uploadAccept, imageWH } from "../../components/Img/type";
import {createResource} from "../../api/upload";
import "./styles.less";
// import { getUrlParameter } from "../../utils/common";
import {
	uploadFn,
	IUploadProps,
	beforeGetFileData,
	beforeUpload
} from "./uploadFn";
import { useUpdateNode } from "./useUpdateNode";
import { UploadStatus } from "./type";
import { md5Hash } from "../../utils/md5";
import { getResource } from "../../api/upload";
import { observer } from "@slides/reactive-react";
import { useSavePage } from "../../hooks/useSavePage";
// const slideId = getUrlParameter("id");
export interface COSUploadProps extends Omit<InputProps, "onChange"> {
	type: keyof typeof uploadAccept;
	value?: string;
	onChange?: (value: string) => void;
	node?: TreeNode;
}

export const COSUpload: React.FC<COSUploadProps> = observer((({
	className,
	style,
	type = "pic",
	title,
	node,
}) => {
	// 上传列表 维护到 全局变量中
	const prefix = usePrefix("image-input");
	const globalData = useGlobalData();
	const setGlobalData = useSetGlobalData();
	const setResourceData = useSetResourceData();
	const [saveCurrentPage] = useSavePage()
	const { addNode, updateNode ,updateProps} = useUpdateNode();
	const engine = useDesigner();
	const currentWorkspace = engine.workbench.activeWorkspace;
	const currentWorkspaceId = currentWorkspace?.id;
	const treeNode = useSelectedNode(currentWorkspaceId);
	// 当前是否是替换图片 或者 是新增背景图片
	const isReplace = useMemo(() => !node, [node]);
	const updatePropsOrNode = useCallback((uploadOptions,target)=> {
		if(!isReplace) {
			updateNode(uploadOptions, target);
		}else {
			updateProps(target, uploadOptions.node)
		}

	},[isReplace, updateNode, updateProps])
	// 替换图片的时候 需要更新旧的MD5
	// 视频展示进度
	const onProgress: IUploadProps["onProgress"] = ({
		progress,
		uploadOptions,
	}) => {
		if(uploadOptions.fileData.resourceType !== 'video') return;
		const { fileData } = uploadOptions;
		const { percent } = progress;
		fileData.percent = Math.round(percent * 100);
		updateNode(uploadOptions, { uploadPercent: fileData.percent });
		setGlobalData((preData) => {
			return {
				...preData,
				uploadList: preData.uploadList.map((v) => {
					if (v.id === fileData.id) {
						return fileData;
					}
					return v;
				})
			}});
	};
	const setFileList = useCallback((fileData) => {
		setResourceData((preData) => {
			if(preData.findIndex((v) => v.fileMd5 ===fileData.fileMd5) === -1){
             return [...preData, fileData]
			}
			return preData;
		})
	},[setResourceData])
	const onFinish: IUploadProps["onFinish"] = async ({ uploadOptions }) => {
		let { fileData } = uploadOptions;
		try {
			fileData.status = UploadStatus.done;
			// 创建资源
			const params = Object.assign({}, fileData);
			delete params.id;
			if (fileData.resourceType === "video") {
				delete params.width;
				delete params.height;
			}
			const res = await createResource(params);
			fileData = { ...fileData, ...res };
			// // 创建资源关系
			// await addResourceRelation({
			// 	pageId: currentWorkspace.id,
			// 	slideId,
			// 	fileMd5: fileData.fileMd5,
			// });
			setFileList(fileData)
			updatePropsOrNode(uploadOptions,{
				src: fileData.fileMd5,
				uploadStatus: UploadStatus.done,
				width: fileData.width,
				height: fileData.height,
			})
			saveCurrentPage()
		} catch (e) {
			message.error(e?.message || "上传失败");
			updatePropsOrNode(uploadOptions,{ uploadStatus: fileData.status })
		}
	};
	const onError = ({ err, uploadOptions }) => {
		const { fileData } = uploadOptions;
		fileData.status = UploadStatus.error;
		updatePropsOrNode(uploadOptions,{ uploadStatus: fileData.status })
		if (err.message) {
			message.error(err?.message || "上传失败");
		}
	};

	const uploadProps = {
		multiple: false,
		maxCount: 1,
		// fileList,
		showUploadList: false,
		accept: uploadAccept[type],
		customRequest: async (options: { file }) => {
			const { file } = options;
			const curNode = isReplace ? treeNode : node;
			//上传前 查看是否已经上传过
				//上传前先添加元素
				let fileData = beforeGetFileData({ file: file, type });
				const uploadOptions = {
					fileData,
					node: curNode,
					currentWorkspace,
				};
				if (type == "pic") {
					const imageFile = await imageWH(file);
					fileData.width = imageFile.width;
					fileData.height = imageFile.height;
				}
				if (!isReplace) {
					// 添加节点
					addNode(
						uploadOptions,
						(elementId) => {
							fileData.elementId = elementId;
						}
					);
				}else {
					updateProps({
						src:'',
						uploadStatus: UploadStatus.uploading,
						uploadPercent: 0,
						width: fileData.width,
						height: fileData.height,
						localUrl: fileData.localUrl,
					}, curNode)
				}
				try{
				const {md5} = await md5Hash(file);
				const res = await getResource(md5);
				if (res?.id) {
					fileData = { ...fileData, ...res };
					fileData.status = UploadStatus.done;
					// // 创建资源关系
					// await addResourceRelation({
					// 	pageId: currentWorkspace.id,
					// 	slideId,
					// 	fileMd5: fileData.fileMd5,
					// });
					setFileList(fileData)
					// 获取到最新的资源信息 替换节点
					const newProps = {
						src: fileData.fileMd5,
						uploadStatus: UploadStatus.done,
						width: fileData.width,
						height: fileData.height,
					}
					updatePropsOrNode(uploadOptions,newProps)
					saveCurrentPage()
				} else {
					//开启上传
					if(uploadOptions.fileData.resourceType === 'video') {
						setGlobalData((preData) => {
							return {
								...preData,
								uploadList: [...(preData.uploadList || []), fileData],
							};
						});
					}
					await uploadFn({
						CdnHost: globalData.cdnPathList?.[0] || "",
						type,
						pathConfigList: globalData.pathConfigList || [],
						file,
						onProgress,
						onFinish,
						onError,
						options: uploadOptions,
					});
				}
			} catch (e) {
				updatePropsOrNode(uploadOptions,{ uploadStatus: UploadStatus.error })
			}
		},
		beforeUpload: async (file) => {
			return beforeUpload({
				file,
				node: isReplace ? treeNode : node,
				currentWorkspace,
				type,
			});
			// 检查是都有后缀 没有后缀需要提示不能上传
		},
	};
	const loading = useMemo(() => {
		return [UploadStatus.uploading, UploadStatus.loading].includes(
			treeNode.props.uploadStatus
		);
	}, [treeNode.props.uploadStatus]);
	return (
		<div className={cls(prefix, className)} style={style}>
			{/* <Button>替换图片</Button> */}

			<Upload {...uploadProps} style={{ width: "100%" }}>
				{!isReplace ? (
					<span
						// style={{ color: active ? "#1890ff" : "#333333" }}
						className="upload-title"
					>
						<IconWidget
							className={prefix + "-sub-menu-item-icon"}
							infer={uploadType[title]}
							style={{ width: 16, height: 16, marginRight: 8 }}
						/>
						{title}
					</span>
				) : (
					<Button loading={loading} disabled={loading}>
						{(treeNode.props.style && treeNode.props.style.backgroundImage) ||
						treeNode.props.src
							? "替换图片"
							: "上传图片"}
					</Button>
				)}
			</Upload>
		</div>
	);
}))
