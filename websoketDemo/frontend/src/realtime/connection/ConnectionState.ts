import type {ConnectionStatus} from '../protocol'

const BUSY_STATES: ConnectionStatus[] = ['connecting', 'recovering', 'ready', 'reconnecting']
// idle：还没开始连接
// offline：浏览器检测到网络不可用
// connecting：首次建连
// recovering：WebSocket 已打开，但正在恢复消息、应用快照
// ready：连接和业务数据都已就绪，可以发业务命令
// reconnecting：异常断线后重新连接
// failed：连接失败
// closed：用户主动关闭
// kicked：同账号登录冲突，被服务端踢下线

/**
 * 集中保存连接维度状态，避免状态标记散落在管理器各处。
 * ConnectionState 是连接生命周期的状态容器和守卫，
 * 负责回答“当前处于什么状态”“还能不能连接”“这个异步回调是否已经过期”，但不负责实际操作 WebSocket。
 */
export class ConnectionState {
  status: ConnectionStatus = navigator.onLine ? 'idle' : 'offline'
  destroyed = false
  manuallyClosed = false
  kicked = false
  epoch = 0 //epoch 是连接代次编号，用于识别异步回调是不是属于当前连接。

  reconnectAttempts = 0
  clientId = ''
  latency = 0 //latency 表示 WebSocket 当前的网络往返延迟，通常单位是毫秒。

  canConnect() {
    return !this.destroyed && !this.kicked && !BUSY_STATES.includes(this.status)
  }

  beginConnect() {
    this.manuallyClosed = false
    this.epoch += 1
    this.status = this.reconnectAttempts ? 'reconnecting' : 'connecting'
    return this.epoch
  }

  isCurrent(epoch: number) {
    return !this.destroyed && this.epoch === epoch
  }

  markManualClose() {
    this.manuallyClosed = true
    this.epoch += 1
    this.status = 'closed'
  }

  markDestroyed() {
    this.destroyed = true
    this.epoch += 1
  }
}
