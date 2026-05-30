import { SHAPE_LIST } from "../utils/shapes";
import { ShapeItemThumbnail } from "./ShapeItemThumbnail";
import './style.less'
interface ShapePanelProps {
	node: any;
}
export const ShapePanel = (props:ShapePanelProps) => {
	return (
		<div style={{width:368}}>
			{SHAPE_LIST.map((item,index) => {
				return (
					<div className={item.type} key={index} style={index !== 0 ? {marginTop: 12} : {}}>
						<div>{item.type}</div>
						<div className="shape-item" style={{ display: "flex", flexWrap: "wrap", marginTop: 10}}>
							{item.children.map((shape, index) => {
								return (
									<ShapeItemThumbnail
										shapeKey={shape.key}
										key={index}
										shape={shape}
										style={{ marginRight: 6}}
										node = {props.node}
									/>
								);
							})}
						</div>
					</div>
				);
			})}
		</div>
	);
};
