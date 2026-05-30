import React, { memo, useMemo } from "react";
import { UploadStatus } from "../../settingComponents/COSUpload/type";
import { useGlobalData } from "@editor/react";
import { Progress } from 'antd'
interface IProps {
	uploadPercent: number;
	uploadStatus: string;
	src: string;
}
export const WidgetLoading = memo(
	(props:IProps) => {
		console.log('props',props)
        const { viewportSize } = useGlobalData();
		const mapKey = useMemo(() => {
			return {
				[UploadStatus.uploading]: "上传中",
				[UploadStatus.error]: "上传失败",
			};
		}, []);
        const Wrapper = ({ text, children }:{
            text:string,
            children?:React.ReactNode
        }) => {
            return (
                <div
                    style={{
                        width: `${viewportSize[0]}px`,
                        height: `${viewportSize[1]}px`,
                        background: "rgba(255,255,255)",
                        position: "absolute",
                        zIndex: 9,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        top:0,
                        left:0
                    }}
                >
                    <div style={{ fontSize: "20px", color: "#000" }}>{text}</div>
                    {children}
                </div>
            );
        };
		// 上传成功之后 更改 props src 属性 即上传阶段结束
		if (props.src || !props.uploadStatus) return null;
		return (
			<>
				{!props.src && props.uploadStatus && (
				<Wrapper text={`视频${mapKey[props.uploadStatus]}`}>
					<Progress
						percent={props.uploadPercent}
                        status={props.uploadStatus === UploadStatus.error ? 'exception' : undefined}
						style={{ width: "50%", marginTop: "30px" }}
					/>
				</Wrapper>
			)}
			</>
		);
	}
);
