import { ShapePoolItem } from "../utils/shapes";
import cls from "classnames";
import { TreeNode } from "@editor/core";

export interface ShapeItemThumbnailProps {
	shape: ShapePoolItem;
	style?: React.CSSProperties;
	node: TreeNode;
	shapeKey: string;
	key: number;
}

export const ShapeItemThumbnail = (props: ShapeItemThumbnailProps) => {
	const shape = props.shape;
	const node = props.node;
	const shapeKey = props.shapeKey;

	return (
		<div className="shape-item-thumbnail" style={props.style}>
			<div
				className="shape-content"
				data-designer-source-id={node.id}
				data-shape-key={shapeKey}
			>
				<svg overflow="visible" width="18" height="18">
					<g
						transform={`scale(${18 / shape.viewBox[0]}, ${
							18 / shape.viewBox[1]
						}) translate(0,0) matrix(1,0,0,1,0,0)`}
					>
						<path
							className={cls("shape-path", { outlined: shape.outlined })}
							vectorEffect="non-scaling-stroke"
							strokeLinecap="butt"
							strokeMiterlimit="8"
							fill={shape.outlined ? "#999" : "transparent"}
							stroke={shape.outlined ? "transparent" : "#999"}
							strokeWidth="2"
							d={shape.path}
						></path>
					</g>
				</svg>
			</div>
		</div>
	);
};
