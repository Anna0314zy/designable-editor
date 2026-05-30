// 游戏 -> mcc
export enum GameEvent {
    RequestEventReady = 'request_event_ready', // 游戏准备就绪 （可以接受recv_is_master）消息
    SendSyncData = 'send_sync_data', // 游戏同步事件
    /**主包加载完成 */
    RequestMainGameInitDone = 'mainGameInitDone',
    /**框架加载完成 */
    RequestFrameGameInitDone = 'frameGameInitDone',
    /**游戏开始 */
    RequestGameStart = 'gameStart',
    RequestResLoadStart = 'request_res_load_start', // 游戏开始加载
    RequestResLoadEnd = 'request_res_load_end', // 游戏加载完成
    RequestKeepPlaying = 'request_keep_playing', // 授课端收到recv_keep_playing接着玩的回调消息
    RequestRestartOver = 'request_restart_over', // 游戏收到recv_restart且支持重新玩的回调
    RequestSyncInit = 'request_sync_init', // 游戏可以接心跳数据
    RequestStaticResUrl = 'request_static_res_url', // 请求获取离线包路径
    RequestGameToClient = 'request_game_to_client', // 透传游戏发给端上的消息

    SetNextPageId = 'setNextPageId', // 翻到下一页
    GetInitParam = 'getInitParam', // 获取课堂参数
    EventTracking = 'eventTracking', // 业务埋点
}

// mcc -> 游戏
export enum GameCommand {
    RecvIsMaster = 'recv_is_master', // 是否为主动发送心跳的一端
    RecvSyncData = 'recv_sync_data', // 发送同步消息
    RecvSync3sData = 'recv_sync_3s_data', // 发送3s心跳消息
    RecvKeepPlaying = 'recv_keep_playing', // ->授课端 开启全员授权（接着玩）
    RecvRestart = 'recv_restart', // 开启全员授权（重新玩）
    RecvCancelKeepPlaying = 'recv_cancel_keep_playing', //取消接着玩的事件(游戏收到此事件会在短时间内增加心跳频率)
    RecvOpenAuthorization = 'recv_open_authorization', // 游戏获取授权
    RecvCancelAuthorization = 'recv_cancel_authorization', // 游戏取消授权
    RecvStaticResUrl = 'recv_static_res_url', // 发送离线包地址给游戏
    RecvClientToGame = 'recv_client_to_game', // 透传端上发给游戏的消息
}

// 课件中游戏所处授权状态
export enum GameAuthorizeStatus {
    // 1.未授权 （正常的 sync 状态）有可能处在
    // 2.被单独授权的状态 因为 单独授权状态 端上不透传给mcc（黑盒）
    Unauthorized = 'unauthorized',
    KeepPlaying = 'keepPlaying', // 授权（接着玩）
    Restart = 'restart', // 授权 （重新玩）
  }

  // 游戏 -> 端（通过mcc透传）
  export enum GameToClientEvent {
    // 作答数据上报
    game_over = 'game_over',
    game_statistic_data = 'game_statistic_data',


    /**开始拍照 */
    startPhotoCapture = 'startPhotoCapture',
    /**取消拍照 */
    cancelPhotoCapture = 'cancelPhotoCapture',
    /**开始录音 */
    startAudioRecording = 'startAudioRecording',
    /**停止录音 */
    stopAudioRecording = 'stopAudioRecording',
    /**取消录音 */
    cancelAudioRecording = 'cancelAudioRecording',
    /**获取用户信息 */
    fetchUserInfo = 'fetchUserInfo',
    
}