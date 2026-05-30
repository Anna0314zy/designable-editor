import React, { useContext, useEffect, useRef } from "react";
import { IComponentProps } from "./type";
import { throttle } from "lodash-es";
import { getUrls, getVideoDuration } from '../utils'
import { playerMessageTypeCollection, playerEvents, PlayerEventTypeCollection } from './const'
import { LogName, LogAct, ResourceType, LogState } from "../const";
import { isRemoteResourceExist } from '../utils';
import './index.css';

const defaultVideoSize = [1280, 960];
const searchParams = window.location.search;
const params = new URLSearchParams(searchParams);
const role = params.get("mode");


export const VideoComponent = (props: IComponentProps) => {
	const {
		useConnect,
		useReport,
		useEventStore,
		id,
		mode,
		pageId,
		style,
		title,
		children,
		setDefaultName,
		src,
		treeNodeProps,
		info = {}, // 预览端使用
		activePageId,
		sendLog,
	} = props;
	// const { registerInstance, instanceMap, uninstallInstance } = useConnect(
	// 	[]
	// ) as any;
	const { registerMsg } = useEventStore(() => []);
	// const { resourceReport, ReportStatus, ResourceStatus } = useReport();
	const playerRef = React.useRef<HTMLVideoElement>(null);

	const canPlay = useRef(false);
	const registered = useRef(false);

	const posterIndexRef = React.useRef(0);
	const sourceIndexRef = React.useRef(0);

	const { resourceData } = props.globalConfig
	const { fileList } = props.globalProps
	// 针对先导课进行特殊处理，需要视频自动播放
	let introductoryLessonMode = false
	if (window.__MICRO_APP_ENVIRONMENT__) {
		const globalData = window?.microApp?.getGlobalData() as any
		if (globalData.initParam) {
			const { introductoryLesson } = globalData.initParam;
			introductoryLessonMode = introductoryLesson
		}
	}

	// 是否自动播放 1. 并且为 autoPlay 为了保证学生端流畅性，去除 autoplay 同步授课端信令逻辑，自动播放即可 2. 先导课模式
	let autoPlay = ((info.autoplay && role === "sender") || introductoryLessonMode) && role !== 'preview'
	if (mode === 'edit') autoPlay = false

	useEffect(() => {
		if (playerRef.current) {
			if (pageId !== activePageId) {
				if (playerRef.current.currentTime > 0) {
					playerRef.current.currentTime = 0
				}
				playerRef.current.pause()
			} else {
				// 如果是当前页，并且是自动播放，则播放
				if (autoPlay) {
					playerRef.current.play()
				}
			}
		}
	}, [activePageId])

	// 判断是否可见
	useEffect(() => {
		const autoPlayHandle = () => {
			if (playerRef.current) {
				// 如果是先导课模式，则需要判断是否可见
				if (document.visibilityState === "visible" && introductoryLessonMode && pageId === activePageId) {
					playerRef.current.play()
				} else if (document.visibilityState === "hidden" && introductoryLessonMode) {
					playerRef.current.pause()
				}
			}

		}
		// 监听页面是否可见
		document.addEventListener('visibilitychange', autoPlayHandle);
		return () => {
			document.removeEventListener('visibilitychange', autoPlayHandle);
		}
	})

	const truncateToFirstDecimalPlace = (num: number) => {
		return Number(String(num).replace(/(\.\d)\d+/, '$1'));
	}

	// 减 0.2 是为了兼容 ios 最后一帧黑屏问题
	const videoDuration = truncateToFirstDecimalPlace(Number(getVideoDuration(resourceData, fileList, src, 'video'))) - 0.2
	const sources = getUrls(resourceData, fileList, src, 'video')
	const posters = getUrls(resourceData, fileList, src, 'video', 'videoScreenshotOssFileName', 'videoScreenshotOssPath', 'pic')
	const videoJsOptions = {
		controls: (role === "sender" || mode === "edit" || role === 'preview') && !introductoryLessonMode,
		controlBar: {
			volumePanel: false,
			fullscreenToggle: false,
			pictureInPictureToggle: false
		},
		playsinline: true,
		fluid: true,
		preload: true,
		aspectRatio: '4:3',
	};

	// 需要暂存的消息
	const playStateTodo = useRef(null)
	// 检查player是否可以播放
	const checkPlayerCanPlayHandle = useRef<Function | null>(null)


	function getPlayerState(type) {
		if (playerRef.current) {
			if (!playerRef.current) {
				return
			}
			const state = {
				id: id,
				type: "videoStateChanged",
				currentTime: playerRef.current.currentTime || 0,
				duration: playerRef.current.duration,
				muted: playerRef.current.muted,
				paused: playerRef.current.paused,
				volume: playerRef.current.volume,
				isFullscreen: false,
				changeType: type,
			}
			console.log("player", type, state);
			return state;
		}
		return null;
	}

	// 注册发送者
	function registerSender(playerEventNotice, playerStateNotice) {
		if (!playerRef.current) return
		// 监听时间更新事件,做节流处理
		const syncTime = throttle(() => {
			const state = getPlayerState(PlayerEventTypeCollection.TIMEUPDATE);
			[playerStateNotice, playerEventNotice].forEach((notice, noticeIndex) => {
				notice({
					type: noticeIndex === 0 ? playerMessageTypeCollection.PLAYERSTATE : playerMessageTypeCollection.PLAYEREVENT,
					payload: {
						state,
						event: PlayerEventTypeCollection.TIMEUPDATE,
					},
				});
				if (mode === "preview" && sendLog) {
					// 埋点-信令发送
					sendLog({ name: LogName.Message, act: LogAct.Send, id: id, option: { event_type: "video", event_act: PlayerEventTypeCollection.TIMEUPDATE } })
				}
			});
		}, 5e3);
		// 监听时间更新事件
		playerRef.current.addEventListener(PlayerEventTypeCollection.TIMEUPDATE, syncTime);

		// 监听暂停事件，如果是先导课模式，并且是可见，则暂停后自动播放
		playerRef.current.addEventListener(PlayerEventTypeCollection.PAUSE, () => {
			// 必须是可见
			if (document.visibilityState === "visible" && pageId === activePageId) {
				// 先导课模式
				if (introductoryLessonMode && playerRef.current) {
					const diff = Math.abs(playerRef.current.currentTime - playerRef.current.duration)
					// 没有播放完毕的话，直接开启播放
					if (diff > 2) {
						playerRef.current.play()
					}
				}
			}
		});

		playerRef.current.addEventListener("stalled", () => {
			console.log('视频播放卡顿')
			playerRef.current.play();
		});

		// 监听 playerEvents 事件
		playerEvents.forEach((event) => {
			playerRef.current?.addEventListener(event, () => {
				const state = getPlayerState(event);
				console.log("state", state);
				[playerStateNotice, playerEventNotice].forEach((notice, noticeIndex) => {
					notice({
						type: noticeIndex === 0 ? playerMessageTypeCollection.PLAYERSTATE : playerMessageTypeCollection.PLAYEREVENT,
						payload: {
							state,
							event,
						},
					});
					if (mode === "preview" && sendLog) {
						// 埋点-信令发送
						sendLog({ name: LogName.Message, act: LogAct.Send, id: id, option: { event_type: "video", event_act: event } })
					}
				});
			});
		});
	}

	// 恢复播放状态
	async function recoverPlayerState(videoState, reconnect = false, playType = playerMessageTypeCollection.PLAYEREVENT) {
		if (!playerRef.current) return
		// 不是断线重连，且不是播放事件，则不进行恢复
		if (!reconnect && playType !== playerMessageTypeCollection.PLAYEREVENT) return
		const {
			id,
			type,
			currentTime,
			duration,
			muted,
			paused: remotePaused,
			volume,
			isFullscreen,
			changeType,
		} = videoState;
		// 判断视频是否加载完成
		if (!canPlay.current) {
			// 视频未加载完成，则暂存消息，后面消费
			playStateTodo.current = videoState
			// 没有注册过检查播放状态的handle，则进行注册
			if (!checkPlayerCanPlayHandle.current) {
				checkPlayerCanPlayHandle.current = () => {
					if (canPlay) {
						recoverPlayerState(playStateTodo.current, reconnect)
						return
					}
					// 防止某一次信令先进入当前的函数，这次的检查未生效，执行了滞后的信令，导致状态恢复失败，如果在外部被重置为 null，则说明有新的信令恢复了，则不需要再进行检查了
					checkPlayerCanPlayHandle.current && requestAnimationFrame(checkPlayerCanPlayHandle.current as any)
				}
				checkPlayerCanPlayHandle.current()
			}
			return
		}
		// 如果有暂存的消息，清空处理
		playStateTodo.current = null
		// 如果有注册的检查播放状态的handle，则清空
		checkPlayerCanPlayHandle.current = null
		// 必须存在视频，并且是 videoStateChanged
		if (
			playerRef.current &&
			playerRef.current.duration &&
			type === "videoStateChanged"
		) {
			// 本地的播放状态
			const localPaused = playerRef.current.paused;
			console.log(
				"videoStatechangeType",
				videoState,
				changeType,
				localPaused,
				remotePaused,
				canPlay,
				Date.now()
			);
			// 是否是第一次播放
			let isFirstPlay = false;
			// 本地和远端的播放状态不一致，则进行恢复
			if (localPaused !== remotePaused) {
				try {
					!remotePaused && (isFirstPlay = true);
					await playerRef.current[remotePaused ? PlayerEventTypeCollection.PAUSE : PlayerEventTypeCollection.PLAY]();
				} catch (error) {
					// TODO: 处理异常
				}
			}

			if (muted !== null) {
				playerRef.current.muted = muted;
			}

			if (volume !== null) {
				playerRef.current.volume = volume;
			}

			const setCurrentTime = (time: number, diff: number, forceUpdate = false) => {
				if (!playerRef.current) return
				if (!forceUpdate && diff < 2) return
				if (time > Number(videoDuration)) {
					playerRef.current.currentTime = videoDuration;
				} else {
					playerRef.current.currentTime = time;
				}
			}

			if (currentTime !== null && typeof currentTime === "number") {
				// 只接受 播放 暂停 时间更新 三种状态的恢复
				if (![PlayerEventTypeCollection.PLAY,
				PlayerEventTypeCollection.PAUSE,
				PlayerEventTypeCollection.TIMEUPDATE,
				PlayerEventTypeCollection.SEEKED].includes(changeType)) return
				if (mode === 'preview' && sendLog) {
					// 埋点-视频事件
					sendLog({ name: LogName.VideoEvent, act: changeType, id: id, option: { md5: src } })
				}
				const time = currentTime <= playerRef.current.duration ? currentTime : playerRef.current.duration
				const diff = Math.abs(playerRef.current.currentTime - time)

				console.log('设置时间', videoDuration, changeType, time, currentTime, playerRef.current.duration, diff)
				// 如果当前的信令类型是 timeupdate
				if (changeType === PlayerEventTypeCollection.TIMEUPDATE) {
					// 则必须是断线重连才需要恢复时间,或者是第一次播放,或者时间差大于2秒
					if (reconnect || isFirstPlay) {
						setCurrentTime(time, diff)
					}
				} else {
					// 非 timeupdate 类型的信令，直接设置时间
					setCurrentTime(time, diff, true)
				}

				// 如果是暂停状态,则隐藏掉poster
				if (remotePaused === true && changeType === PlayerEventTypeCollection.TIMEUPDATE) {
					const el = document.querySelector(`[preview-id="${id}"] .vjs-poster`) as HTMLElement
					el && (el.style.display = 'none')
				}
			}

			if (changeType === PlayerEventTypeCollection.ENDED && currentTime !== null && typeof currentTime === "number") {
				const time = currentTime <= playerRef.current.duration ? currentTime : playerRef.current.duration
				// TODO：需要处理真实的duration
				const diff = Math.abs(playerRef.current.currentTime - time)
				setCurrentTime(time, diff)
			}
			console.log("recoverPlayerState", type);
		}
	}

	// 接收到信令
	function registerReceiver(playerEventRegister, playerStateRegister) {
		[playerEventRegister, playerStateRegister].forEach((register) => {
			console.log("register", register);
			register((msg: any) => {
				console.log("playerStateRegister", msg);
				const { event, state } = msg.payload;
				const { reconnect, type } = msg;
				recoverPlayerState(state, reconnect, type);
				if (mode === "preview" && sendLog && type === playerMessageTypeCollection.PLAYEREVENT) {
					// 埋点-信令接收
					sendLog({ name: LogName.Message, act: LogAct.Receive, id: id, option: { event_type: "video", event_act: state.changeType } })
				}
			});
		});
	}

	const handlePlayerReady = () => {
		console.log('player ready', autoPlay)
		if (autoPlay && pageId === activePageId) {
			playerRef.current && playerRef.current.play()
			playerRef.current.currentTime = 0
		}

		// 注册消息
		if (mode !== "edit" && registered.current === false) {
			const { notice: playerEventNotice, register: playerEventRegister } =
				registerMsg(id, playerMessageTypeCollection.PLAYEREVENT, "event", pageId);
			const { notice: playerStateNotice, register: playerStateRegister } =
				registerMsg(id, playerMessageTypeCollection.PLAYERSTATE, "state", pageId);
			registerSender(playerEventNotice, playerStateNotice);
			registerReceiver(playerEventRegister, playerStateRegister);
			registered.current = true;
		}

	};

	const handleCanPlay = () => {
		console.log('canPlay')
		canPlay.current = true
	}

	/**
   * @description 设置封面图
   * @returns {*}
   * @memberof PlayerManager
   */
	const setNewPoster = async () => {
		const url = posters[posterIndexRef.current];
		const exist = await isRemoteResourceExist(url, { timeout: 2000, retryCount: 3, retryDelay: 50 });
		if (!exist) {
			posterIndexRef.current++;
			if (posterIndexRef.current >= posters.length) {
				posterIndexRef.current = 0;
				//TODO: 这里一定要报错
				if (mode === "preview" && sendLog) {
					// 埋点-资源加载失败
					sendLog({ name: LogName.LoadResource, act: LogAct.End, id: id, option: { resource_type: ResourceType.Img, md5: src, state: LogState.Error } })
				}
				return;
			}
			setNewPoster();
			return;
		}
		if (mode === "preview" && sendLog) {
			// 埋点-资源加载成功
			sendLog({ name: LogName.LoadResource, act: LogAct.End, id: id, option: { resource_type: ResourceType.Img, md5: src, url: url, state: LogState.Success } })
		}
		playerRef.current && (playerRef.current.poster = url);
	}
	/**
	 * @description 设置播放源
	 * @memberof Player2
	 */
	const setNewSource = async () => {
		const url = sources[sourceIndexRef.current];
		const exist = await isRemoteResourceExist(url);
		if (!exist) {
			sourceIndexRef.current++;
			if (sourceIndexRef.current >= sources.length) {
				//TODO: 这里一定要报错
				if (mode === "preview" && sendLog) {
					// 埋点-资源加载失败
					sendLog({ name: LogName.LoadResource, act: LogAct.End, id: id, option: { resource_type: ResourceType.Video, md5: src, state: LogState.Error } })
				}
				return;
			}
			setNewSource();
			return;
		}
		console.log('player setNewSource', url)
		if (mode === "preview" && sendLog) {
			// 埋点-资源加载成功
			sendLog({ name: LogName.LoadResource, act: LogAct.End, id: id, option: { resource_type: ResourceType.Video, md5: src, url: url, state: LogState.Success } })
		}
		playerRef.current && (playerRef.current.src = url);
	}

	React.useEffect(() => {
		if (playerRef.current) {
			playerRef.current.addEventListener("loadedmetadata", () => {
				canPlay.current = true
				handlePlayerReady();
			});
			if (mode === 'preview' && sendLog) {
				// 埋点-资源加载开始
				sendLog({ name: LogName.LoadResource, act: LogAct.Start, id: id, option: { resource_type: ResourceType.Img, md5: src } })
			}
			setNewPoster();
			if (mode === 'preview' && sendLog) {
				// 埋点-资源加载开始
				sendLog({ name: LogName.LoadResource, act: LogAct.Start, id: id, option: { resource_type: ResourceType.Video, md5: src } })
			}
			setNewSource();
		}
	}, [playerRef]);

	return (
		<div
			preview-id={id}
			style={{
				width: `${defaultVideoSize[0]}px`,
				height: `${defaultVideoSize[1]}px`,
			}}
			{...treeNodeProps}
		>
			<video className="player" ref={playerRef} style={{ width: "100%", height: "100%" }} id={id} preload="auto" playsInline={true} controls={(role === "sender" || mode === "edit" || role === 'preview') && !introductoryLessonMode} 
			controlsList="nodownload noplaybackrate" disablePictureInPicture ></video>
			{children}
		</div>
	);
};
