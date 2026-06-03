import { useGlobalData } from "../../hooks";
import {  List, Popover,Progress } from "antd";
import { IconWidget, TextWidget } from "../../widgets";
import  "./styles.less";
interface  IUploadList {
    id:string;
    fileName:string;
    percent:number;
}
const ProgressList = ({ parentRef }) => {
	const { uploadList = [] } = useGlobalData();
	return (
		<Popover
			styles={{
				body: {
					maxHeight: "calc(100vh - 150px)",
					overflowY: "auto",
				},
			}}
			getPopupContainer={() => parentRef.current}
			content={
				<div style={{ width: 600 }}>
					<List
						itemLayout="horizontal"
						dataSource={uploadList as IUploadList[]}
						size="small"
						renderItem={(item) => (
							<List.Item key={item.id} className={'footer-resource-progress'}>
								<div className="text">{item.fileName}</div>
                                <Progress percent={item.percent || 0} style={{width:'200px'}}/>
							</List.Item>
						)}
					/>
				</div>
			}
			placement="top"
			title="视频上传进度列表"
			trigger="click"
		>
			<IconWidget
				tooltip={{
					title: <TextWidget>视频上传进度列表</TextWidget>,
					placement: "leftTop",
				}}
				infer="List"
				style={{ cursor: "pointer", marginRight: 10 }}
			/>
		</Popover>
	);
};
export default ProgressList;
