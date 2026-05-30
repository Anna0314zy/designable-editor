import React, {
	useState,
	useCallback,
	useImperativeHandle,
	useEffect,
	useRef,
} from "react";
import { Modal } from "antd";
import style from "./index.module.less";
import { ParentHandshake, WindowMessenger } from "post-me";
import { useWorkbench } from "@editor/react";
import { observer } from '@slides/reactive-react'
interface IProps {
	slideId: string;
	pageId: string;
	slideTitle: string;
	productId: string;
	// workbench: any;
	fileList: any[];
	selfRef:any
}

// export default observer(forwardRef(PreviewModal));
const PreviewModal = observer(
  (({ slideId, pageId, slideTitle, productId, fileList,selfRef }: IProps) => {
    // 在这里返回你的组件
	const workbench = useWorkbench();
	const [visible, setVisible] = useState(false);
	const [previewUrl, setPreviewUrl] = useState("");
	const previewRef = useRef(null);
	const cancel = () => {
		setVisible(false);
	};
	const open = () => {
		const regex = /(\d+\.\d+\.\d+)/;
		const TaskVersion = localStorage.getItem("TaskVersion");
		const HomeUrl = import.meta.env.VITE_HOME_SERVER.replace(
			regex,
			TaskVersion || "1.0.0"
		);
		setPreviewUrl(
			`${HomeUrl}?mode=sender&pageId=${pageId}&title=${slideTitle}&productId=${productId}&timestamp=${Date.now()}#/editor/preview/${slideId}`
		);
		setVisible(true);
	};
	// 绑定ref对外引用
	useImperativeHandle(selfRef, () => ({
		open,
		cancel,
	}));

	const handleCancel = useCallback(() => {
		setVisible(false);
	}, []);
	useEffect(() => {
		setTimeout(() => {
			if (visible && previewUrl) {
				// Create the child window any way you like (iframe here, but could be popup or tab too)
				const childFrame = previewRef.current;
				// childFrame.src = previewUrl;
				const pages = workbench.workspaces.map((workspace) => {
					const pageInfo = workspace.serialize();
					return {
						...pageInfo.pageInfo,
						pageType: pageInfo.pageType,
					};
				});
				const data = JSON.stringify({
					fileList,
					slideId,
					pages,
					pageId,
				});
				// 需要确保iframe 已经完全加载
				childFrame.addEventListener("load", () => {
					const childWindow = childFrame.contentWindow;
					const remoteOrigin = new URL(previewUrl).origin;
					// For safety it is strongly adviced to pass the explicit child origin instead of '*'
					const messenger = new WindowMessenger({
						localWindow: window,
						remoteWindow: childWindow,
						remoteOrigin: remoteOrigin,
					});
	
					ParentHandshake(messenger).then((connection) => {
						const remoteHandle = connection.remoteHandle();
						remoteHandle.call("getSlideData", data);
					});
				});
			}
		},0)
	}, [fileList, pageId, previewUrl, slideId, visible, workbench.workspaces]);
	return (
		<Modal
			title="预览"
			open={visible}
			footer={null}
			onCancel={handleCancel}
			width="100%"
			style={{
				top: 0,
				bottom: 0,
				left: 0,
				right: 0,
				position: "fixed",
				paddingBottom: "10px",
			}}
			destroyOnClose={true}
			afterClose={() => setPreviewUrl("")}
			wrapClassName={style["preview-modal"]}
		>
			<iframe
				ref={previewRef}
				src={previewUrl}
				height="100%"
				width="100%"
				style={{ border: "none" }}
			></iframe>
		</Modal>
	);
	
  })
);
export default PreviewModal;