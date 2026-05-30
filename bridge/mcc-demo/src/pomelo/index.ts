
/* eslint-disable */
// @ts-nocheck
import { EventEmitter } from 'events';

function myLog(...args: unknown[]) {
  // console.log('[mock-pomelo] ', ...args);
}
enum ConnectStatus {
  UnConnected,
  Connecting,
  Connected,
  DisConnected,
}
class MockPomelo extends EventEmitter {
  public roomId: string | undefined;

  private _host!: string;
  private _port!: string;
  private _socket!: WebSocket | null;
  private status: ConnectStatus;
  private classId: string | number
  constructor() {
    super();
    this.initServer();
    this.status = ConnectStatus.UnConnected;
  }

  /**
   * 添加事件监听
   */
  addEvents(): void {
    //readyState属性返回实例对象的当前状态，共有四种。  this._socket.readyState
    //CONNECTING：值为0，表示正在连接。
    //OPEN：值为1，表示连接成功，可以通信了。
    //CLOSING：值为2，表示连接正在关闭。
    //CLOSED：值为3，表示连接已经关闭，或者打开连接失败

    this._socket!.onopen = this.onSocketOpen.bind(this);
    this._socket!.onmessage = this.onReceiveMessage.bind(this);
    this._socket!.onclose = this.onSocketClose.bind(this);
    this._socket!.onerror = this.onSocketError.bind(this);
  }

  /**
   * 移除事件监听
   */
  removeEvents(): void {
    myLog('removeEvents');
    this._socket!.onopen = null;
    this._socket!.onmessage = null;
    this._socket!.onclose = null;
    this._socket!.onerror = null;
  }

  /**
   * 初始化服务区地址
   * @param host IP
   * @param port 端口
   */
  initServer(): void {
    this._host = '43.138.0.163';
    // this._host = 'localhost';
    this._port = '80';
    this.roomId = localStorage.getItem('classId') || 'h5';

    this.connect();
  }

  /**
   * 开始Socket连接
   */
  connect(): void {
    this._socket = new WebSocket(`ws://${this._host}/?room=${this.roomId}`);
    this.status = ConnectStatus.Connecting;
    myLog('WebSocket connect: ' + this._host + ':' + this._port);
    this.addEvents();
  }

  /**
   * 发送消息到服务器
   * @param msg unknown
   */
  send(data: unknown): void {
    if (this.status !== ConnectStatus.Connected) {
      return myLog('socket is not connected');
    }
    myLog('发送消息socket', data);
    this._socket!.send(JSON.stringify(data));
  }

  async storeData(key: string, value: unknown): Promise<string> {
    const url = this.getBaseUrl();
    url.pathname = '/sync-server/store';
    url.searchParams.set('key', key);
    const ret = await fetch(url.toString(), {
      method: 'POST',
      body: JSON.stringify({ value }),
      headers: {
        'content-type': 'application/json',
      },
    });
    return ret.text();
  }

  async getStoredData(): Promise<unknown> {
    const url = this.getBaseUrl();
    url.pathname = '/sync-server/getAllStore';
    const ret = await fetch(url.toString());
    const allStored = await ret.json();
    const keys = Object.keys(allStored.data);
    for (const key of keys) {
      allStored[key] = allStored.data[key].value;
    }
    return allStored;
  }

  // async getLatestMsg(): Promise<string> {
  //   const ret = await fetch(
  //     `http://${this._host}:${this._port}/latest?room=${this.roomId}`
  //   );
  //   return ret.text();
  // }

  /**
   * 关闭Socket连接
   */
  close(): void {
    myLog('close');
    if (this._socket) {
      this.removeEvents();
      this._socket.close();
      this._socket = null;
    }
  }

  // startHeart () {
  //   this.stopHeart()
  //   this.heartTimer = setInterval(() => {
  //     this._socket.send('--heartbeart--')
  //   }, 10000)
  // }

  // stopHeart () {
  //   if (this.heartTimer) {
  //     clearInterval(this.heartTimer)
  //     this.heartTimer = null
  //   }
  // }

  private getBaseUrl() {
    const url = new URL(`http://${this._host}`);
    url.port = this._port;
    url.searchParams.set('room', this.roomId);
    return url;
  }

  onSocketOpen(e: unknown): void {
    // this.startHeart()
    this.status = ConnectStatus.Connected;
    myLog('[ws]SocketOpen', e);
    this.emit('onOpen', this.roomId);
  }

  onReceiveMessage(e: unknown): void {
    // if (e.data === '--heartbeart--') return
    myLog('[ws]收到消息socket', e);
    this.emit('onMessage', JSON.parse(e.data));
  }

  onSocketClose(e): void {
    this.status = ConnectStatus.DisConnected;
    myLog('[ws]onClose', e);
    this.emit('onClose', e);
  }

  onSocketError(e): void {
    this.status = ConnectStatus.DisConnected;
    myLog('[ws]onError', e);
    this.emit('onError', e);
  }
}

export default MockPomelo;
