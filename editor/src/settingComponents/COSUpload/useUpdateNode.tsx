import { TreeNode, Workspace } from "@editor/core/src/models";
import { IUploadFile } from "../../api/upload";
import { useDesigner, useTree } from "@editor/react";
interface IProps {
	node: TreeNode;
	currentWorkspace: Workspace;
	fileData: IUploadFile;
}
import { getImgWH } from "../../utils/common";
export const useUpdateNode = () => {
	const engine = useDesigner();
	const curWorkspace = engine.workbench.activeWorkspace;
	const tree = useTree()
	const selectNode = (currentWorkspace, node) => {
		const operation = currentWorkspace.operation;
		const selection = operation.selection;
		if (curWorkspace.id !== currentWorkspace.id) return;
		selection.safeSelect(node);
	};
	const addNode = async (props: IProps, callback?: (id: string) => void) => {
		// 新上传图片
		const { node, currentWorkspace } = props;
		const { width, height, fileMd5, resourceType, status,localUrl,uploadPercent } =
			props.fileData;
		// const sourceId = node.id;
		// const sourceNodes = [engine.findNodeById(sourceId)];
		const closestNode = currentWorkspace.operation.tree;
		// 如果当前video 页面有视频 则替换
		// 视频节点则只能上传一次
		let newTreeNode = null;
		const children = closestNode?.children || [];
		if (resourceType == "video" && children.length > 0) {
			newTreeNode = children;
		} else {
			if (closestNode.allowAppend([node])) {
				newTreeNode = closestNode.append(
					...TreeNode.filterDroppable([node], closestNode)
				);
			}
		}
		if (!newTreeNode) return;
		const x = 0;
		const y = 0;
		newTreeNode[0].props.style ||= {};
		if (resourceType == "pic") {
			const { width: imgWidth, height: imgHeight } = await getImgWH({
				width,
				height,
			});
			newTreeNode[0].props.style.width = imgWidth + "px";
			newTreeNode[0].props.style.height = imgHeight + "px";
		}
		newTreeNode[0].props.style.transform = `translate(${x}px, ${y}px)`;
		newTreeNode[0].props.src = fileMd5;
		newTreeNode[0].props.uploadStatus = status;
		newTreeNode[0].props.localUrl = localUrl;
		newTreeNode[0].props.uploadPercent = uploadPercent;
		selectNode(currentWorkspace, newTreeNode[0]);
		callback?.(newTreeNode[0].id);
		// 添加视频之后需要添加任务
		// try {
		// 	if (resourceType == "video" && children.length === 0) {
		// 		addVideoTask({
		// 			elementId: newTreeNode[0].id,
		// 			pageId: curWorkspace.id,
		// 		});
		// 	}
		// } catch (e) {
		// 	console.log(e);
		// }
	};
	const updateNode = async (props: IProps, data: Record<string, any>) => {
		const { currentWorkspace, fileData } = props;
		const { elementId } =
			fileData;
		const closestNode = currentWorkspace.operation.tree;
		const children = closestNode?.children || [];
		const updateNode = children.find((v) => v.id == elementId);
		if (!updateNode) return;
		// 更新src
		updateProps(data, updateNode);
	};
	//更新节点宽高
	const updateProps = (props, treeNode) => {
		const { src, width, height } = props;
		if (treeNode.isRoot) {
			if(treeNode.props.style.backgroundImage) {
				treeNode.props.style.backgroundImage = src
			} else {
				treeNode.props.style = {backgroundImage:src, backgroundSize: 'cover'}
			}
			// 更新背景图以后，图片组件设为背景的switch更新
			const children = tree.children
			children.forEach(component => {
				if (component.props["x-component"] == "Img") {
					component.setProps({
						info: {
							...component.props.info,
							isBackground: component.props.src === src
						}
					})
				}
			});
		} else {
			if (treeNode.props["x-component"] == "Img") {
				if (width && height) {
					const { width: imgWidth, height: imgHeight } = getImgWH({
						width,
						height,
					});
					treeNode.props.style.width = imgWidth + "px";
					treeNode.props.style.height = imgHeight + "px";
				}
				// 新上传的图片组件如果和背景图一样，设置isBackground
				if (tree.props.style.backgroundImage === src) {
					treeNode.props.info.isBackground = true;
				}
			}
			const newProps = {...props};
			delete newProps.width;
			delete newProps.height;
			treeNode.props = Object.assign(treeNode.props, newProps);
		}
	};
	return {
		addNode,
		updateProps,
		updateNode,
	};
};
