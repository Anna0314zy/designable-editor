import React, { useEffect, memo, useMemo } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { UploadStatus } from "../../settingComponents/COSUpload/type";
export const WidgetLoading = memo(
	({
		bgColor,
		textColor,
		uploadStatus,
		src,
		children,
	}: {
		bgColor?: string;
		textColor?: string;
		uploadStatus?: string;
		src;
		children?: React.ReactNode;
	}) => {
		const mapKey = useMemo(() => {
			return {
				[UploadStatus.uploading]: "上传中",
				[UploadStatus.error]: "上传失败",
			};
		}, []);
		// 上传成功之后 更改 props src 属性 即上传阶段结束
		if (src || !uploadStatus) return null;

		return (
			<>
				{children}
				<div
					style={{
						position: "absolute",
						left: "20px",
						top: "20px",
						padding: "10px",
						backgroundColor: bgColor ? bgColor : "#000",
						color: textColor ? textColor : "#fff",
						display: "flex",
						flexWrap: "nowrap",
						fontSize: "24px",
						borderRadius: "8px",
						zIndex: 10,
					}}
				>
					<LoadingOutlined />
					{/* // loading 中 上传中 图片发生错误 图片上传发生错误 */}
					{
						<span
							style={{
								color: mapKey[uploadStatus]?.includes("失败")
									? "#ff4d4f"
									: "#fff",
								paddingLeft: "10px",
							}}
						>
							{mapKey[uploadStatus]}
						</span>
					}
				</div>
			</>
		);
	}
);
