import {
	RenderRoot,
	useEventStore,
} from "@play/render";
import { useContext } from "react";
import {
	AnimateWidget,
} from "@slides/animate";
import "./assets/normalize.css";
import { SlideInfoContext } from "@slide/render-context";
import { sendChangeMessage, sendLog } from './utils'


if (window.__MICRO_APP_ENVIRONMENT__) {
	console.log("预览端在微前端环境中");
	window.Event = window.rawWindow.Event;
}

const App = ({ globalConfig, pageInfo, style }) => {
	const context = useContext(SlideInfoContext);
	const activeId = context.pageInfo?.activeId
	const globalData = window.microApp && window.microApp.getGlobalData();
	const globalProps = {
		styleMapProps: {},
		fileList: globalData[pageInfo.id]?.fileResourceDtoList || [],
	};
	return (
		<div preview-id={pageInfo.id} preview-root={pageInfo.id} style={{position: 'absolute', backgroundColor: "#fff", height: "960px", width: "1280px", ...pageInfo.props.style, ...style }}>
			<RenderRoot
				schema={pageInfo}
				widgets={{}}
				methods={{sendLog:sendLog}}
				globalProps={globalProps}
				globalConfig={globalConfig}
				activePageId={activeId}
				pageId={pageInfo.id}
			>
				<AnimateWidget
					activePageId={activeId}
					pageInfo={pageInfo}
					useEventStore={useEventStore}
					sendChangeMessage={sendChangeMessage}
					sendLog={sendLog}
				/>
			</RenderRoot>
		</div>
	);
};

export default App;
