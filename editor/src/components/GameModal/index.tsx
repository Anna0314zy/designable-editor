import React, { useState, forwardRef, memo, useImperativeHandle,useRef, useCallback } from "react";
import { Modal } from "antd";
import { useSaveGame } from '../../hooks/useSaveGame'
import { useDesigner } from '@editor/react'
import { getToken } from '../../utils/common'
const GameModal = (props, ref) => {
	const [visible, setVisible] = useState(false);
	const engine = useDesigner()
	const [gameLibUrl, setGameLibUrl] = useState("");
	const gameNode = useRef(null)
	const [edit,setEdit] = useState(false)
	const frameRef = useRef(null)
	const handleCancel = () => {
		setVisible(false);
		setEdit(false)
	};
	// 保存游戏
	useSaveGame(engine, gameNode.current, handleCancel,edit)
	const open = (node,params) => {
		gameNode.current=node
		const tag = params ? 'edit' : "create";
		if(params) setEdit(true);
		const GameLib = `${
			import.meta.env.VITE_GAME_BASE
		}/courseware_admin/`;
		const token = getToken();
		let GameLink = `${GameLib}?token=${token}&timestamp=${Date.now()}`;
		if(params){
			const { gameId, templateId } = params;
			GameLink = `${GameLink}&gameId=${gameId}&templateId=${templateId}`;
		}
		setGameLibUrl(`${GameLink}#/${tag}TeachingCourseware/lele`);
		setVisible(true);
	};
	// 绑定ref对外引用
	useImperativeHandle(ref, () => ({
		open,
		cancel: handleCancel,
	}));
	const handleClose = useCallback(() => {
		setGameLibUrl("")
		frameRef.current = null
	},[])

	return (
		<Modal
			className="game-lib-modal"
			title="游戏库"
			open={visible}
			footer={null}
			onCancel={handleCancel}
			width="100%"
			style={{
				position: "fixed",
				left: 0,
				right: 0,
				top: 0,
				bottom: 0,
				paddingBottom: 0,
			}}
			destroyOnClose={true}
			afterClose={handleClose}
		>
			<iframe
			ref={frameRef}
				src={gameLibUrl}
				height="100%"
				width="100%"
				style={{ border: "none" }}
			></iframe>
		</Modal>
	);
};
export default memo(forwardRef(GameModal));
