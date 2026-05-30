import React from "react";
import { usePrefix, IconWidget, TextWidget } from "@editor/react";
export const ResourceSubMenuItem = ({ item }) => {
	const { node, icon, title } = item[0];
	const prefix = usePrefix("resource");

	return (
		<div
			className={prefix + "-item"}
			key={node.id}
			data-designer-source-id={node.id}
		>
			{icon && React.isValidElement(icon) ? (
				<>{icon}</>
			) : (
				<IconWidget
					className={prefix + "-item-icon"}
					infer={icon}
					style={{ width: 16, height: 16 }}
				/>
			)}
			<span className={prefix + "-item-text"}>
				{
					<TextWidget>
						{title || node.children[0]?.getMessage("title")}
					</TextWidget>
				}
			</span>
		</div>
	);
};

