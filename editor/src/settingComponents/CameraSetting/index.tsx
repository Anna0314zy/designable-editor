import React from "react";
import { useField, Field, observer } from "@slides/react";
import { usePrefix } from "@editor/react";
import { Select, FormItem } from "@slides/antd";
import { FoldItem, SizeInput } from "@editor/react-settings-form";
import cls from "classnames";
import { useSelectedNode } from "@editor/react";
const getRatio = (treeNode) => {
	const [w, h] = treeNode.props.style.ratio.split(":");
	return Number(h) / Number(w);
};
const clamp = (number, lower, upper) => {
	return Math.min(Math.max(number, lower), upper);
};

const getSize = (treeNode) => {
	const minHeight = Number(
		(treeNode.props.style.minHeight || "0").match(/\d+/)[0]
	);
	const maxHeight = Number(
		(treeNode.props.style.maxHeight || "0").match(/\d+/)[0]
	);
	const minWidth = Number(
		(treeNode.props.style.minWidth || "0").match(/\d+/)[0]
	);
	const maxWidth = Number(
		(treeNode.props.style.maxWidth || "0").match(/\d+/)[0]
	);
	return { minHeight, maxHeight, minWidth, maxWidth };
};

export interface ICameraStyleSetterProps {
	className?: string;
	style?: React.CSSProperties;
	COSUpload?: any;
	treeNode?: any;
}

export const CameraSetting: React.FC<ICameraStyleSetterProps> = observer(
	(props) => {
		console.log(
			"%c 🍵 props: ",
			"font-size:20px;background-color: #FFDD4D;color:#fff;",
			props
		);
		const treeNode = useSelectedNode();
		const field = useField();
		const prefix = usePrefix("ratio-style-setter");
		const options = [
			{
				label: "4:3",
				value: "4:3",
			},
			{
				label: "1:1",
				value: "1:1",
			},
		];
		const onRatioChange = (value: string) => {
			const width = Number((treeNode.props.style.width || "0").match(/\d+/)[0]);
			treeNode.props.style.ratio = value;
			const ratio = getRatio(treeNode);
			const { minHeight, maxHeight } = getSize(treeNode);
			const height = clamp(width * ratio, minHeight, maxHeight);
			treeNode.props.style.height = `${Math.round(height)}px`;
			treeNode.props.style.width = `${Math.round(height / ratio)}px`;
		};
		const onWidthChange = (value) => {
			const [w, h] = treeNode.props.style.ratio.split(":");
			const ratio = Number(h) / Number(w);
			const val = Number((value || "0").match(/\d+/)[0]);
			const { minHeight, maxHeight } = getSize(treeNode);
			const height = clamp(val * ratio, minHeight, maxHeight);
			treeNode.props.style.height = `${Math.round(height)}px`;
			treeNode.props.style.width = `${Math.round(height / ratio)}px`;
		};
		const onHeightChange = (value) => {
			const [w, h] = treeNode.props.style.ratio.split(":");
			const ratio = Number(w) / Number(h);
			const val = Number((value || "0").match(/\d+/)[0]);
			const { minWidth, maxWidth } = getSize(treeNode);
			const width = clamp(val * ratio, minWidth, maxWidth);
			treeNode.props.style.width = `${Math.round(width)}px`;
			treeNode.props.style.height = `${Math.round(width / ratio)}px`;
		};
		//  我希望联动的话 是 onBlur
		return (
			<FoldItem className={cls(prefix, props.className)} label={field.title}>
				<FoldItem.Base>
					<Select
						value={treeNode.props.style.ratio}
						options={options}
						onChange={onRatioChange}
					/>
				</FoldItem.Base>
				<FoldItem.Extra>
					<Field
						name="width"
						title="宽度"
						decorator={[FormItem]}
						basePath={field.address.parent()}
						component={[
							SizeInput,
							{ onBlur: onWidthChange },
						]}
					/>
					<Field
						name="height"
						title="高度"
						decorator={[FormItem]}
						basePath={field.address.parent()}
						component={[
							SizeInput,
							{ onBlur: onHeightChange },
						]}
					/>
				</FoldItem.Extra>
			</FoldItem>
		);
	}
);
