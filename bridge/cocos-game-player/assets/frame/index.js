System.register("chunks:///_virtual/AppBridge.ts", ['cc', './SDKMsgType.ts', './Tools.ts'], function (exports) {
  var cclegacy, ClientMsgType, Tools;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ClientMsgType = module.ClientMsgType;
    }, function (module) {
      Tools = module.Tools;
    }],
    execute: function () {
      cclegacy._RF.push({}, "21dcc0CKw1FdrE/MltJKWJq", "AppBridge", undefined);
      /**课堂端返回的结果 */

      /**照相回调 */

      /**录音回调 */

      /**用户信息回调 */


      var AppBridgeClass = /*#__PURE__*/function () {
        function AppBridgeClass() {
          /**游戏和app交互的唯一id 由发起方生成  key: 发起的事件名 value: 唯一id */
          this.uniqueIdMap = new Map();
          /**回调管理map key: 发起的事件名-也是app返回结果的事件名 */

          this.handleMap = new Map();
        }

        AppBridgeClass.getInstance = function getInstance() {
          if (null === this._instance) {
            this._instance = new AppBridgeClass();
          }

          return this._instance;
        };

        var _proto = AppBridgeClass.prototype;
        /**
        * 监听课堂端发出的事件
        * @param key 事件名字
        * @param callBack 响应函数
        */

        _proto.addClientEvent = function addClientEvent(event, callBack, target) {
          window['gameMsg'].on(event, callBack, target);
        }
        /**
         * 注册需要回调的事件 监听端上的回调
         */
        ;

        _proto.addAllClientEvent = function addAllClientEvent() {
          //注册app监听方法
          window['gameMsg'].addMessageListener();
          this.addClientEvent(ClientMsgType.startPhotoCapture, this.receiveCaptureResult, this);
          this.addClientEvent(ClientMsgType.startAudioRecording, this.receiveRecordingResult, this);
          this.addClientEvent(ClientMsgType.fetchUserInfo, this.receiveUserInfo, this);
        }
        /**
        * 向课堂端发出的事件
        * @param key 事件名字
        */
        ;

        _proto.sendClientEvent = function sendClientEvent(event, data) {
          window['gameMsg'].dispatch(event, data);
        }
        /**
         * 开始拍照
         * @param width 照片的宽
         * @param height 高
         * @param needUpload 是否需要上传，上传的会返回远程地址 
         * @param callBack  回调会被暂存，收到端上结果走回调 callBack是箭头函数或者绑定自己的this  
         * @param target 用来检测是否已经销毁
         */
        ;

        _proto.startPhotoCapture = function startPhotoCapture(width, height, needUpload, callBack, target) {
          var uniqueId = Tools.randomString(6);
          this.uniqueIdMap.set(ClientMsgType.startPhotoCapture, uniqueId);
          var data = {
            id: uniqueId,
            param: {
              needUpload: needUpload,
              contentSize: {
                width: width,
                height: height
              }
            }
          };
          this.sendClientEvent(ClientMsgType.startPhotoCapture, data);
          this.handleMap.set(ClientMsgType.startPhotoCapture, {
            func: callBack,
            target: target
          });
        }
        /**
         * app返回的录音结果
         * @param result 
         * @returns 
         */
        ;

        _proto.receiveCaptureResult = function receiveCaptureResult(result) {
          var uniqueId = this.uniqueIdMap.get(ClientMsgType.startPhotoCapture);
          this.uniqueIdMap["delete"](ClientMsgType.startPhotoCapture);

          if (!result || result.id != uniqueId || !result.param.localPath && !result.param.remotePath) {
            return;
          }

          var eventData = this.handleMap.get(ClientMsgType.startPhotoCapture);
          this.runCallBack(eventData, result);
        }
        /**
         * 取消拍照
         * @param uniqueId 开始拍照时候的 唯一id
         */
        ;

        _proto.cancelPhotoCapture = function cancelPhotoCapture() {
          var uniqueId = this.uniqueIdMap.get(ClientMsgType.startPhotoCapture);
          this.uniqueIdMap["delete"](ClientMsgType.startPhotoCapture);
          var data = {
            id: uniqueId,
            param: {}
          };
          this.sendClientEvent(ClientMsgType.cancelPhotoCapture, data);
        }
        /**
         * 
         * @param duration 录音时长
         * @param audioAnalyze 是否需要音频分析能力
         * @param needUpload 需要上传
         * @param callBack 回调会被暂存，收到端上结果走回调 callBack是箭头函数或者绑定自己的this  
         * @param target 组件，用于判断是否已经销毁
         */
        ;

        _proto.startAudioRecording = function startAudioRecording(duration, audioAnalyze, needUpload, callBack, target) {
          var uniqueId = Tools.randomString(6);
          this.uniqueIdMap.set(ClientMsgType.startAudioRecording, uniqueId);
          var data = {
            id: uniqueId,
            param: {
              /**录音时长 */
              duration: duration,

              /**是否需要音频分析能力 */
              audioAnalyze: audioAnalyze,

              /**需要上传 */
              needUpload: needUpload
            }
          };
          this.sendClientEvent(ClientMsgType.startAudioRecording, data);
          this.handleMap.set(ClientMsgType.startAudioRecording, {
            func: callBack,
            target: target
          });
        }
        /**
         * 收到录音结果
         * @param result 
         */
        ;

        _proto.receiveRecordingResult = function receiveRecordingResult(result) {
          var uniqueId = this.uniqueIdMap.get(ClientMsgType.startAudioRecording);
          this.uniqueIdMap["delete"](ClientMsgType.startAudioRecording);

          if (result.id != uniqueId) {
            return;
          }

          var eventData = this.handleMap.get(ClientMsgType.startAudioRecording);
          this.runCallBack(eventData, result);
        }
        /**
         * 暂停录音
         */
        ;

        _proto.stopAudioRecording = function stopAudioRecording() {
          var uniqueId = this.uniqueIdMap.get(ClientMsgType.startAudioRecording);
          this.uniqueIdMap["delete"](ClientMsgType.startAudioRecording);
          var data = {
            id: uniqueId,
            param: {}
          };
          this.sendClientEvent(ClientMsgType.stopAudioRecording, data);
        }
        /**
         * 取消录音
         * @param uniqueId 唯一id
         * @param callback 暂停录音结果参数 成功失败:(uniqueId, result:{sccuess: true})
         */
        ;

        _proto.cancelAudioRecording = function cancelAudioRecording() {
          var uniqueId = this.uniqueIdMap.get(ClientMsgType.startAudioRecording);
          this.uniqueIdMap["delete"](ClientMsgType.startAudioRecording);
          var data = {
            id: uniqueId,
            param: {}
          };
          this.sendClientEvent(ClientMsgType.cancelAudioRecording, data);
        }
        /**
         * 获取用户信息
         * @param callBack 回调会被暂存，收到端上结果走回调 callBack是箭头函数或者绑定自己的this  
         * @param target 组件，用于判断是否已经销毁
         */
        ;

        _proto.fetchUserInfo = function fetchUserInfo(callBack, target) {
          var uniqueId = Tools.randomString(6);
          this.uniqueIdMap.set(ClientMsgType.fetchUserInfo, uniqueId);
          var data = {
            id: uniqueId,
            param: {}
          };
          this.sendClientEvent(ClientMsgType.fetchUserInfo, data);
          this.handleMap.set(ClientMsgType.fetchUserInfo, {
            func: callBack,
            target: target
          });
        }
        /**用户信息的结果 */
        ;

        _proto.receiveUserInfo = function receiveUserInfo(result) {
          var uniqueId = this.uniqueIdMap.get(ClientMsgType.fetchUserInfo);
          this.uniqueIdMap["delete"](ClientMsgType.fetchUserInfo);

          if (result.id != uniqueId) {
            return;
          }

          var eventData = this.handleMap.get(ClientMsgType.fetchUserInfo);
          this.runCallBack(eventData, result);
          console.log('收到拍照结果回调', result);
        };

        _proto.runCallBack = function runCallBack(eventData, result) {
          if (eventData && eventData.target && eventData.target.node && eventData.target.node.active && !eventData.target.node.isValid) {
            eventData.func && eventData.func(result);
            console.log('收到拍照结果回调', result.param);
          }
        };

        _proto.clean = function clean() {
          this.handleMap.clear();
          this.uniqueIdMap.clear();
        };

        return AppBridgeClass;
      }();

      AppBridgeClass._instance = null;
      var AppBridge = exports('AppBridge', AppBridgeClass.getInstance());

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AudioEngine.ts", ['cc'], function (exports) {
  var cclegacy, Node, director, isValid, AudioSource, misc;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      director = module.director;
      isValid = module.isValid;
      AudioSource = module.AudioSource;
      misc = module.misc;
    }],
    execute: function () {
      cclegacy._RF.push({}, "4a40avHIx9E2omCR9KCjWB7", "AudioEngine", undefined);

      var MUSIC_AUDIO_NODE_NAME = 'AudioEngine-MusicAudioNode';
      var AudioEngine = exports('AudioEngine', /*#__PURE__*/function () {
        function AudioEngine() {}
        /**
         * 获取音效组件
         * @param {string} clipName 音频名字
         * @param {boolean} isCreate 如果没有是否创建（默认不会创建）
         * @returns {AudioSource}
         */


        AudioEngine.getAudioSource = function getAudioSource(clipName, isCreate) {
          if (isCreate === void 0) {
            isCreate = false;
          }

          if (!AudioEngine.baseNode) {
            AudioEngine.baseNode = new Node('AudioEngine-BaseNode');
            director.getScene().addChild(AudioEngine.baseNode);
            director.addPersistRootNode(AudioEngine.baseNode);
          }

          var audioNode = AudioEngine.baseNode.getChildByName(clipName);

          if (audioNode && isValid(audioNode, true)) {
            return audioNode.getComponent(AudioSource);
          } else if (isCreate) {
            audioNode = new Node(clipName);
            var audioComp = audioNode.addComponent(AudioSource);
            audioComp.playOnAwake = false;
            audioNode.parent = AudioEngine.baseNode;
            return audioComp;
          }

          return null;
        }
        /************************************* */

        /**
         * !#en Set audio loop.
         * !#zh 设置音频是否循环。
         * @method setLoop
         * @param {string} clipName - clip.name
         * @param {Boolean} loop - Whether cycle.
         */
        ;

        AudioEngine.setLoop = function setLoop(clipName, loop) {
          var audioComp = AudioEngine.getAudioSource(clipName, false);

          if (audioComp) {
            audioComp.loop = loop;
          }
        }
        /**
         * !#en Get audio cycle state.
         * !#zh 获取音频的循环状态。
         * @method isLoop
         * @param {string} clipName - clip.name
         * @return {Boolean} Whether cycle.
         */
        ;

        AudioEngine.isLoop = function isLoop(clipName) {
          var audioComp = AudioEngine.getAudioSource(clipName, false);

          if (audioComp) {
            return audioComp.loop;
          }

          return false;
        }
        /**
         * !#en Set the volume of audio.
         * !#zh 设置音量（0.0 ~ 1.0）。
         * @method setVolume
         * @param {string} clipName - clip.name
         * @param {number} volume - Volume must be in 0.0~1.0 .
         */
        ;

        AudioEngine.setVolume = function setVolume(clipName, volume) {
          var audioComp = AudioEngine.getAudioSource(clipName, false);

          if (audioComp) {
            audioComp.volume = volume;
          }
        }
        /**
         * !#en The volume of the music max value is 1.0,the min value is 0.0 .
         * !#zh 获取音量（0.0 ~ 1.0）。
         * @method getVolume
         * @param {string} clipName - clip.name
         * @return {number}
         */
        ;

        AudioEngine.getVolume = function getVolume(clipName) {
          var audioComp = AudioEngine.getAudioSource(clipName, false);
          return audioComp ? audioComp.volume : 1;
        }
        /**
         * !#en Set current time
         * !#zh 设置当前的音频时间。
         * @method setCurrentTime
         * @param {string} clipName - clip.name
         * @param {number} sec - current time.
         * @return {Boolean}
         */
        ;

        AudioEngine.setCurrentTime = function setCurrentTime(clipName, sec) {
          var audioComp = AudioEngine.getAudioSource(clipName, false);

          if (audioComp) {
            audioComp.currentTime = sec;
            return true;
          } else {
            return false;
          }
        }
        /**
         * !#en Get current time
         * !#zh 获取当前的音频播放时间。
         * @method getCurrentTime
         * @param {string} clipName - clip.name
         * @return {number} audio current time.
         */
        ;

        AudioEngine.getCurrentTime = function getCurrentTime(clipName) {
          var audioComp = AudioEngine.getAudioSource(clipName, false);
          return audioComp ? audioComp.currentTime : 0;
        }
        /**
         * !#en Get audio duration
         * !#zh 获取音频总时长。
         * @method getDuration
         * @param {string} clipName - clip.name
         * @return {number} audio duration.
         */
        ;

        AudioEngine.getDuration = function getDuration(clipName) {
          var audioComp = AudioEngine.getAudioSource(clipName, false);
          return audioComp ? audioComp.duration : 0;
        }
        /**
         * !#en Get audio state
         * !#zh 获取音频状态。
         * @method getState
         * @param {string} clipName - clip.name
         * @return {AudioSource.AudioState} audio duration.
         */
        ;

        AudioEngine.getState = function getState(clipName) {
          var audioComp = AudioEngine.getAudioSource(clipName, false);
          return audioComp ? audioComp.state : AudioSource.AudioState.INIT;
        }
        /**
         * !#en Whether the audio is playing
         * !#zh 音乐是否正在播放
         * @method isPlaying
         * @return {Boolean}
         */
        ;

        AudioEngine.isPlaying = function isPlaying(clipName) {
          var audioComp = AudioEngine.getAudioSource(clipName, false);
          return audioComp ? audioComp.playing : false;
        }
        /**
         * !#en Set Audio finish callback
         * !#zh 设置一个音频结束后的回调
         * @method setFinishCallback
         * @param {string} clipName - clip.name
         * @param {Function} callback - loaded callback.
         */
        ;

        AudioEngine.setFinishCallback = function setFinishCallback(clipName, callback) {
          var audioComp = AudioEngine.getAudioSource(clipName, false);

          if (audioComp) {
            audioComp.node.off(AudioSource.EventType.ENDED, callback);
            audioComp.node.on(AudioSource.EventType.ENDED, callback);
            return true;
          } else {
            return false;
          }
        }
        /**
         * !#en remove Audio finish callback
         * !#zh 移除一个音频结束后的回调
         * @method removeFinishCallback
         * @param {string} clipName - clip.name
         * @param {Function} callback - loaded callback.
         */
        ;

        AudioEngine.removeFinishCallback = function removeFinishCallback(clipName, callback) {
          var audioComp = AudioEngine.getAudioSource(clipName, false);

          if (audioComp) {
            audioComp.node.off(AudioSource.EventType.ENDED, callback);
            return true;
          } else {
            return false;
          }
        }
        /**
         * !#en Pause playing audio.
         * !#zh 暂停正在播放音频。
         * @method pause
         * @param {string} clipName - clip.name
         */
        ;

        AudioEngine.pause = function pause(clipName) {
          var audioComp = AudioEngine.getAudioSource(clipName, false);

          if (audioComp) {
            audioComp.pause();
            return true;
          } else {
            return false;
          }
        }
        /**
         * !#en Pause all playing audio
         * !#zh 暂停现在正在播放的所有音频。
         * @method pauseAll
         */
        ;

        AudioEngine.pauseAll = function pauseAll() {
          if (AudioEngine.baseNode) {
            var audioArr = AudioEngine.baseNode.getComponentsInChildren(AudioSource);
            audioArr.forEach(function (audioComp) {
              audioComp.pause();
            });
          }
        }
        /**
         * !#en Resume playing audio.
         * !#zh 恢复播放指定的音频。
         * @method resume
         * @param {string} clipName - clip.name
         * @example
         * cc.audioEngine.resume(clipName: string);
         */
        ;

        AudioEngine.resume = function resume(clipName) {
          var audioComp = AudioEngine.getAudioSource(clipName, false);

          if (audioComp) {
            if (AudioSource.AudioState.PLAYING !== audioComp.state) {
              audioComp.play();
            }
          }
        }
        /**
         * !#en Resume all playing audio.
         * !#zh 恢复播放所有之前暂停的所有音频。
         * @method resumeAll
         */
        ;

        AudioEngine.resumeAll = function resumeAll() {
          if (AudioEngine.baseNode) {
            var audioArr = AudioEngine.baseNode.getComponentsInChildren(AudioSource);
            audioArr.forEach(function (audioComp) {
              if (AudioSource.AudioState.PLAYING !== audioComp.state) {
                audioComp.play();
              }
            });
          }
        }
        /**
         * !#en Stop playing audio.
         * !#zh 停止播放指定音频。
         * @method stop
         * @param {string} clipName - clip.name
         */
        ;

        AudioEngine.stop = function stop(clipName) {
          var audioComp = AudioEngine.getAudioSource(clipName, false);

          if (audioComp) {
            audioComp.stop();
            return true;
          } else {
            return false;
          }
        }
        /**
         * !#en Stop all playing audio.
         * !#zh 停止正在播放的所有音频。
         * @method stopAll
         */
        ;

        AudioEngine.stopAll = function stopAll() {
          if (AudioEngine.baseNode) {
            var audioArr = AudioEngine.baseNode.getComponentsInChildren(AudioSource);
            audioArr.forEach(function (audioComp) {
              audioComp.stop();
            });
          }
        }
        /**
         * !#en Play background music
         * !#zh 播放背景音乐
         * @method playMusic
         * @param {AudioClip} clip - The audio clip to play.
         * @param {Boolean} loop - Whether the music loop or not.
         * @return {string} clipName
         */
        ;

        AudioEngine.playMusic = function playMusic(clip, loop, volume) {
          if (loop === void 0) {
            loop = true;
          }

          if (volume === void 0) {
            volume = this.musicVolume;
          }

          var audioComp = AudioEngine.getAudioSource(MUSIC_AUDIO_NODE_NAME, true);

          if (audioComp.playing) {
            audioComp.stop();
          }

          audioComp.clip = clip;
          audioComp.loop = loop;
          audioComp.volume = volume;
          this.musicVolume = volume;
          audioComp.play();
          return MUSIC_AUDIO_NODE_NAME;
        }
        /**
         * !#en Stop background music.
         * !#zh 停止播放背景音乐。
         * @method stopMusic
         */
        ;

        AudioEngine.stopMusic = function stopMusic() {
          this.stop(MUSIC_AUDIO_NODE_NAME);
        }
        /**
         * !#en Pause the background music.
         * !#zh 暂停播放背景音乐。
         * @method pauseMusic
         */
        ;

        AudioEngine.pauseMusic = function pauseMusic() {
          this.pause(MUSIC_AUDIO_NODE_NAME);
        }
        /**
         * !#en Resume playing background music.
         * !#zh 恢复播放背景音乐。
         * @method resumeMusic
         */
        ;

        AudioEngine.resumeMusic = function resumeMusic() {
          this.resume(MUSIC_AUDIO_NODE_NAME);
        }
        /**
         * !#en Get the volume(0.0 ~ 1.0).
         * !#zh 获取音量（0.0 ~ 1.0）。
         * @method getMusicVolume
         * @return {number}
         */
        ;

        AudioEngine.getMusicVolume = function getMusicVolume() {
          return this.musicVolume;
        }
        /**
         * !#en Set the background music volume.
         * !#zh 设置背景音乐音量（0.0 ~ 1.0）。
         * @method setMusicVolume
         * @param {number} volume - Volume must be in 0.0~1.0.
         */
        ;

        AudioEngine.setMusicVolume = function setMusicVolume(volume) {
          volume = misc.clampf(volume, 0, 1);
          this.musicVolume = volume;
          this.setVolume(MUSIC_AUDIO_NODE_NAME, volume);
          return volume;
        }
        /**
         * !#en Background music playing state
         * !#zh 背景音乐是否正在播放
         * @method isMusicPlaying
         * @return {boolean}
         */
        ;

        AudioEngine.isMusicPlaying = function isMusicPlaying() {
          return this.getState(MUSIC_AUDIO_NODE_NAME) === AudioSource.AudioState.PLAYING;
        }
        /**
         * 获取背景音乐组件
         * @method getMusicAudioSource
         * @returns {AudioSource}
         */
        ;

        AudioEngine.getMusicAudioSource = function getMusicAudioSource() {
          var audioComp = AudioEngine.getAudioSource(MUSIC_AUDIO_NODE_NAME, true);
          return audioComp;
        }
        /**
         * !#en Play effect audio.
         * !#zh 播放音效
         * @method playEffect
         * @param {AudioClip} clip - The audio clip to play.
         * @param {Boolean} loop - Whether the music loop or not.
         * @return {number} audioId
         */
        ;

        AudioEngine.playEffect = function playEffect(clip, loop, volume) {
          if (loop === void 0) {
            loop = false;
          }

          if (volume === void 0) {
            volume = this.effectVolume;
          }

          if (!clip) return '';
          var audioComp = AudioEngine.getAudioSource(clip.name, true);

          if (audioComp.playing) {
            audioComp.stop();
          }

          audioComp.clip = clip;
          audioComp.loop = loop;
          audioComp.volume = volume;
          this.effectVolume = volume;
          audioComp.play();
          return clip.name;
        }
        /**
         * !#en Set the volume of effect audio.
         * !#zh 设置音效音量（0.0 ~ 1.0）。
         * @method setEffectsVolume
         * @param {number} volume - Volume must be in 0.0~1.0.
         */
        ;

        AudioEngine.setEffectsVolume = function setEffectsVolume(volume) {
          volume = misc.clampf(volume, 0, 1);
          this.effectVolume = volume;
          this.setVolume(MUSIC_AUDIO_NODE_NAME, volume);

          if (AudioEngine.baseNode) {
            var audioArr = AudioEngine.baseNode.getComponentsInChildren(AudioSource);
            audioArr.forEach(function (audioComp) {
              if (MUSIC_AUDIO_NODE_NAME !== audioComp.node.name) {
                audioComp.volume = volume;
              }
            });
          }

          return volume;
        }
        /**
         * !#en The volume of the effect audio max value is 1.0,the min value is 0.0 .
         * !#zh 获取音效音量（0.0 ~ 1.0）。
         * @method getEffectsVolume
         * @return {number}
         */
        ;

        AudioEngine.getEffectsVolume = function getEffectsVolume() {
          return this.effectVolume;
        }
        /**
         * !#en Pause effect audio.
         * !#zh 暂停播放音效。
         * @method pauseEffect
         * @param {string} clipName - clip.name
         * @example
         * cc.audioEngine.pauseEffect(clipName: string);
         */
        ;

        AudioEngine.pauseEffect = function pauseEffect(clipName) {
          return this.pause(clipName);
        }
        /**
         * !#en Stop playing all the sound effects.
         * !#zh 暂停播放所有音效。
         * @method pauseAllEffects
         * @example
         * cc.audioEngine.pauseAllEffects();
         */
        ;

        AudioEngine.pauseAllEffects = function pauseAllEffects() {
          if (AudioEngine.baseNode) {
            var audioArr = AudioEngine.baseNode.getComponentsInChildren(AudioSource);
            audioArr.forEach(function (audioComp) {
              if (MUSIC_AUDIO_NODE_NAME !== audioComp.node.name) {
                audioComp.pause();
              }
            });
          }
        }
        /**
         * !#en Resume effect audio.
         * !#zh 恢复播放音效音频。
         * @method resumeEffect
         * @param {string} clipName - clip.name
         */
        ;

        AudioEngine.resumeEffect = function resumeEffect(clipName) {
          this.resume(clipName);
        }
        /**
         * !#en Resume all effect audio.
         * !#zh 恢复播放所有之前暂停的音效。
         * @method resumeAllEffects
         * @example
         * cc.audioEngine.resumeAllEffects();
         */
        ;

        AudioEngine.resumeAllEffects = function resumeAllEffects() {
          var _this = this;

          if (AudioEngine.baseNode) {
            var audioArr = AudioEngine.baseNode.getComponentsInChildren(AudioSource);
            audioArr.forEach(function (audioComp) {
              if (MUSIC_AUDIO_NODE_NAME !== audioComp.node.name) {
                _this.resume(audioComp.node.name);
              }
            });
          }
        }
        /**
         * !#en Stop playing the effect audio.
         * !#zh 停止播放音效。
         * @method stopEffect
         * @param {string} clipName - clip.name
         */
        ;

        AudioEngine.stopEffect = function stopEffect(clipName) {
          return this.stop(clipName);
        }
        /**
         * !#en Stop playing all the effects.
         * !#zh 停止播放所有音效。
         * @method stopAllEffects
         */
        ;

        AudioEngine.stopAllEffects = function stopAllEffects() {
          if (AudioEngine.baseNode) {
            var audioArr = AudioEngine.baseNode.getComponentsInChildren(AudioSource);
            audioArr.forEach(function (audioComp) {
              if (MUSIC_AUDIO_NODE_NAME !== audioComp.node.name) {
                audioComp.stop();
              }
            });
          }
        }
        /**
         * 释放音频节点
         * @method releaseAudio
         * @param clipName - clip.name
         */
        ;

        AudioEngine.releaseAudio = function releaseAudio(clipName) {
          var audioComp = AudioEngine.getAudioSource(clipName, false);

          if (audioComp) {
            audioComp.clip = null;
            audioComp.node.destroy();
            return true;
          } else {
            return false;
          }
        }
        /**
         * 释放所有音频节点
         * @method releaseAllAudio
         */
        ;

        AudioEngine.releaseAllAudio = function releaseAllAudio() {
          if (AudioEngine.baseNode) {
            var audioArr = AudioEngine.baseNode.getComponentsInChildren(AudioSource);
            audioArr.forEach(function (audioComp) {
              audioComp.clip = null;
              audioComp.node.destroy();
            });
          }
        };

        return AudioEngine;
      }());
      AudioEngine.baseNode = null;
      AudioEngine.musicVolume = 1;
      AudioEngine.effectVolume = 1;

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/BasePublicModelPanel.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BaseUI.ts'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, log, BaseUI;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      log = module.log;
    }, function (module) {
      BaseUI = module.BaseUI;
    }],
    execute: function () {
      var _class, _class2;

      cclegacy._RF.push({}, "3b30cBFDJ5O7LybnmGD4n5l", "BasePublicModelPanel", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var BasePublicModelPanel = exports('BasePublicModelPanel', ccclass(_class = (_class2 = /*#__PURE__*/function (_BaseUI) {
        _inheritsLoose(BasePublicModelPanel, _BaseUI);

        function BasePublicModelPanel() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _BaseUI.call.apply(_BaseUI, [this].concat(args)) || this;
          _this.gameInfo = null;
          return _this;
        }

        var _proto = BasePublicModelPanel.prototype;

        _proto.showGame = function showGame(gameInfo) {
          log('======== BasePublicModelPanel: showGame: ', gameInfo);
          this.gameInfo = gameInfo;
        };

        _proto.destroyGame = function destroyGame() {};

        return BasePublicModelPanel;
      }(BaseUI), _class2.className = 'BasePublicModelPanel', _class2)) || _class);

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/BaseUI.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './FrameListenerManager.ts', './BindNode.ts'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, FrameListenerManager, BindNode;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      FrameListenerManager = module.FrameListenerManager;
    }, function (module) {
      BindNode = module.default;
    }],
    execute: function () {
      var _class, _class2;

      cclegacy._RF.push({}, "78ceeop38BLL5E/qP2+qV0s", "BaseUI", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var BaseUI = exports('BaseUI', ccclass(_class = (_class2 = /*#__PURE__*/function (_BindNode) {
        _inheritsLoose(BaseUI, _BindNode);

        function BaseUI() {
          return _BindNode.apply(this, arguments) || this;
        }

        var _proto = BaseUI.prototype;

        _proto.onDestroy = function onDestroy() {
          FrameListenerManager.removeAll(this);
        }
        /**
         * UI的入口函数
         */
        ;

        _proto.showPanel = function showPanel() {};

        return BaseUI;
      }(BindNode), _class2.className = 'BaseUI', _class2)) || _class);

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/BindNode.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, Component;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _class;

      cclegacy._RF.push({}, "01472EztkpIzZ+HGO2FFa8E", "BindNode", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var BindNode = exports('default', ccclass(_class = /*#__PURE__*/function (_Component) {
        _inheritsLoose(BindNode, _Component);

        function BindNode() {
          return _Component.apply(this, arguments) || this;
        }

        var _proto = BindNode.prototype;

        _proto.__preload = function __preload() {
          this.bindNode(this.node, this);
        } //遍历全部节点，绑定节点名字（重名的只会绑定第一个符合条件的节点）
        ;

        _proto.bindNode = function bindNode(node, target) {
          if (!node || !target) {
            return;
          }

          var _nameTag = '_'; //名字以 '_' 开头的节点才会被绑定

          var nodeList = [node];
          var i = 0;

          while (node) {
            var nodeName = node.name;

            if (_nameTag === nodeName[0] && !target[nodeName]) {
              target[nodeName] = node; // cc.log('bindNode:  ', nodeName);
            }

            var bindComp = node.getComponent(BindNode);

            if (0 === i || !bindComp) {
              nodeList = nodeList.concat(node.children); //节点有脚本继承了BindNode，就不再绑定其子节点
            }

            node = nodeList[++i];
          }
        };

        return BindNode;
      }(Component)) || _class);

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/CosManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './NetWork.ts', './GameMsg.ts', './Tools.ts', './StaticAssetsManager.ts'], function (exports) {
  var _asyncToGenerator, _regeneratorRuntime, cclegacy, assetManager, path, SpriteFrame, log, NetWork, GameMsg, Tools, StaticAssetsManager;

  return {
    setters: [function (module) {
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
      assetManager = module.assetManager;
      path = module.path;
      SpriteFrame = module.SpriteFrame;
      log = module.log;
    }, function (module) {
      NetWork = module.NetWork;
    }, function (module) {
      GameMsg = module.default;
    }, function (module) {
      Tools = module.Tools;
    }, function (module) {
      StaticAssetsManager = module.StaticAssetsManager;
    }],
    execute: function () {
      cclegacy._RF.push({}, "e0308K8HgFFIr5TX2qNrOrX", "CosManager", undefined);

      var CosManagerClass = /*#__PURE__*/function () {
        function CosManagerClass() {
          this._roolPath = {
            mainRes: 'cocos/lele/'
          };
          /** key->fileKey  value->IUpLoadFileData */

          this.upLoadFileMap = new Map();
        }

        CosManagerClass.getInstance = function getInstance() {
          if (null === this._instance) {
            this._instance = new CosManagerClass();
          }

          return this._instance;
        };

        var _proto = CosManagerClass.prototype;
        /**
         * 删除不需要上传的文件
         * @param key 
         */

        _proto.delFileData = function delFileData(key) {
          if (StaticAssetsManager.curLoadAssetsData.completeAssetsMap.has(key)) {
            StaticAssetsManager.curLoadAssetsData.completeAssetsMap["delete"](key);
          }

          var upLoadFilesData = StaticAssetsManager.curLoadAssetsData.jsonData['upLoadFilesData'];
          upLoadFilesData && upLoadFilesData[key] && delete upLoadFilesData[key];
        };

        _proto.uploadFile = /*#__PURE__*/function () {
          var _uploadFile = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(fileData) {
            var _this = this;

            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  return _context.abrupt("return", new Promise(function (resolve, reject) {
                    _this.uploadFiles([fileData]).then(function (success) {
                      if (success) {
                        return resolve(true);
                      }

                      return resolve(false);
                    });
                  }));

                case 1:
                case "end":
                  return _context.stop();
              }
            }, _callee);
          }));

          function uploadFile(_x) {
            return _uploadFile.apply(this, arguments);
          }

          return uploadFile;
        }();

        _proto.uploadFiles = /*#__PURE__*/function () {
          var _uploadFiles = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(filesData) {
            var _this2 = this;

            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  return _context2.abrupt("return", new Promise(function (resolve, reject) {
                    var filesCosData = [];
                    filesData.forEach(function (fileData) {
                      var cosData = _this2.getFileCosData(_this2.getFileLocalPath(fileData.fileBody.name), fileData.fileBody);

                      filesCosData.push(cosData);
                    });
                    GameMsg.uploadFiles(filesCosData, function (err, data) {
                      log("上传文件===uploadFiles====", err || data);

                      if (!err) {
                        var loadedNum = 0,
                            totalNum = data.files.length,
                            isErr = false;

                        for (var i = 0; i < totalNum; i++) {
                          var oldUrl = "https://" + data.files[i].data.Location;
                          var remoteUrl = oldUrl; //Tools.replaceCosUrl(oldUrl, NetWork.COS_BASE_URL);

                          log('file-remoteUrl:', remoteUrl);

                          _this2.loadRemoteFile(remoteUrl, filesData[i], function (err) {
                            if (err) {
                              isErr = true;
                            }

                            loadedNum++;

                            if (loadedNum == totalNum) {
                              if (isErr) {
                                // UIHelp.showTip('文件上传失败');
                                resolve(false);
                              } else {
                                resolve(true);
                              }
                            }
                          });
                        }
                      } else {
                        // UIHelp.showTip('文件上传失败');
                        return reject(err);
                      }
                    });
                  }));

                case 1:
                case "end":
                  return _context2.stop();
              }
            }, _callee2);
          }));

          function uploadFiles(_x2) {
            return _uploadFiles.apply(this, arguments);
          }

          return uploadFiles;
        }();

        _proto.loadRemoteFile = function loadRemoteFile(remoteUrl, fileData, callBack) {
          assetManager.loadRemote(remoteUrl, {
            maxRetryCount: 1,
            headers: {
              'Access-Control-Allow-Origin': '*'
            }
          }, function (err, asset) {
            if (!err) {
              var loadAsset = null;
              var fileType = path.extname(fileData.fileBody.name);

              if (fileType == '.png' || fileType == '.jpg' || fileType == '.jpeg') {
                loadAsset = SpriteFrame.createWithImage(asset);
                StaticAssetsManager.curLoadAssetsData.completeAssetsMap.set(fileData.fileKey, {
                  asset: loadAsset,
                  url: remoteUrl,
                  fileName: fileData.fileBody.name
                });
              } else {
                loadAsset = asset;
                StaticAssetsManager.curLoadAssetsData.completeAssetsMap.set(fileData.fileKey, {
                  asset: loadAsset,
                  url: remoteUrl,
                  fileName: fileData.fileBody.name
                });
              }

              var upLoadFilesData = StaticAssetsManager.curLoadAssetsData.jsonData['upLoadFilesData'];
              upLoadFilesData && (upLoadFilesData[fileData.fileKey] = {
                url: remoteUrl,
                fileName: fileData.fileBody.name
              });
            }

            callBack && callBack(err, asset);
          });
        };

        _proto.getFileLocalPath = function getFileLocalPath(fileName) {
          var randStr = Tools.randomString(6);
          return "" + this._roolPath.mainRes + NetWork.gameId + "/" + (randStr + fileName);
        }
        /**
         * 批量删除文件
         * @param keys 
         * @param callBack 
         */
        ;

        _proto.deleteMultipleObject = function deleteMultipleObject(keys, callBack) {
          GameMsg.deleteMultipleObject(keys, callBack);
        };

        _proto.getUploadFileData = function getUploadFileData(filebode, fileKey) {
          return {
            fileBody: filebode,
            fileKey: fileKey
          };
        }
        /**
         * 组装数据
         * @param key 唯一性 在腾讯云里边的路径
         * @param body 文件本身
         */
        ;

        _proto.getFileCosData = function getFileCosData(key, body) {
          return {
            Bucket: NetWork.COS_BUCKET,
            // Bucket 格式：test-1250000000
            Region: NetWork.COS_REGION,
            Key: key,
            Body: body
          };
        };

        return CosManagerClass;
      }();

      CosManagerClass._instance = null;
      var CosManager = exports('CosManager', CosManagerClass.getInstance());

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ErrorManager.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "10b9bQcAFpL2Y1Lo/jd9LZ7", "ErrorManager", undefined);
      /**
       * 处理各种错误和异常
       */


      var EErrorType = exports('EErrorType', /*#__PURE__*/function (EErrorType) {
        EErrorType[EErrorType["LOAD_BUNDLE_ERROR"] = 1] = "LOAD_BUNDLE_ERROR";
        EErrorType[EErrorType["LOAD_BUNDLE_DIR_ERROR"] = 2] = "LOAD_BUNDLE_DIR_ERROR";
        EErrorType[EErrorType["GET_GAME_CONFIG_ERROR"] = 3] = "GET_GAME_CONFIG_ERROR";
        EErrorType[EErrorType["LOAD_REMOTE_ASSETS_ERROR"] = 4] = "LOAD_REMOTE_ASSETS_ERROR";
        return EErrorType;
      }({}));

      var ErrorManagerClass = /*#__PURE__*/function () {
        function ErrorManagerClass() {}

        ErrorManagerClass.getInstance = function getInstance() {
          if (null === this._instance) {
            this._instance = new ErrorManagerClass();
          }

          return this._instance;
        };

        var _proto = ErrorManagerClass.prototype;

        _proto.throwError = function throwError(errorInfo, isPreload) {};

        return ErrorManagerClass;
      }();

      ErrorManagerClass._instance = null;
      var ErrorManager = exports('ErrorManager', ErrorManagerClass.getInstance());

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/frame", ['./FrameConstValue.ts', './FrameMsgType.ts', './MainGameData.ts', './SDKMsgType.ts', './GameFrame.ts', './NetWork.ts', './CosManager.ts', './ErrorManager.ts', './FrameListenerManager.ts', './FrameUIManager.ts', './GameBundleManager.ts', './SoundManager.ts', './StaticAssetsManager.ts', './AppBridge.ts', './GameMsg.ts', './BasePublicModelPanel.ts', './BaseUI.ts', './BindNode.ts', './FrameErrorTips.ts', './FrameLoadingUI.ts', './AudioEngine.ts', './HitTest.ts', './MathUtils.ts', './Tools.ts', './UIHelp.ts'], function () {
  return {
    setters: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/FrameConstValue.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "99a1c7YHT9CaJZdHeeiPqq2", "FrameConstValue", undefined);

      var FrameConstValue = exports('FrameConstValue', function FrameConstValue() {});
      FrameConstValue.MainGameVer = "1.0.0"; //主包的版本  主包每次打包自增

      FrameConstValue.IS_EDITIONS = false; //是否为发布版本，用于数据上报 及 log输出控制

      FrameConstValue.IS_TEACHER = true; //是否为教师端版本

      FrameConstValue.GAME_NAME = "cocos-game-player";
      FrameConstValue.AUDIO_DIR = 'audios/';
      FrameConstValue.PREFAB_PANEL_DIR = 'prefab/panel/';
      FrameConstValue.GAME_AUDIO_DIR = 'res/audios/';
      FrameConstValue.GAME_PRELOAD_DIR = 'res/preload/';
      FrameConstValue.GAME_PREFAB_DIR = 'res/prefab/';
      FrameConstValue.GAME_PREFAB_PANEL_DIR = "res/prefab/ui/panel/";
      FrameConstValue.GAME_CORE_PREFAB_PANEL_DIR = "res/core/prefab/panel/";
      FrameConstValue.PUBLIC_MODEL_PANEL_NAME = 'PublicModelPanel';
      /**支持的帧率 */

      FrameConstValue.SUPPORT_FPS = [15, 30, 60];
      var PackageType = exports('PackageType', /*#__PURE__*/function (PackageType) {
        PackageType[PackageType["Main"] = 0] = "Main";
        PackageType[PackageType["Sub"] = 1] = "Sub";
        return PackageType;
      }({}));
      var GameLoadErrType = exports('GameLoadErrType', /*#__PURE__*/function (GameLoadErrType) {
        GameLoadErrType[GameLoadErrType["MainGameLoadErr"] = 1] = "MainGameLoadErr";
        GameLoadErrType[GameLoadErrType["SubGameLoadErr"] = 2] = "SubGameLoadErr";
        GameLoadErrType[GameLoadErrType["SeverAssetsLoadErr"] = 3] = "SeverAssetsLoadErr";
        GameLoadErrType[GameLoadErrType["OtherErr"] = 4] = "OtherErr";
        return GameLoadErrType;
      }({}));
      /**
       * 分组管理
       * 碰撞规则 default-default  group1-group2 其他情况不产生碰撞
       */

      var NodeGroupType = exports('NodeGroupType', function NodeGroupType() {});
      NodeGroupType["default"] = 'default';
      NodeGroupType.group1 = 'group1';
      NodeGroupType.group2 = 'group2';

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/FrameErrorTips.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BindNode.ts', './FrameListenerManager.ts', './FrameMsgType.ts'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, Label, BindNode, FrameListenerManager, FrameMsgType;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Label = module.Label;
    }, function (module) {
      BindNode = module.default;
    }, function (module) {
      FrameListenerManager = module.FrameListenerManager;
    }, function (module) {
      FrameMsgType = module.FrameMsgType;
    }],
    execute: function () {
      var _class, _class2;

      cclegacy._RF.push({}, "a53e4zqiiBOiZXF5p0eEfR5", "FrameErrorTips", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var FrameErrorTips = exports('FrameErrorTips', ccclass(_class = (_class2 = /*#__PURE__*/function (_BindNode) {
        _inheritsLoose(FrameErrorTips, _BindNode);

        function FrameErrorTips() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _BindNode.call.apply(_BindNode, [this].concat(args)) || this;
          _this._nd_panel = null;
          _this._lb_title = null;
          _this._lb_desc = null;
          _this._lb_tips = null;
          return _this;
        }

        var _proto = FrameErrorTips.prototype;

        _proto.__preload = function __preload() {
          _BindNode.prototype.__preload.call(this);

          this._nd_panel.active = false;
          FrameListenerManager.on(FrameMsgType.UI_FRAME_ERROR_TIPS, this.onActive, this);
        };

        _proto.start = function start() {};

        _proto.onActive = function onActive(isShow, desc, title, tips) {
          if (desc === void 0) {
            desc = '';
          }

          if (title === void 0) {
            title = '';
          }

          if (tips === void 0) {
            tips = '';
          }

          this._nd_panel.active = isShow;

          if (isShow) {
            this._lb_title.getComponent(Label).string = title;
            this._lb_desc.getComponent(Label).string = desc;
            this._lb_tips.getComponent(Label).string = tips;
          }
        };

        return FrameErrorTips;
      }(BindNode), _class2.className = 'FrameErrorTips', _class2)) || _class);

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/FrameListenerManager.ts", ['cc'], function (exports) {
  var cclegacy, Component, isValid;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      isValid = module.isValid;
    }],
    execute: function () {
      cclegacy._RF.push({}, "c63cbupxTFO6IwHPtBiqGeK", "FrameListenerManager", undefined);

      var FrameListenerManagerClass = /*#__PURE__*/function () {
        function FrameListenerManagerClass() {
          this.handle = {};
        }

        FrameListenerManagerClass.getInstance = function getInstance() {
          if (null === this._instance) {
            this._instance = new FrameListenerManagerClass();
          }

          return this._instance;
        }
        /**
         * 
         * @param eventName 事件名
         * @param cb 回调
         * @param target 
         * @returns 
         */
        ;

        var _proto = FrameListenerManagerClass.prototype;

        _proto.on = function on(eventName, cb, target) {
          if (this.hasEvent(eventName, cb, target)) {
            return;
          }

          if (!this.handle[eventName]) {
            this.handle[eventName] = [];
          }

          var data = {
            func: cb,
            target: target
          };
          this.handle[eventName].push(data);
        };

        _proto.off = function off(eventName, cb, target) {
          var list = this.handle[eventName];

          if (!list || list.length <= 0) {
            return;
          }

          for (var i = 0; i < list.length; i++) {
            var event = list[i];

            if (cb == event.func && (!target || target == event.target)) {
              list.splice(i, 1);
              break;
            }
          }
        };

        _proto.dispatch = function dispatch(eventName) {
          var list = this.handle[eventName];

          if (!list || list.length <= 0) {
            return;
          }

          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          for (var i = 0; i < list.length; i++) {
            var event = list[i];

            if (!event.target) {
              continue;
            } // 被销毁的节点，不再接受事件派发


            if (event.target instanceof Component && (!event.target.node || !event.target.node.activeInHierarchy || !isValid(event.target.node, true))) {
              continue;
            }

            event.func.apply(event.target, args);
          }
        };

        _proto.removeAllGameEvent = function removeAllGameEvent() {
          for (var key in this.handle) {
            var list = this.handle[key];

            for (var i = 0, l = list.length; i < l; i++) {
              list.splice(i, 1);

              if (l > 0) {
                l--;
              }

              i--;
            }
          }
        };

        _proto.removeAll = function removeAll(target) {
          if (target) {
            for (var key in this.handle) {
              var list = this.handle[key];

              for (var i = 0, l = list.length; i < l; i++) {
                var event = list[i];

                if (event.target == target) {
                  list.splice(i, 1);

                  if (l > 0) {
                    l--;
                  }

                  i--;
                }
              }
            }
          } else {
            for (var _key2 in this.handle) {
              var _list = this.handle[_key2];

              while (_list.length > 0) {
                _list.pop();
              }
            }
          }
        };

        _proto.hasEvent = function hasEvent(eventName, cb, target) {
          var list = this.handle[eventName];

          if (!list || list.length <= 0) {
            return false;
          }

          for (var i = 0; i < list.length; i++) {
            var event = list[i];

            if (cb == event.func && (!target || target == event.target)) {
              return true;
            }
          }

          return false;
        };

        return FrameListenerManagerClass;
      }();

      FrameListenerManagerClass._instance = null;
      var FrameListenerManager = exports('FrameListenerManager', FrameListenerManagerClass.getInstance());

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/FrameLoadingUI.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BindNode.ts', './FrameListenerManager.ts', './FrameMsgType.ts'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, BindNode, FrameListenerManager, FrameMsgType;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      BindNode = module.default;
    }, function (module) {
      FrameListenerManager = module.FrameListenerManager;
    }, function (module) {
      FrameMsgType = module.FrameMsgType;
    }],
    execute: function () {
      var _class, _class2;

      cclegacy._RF.push({}, "917d5uPrxpD3obbIp0nH7cK", "FrameLoadingUI", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var FrameLoadingUI = exports('FrameLoadingUI', ccclass(_class = (_class2 = /*#__PURE__*/function (_BindNode) {
        _inheritsLoose(FrameLoadingUI, _BindNode);

        function FrameLoadingUI() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _BindNode.call.apply(_BindNode, [this].concat(args)) || this;
          _this._nd_panel = null;
          return _this;
        }

        var _proto = FrameLoadingUI.prototype;

        _proto.__preload = function __preload() {
          _BindNode.prototype.__preload.call(this);

          this._nd_panel.active = false;
          FrameListenerManager.on(FrameMsgType.UI_FRAME_LOADING, this.onActive, this);
        };

        _proto.start = function start() {};

        _proto.onActive = function onActive(isShow) {
          this._nd_panel.active = isShow;
        };

        return FrameLoadingUI;
      }(BindNode), _class2.className = 'FrameLoadingUI', _class2)) || _class);

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/FrameMsgType.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "968aa75pUZFT5GLVjlD+9+D", "FrameMsgType", undefined);

      var FrameMsgType = exports('FrameMsgType', function FrameMsgType() {});
      FrameMsgType.MicroApp_recv_subGameCfg = 'subGameCfg';
      FrameMsgType.MicroApp_send_frameGameInitDone = 'frameGameInitDone';
      FrameMsgType.MicroApp_recv_pageChanged = 'pageChanged';
      FrameMsgType.MicroApp_send_staticAssetsUrl = 'staticAssetsUrl';
      FrameMsgType.UI_FRAME_LOADING = 'UI_FRAME_LOADING';
      FrameMsgType.UI_FRAME_ERROR_TIPS = 'UI_FRAME_ERROR_TIPS';
      FrameMsgType.ON_EDIT_STATE_SWITCHING = 'ON_EDIT_STATE_SWITCHING'; // 数据同步类型

      FrameMsgType.ON_TOUCH_CLICK = 'ON_TOUCH_CLICK';
      FrameMsgType.ON_TOUCH_START = 'ON_TOUCH_START';
      FrameMsgType.ON_TOUCH_MOVE = 'ON_TOUCH_MOVE';
      FrameMsgType.ON_TOUCH_END = 'ON_TOUCH_END'; // 心跳

      FrameMsgType.ON_HEART_BREAK = 'ON_HEART_BREAK'; // 数据恢复

      FrameMsgType.ON_RECOVERY_DATA = 'ON_RECOVERY_DATA'; // 再玩一次

      FrameMsgType.REPLAY_START = 'REPLAY_START'; // 题干语音播放完成

      FrameMsgType.COMPLETE_TRUMPET = 'COMPLETE_TRUMPET';
      /**  全局遮罩 */

      FrameMsgType.ON_MASK = 'ON_MASK'; // 数据恢复遮罩

      FrameMsgType.MASK_RECOVER = 'MASK_RECOVER'; // OverTips关闭按钮

      FrameMsgType.OVERTIPS_CLOSE = 'OVERTIPS_CLOSE'; // AffirmTips确认按钮

      FrameMsgType.AFFIRMTIPS_SURE = 'AFFIRMTIPS_SURE'; // AffirmTips取消按钮

      FrameMsgType.AFFIRMTIPS_CANCEL = 'AFFIRMTIPS_CANCEL'; // 第一次接收到心跳

      FrameMsgType.ON_FIRST_BREAK = 'ON_FIRST_BREAK'; // TeacherPanel的loading层开关

      FrameMsgType.TEACHER_PANEL_LOADING = 'TEACHER_PANEL_LOADING';
      /**点击开始游戏 */

      FrameMsgType.ON_CLICK_GAME_START = 'ON_CLICK_GAME_START'; //刷新编辑器界面需要下载的资源

      FrameMsgType.REFRESH_EDITOR_DOWNLOAD_UI = 'REFRESH_EDITOR_DOWNLOAD_UI';
      FrameMsgType.MainGame_ = '';
      /**主包内部事件 */

      /** 游戏隐藏 */

      /**更新游戏发送过来的数据 */

      FrameMsgType.UPDATA_GAME_SEND_DATA = 'UPDATA_GAME_SEND_DATA';
      /**更新游戏同步数据 */

      FrameMsgType.INIT_GAME_SYNC_DATA = 'INIT_GAME_SYNC_DATA';
      /** 游戏加载进度 */

      FrameMsgType.GAME_LOAD_PROGRESS = 'GAME_LOAD_PROGRESS';
      /**设置授权 */

      FrameMsgType.UPDATE_AUTHORIZATION = 'UPDATE_AUTHORIZATION';
      /**************************分包相关***************************************/

      /** 游戏资源加载完，数据已获取，进入准备 */

      FrameMsgType.GAME_PANEL_READ = "GAME_PANEL_READ";
      /**切换游戏，停止上个游戏异步流程 */

      FrameMsgType.ON_SWITCH_GAME = "ON_SWITCH_GAME";
      /*************************主包转发sdk事件****************************************/

      /** 接着玩 */

      FrameMsgType.REC_KEEP_PLAYING = 'REC_KEEP_PLAYING';
      /** 取消接着玩 */

      FrameMsgType.REC_CANCEL_KEEP_PLAYING = 'REC_CANCEL_KEEP_PLAYING';
      /** 重新玩 */

      FrameMsgType.REC_RESTART = 'REC_RESTART';
      /** 更新发送心跳的人*/

      FrameMsgType.REC_IS_MASTER = 'REC_IS_MASTER';
      /** 同步事件 */

      FrameMsgType.RECV_SYNC_DATA = 'RECV_SYNC_DATA';
      /*************************SDK内部事件****************************************/

      FrameMsgType.ACTION_SYNC_RECEIVE = 'action_sync_receive'; //游戏操作交互同步  //交互游戏暂不处理此消息

      FrameMsgType.DISABLED = 'disabled'; //是否可以操作游戏 0禁用 1开启 默认1  //交互游戏暂不处理此消息

      FrameMsgType.RELOAD = 'reload'; //重新加载游戏  //在index.html监听

      FrameMsgType.DATA_RECOVERY = 'data_recovery'; //游戏数据恢复

      FrameMsgType.STOP = 'stop'; //停止游戏（游戏需要返回finish）

      FrameMsgType.INIT = 'init'; //恢复游戏到初始化界面

      FrameMsgType.THRESHHOLD = 'threshhold'; //游戏消息频率（默认100ms/次）

      FrameMsgType.PLAYBGM = 'play_bgm'; //播放背景音

      FrameMsgType.RESUMEBGM = 'resume_bgm'; //恢复背景音

      FrameMsgType.STOPBGM = 'stop_bgm'; //停止背景音

      FrameMsgType.PLAYAUDIOTITLE = 'play_audio_title'; //播放题干音

      FrameMsgType.STOPAUDIOTITLE = 'stop_audio_title'; //停止题干音

      FrameMsgType.STOPALLAUDIO = 'stop_all_audio'; //停止语音（包括题干）

      FrameMsgType.STOPALLEFFECT = 'stop_all_effect'; //停止音效

      FrameMsgType.STOPALL = 'stop_all';

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/FrameUIManager.ts", ['cc', './NetWork.ts', './BasePublicModelPanel.ts'], function (exports) {
  var cclegacy, NetWork, BasePublicModelPanel;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      NetWork = module.NetWork;
    }, function (module) {
      BasePublicModelPanel = module.BasePublicModelPanel;
    }],
    execute: function () {
      cclegacy._RF.push({}, "cfbabSiYsNC2bpdno7hgMkh", "FrameUIManager", undefined);

      var FrameUIManagerClass = /*#__PURE__*/function () {
        function FrameUIManagerClass() {
          /** 正在运行的公共模块节点 */
          this._runningPublicPanel = null;
          /** 正在运行的公共模块节点 */

          this._preloadPublicPanel = new Map();
        }

        FrameUIManagerClass.getInstance = function getInstance() {
          if (null === this._instance) {
            this._instance = new FrameUIManagerClass();
          }

          return this._instance;
        }
        /**
         * 设置正在运行的公共模块节点
         * @param panel 
         */
        ;

        var _proto = FrameUIManagerClass.prototype;

        _proto.setRunningPublicPanel = function setRunningPublicPanel(panel) {
          if (this._runningPublicPanel) {
            this.destroyRunningPublicPanel();
          }

          this._runningPublicPanel = panel;
        }
        /**
         * 销毁正在运行的公共模块节点
         */
        ;

        _proto.destroyRunningPublicPanel = function destroyRunningPublicPanel() {
          if (this._runningPublicPanel) {
            var _this$_runningPublicP;

            (_this$_runningPublicP = this._runningPublicPanel.getComponent(BasePublicModelPanel)) == null ? void 0 : _this$_runningPublicP.destroyGame();
            this._runningPublicPanel = null;
          }
        }
        /**
         * 添加预加载的公共模块节点
         * @param panel 
         * @param gameId 
         * @returns 
         */
        ;

        _proto.addPreloadPublicPanel = function addPreloadPublicPanel(panel, gameId) {
          if (this._preloadPublicPanel.has(gameId)) {
            return;
          }

          if (this._preloadPublicPanel.size >= NetWork.maxPreloadPanelCount) {
            var firstKey = this._preloadPublicPanel.keys().next().value;

            var firstPanel = this._preloadPublicPanel.get(firstKey);

            firstPanel.destroy();

            this._preloadPublicPanel["delete"](firstKey);
          }

          this._preloadPublicPanel.set(gameId, panel);
        }
        /**
         * 获取预加载的公共模块节点
         * @param gameId 
         * @returns 
         */
        ;

        _proto.getPreloadPublicPanel = function getPreloadPublicPanel(gameId) {
          return this._preloadPublicPanel.get(gameId);
        }
        /**
         * 删除预加载的公共模块节点
         * @param gameId 
         */
        ;

        _proto.deletePreloadPublicPanel = function deletePreloadPublicPanel(gameId) {
          if (this._preloadPublicPanel.has(gameId)) {
            this._preloadPublicPanel["delete"](gameId);
          }
        };

        _proto.getPreloadPublicPanelMap = function getPreloadPublicPanelMap() {
          return this._preloadPublicPanel;
        };

        return FrameUIManagerClass;
      }();

      FrameUIManagerClass._instance = null;
      var FrameUIManager = exports('FrameUIManager', FrameUIManagerClass.getInstance());

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GameBundleManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './FrameConstValue.ts', './NetWork.ts', './Tools.ts', './ErrorManager.ts', './FrameUIManager.ts', './BasePublicModelPanel.ts', './UIHelp.ts'], function (exports) {
  var _asyncToGenerator, _regeneratorRuntime, cclegacy, assetManager, error, Prefab, instantiate, director, Canvas, FrameConstValue, NetWork, Tools, EErrorType, ErrorManager, FrameUIManager, BasePublicModelPanel, UIHelp;

  return {
    setters: [function (module) {
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
      assetManager = module.assetManager;
      error = module.error;
      Prefab = module.Prefab;
      instantiate = module.instantiate;
      director = module.director;
      Canvas = module.Canvas;
    }, function (module) {
      FrameConstValue = module.FrameConstValue;
    }, function (module) {
      NetWork = module.NetWork;
    }, function (module) {
      Tools = module.Tools;
    }, function (module) {
      EErrorType = module.EErrorType;
      ErrorManager = module.ErrorManager;
    }, function (module) {
      FrameUIManager = module.FrameUIManager;
    }, function (module) {
      BasePublicModelPanel = module.BasePublicModelPanel;
    }, function (module) {
      UIHelp = module.UIHelp;
    }],
    execute: function () {
      cclegacy._RF.push({}, "91bcaEkKdlPEYMx4lJijzj9", "GameBundleManager", undefined);

      var GamePanelType = exports('GamePanelType', /*#__PURE__*/function (GamePanelType) {
        GamePanelType[GamePanelType["TeacherPanel"] = 0] = "TeacherPanel";
        GamePanelType[GamePanelType["GamePanel"] = 1] = "GamePanel";
        return GamePanelType;
      }({}));
      /*******************  new add */

      var EBundleType = exports('EBundleType', /*#__PURE__*/function (EBundleType) {
        EBundleType[EBundleType["MAIN_BUNDLE"] = 0] = "MAIN_BUNDLE";
        EBundleType[EBundleType["FRAME_BUNDLE"] = 1] = "FRAME_BUNDLE";
        EBundleType[EBundleType["PUBLIC_BUNDLE"] = 2] = "PUBLIC_BUNDLE";
        EBundleType[EBundleType["GAME_BUNDLE"] = 3] = "GAME_BUNDLE";
        return EBundleType;
      }({}));
      var EGameCreateType = exports('EGameCreateType', /*#__PURE__*/function (EGameCreateType) {
        EGameCreateType[EGameCreateType["OPEN"] = 0] = "OPEN";
        EGameCreateType[EGameCreateType["PRELOAD"] = 1] = "PRELOAD";
        return EGameCreateType;
      }({}));

      var GameBundleManagerClass = /*#__PURE__*/function () {
        function GameBundleManagerClass() {
          /** 游戏是否是否是隐藏的  */
          this.gameIsHide = false;
          /**游戏切换索引 */

          this.curSwitchIndex = 0;
          /******************* new add */

          /** 当前运行的游戏 */

          this.runGameData = null;
          /** 当前需要预加载的游戏(也就是下一页游戏) */

          this.nextPageGameData = null;
          /** 当前需要加载的游戏 */

          this._curGeneratingGameData = null;
          /** 加载中的游戏 */

          this._loadingGameMap = new Map();
          /** bundle加载完成的游戏 */

          this._readyGameMap = new Map();
          /** bundle加载终止的游戏 */

          this._abortGameMap = new Map();
          /** 子包资源是否准备好了 */

          this._isBundleResourceReady = false;
          /** 远程资源是否准备好了 */

          this._isRemoteResourceReady = false;
        }

        GameBundleManagerClass.getInstance = function getInstance() {
          if (null === this._instance) {
            this._instance = new GameBundleManagerClass();
          }

          return this._instance;
        }
        /******************************** new add ********************************************** */

        /**
         * 重置资源是否准备好的状态
         */
        ;

        var _proto = GameBundleManagerClass.prototype;

        _proto.resetResourceReadyState = function resetResourceReadyState() {
          this._isBundleResourceReady = false;
          this._isRemoteResourceReady = false;
        }
        /** 
         * 尝试创建一个子包加载任务；如果已经加载好了，执行后续
         */
        ;

        _proto.tryCreateNewLoadBundleTask = function tryCreateNewLoadBundleTask(gameData) {
          this._curGeneratingGameData = gameData; // 判断是否需要展示loading界面

          if (EGameCreateType.OPEN === gameData.createType) {
            var publicModelPanel = FrameUIManager.getPreloadPublicPanel(gameData.gameId);

            if (!publicModelPanel) {
              UIHelp.showFrameLoadingUI();
            }
          } // 如果有同一游戏正在加载，不处理；否则，开启一个新的加载任务


          if (this._loadingGameMap.has(gameData.templateId)) {
            return;
          } // 已经加载完成的bundle，直接执行后续


          if (this._readyGameMap.has(gameData.templateId)) {
            this.bundleResourceReady();
          }

          var backupGameData = Tools.deepCopy(gameData);
          this.startLoadBundleTask(backupGameData);
        };

        _proto.startLoadBundleTask = /*#__PURE__*/function () {
          var _startLoadBundleTask = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(gameData) {
            var _this = this;

            var isLoadFailed, errorInfo, dirArr, bundleArr, _loop, _ret, i;

            return _regeneratorRuntime().wrap(function _callee$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  this._loadingGameMap.set(gameData.templateId, gameData);

                  isLoadFailed = false;
                  errorInfo = {
                    type: EErrorType.LOAD_BUNDLE_ERROR
                  };
                  dirArr = [FrameConstValue.GAME_AUDIO_DIR, FrameConstValue.GAME_PRELOAD_DIR, FrameConstValue.GAME_PREFAB_DIR];
                  bundleArr = [gameData.publicBundleInfo].concat(gameData.gameBundleList);
                  _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
                    var bundleData, gameBundle, j, dir;
                    return _regeneratorRuntime().wrap(function _loop$(_context) {
                      while (1) switch (_context.prev = _context.next) {
                        case 0:
                          bundleData = bundleArr[i];
                          _context.next = 3;
                          return _this.loadBundle(bundleData.bundleUrl).then(function (bundle) {
                            gameBundle = bundle;
                          })["catch"](function (err) {
                            isLoadFailed = true;
                            errorInfo.info = err;
                          });

                        case 3:
                          if (!(gameData.templateId !== _this._curGeneratingGameData.templateId)) {
                            _context.next = 8;
                            break;
                          }

                          _this._loadingGameMap["delete"](gameData.templateId);

                          _this._abortGameMap.set(gameData.templateId, gameData);

                          _this.bundleLoadEnd(true);

                          return _context.abrupt("return", {
                            v: void 0
                          });

                        case 8:
                          if (!isLoadFailed) {
                            _context.next = 15;
                            break;
                          }

                          errorInfo.bundle = bundleData;
                          ErrorManager.throwError(errorInfo, EGameCreateType.PRELOAD === _this._curGeneratingGameData.createType);

                          _this._loadingGameMap["delete"](gameData.templateId);

                          _this._abortGameMap.set(gameData.templateId, gameData);

                          _this.bundleLoadEnd(true);

                          return _context.abrupt("return", {
                            v: void 0
                          });

                        case 15:
                          j = 0;

                        case 16:
                          if (!(j < dirArr.length)) {
                            _context.next = 37;
                            break;
                          }

                          dir = dirArr[j];
                          _context.next = 20;
                          return _this.loadAssetsDirInBundle(gameBundle, dir)["catch"](function (err) {
                            isLoadFailed = true;
                            errorInfo.info = err;
                          });

                        case 20:
                          if (!(gameData.templateId !== _this._curGeneratingGameData.templateId)) {
                            _context.next = 25;
                            break;
                          }

                          _this._loadingGameMap["delete"](gameData.templateId);

                          _this._abortGameMap.set(gameData.templateId, gameData);

                          _this.bundleLoadEnd(true);

                          return _context.abrupt("return", {
                            v: void 0
                          });

                        case 25:
                          if (!isLoadFailed) {
                            _context.next = 34;
                            break;
                          }

                          errorInfo.type = EErrorType.LOAD_BUNDLE_DIR_ERROR;
                          errorInfo.bundle = bundleData;
                          errorInfo.url = dir;
                          ErrorManager.throwError(errorInfo, EGameCreateType.PRELOAD === _this._curGeneratingGameData.createType);

                          _this._loadingGameMap["delete"](gameData.templateId);

                          _this._abortGameMap.set(gameData.templateId, gameData);

                          _this.bundleLoadEnd(true);

                          return _context.abrupt("return", {
                            v: void 0
                          });

                        case 34:
                          ++j;
                          _context.next = 16;
                          break;

                        case 37:
                        case "end":
                          return _context.stop();
                      }
                    }, _loop);
                  });
                  i = 0;

                case 7:
                  if (!(i < bundleArr.length)) {
                    _context2.next = 15;
                    break;
                  }

                  return _context2.delegateYield(_loop(), "t0", 9);

                case 9:
                  _ret = _context2.t0;

                  if (!_ret) {
                    _context2.next = 12;
                    break;
                  }

                  return _context2.abrupt("return", _ret.v);

                case 12:
                  ++i;
                  _context2.next = 7;
                  break;

                case 15:
                  // 加载结束
                  this._loadingGameMap["delete"](gameData.templateId);

                  this._readyGameMap.set(gameData.templateId, gameData);

                  this.bundleLoadEnd(false);

                case 18:
                case "end":
                  return _context2.stop();
              }
            }, _callee, this);
          }));

          function startLoadBundleTask(_x) {
            return _startLoadBundleTask.apply(this, arguments);
          }

          return startLoadBundleTask;
        }()
        /**
         * bundle及其文件夹资源加载完成后或者加载终止后的回调
         * @param isAbort 
         */
        ;

        _proto.bundleLoadEnd = function bundleLoadEnd(isAbort) {
          // 检测需要释放的bundle: 1.终止的全部清除；2.检查已完成的是否超过最大数量，超过的话按加载完成的顺序清除，清除时需要检测当前游戏、预加载的游戏、加载中的游戏里是否使用了相应的bundle，使用的不清除
          this.releaseAbortBundles();

          if (!isAbort && this._readyGameMap.size > NetWork.maxGameBundleCount) {
            this.releaseReadyBundles();
          } // 启动公共模块


          if (!isAbort) {
            this.bundleResourceReady();
          }
        }
        /**
         * 子包资源准备就绪
         */
        ;

        _proto.bundleResourceReady = function bundleResourceReady() {
          this._isBundleResourceReady = true;

          if (this._isRemoteResourceReady) {
            this.startPublicBundle();
          }
        }
        /**
         * 远程资源准备就绪
         */
        ;

        _proto.remoteResourceReady = function remoteResourceReady() {
          this._isRemoteResourceReady = true;

          if (this._isBundleResourceReady) {
            this.startPublicBundle();
          }
        }
        /**
         * 启动公共模块；后续由公共模块管理子游戏的启动
         */
        ;

        _proto.startPublicBundle = function startPublicBundle() {
          var isNewPanel = false;
          var publicModelPanel = FrameUIManager.getPreloadPublicPanel(this._curGeneratingGameData.gameId);

          if (!publicModelPanel) {
            var bundle = assetManager.getBundle(this._curGeneratingGameData.publicBundleInfo.bundleName);

            if (!bundle) {
              error("startPublicBundle \u9519\u8BEF\uFF01 bundle \u4E0D\u5B58\u5728\uFF1A" + this._curGeneratingGameData.publicBundleInfo.bundleName);
              return;
            }

            var path = FrameConstValue.GAME_PREFAB_DIR + FrameConstValue.PUBLIC_MODEL_PANEL_NAME;
            var prefab = bundle.get(path, Prefab);

            if (!prefab) {
              error("startPublicBundle \u9519\u8BEF\uFF01 prefab \u4E0D\u5B58\u5728\uFF1A" + path);
              return;
            }

            isNewPanel = true;
            publicModelPanel = instantiate(prefab);
            publicModelPanel.parent = director.getScene().getComponentInChildren(Canvas).node;
          }

          var comp = publicModelPanel.getComponent(BasePublicModelPanel);

          if (!comp) {
            error("startPublicBundle \u9519\u8BEF\uFF01 \u8282\u70B9\u4E0A\u6CA1\u6709 BasePublicModelUI \u7EC4\u4EF6");
            return;
          }

          if (this._curGeneratingGameData.createType === EGameCreateType.OPEN) {
            if (!isNewPanel) {
              FrameUIManager.deletePreloadPublicPanel(this._curGeneratingGameData.gameId);
            }

            FrameUIManager.setRunningPublicPanel(publicModelPanel);
            comp.showGame(this._curGeneratingGameData);
          } else if (this._curGeneratingGameData.createType === EGameCreateType.PRELOAD) {
            if (isNewPanel) {
              FrameUIManager.addPreloadPublicPanel(publicModelPanel, this._curGeneratingGameData.gameId);
            }

            comp.showGame(this._curGeneratingGameData);
          }
        }
        /**
         * 销毁当前游戏
         */
        ;

        _proto.closeCurGame = function closeCurGame() {
          FrameUIManager.destroyRunningPublicPanel();
        }
        /**
         * 加载bundle
         * @param url 
         * @returns 
         */
        ;

        _proto.loadBundle = function loadBundle(url) {
          return new Promise(function (resolve, reject) {
            var options = {
              maxRetryCount: 2
            };
            assetManager.loadBundle(url, options, function (err, bundle) {
              if (err) {
                error(err);
                return reject(err);
              }

              return resolve(bundle);
            });
          });
        }
        /**
         * 加载bundle中的文件夹
         * @param bundle 
         * @param path 
         * @returns 
         */
        ;

        _proto.loadAssetsDirInBundle = function loadAssetsDirInBundle(bundle, path) {
          return new Promise(function (resolve, reject) {
            if (!bundle || !path) {
              return reject(false);
            }

            bundle.loadDir(path, function (e, data) {
              if (e) {
                error(e);
                return reject(e);
              }

              resolve(data);
            });
          });
        }
        /**
         * 释放终止的bundle资源
         */
        ;

        _proto.releaseAbortBundles = function releaseAbortBundles() {
          var _this2 = this;

          this._abortGameMap.forEach(function (gameData, templateId) {
            var bundleArr = [gameData.publicBundleInfo].concat(gameData.gameBundleList);
            bundleArr.forEach(function (bundleInfo) {
              var bundle = assetManager.getBundle(bundleInfo.bundleName);

              if (bundle && _this2.isBundleCanRelease(bundleInfo.bundleName)) {
                bundle.releaseAll();
                assetManager.removeBundle(bundle);
              }
            });

            _this2._abortGameMap["delete"](templateId);
          });
        }
        /**
         * 释放加载完成的bundle资源
         */
        ;

        _proto.releaseReadyBundles = function releaseReadyBundles() {
          var _this3 = this;

          var num = this._readyGameMap.size - NetWork.maxGameBundleCount;
          var releaseArr = [];

          this._readyGameMap.forEach(function (gameData, templateId) {
            if (releaseArr.length < num && templateId !== _this3.runGameData.templateId && templateId !== _this3.nextPageGameData.templateId) {
              releaseArr.push(gameData);

              _this3._readyGameMap["delete"](gameData.templateId);
            }
          });

          releaseArr.forEach(function (gameData) {
            var bundleArr = [gameData.publicBundleInfo].concat(gameData.gameBundleList);
            bundleArr.forEach(function (bundleInfo) {
              var bundle = assetManager.getBundle(bundleInfo.bundleName);

              if (bundle && _this3.isBundleCanRelease(bundleInfo.bundleName)) {
                bundle.releaseAll();
                assetManager.removeBundle(bundle);
              }
            });
          });
        }
        /**
         * bundle资源是否可以释放
         * @param bundleName 
         * @returns 
         */
        ;

        _proto.isBundleCanRelease = function isBundleCanRelease(bundleName) {
          var bundle = assetManager.getBundle(bundleName);
          if (!bundle) return false;
          var bundleList = [];

          this._loadingGameMap.forEach(function (gameData, templateId) {
            bundleList.push(gameData.publicBundleInfo.bundleName);
            gameData.gameBundleList.forEach(function (bundleInfo) {
              bundleList.push(bundleInfo.bundleName);
            });
          });

          this._readyGameMap.forEach(function (gameData, templateId) {
            bundleList.push(gameData.publicBundleInfo.bundleName);
            gameData.gameBundleList.forEach(function (bundleInfo) {
              bundleList.push(bundleInfo.bundleName);
            });
          });

          return bundleList.indexOf(bundleName) === -1;
        };

        _proto.loadBundleAndAssets = function loadBundleAndAssets(bundleUrl) {
          var _this4 = this;

          return new Promise(function (resolve, reject) {
            assetManager.loadBundle(bundleUrl, function (err, bundle) {
              if (err) {
                error(err);
                return reject(false);
              }

              return _this4.loadAssetsDirInBundle(bundle, FrameConstValue.GAME_AUDIO_DIR).then(function () {
                return _this4.loadAssetsDirInBundle(bundle, FrameConstValue.GAME_PRELOAD_DIR);
              }).then(function () {
                return _this4.loadAssetsDirInBundle(bundle, FrameConstValue.GAME_PREFAB_DIR);
              }).then(function () {
                return resolve(true);
              })["catch"](function (e) {
                error(e);
                return reject(false);
              });
            });
          });
        };

        return GameBundleManagerClass;
      }();

      GameBundleManagerClass._instance = null;
      var GameBundleManager = exports('GameBundleManager', GameBundleManagerClass.getInstance());

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GameFrame.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './FrameMsgType.ts', './NetWork.ts', './FrameListenerManager.ts', './GameMsg.ts', './GameBundleManager.ts', './MicroApp.ts', './MainDataManager.ts', './StaticAssetsManager.ts', './AppBridge.ts'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, log, Component, FrameMsgType, NetWork, FrameListenerManager, GameMsg, EGameCreateType, GameBundleManager, MicroApp, MainDataManager, StaticAssetsManager, AppBridge;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      log = module.log;
      Component = module.Component;
    }, function (module) {
      FrameMsgType = module.FrameMsgType;
    }, function (module) {
      NetWork = module.NetWork;
    }, function (module) {
      FrameListenerManager = module.FrameListenerManager;
    }, function (module) {
      GameMsg = module.default;
    }, function (module) {
      EGameCreateType = module.EGameCreateType;
      GameBundleManager = module.GameBundleManager;
    }, function (module) {
      MicroApp = module.MicroApp;
    }, function (module) {
      MainDataManager = module.MainDataManager;
    }, function (module) {
      StaticAssetsManager = module.StaticAssetsManager;
    }, function (module) {
      AppBridge = module.AppBridge;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "170948Gd1BNTbyZYUxA1hxp", "GameFrame", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var GameFrame = exports('GameFrame', (_dec = ccclass('GameFrame'), _dec(_class = /*#__PURE__*/function (_Component) {
        _inheritsLoose(GameFrame, _Component);

        function GameFrame() {
          return _Component.apply(this, arguments) || this;
        }

        var _proto = GameFrame.prototype;

        _proto.onLoad = function onLoad() {
          var _this = this;

          NetWork.setNetWorkData();
          NetWork.setCosData();
          /** 注册监听 */

          this.addMicroAppListener();
          this.addSDKEventListener();

          if (MainDataManager.isFromApp()) {
            // 通知端上，frame初始化完成
            MicroApp.dispatch(FrameMsgType.MicroApp_send_frameGameInitDone, null);
          } else {
            // 如果不是APP里打开的，通过gameId请求游戏子包数据
            var url = NetWork.GET_SUB_GAME_BUNDLE + "?gameId=" + NetWork.templateId;
            NetWork.httpRequest(url, 'GET', 'application/json', function (isError, response) {
              if (!isError && response) {
                if (response.code === 0) {
                  var subGameCfg = response.data;

                  _this.loadGame(subGameCfg);
                } else {
                  log("\u8BF7\u6C42\u6E38\u620F\u5B50\u5305\u6570\u636E\u5931\u8D25, url: " + url + ", response: " + response);
                }
              }
            });
          }
        };

        _proto.addMicroAppListener = function addMicroAppListener() {
          MicroApp.on(FrameMsgType.MicroApp_recv_pageChanged, this.onPageChanged, this);
        };

        _proto.onPageChanged = function onPageChanged(data) {
          var curSubGame = data.curPage;
          var nextSubGame = data.nextPage;

          if (curSubGame && Object.keys(curSubGame).length > 0) {
            curSubGame.createType = EGameCreateType.OPEN;
          }

          if (nextSubGame && Object.keys(nextSubGame).length > 0) {
            nextSubGame.createType = EGameCreateType.PRELOAD;
          }

          GameBundleManager.runGameData = curSubGame;
          GameBundleManager.nextPageGameData = nextSubGame; // 关闭当前运行的游戏页

          GameBundleManager.closeCurGame();

          if (curSubGame && Object.keys(curSubGame).length > 0) {
            NetWork.gameId = curSubGame.gameId;
            NetWork.isSupportKeepPlay = curSubGame.isSupportKeepPlay;
            NetWork.isMaster = NetWork.isTeacher; // 预览模式是否支持同步，由网页配置

            {
              NetWork.isSync = curSubGame.isSync;
            }
            this.loadGame(curSubGame);
          } // 如果当前页没有游戏，预加载下一页
          else {
              if (nextSubGame && Object.keys(nextSubGame).length > 0) {
                this.loadGame(nextSubGame);
              }
            }
        };

        _proto.loadGame = function loadGame(subGameCfg) {
          GameBundleManager.resetResourceReadyState();
          GameBundleManager.tryCreateNewLoadBundleTask(subGameCfg);
          StaticAssetsManager.tryCreateNewLoadAssetsTask(subGameCfg.gameId, subGameCfg.createType, function () {
            GameBundleManager.remoteResourceReady();
          });
        };

        _proto.addSDKEventListener = function addSDKEventListener() {
          // GameMsg.pauseGame(this.pauseGame.bind(this));
          AppBridge.addAllClientEvent();
          GameMsg.recv_keep_playing(this.onReceiveKeepPlaying.bind(this));
          GameMsg.recv_cancel_keep_playing(this.onReceiveCancellKeepPlaying.bind(this));
          GameMsg.recv_restart(this.onReceiveRestart.bind(this));
          GameMsg.recv_is_master(this.onReceiveIsMaster.bind(this));
          GameMsg.recv_sync_data(this.onActionSyncHandler.bind(this));
          GameMsg.recv_cancel_authorization(this.onRecvCancelAuthorization.bind(this));
          GameMsg.recv_open_authorization(this.onRecvOpenAuthorization.bind(this));
        }
        /** 打开授权 */
        ;

        _proto.onRecvOpenAuthorization = function onRecvOpenAuthorization(data) {
          var isRecover = data || false;
          NetWork.isAuthorization = true; // GameMsg.reportAliLog(AliLogMsgType.reportGameAuthChange, { isRecover: isRecover, isAuth: true });

          FrameListenerManager.dispatch(FrameMsgType.UPDATE_AUTHORIZATION, isRecover);
        }
        /** 取消授权 */
        ;

        _proto.onRecvCancelAuthorization = function onRecvCancelAuthorization() {
          NetWork.isAuthorization = false; // GameMsg.reportAliLog(AliLogMsgType.reportGameAuthChange, { isAuth: false });

          FrameListenerManager.dispatch(FrameMsgType.UPDATE_AUTHORIZATION);
        };

        _proto.onActionSyncHandler = function onActionSyncHandler(data) {
          FrameListenerManager.dispatch(FrameMsgType.RECV_SYNC_DATA, data);
        }
        /**
         * 监听接着玩
         */
        ;

        _proto.onReceiveKeepPlaying = function onReceiveKeepPlaying() {
          console.log('onReceiveKeepPlaying'); // if (!UIManager.isGameShowing) return;

          FrameListenerManager.dispatch(FrameMsgType.REC_KEEP_PLAYING);
        }
        /**
         * 监听取消接着玩
         */
        ;

        _proto.onReceiveCancellKeepPlaying = function onReceiveCancellKeepPlaying() {
          console.log('onReceiveCancellKeepPlaying'); // if (!UIManager.isGameShowing) return;

          FrameListenerManager.dispatch(FrameMsgType.REC_CANCEL_KEEP_PLAYING);
        }
        /**
         * 监听重新玩
         */
        ;

        _proto.onReceiveRestart = function onReceiveRestart() {
          console.log('onReceiveRestart'); // if (!UIManager.isGameShowing) return;

          FrameListenerManager.dispatch(FrameMsgType.REC_RESTART); // this.scheduleOnce(() => {
          //     UIHelp.showGamePanel();
          // });
        }
        /**
         * 监听是否为主动发送心跳的一端
         */
        ;

        _proto.onReceiveIsMaster = function onReceiveIsMaster(data) {
          NetWork.isMaster = data; // GameMsg.reportAliLog(AliLogMsgType.reportGameIsMasterChange, { isMaster: data.data });

          FrameListenerManager.dispatch(FrameMsgType.REC_IS_MASTER);
        };

        return GameFrame;
      }(Component)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GameMsg.ts", ['cc', './MicroApp.ts', './SDKMsgType.ts'], function (exports) {
  var cclegacy, MicroApp, AliLogMsgType, MccMsgType;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      MicroApp = module.MicroApp;
    }, function (module) {
      AliLogMsgType = module.AliLogMsgType;
      MccMsgType = module.MccMsgType;
    }],
    execute: function () {
      cclegacy._RF.push({}, "f1ba4NUYAVNZJkhvthj6NzR", "GameMsg", undefined);

      var GameMsg = exports('default', /*#__PURE__*/function () {
        function GameMsg() {}
        /************************************ aliLog 接口**************************************/


        GameMsg.reportAliLog = function reportAliLog(event, data) {
          if (data === void 0) {
            data = "";
          }

          if (window['aliLogMsg']) {
            window['aliLogMsg'].info(event, data);
          }
        } // 警告日志
        ;

        GameMsg.warn = function warn(msg) {
          if (window['aliLogMsg']) {
            var _window$aliLogMsg;

            for (var _len = arguments.length, data = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              data[_key - 1] = arguments[_key];
            }

            (_window$aliLogMsg = window['aliLogMsg']).warn.apply(_window$aliLogMsg, [msg].concat(data));
          }
        } // 报错日志
        ;

        GameMsg.error = function error(msg) {
          if (window['aliLogMsg']) {
            var _window$aliLogMsg2;

            for (var _len2 = arguments.length, data = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              data[_key2 - 1] = arguments[_key2];
            }

            (_window$aliLogMsg2 = window['aliLogMsg']).error.apply(_window$aliLogMsg2, [msg].concat(data));
          }
        }
        /**
         * URL参数不全报错
         * @param data url参数
         */
        ;

        GameMsg.URLError = function URLError(data) {
          if (window['aliLogMsg']) {
            window['aliLogMsg'].URLError(data);
          }
        } // 网络请求超时
        ;

        GameMsg.httpTimeOut = function httpTimeOut(msg) {
          window['aliLogMsg'].httpTimeOut(msg);
        } // 网络请求错误
        ;

        GameMsg.httpError = function httpError(msg) {
          window['aliLogMsg'].httpError(msg);
        } // coursewareKey不同
        ;

        GameMsg.differntKey = function differntKey(msg) {
          if (window['aliLogMsg']) {
            window['aliLogMsg'].differntKey(msg);
          }
        }
        /**
         * 上报灰度所需日志
         * @param classId 直播讲
         * @param stdGrade 年级
         * @param belongCity 分校
         * @param version 版本
         * @param gameId 游戏id
         */
        ;

        GameMsg.reportDarkTag = function reportDarkTag(classId, stdGrade, belongCity, version, gameId) {
          GameMsg.reportAliLog(AliLogMsgType.DarkTagInfo, {
            classId: "DarkTagClassId-" + classId,
            stdGrade: "DarkTagStdGrade-" + stdGrade,
            belongCity: "DarkTagBelongCity-" + belongCity,
            version: "DarkTagVersion-" + version,
            gameId: "DarkTagGameId-" + gameId
          });
        }
        /************************************对外接口**************************************/

        /**
         * 同步发送
         * @param 同步数据
         */
        ;

        GameMsg.send_sync_data = function send_sync_data(msg) {
          MicroApp.dispatch(MccMsgType.send_sync_data, msg);
        }
        /**
         * 同步接收
         * @param cb 回调
         */
        ;

        GameMsg.recv_sync_data = function recv_sync_data(cb, target) {
          MicroApp.on(MccMsgType.recv_sync_data, cb, target);
        } // 游戏收到结束游戏上报
        ;

        GameMsg.gameStop = function gameStop() {
          GameMsg.reportAliLog(AliLogMsgType.gameStop);
        }
        /************************************* mcc 接口 *********************************/

        /**
         * 发送同步事件监听初始化完成
         * @param data
         */
        ;

        GameMsg.request_sync_init = function request_sync_init() {
          MicroApp.dispatch(MccMsgType.request_sync_init, null);
        }
        /**
         * 监听接着玩
         * @param cb
         */
        ;

        GameMsg.recv_keep_playing = function recv_keep_playing(cb, target) {
          MicroApp.on(MccMsgType.recv_keep_playing, cb, target);
        }
        /**
         * 接着玩回调
         * @param data  3s心跳数据
         */
        ;

        GameMsg.request_keep_playing = function request_keep_playing(data) {
          MicroApp.dispatch(MccMsgType.request_keep_playing, data);
        }
        /**
         * 监听取消接着玩
         * @param cb
         */
        ;

        GameMsg.recv_cancel_keep_playing = function recv_cancel_keep_playing(cb, target) {
          MicroApp.on(MccMsgType.recv_cancel_keep_playing, cb, target);
        }
        /**
         * 监听重新玩
         * @param cb
         */
        ;

        GameMsg.recv_restart = function recv_restart(cb, target) {
          MicroApp.on(MccMsgType.recv_restart, cb, target);
        }
        /**
         * 发送重新玩成功回调
         * @param data
         */
        ;

        GameMsg.request_restart_over = function request_restart_over() {
          MicroApp.dispatch(MccMsgType.request_restart_over, null);
        }
        /** 
         * 发送准备就绪 mcc会发送给游戏recv_is_master
         * @param data
         */
        ;

        GameMsg.request_event_ready = function request_event_ready() {
          MicroApp.dispatch(MccMsgType.request_event_ready, null);
        }
        /**
         * 监听是否为主动发送心跳的一端
         * @param cb 回调
         */
        ;

        GameMsg.recv_is_master = function recv_is_master(cb, target) {
          MicroApp.on(MccMsgType.recv_is_master, cb, target);
        }
        /**
         * 发送关卡信息
         * @param data
         */
        ;

        GameMsg.request_level_info = function request_level_info(data) {
          MicroApp.dispatch(MccMsgType.request_level_info, data);
        }
        /**打开授权 */
        ;

        GameMsg.recv_open_authorization = function recv_open_authorization(cb, target) {
          MicroApp.on(MccMsgType.recv_open_authorization, cb, target);
        }
        /** 取消授权 */
        ;

        GameMsg.recv_cancel_authorization = function recv_cancel_authorization(cb, target) {
          MicroApp.on(MccMsgType.recv_cancel_authorization, cb, target);
        }
        /*************************************文件上传*********************************/

        /** 批量上传文件 */
        ;

        GameMsg.uploadFiles = function uploadFiles(files, callbacl) {
          if (window['cosMsg']) {
            window['cosMsg'].uploadFiles(files, callbacl);
          }
        }
        /** 设置Cos需要的数据，区分生产环境和线上环境 */
        ;

        GameMsg.setCosData = function setCosData(data) {
          if (window['cosMsg']) {
            window['cosMsg'].setCosData(data);
          }
        }
        /** 删除文件 */
        ;

        GameMsg.deleteObject = function deleteObject(key, callBack) {
          if (window['cosMsg']) {
            window['cosMsg'].deleteObject(key, callBack);
          }
        }
        /** 批量删除文件 
         * keys:[{Key: '中文/中文.txt'},{Key: '中文/中文.zip'}]
         * 
        */
        ;

        GameMsg.deleteMultipleObject = function deleteMultipleObject(keys, callBack) {
          if (window['cosMsg']) {
            window['cosMsg'].deleteMultipleObject(keys, callBack);
          }
        }
        /**********************************************************************************/
        ;

        return GameMsg;
      }());

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/HitTest.ts", ['cc'], function (exports) {
  var cclegacy, UITransform, v3, v2;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      UITransform = module.UITransform;
      v3 = module.v3;
      v2 = module.v2;
    }],
    execute: function () {
      cclegacy._RF.push({}, "cc84066lYNFeaHvvm4jg8ve", "HitTest", undefined);

      var HitTest = exports('HitTest', /*#__PURE__*/function () {
        function HitTest() {}
        /**
         * 点是否在图形内
         * @param pos 世界坐标
         * @param rect 碰撞节点
         */


        HitTest.posInRect = function posInRect(pos, rect) {
          var p = rect.parent.getComponent(UITransform).convertToWorldSpaceAR(v3(rect.position.x, rect.position.y));
          var lb = v2(p.x - rect.getComponent(UITransform).width / 2, p.y - rect.getComponent(UITransform).height / 2);
          var rt = v2(p.x + rect.getComponent(UITransform).width / 2, p.y + rect.getComponent(UITransform).height / 2);
          var b = pos.x >= lb.x && pos.y >= lb.y && pos.x <= rt.x && pos.y <= rt.y;
          return b;
        }
        /**
         * 图形点击检测, 锚点必须为左上角，或者中心。
         * 所检测的图片不可打包图集
         * @param posw 点击的世界坐标
         * @param sprite 点击的图片
         * @param accurate 是否开始像素精确判定
         */
        ;

        HitTest.imgHitTest = function imgHitTest(posw, sprite, accurate) {
          // if (accurate) {
          //     let spf = sprite.spriteFrame;
          //     let pos = sprite.node.convertToNodeSpaceAR(posw);
          //     if (sprite.node.anchorX == 0 && sprite.node.anchorY == 1) {
          //         pos.y = -pos.y;
          //     } else if (sprite.node.anchorX == 0.5 && sprite.node.anchorY == 0.5) {
          //         let w = sprite.node.width;
          //         let h = sprite.node.height;
          //         pos.x = w / 2 + pos.x;
          //         if (pos.y > 0) {
          //             pos.y = h / 2 - pos.y;
          //         } else {
          //             pos.y = h / 2 + Math.abs(pos.y);
          //         }
          //     }
          //     let tex = spf.getTexture();
          //     let cvs = document.createElement('canvas');
          //     var ctx = cvs.getContext('2d');
          //     cvs.width = tex.width;
          //     cvs.height = tex.height;
          //     ctx.drawImage(tex.getHtmlElementObj(), 0, 0, tex.width, tex.height, 0, 0, tex.width / 1, tex.height / 1);
          //     var ctx = cvs.getContext('2d');
          //     let data = ctx.getImageData(pos.x, pos.y, 1, 1).data;
          //     console.log(data);
          //     // cvs.parentNode.removeChild(cvs);
          //     return data[3] != 0;
          // } else {
          //     this.posInRect(posw, sprite.node);
          // }
          return false;
        }
        /**
         * 点是否在多边形内
         */
        ;

        HitTest.polygonInside = function polygonInside(point, polygon) {
          var b = false;
          var cn = 0;

          for (var i = 0, l = polygon.length - 1; i < l; i++) {
            var p1 = polygon[i];
            var p2 = polygon[i + 1];

            if (p1.y < point.y && p2.y > point.y || p1.y > point.y && p2.y < point.y) {
              var vt = (point.y - p1.y) / (p2.y - p1.y);

              if (point.x < p1.x + vt * (p2.x - p1.x)) {
                ++cn;
              }
            }
          } // 判断交点个数是奇数还是偶数，奇数在图内，偶数在图外，如果有特殊图形，则需要特殊判断


          b = cn % 2 == 1;
          return b;
        };

        return HitTest;
      }());

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/MainGameData.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "ba57eHmeNVHa5exIwnbgMKh", "MainGameData", undefined);

      var MainGameDataClass = /*#__PURE__*/function () {
        function MainGameDataClass() {
          this.subGameCfg = null;
        }

        MainGameDataClass.getInstance = function getInstance() {
          if (null === this._instance) {
            this._instance = new MainGameDataClass();
          }

          return this._instance;
        };

        return MainGameDataClass;
      }();

      MainGameDataClass._instance = null;
      var MainGameData = exports('MainGameData', MainGameDataClass.getInstance());

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/MathUtils.ts", ['cc'], function (exports) {
  var cclegacy, Vec3, v3;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Vec3 = module.Vec3;
      v3 = module.v3;
    }],
    execute: function () {
      cclegacy._RF.push({}, "aa960SepSxHGal1p7xVIQi8", "MathUtils", undefined);

      var MathUtils = exports('MathUtils', /*#__PURE__*/function () {
        MathUtils.getInstance = function getInstance() {
          if (this.instance == null) {
            this.instance = new MathUtils();
          }

          return this.instance;
        };

        function MathUtils() {}
        /**
         弧度制转换为角度值
         @param radian 弧度制
         @returns {number}
         */


        var _proto = MathUtils.prototype;

        _proto.getAngle = function getAngle(radian) {
          return 180 * radian / Math.PI;
        }
        /**
         角度值转换为弧度制
         @param angle
         */
        ;

        _proto.getRadian = function getRadian(angle) {
          return angle / 180 * Math.PI;
        }
        /**
         获取两点间弧度
         @param p1X
         @param p1Y
         @param p2X
         @param p2Y
         @returns {number}
         */
        ;

        _proto.getRadian2 = function getRadian2(p1X, p1Y, p2X, p2Y) {
          var xdis = p2X - p1X;
          var ydis = p2Y - p1Y;
          return Math.atan2(ydis, xdis);
        }
        /**
         获取两点间距离
         @param p1
         @param p1
         * @returns {number}
         */
        ;

        _proto.getDistance = function getDistance(p1, p2) {
          var disX = p2.x - p1.x;
          var disY = p2.y - p1.y;
          var disQ = disX * disX + disY * disY;
          return Math.sqrt(disQ);
        }
        /**
         获取一个区间的随机数
         @param $from 最小值
         @param $end 最大值
         @returns {number}
         */
        ;

        _proto.limit = function limit($from, $end) {
          $from = Math.min($from, $end);
          $end = Math.max($from, $end);
          var range = $end - $from;
          return $from + Math.random() * range;
        }
        /**
         获取一个区间的随机数(帧数)
         @param $from 最小值
         @param $end 最大值
         @returns {number}
         */
        ;

        _proto.limitInteger = function limitInteger($from, $end) {
          return Math.round(this.limit($from, $end));
        }
        /**
         在一个数组中随机获取一个元素
         @param arr 数组
         @returns {any} 随机出来的结果
         */
        ;

        _proto.randomArray = function randomArray(arr) {
          var index = Math.floor(Math.random() * arr.length);
          return arr[index];
        }
        /**
         点到直线的垂点
         */
        ;

        _proto.SagPoint = function SagPoint(x, y, sp, ep) {
          var se = (sp.x - ep.x) * (sp.x - ep.x) + (sp.y - ep.y) * (sp.y - ep.y); //线段两点距离平方

          var p = (x - sp.x) * (ep.x - sp.x) + (y - sp.y) * (ep.y - sp.y); //向量点乘=|a|*|b|*cosA

          var r = p / se; //r即点到线段的投影长度与线段长度比

          var outx = sp.x + r * (ep.x - sp.x); //垂足x

          var outy = sp.y + r * (ep.y - sp.y); //垂足y

          var point = new Vec3(outx, outy);
          return point;
        }
        /**
         求延长线上的某点，第一象限
         */
        ;

        _proto.extendedLinePoint = function extendedLinePoint(p1, p2, dis) {
          var lab = 0;
          var x;
          var y; // lab = Math.sqrt(Math.abs((p2.x - p1.x) * (p2.x - p1.x)) + Math.abs((p2.y - p1.y) * (p2.y - p1.y)));

          lab = this.getDistance(p1, p2);

          if (p2.x > p1.x && p2.y > p1.y) {
            x = dis / lab * Math.abs(p1.x - p2.x) + p2.x;
            y = dis / lab * Math.abs(p1.y - p2.y) + p2.y;
          } else if (p2.x < p1.x && p2.y > p1.y) {
            x = -dis / lab * Math.abs(p1.x - p2.x) + p2.x;
            y = dis / lab * Math.abs(p1.y - p2.y) + p2.y;
          } else if (p2.x < p1.x && p2.y < p1.y) {
            x = -dis / lab * Math.abs(p1.x - p2.x) + p2.x;
            y = -dis / lab * Math.abs(p1.y - p2.y) + p2.y;
          } else if (p2.x > p1.x && p2.y < p1.y) {
            x = dis / lab * Math.abs(p1.x - p2.x) + p2.x;
            y = -dis / lab * Math.abs(p1.y - p2.y) + p2.y;
          }

          var p = new Vec3(x, y);
          return p;
        }
        /**
         获得两点的角度 1~4象限
         @param {cc.Vec3} p1
         @param {cc.Vec3} p2 
         */
        ;

        _proto.getTwoPointsRadian1 = function getTwoPointsRadian1(p1, p2) {
          var x = Math.abs(p1.x - p2.x);
          var y = Math.abs(p1.y - p2.y);
          var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
          var cos = y / z;
          var radina = Math.acos(cos); //用反三角函数求弧度

          var angle = Math.floor(180 / (Math.PI / radina)); //将弧度转换成角度

          if (p2.x > p1.x && p2.y < p1.y) {
            //鼠标在第四象限
            angle = 180 - angle;
          }

          if (p2.x == p1.x && p2.y > p1.y) {
            //鼠标在y轴负方向上
            angle = 180;
          }

          if (p2.x > p1.x && p2.y == p1.y) {
            //鼠标在x轴正方向上
            angle = 90;
          }

          if (p2.x < p1.x && p2.y < p1.y) {
            //鼠标在第三象限
            angle = 180 + angle;
          }

          if (p2.x < p1.x && p2.y == p1.y) {
            //鼠标在x轴负方向
            angle = 270;
          }

          if (p2.x < p1.x && p2.y > p1.y) {
            //鼠标在第二象限
            angle = 360 - angle;
          }

          return angle;
        }
        /**
         获得两点的角度  无论正反旋转
         @param {cc.Vec3} p1
         @param {cc.Vec3} p2 
         */
        ;

        _proto.getTwoPointsRadian2 = function getTwoPointsRadian2(p1, p2) {
          var o = p1.x - p2.x;
          var a = p1.y - p2.y;
          var r = Math.atan2(a, o) * -180 / Math.PI - 90;
          return r;
        }
        /**
         取两条直线的交点
         @param p1          // 直线1点1
         @param p2          // 直线1点2
         @param p3          // 直线2点1
         @param p4          // 直线2点2
         */
        ;

        _proto.fingCrossPoint = function fingCrossPoint(p1, p2, p3, p4) {
          var a1 = p2.y - p1.y;
          var b1 = p1.x - p2.x;
          var c1 = p1.x * p2.y - p2.x * p1.y;
          var a2 = p4.y - p3.y;
          var b2 = p3.x - p4.x;
          var c2 = p3.x * p4.y - p4.x * p3.y;
          var det = a1 * b2 - a2 * b1;

          if (det == 0) {
            return null;
          }

          var x = (c1 * b2 - c2 * b1) / det;
          var y = (a1 * c2 - a2 * c1) / det;
          var p = new Vec3(Math.floor(x), Math.floor(y));
          return p;
        }
        /**
         * 用于浮点数相加  解决浮点数相加不准确问题
         * @param arg1
         * @param arg2
         */
        ;

        _proto.accAdd = function accAdd(arg1, arg2) {
          var r1 = 0,
              r2 = 0,
              m = 0,
              c = 0;

          try {
            r1 = arg1.toString().split('.')[1].length;
          } catch (e) {
            r1 = 0;
          }

          try {
            r2 = arg2.toString().split('.')[1].length;
          } catch (e) {
            r2 = 0;
          }

          c = Math.abs(r1 - r2);
          m = Math.pow(10, Math.max(r1, r2));

          if (c > 0) {
            var cm = Math.pow(10, c);

            if (r1 > r2) {
              arg1 = Number(arg1.toString().replace('.', ''));
              arg2 = Number(arg2.toString().replace('.', '')) * cm;
            } else {
              arg1 = Number(arg1.toString().replace('.', '')) * cm;
              arg2 = Number(arg2.toString().replace('.', ''));
            }
          } else {
            arg1 = Number(arg1.toString().replace('.', ''));
            arg2 = Number(arg2.toString().replace('.', ''));
          }

          return (arg1 + arg2) / m;
        }
        /**
         * 浮点数相减
         * @param arg1
         * @param arg2
         */
        ;

        _proto.accSub = function accSub(arg1, arg2) {
          var r1 = 0,
              r2 = 0,
              m = 0,
              n = 0;

          try {
            r1 = arg1.toString().split('.')[1].length;
          } catch (e) {
            r1 = 0;
          }

          try {
            r2 = arg2.toString().split('.')[1].length;
          } catch (e) {
            r2 = 0;
          }

          m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度

          n = r1 >= r2 ? r1 : r2;
          return ((arg1 * m - arg2 * m) / m).toFixed(n);
        }
        /**
         * 浮点数相乘
         * @param arg1
         * @param arg2
         */
        ;

        _proto.accMul = function accMul(arg1, arg2) {
          var m = 0,
              s1 = arg1.toString(),
              s2 = arg2.toString();

          try {
            m += s1.split('.')[1].length;
          } catch (e) {}

          try {
            m += s2.split('.')[1].length;
          } catch (e) {}

          return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
        }
        /**
         * 浮点数相除
         * @param arg1
         * @param arg2
         */
        ;

        _proto.accDiv = function accDiv(arg1, arg2) {
          var t1 = 0,
              t2 = 0,
              r1 = 0,
              r2 = 0;

          try {
            t1 = arg1.toString().split('.')[1].length;
          } catch (e) {}

          try {
            t2 = arg2.toString().split('.')[1].length;
          } catch (e) {}

          r1 = Number(arg1.toString().replace('.', ''));
          r2 = Number(arg2.toString().replace('.', ''));
          return r1 / r2 * Math.pow(10, t2 - t1);
        }
        /**
         线段中点
         * @param {cc.Vec3} p1
         * @param {cc.Vec3} p2
         * @returns {cc.Vec3}
         * @memberof MathUtils
         */
        ;

        _proto.getCenterPosition = function getCenterPosition(p1, p2) {
          var pos = v3((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
          return pos;
        };

        return MathUtils;
      }());
      MathUtils.instance = void 0;

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/NetWork.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './env', './FrameConstValue.ts', './GameMsg.ts', './UIHelp.ts', './MainDataManager.ts'], function (exports) {
  var _asyncToGenerator, _regeneratorRuntime, cclegacy, log, DEBUG, FrameConstValue, GameMsg, UIHelp, MainDataManager;

  return {
    setters: [function (module) {
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
      log = module.log;
    }, function (module) {
      DEBUG = module.DEBUG;
    }, function (module) {
      FrameConstValue = module.FrameConstValue;
    }, function (module) {
      GameMsg = module.default;
    }, function (module) {
      UIHelp = module.UIHelp;
    }, function (module) {
      MainDataManager = module.MainDataManager;
    }],
    execute: function () {
      cclegacy._RF.push({}, "9cd01aQNbFMUY4sUMN0yYH5", "NetWork", undefined);

      var NetWorkClass = exports('NetWorkClass', /*#__PURE__*/function () {
        function NetWorkClass() {
          //判断是否是线上   URL里不加参数则默认为测试环境
          this.isOnlineEnv = this.GetIsOnline() == 'online'; // /classroom-slides/resources/cos/credential

          this.BASE = this.isOnlineEnv ? '' : '';
          this.COS_BUCKET = this.isOnlineEnv ? '' : '';
          this.COS_URL = this.BASE + "/classroom-slides/resources/cos/credential?bucketName=" + this.COS_BUCKET;
          this.COS_REGION = 'ap-beijing';
          this.COS_BASE_URL = this.isOnlineEnv ? 'https://micro-class.xuepeiyou.com' : 'https://micro-class-test.xuepeiyou.com';
          this.GET_GAME_ID = this.BASE + '/classroom-slides/games/create';
          this.GET_QUESTION = this.BASE + '/classroom-slides/games/{gameId}';
          this.SAVE_QUESTION = this.BASE + '/classroom-slides/games/{gameId}/save';
          this.GET_USER_PROGRESS = this.BASE + '/get/answer';
          this.GET_TITLE = this.BASE + '/get/title';
          this.ADD = this.BASE + '/add';
          this.MODIFY = this.BASE + '/modify';
          this.CLEAR = this.BASE + '/clear';
          this.GET_SUB_GAME_BUNDLE = this.BASE + '/subgame';
          this.empty = false; //清理脏数据的开关，在URL里面拼此参数 = true；
          //新课堂参数

          this.isSubGame = false; // 是否分包模式

          /**游戏帧率 */

          this.gameFps = 30;
          /**从url里边获取游戏名 */

          this.gameName = null;
          /**用户id */

          this.userId = null;
          /**直播讲id */

          this.chapterId = null;
          /**游戏id */

          this.templateId = null;
          /**分校 */

          this.belongCityId = null;
          /** 年级 */

          this.gradeId = null;
          /**题目信息   用于交互游戏自身查题目信息 */

          this.gameId = null;
          /**交互游戏绑定id   绑定的时候用（监课平台）  学生端不传 */

          this.titleId = null;
          /**是否是直播 */

          this.bLive = null;
          /** 运行环境（线上/测试）*/

          this.env = null;
          this.app = null; //App名称

          /**硬件平台信息（pc/iPad/android/androidPad/web） */

          this.platform = null;
          /**使用方(辅导端、学生端、未来黑板、配齐、教研云、……） */

          this.channel = null;
          /**浏览器信息（内核及版本） */

          this.browser = null;
          /**端的版本信息 */

          this.appVersion = null;
          /**是否为教师（通过同步的get_role返回的是否为'teacher'） */

          this.isTeacher = false;
          /**是否为同步（通过同步的get_is_sync返回是否为1/true） */

          this.isSync = false;
          /**是否是主动发心跳的一方 */

          this.isMaster = null;
          /**是否支持接着玩重新玩   */

          this.isSupportKeepPlay = false;
          /**
           * mccVersion: '2' //分包、新的开始游戏规则
           *  */

          this.mccVersion = null; //mcc版本

          /**是否被授权 以此判断开始游戏页面是否展示 */

          this.isAuthorization = true;
          /** 是否有静态资源*/

          this.hasStaticAssets = null;
          /** 缓存的游戏子包最大数 */

          this.maxGameBundleCount = 3;
          /** 缓存的预加载页面最大数 */

          this.maxPreloadPanelCount = 3;
          /** 打开的是否是TeacherPanel */

          this.isOpenTeacherPanel = false;
          this.theRequest = null;
          this.cacheXhr = null;
        }

        NetWorkClass.getInstance = function getInstance() {
          if (this.instance == null) {
            this.instance = new NetWorkClass();
          }

          return this.instance;
        };

        var _proto = NetWorkClass.prototype;

        _proto.setIsSync = function setIsSync(isSync) {
          isSync = isSync == null ? false : isSync;
          NetWork.isSync = isSync;
        };

        _proto.setIsPreload = function setIsPreload(isPreload) {// UIManager.isGameShowing = !isPreload;
        };

        _proto.setIsSupportKeepPlay = function setIsSupportKeepPlay(isSupportKeepPlay) {
          NetWork.isSupportKeepPlay = isSupportKeepPlay;
          NetWork.isMaster = NetWork.isTeacher;
          console.log("isSupportKeepPlay: " + isSupportKeepPlay);
        }
        /**
         * 请求网络Post 0成功 1超时
         * @param url
         * @param openType
         * @param contentType
         * @param callback
         * @param params
         */
        ;

        _proto.httpRequest = function httpRequest(url, openType, contentType, callback, params) {
          var _this = this;

          if (callback === void 0) {
            callback = null;
          }

          if (params === void 0) {
            params = '';
          }

          if (!FrameConstValue.IS_TEACHER && !DEBUG && (!this.userId || !this.gameId || !this.env || !this.app || !this.channel || !this.browser)) {
            GameMsg.URLError(this.theRequest);
            UIHelp.showFrameErrorTips('URL参数错误');
            callback && callback(true, null);
            return;
          }

          var xhr = new XMLHttpRequest();
          xhr.open(openType, url);
          xhr.timeout = 10000;
          xhr.setRequestHeader('Content-Type', contentType);
          xhr.withCredentials = true;
          this.cacheXhr = xhr; //回调

          xhr.onreadystatechange = function () {
            log('httpRequest rsp status', xhr.status, '        xhr.readyState', xhr.readyState, '        xhr.responseText', xhr.responseText);

            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status <= 400) {
              _this.cacheXhr = null;
              var response = JSON.parse(xhr.responseText);

              if (!response.errcode) {
                callback && callback(false, response);
              } else {
                GameMsg.httpError(response.errmsg);
                UIHelp.showFrameErrorTips(response.errmsg);
                callback && callback(true, null);
              }
            }
          }; //超时回调


          xhr.ontimeout = function (event) {
            GameMsg.httpTimeOut('网络不佳，请稍后重试');
            xhr.abort();
            _this.cacheXhr = null;
            UIHelp.showFrameErrorTips('网络不佳，请稍后重试');
            console.log('httpRequest timeout');
            callback && callback(true, null);
          }; //出错


          xhr.onerror = function (error) {
            _this.cacheXhr = null;
            UIHelp.showFrameErrorTips('网络出错，请稍后重试');
            console.log('httpRequest error');
            callback && callback(true, null);
          };

          xhr.send(params);
        }
        /**
         * 获取对象数据存储需要的配置
         * 由于uploadFiles时候才会走new COS({请求})里边的请求，此时uploadFiles里边使用的会是初始化的bucket和region
         * ，所以进游戏先获取bucket和region
         * @returns 
         */
        ;

        _proto.setCosData = function setCosData() {
          GameMsg.setCosData({
            bucket: this.COS_BUCKET,
            url: NetWork.COS_URL,
            region: this.COS_REGION
          });
        }
        /**
         * 获取url参数
         */
        ;

        _proto.setNetWorkData = function setNetWorkData() {
          var urlParams = MainDataManager.getUrlParams();
          this.theRequest = urlParams; //新课堂url必需参数

          this.isSubGame = urlParams['isSubGame'] == "1" ? true : false;
          this.gameFps = parseInt(urlParams['gameFps'] || 30);

          if (FrameConstValue.SUPPORT_FPS.indexOf(this.gameFps) < 0) {
            this.gameFps = 30;
          }

          this.userId = urlParams['userId'];
          this.chapterId = urlParams['chapterId'];
          this.templateId = urlParams['templateId'];
          this.belongCityId = urlParams['belongCityId'];
          this.gradeId = urlParams['gradeId'];
          this.gameId = urlParams['gameId'];
          this.titleId = urlParams['titleId'];
          this.hasStaticAssets = urlParams['hasStaticAssets'] == "1" ? true : false;
          this.bLive = urlParams['bLive'];
          this.env = urlParams['env'];
          this.app = urlParams['app'];
          this.platform = urlParams['platform'];
          this.channel = urlParams['channel'];
          this.browser = urlParams['browser'];
          this.appVersion = urlParams['appVersion'];
          this.empty = urlParams['empty'];
          this.isTeacher = urlParams['role'] == 'teacher';
          this.mccVersion = parseInt(urlParams['mccVersion'] || 1);
          var s = urlParams['isSync'];
          this.isSync = '1' == s || 'true' == s;
          s = urlParams['supportKeepAndRestart'];
          this.isSupportKeepPlay = '1' == s || 'true' == s;
          s = urlParams['isPreload']; // UIManager.isGameShowing = !isPreload;

          this.maxGameBundleCount = parseInt(urlParams['maxGameBundleCount'] || 3);
          this.maxPreloadPanelCount = parseInt(urlParams['maxPreloadPanelCount'] || 1);
          this.isOpenTeacherPanel = 'teacherPanel' === urlParams['openPanel'];
          return urlParams;
        };

        _proto.setCoursewareId = function setCoursewareId(gameId) {
          this.gameId = gameId;
        };

        _proto.GetIsOnline = function GetIsOnline() {
          // this.setNetWorkData();
          var isOnline = 'test';

          if (this.env) {
            isOnline = this.env;
          }

          return isOnline;
        };

        _proto.checkRemoteFileExists = /*#__PURE__*/function () {
          var _checkRemoteFileExists = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(url, callBack) {
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  if (callBack === void 0) {
                    callBack = null;
                  }

                  return _context.abrupt("return", new Promise(function (resolve, reject) {
                    var xhr = new XMLHttpRequest();
                    xhr.timeout = 3000;

                    xhr.onreadystatechange = function () {
                      if (xhr.readyState === 4) {
                        var statusList = [0, 200, 204, 206]; // 状态码为 200 或 206 表示资源存在

                        if (statusList.indexOf(xhr.status) >= 0) {
                          callBack && callBack(true);
                          return resolve(true);
                        } else {
                          callBack && callBack(false, xhr.status);
                          return reject();
                        }
                      }
                    };

                    xhr.open('HEAD', url, true);
                    xhr.send();

                    xhr.onerror = function () {
                      callBack && callBack(false);
                      return reject();
                    };

                    xhr.ontimeout = function () {
                      callBack && callBack(false);
                      return reject();
                    };
                  }));

                case 2:
                case "end":
                  return _context.stop();
              }
            }, _callee);
          }));

          function checkRemoteFileExists(_x, _x2) {
            return _checkRemoteFileExists.apply(this, arguments);
          }

          return checkRemoteFileExists;
        }()
        /**
         * 检测配置文件大小，过大不允许保存
         * 服务端最大65535字节
         * @param editorData 
         * @param coursewareKey 
         * @param callBack 
         * @returns 
         */
        ;

        _proto.checkJsonLength = function checkJsonLength(editorData, coursewareKey, callBack) {
          var jsonString = JSON.stringify({
            CoursewareKey: coursewareKey,
            data: editorData
          });
          var byteCount = new TextEncoder().encode(jsonString).length;

          if (byteCount > 65535) {
            // UIHelp.showPopupTips(PopupTipsType.OnlyConfirm, "数据量过大，请删除几个关卡再提交", () => {
            //     callBack && callBack();
            // });
            return null;
          } else {
            return jsonString;
          }
        }
        /**
         * 从服务器获取 gameId 
         * @param templateId
         */
        ;

        _proto.getGameIdFromServer = function getGameIdFromServer(templateId, callBack) {
          var _this2 = this;

          return new Promise(function (resolve, reject) {
            var params = JSON.stringify({
              gameTemplateId: templateId
            });

            _this2.httpRequest(_this2.GET_GAME_ID, 'POST', 'application/json;charset=utf-8', function (isError, res) {
              if (isError) {
                reject(isError);
              } else {
                var _gameId = res.data.id + '';

                callBack && callBack(_gameId);
                resolve(_gameId);
              }
            }, params);
          });
        }
        /**
         * 保存题目数据
         * @param gameId
         * @param editorData
         * @param callBack
         */
        ;

        _proto.saveQuestionData = function saveQuestionData(gameId, editorData, callBack) {
          var _this3 = this;

          return new Promise(function (resolve, reject) {
            var params = JSON.stringify({
              gameCustomStructure: JSON.stringify(editorData)
            });

            var url = _this3.SAVE_QUESTION.replace('{gameId}', gameId);

            _this3.httpRequest(url, 'POST', 'application/json;charset=utf-8', function (isError, res) {
              if (isError) {
                reject();
              } else {
                callBack && callBack();
                resolve();
              }
            }, params);
          });
        }
        /**
         * 从服务器获取题目数据
         */
        ;

        _proto.getQuestionData = function getQuestionData(gameId, callBack) {
          var _this4 = this;

          return new Promise(function (resolve, reject) {
            if (!gameId) {
              UIHelp.showFrameErrorTips('gameId为空，无法获取编辑器数据。', '获取编辑器数据失败');
              return reject();
            }

            var url = _this4.GET_QUESTION.replace('{gameId}', gameId);

            _this4.httpRequest(url, 'GET', 'application/json;charset=utf-8', function (isError, res) {
              if (isError || !res || !res.data || !res.data.gameCustomStructure) {
                reject();
              } else {
                var editorData = JSON.parse(res.data.gameCustomStructure);
                callBack && callBack(editorData);
                resolve(editorData);
              }
            });
          });
        };

        return NetWorkClass;
      }());
      NetWorkClass.instance = void 0;
      var NetWork = exports('NetWork', NetWorkClass.getInstance());

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/SDKMsgType.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "e0fb95Wkf1FPK6ZjN3o1+/S", "SDKMsgType", undefined);
      /** mcc交互消息 */


      var MccMsgType = exports('MccMsgType', function MccMsgType() {});
      MccMsgType.request_main_res_load_end = 'request_main_res_load_end';
      MccMsgType.request_load_err = 'request_load_err';
      MccMsgType.request_game_err = 'request_game_err';
      MccMsgType.request_engine_load_start = 'request_engine_load_start';
      MccMsgType.request_engine_load_end = 'request_engine_load_end';
      /** 取消mcc2秒检测 */

      MccMsgType.request_cancel_2s_detection = 'request_cancel_2s_detection';
      MccMsgType.recv_switch_game = 'recv_switch_game';
      MccMsgType.recv_preload_game = 'recv_preload_game';
      MccMsgType.recv_pause_game = 'recv_pause_game';
      MccMsgType.recv_sync_data = 'recv_sync_data';
      MccMsgType.recv_json_data = 'recv_json_data';
      MccMsgType.recv_sync_3s_data = 'recv_sync_3s_data';
      MccMsgType.recv_keep_playing = 'recv_keep_playing';
      MccMsgType.recv_cancel_keep_playing = 'recv_cancel_keep_playing';
      MccMsgType.recv_restart = 'recv_restart';
      MccMsgType.recv_is_master = 'recv_is_master';
      MccMsgType.recv_show_gamePanel = 'recv_show_gamePanel';
      MccMsgType.recv_hide_gamePanel = 'recv_hide_gamePanel';
      MccMsgType.answer_sync_send = 'answer_sync_send';
      MccMsgType.game_statistic_data = 'game_statistic_data';
      /** 游戏获取授权 */

      MccMsgType.recv_open_authorization = 'recv_open_authorization';
      /** 游戏取消授权 */

      MccMsgType.recv_cancel_authorization = 'recv_cancel_authorization';
      /**接收静态资源url */

      MccMsgType.recv_static_res_url = 'recv_static_res_url';
      /** 游戏消息 判断是子游戏时候会拼接'sub_' */

      MccMsgType.res_load_process = 'res_load_process';
      MccMsgType.game_start = 'game_start';
      MccMsgType.game_over = 'game_over';
      MccMsgType.request_res_load_start = 'request_res_load_start';
      MccMsgType.request_res_load_end = 'request_res_load_end';
      MccMsgType.request_sync_init = 'request_sync_init';
      MccMsgType.send_sync_data = 'send_sync_data';
      MccMsgType.request_json_data = 'request_json_data';
      MccMsgType.send_sync_3s_data = 'send_sync_3s_data';
      MccMsgType.request_keep_playing = 'request_keep_playing';
      MccMsgType.request_restart_over = 'request_restart_over'; //重新玩回调用

      MccMsgType.request_event_ready = 'request_event_ready';
      MccMsgType.request_level_info = 'request_level_info';
      /** 请求静态资源url */

      MccMsgType.request_static_res_url = 'request_static_res_url';
      var SubGameEvent = exports('SubGameEvent', function SubGameEvent() {});
      /** 客户端交互消息 */

      SubGameEvent.iframe_sub = 'sub_';
      /** 子游戏消息 判断是子游戏时候会拼接'sub_' */

      SubGameEvent.subEventList = [MccMsgType.request_res_load_start, MccMsgType.res_load_process, MccMsgType.request_res_load_end, MccMsgType.game_start, MccMsgType.request_sync_init, MccMsgType.send_sync_data, MccMsgType.request_json_data, MccMsgType.request_static_res_url, MccMsgType.send_sync_3s_data, MccMsgType.request_keep_playing, MccMsgType.request_restart_over, MccMsgType.request_event_ready, MccMsgType.request_level_info, MccMsgType.answer_sync_send, MccMsgType.game_over];
      var ClientMsgType = exports('ClientMsgType', function ClientMsgType() {});
      /**阿里上报消息 */

      ClientMsgType.res_load_start = 'res_load_start';
      ClientMsgType.res_load_complete = 'res_load_complete';
      ClientMsgType.finished = 'finished';
      ClientMsgType.STOP = 'stop';
      ClientMsgType.res_load_process = 'res_load_process';
      ClientMsgType.game_start = 'game_start';
      ClientMsgType.answer_sync_send = 'answer_sync_send';
      ClientMsgType.game_over = 'game_over';
      ClientMsgType.game_statistic_data = 'game_statistic_data';
      /**开始拍照 */

      ClientMsgType.startPhotoCapture = 'startPhotoCapture';
      /**取消拍照 */

      ClientMsgType.cancelPhotoCapture = 'cancelPhotoCapture';
      /**开始录音 */

      ClientMsgType.startAudioRecording = 'startAudioRecording';
      /**停止录音 */

      ClientMsgType.stopAudioRecording = 'stopAudioRecording';
      /**取消录音 */

      ClientMsgType.cancelAudioRecording = 'cancelAudioRecording';
      /**获取用户信息 */

      ClientMsgType.fetchUserInfo = 'fetchUserInfo';
      var AliLogMsgType = exports('AliLogMsgType', function AliLogMsgType() {});
      AliLogMsgType.resLoadStart = 'resLoadStart';
      AliLogMsgType.resLoadEnd = 'resLoadEnd';
      AliLogMsgType.game_start = 'game_start';
      AliLogMsgType.request_sync_init = 'request_sync_init';
      AliLogMsgType.gameLevelReport = 'gameLevelReport';
      AliLogMsgType.gameOverReport = 'gameOverReport';
      AliLogMsgType.gameStop = 'gameStop';
      /**分包埋点 */

      AliLogMsgType.recv_switch_game = 'recv_switch_game';
      AliLogMsgType.recv_preload_game = 'recv_preload_game';
      AliLogMsgType.request_main_res_load_end = 'request_main_res_load_end';
      AliLogMsgType.request_load_err = 'request_load_err';
      /**加载的游戏不是当前游戏 */

      AliLogMsgType.loadGameNotCurGame = 'loadGameNotCurGame';
      /** 加载失败 */

      AliLogMsgType.loadBundleFail = 'loadBundleFail';
      /** 预加载和加载的是同一个bundle */

      AliLogMsgType.preLoadIsSameLoadBunde = 'preLoadIsSameLoadBunde';
      /** 预加载完成 */

      AliLogMsgType.preLoadBundleFinish = 'preLoadBundleFinish';
      /** 预加载失败 */

      AliLogMsgType.preLoadBundleFail = 'preLoadBundleFail';
      /**上报游戏isMaster变更 */

      AliLogMsgType.reportGameIsMasterChange = 'reportGameIsMasterChange';
      /**上报游戏授权变更 */

      AliLogMsgType.reportGameAuthChange = 'reportGameAuthChange';
      /** 上报游戏灰度相关信息 */

      AliLogMsgType.DarkTagInfo = 'DarkTagInfo';
      /**上报自定义信息 */

      AliLogMsgType.reportCustomInfo = 'reportCustomInfo';
      /**离线资源下载埋点 */

      AliLogMsgType.staticAssetsLoad = 'staticAssetsLoad';
      /**切页暂停引擎 */

      AliLogMsgType.pauseGame = 'pauseGame';

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/SoundManager.ts", ['cc', './AudioEngine.ts'], function (exports) {
  var cclegacy, AudioEngine;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      AudioEngine = module.AudioEngine;
    }],
    execute: function () {
      cclegacy._RF.push({}, "3ade5V8w/hPS5OWiHLtHdKR", "SoundManager", undefined);
      /** 音乐的资源名称枚举 */


      var MusicType = exports('MusicType', /*#__PURE__*/function (MusicType) {
        MusicType["BGM_MUSIC"] = "BGM_MUSIC";
        MusicType["TITLE_AUDIO"] = "TITLE_AUDIO";
        MusicType["GAME_EFFECT"] = "GAME_EFFECT";
        MusicType["GAME_AUDIO"] = "GAME_AUDIO";
        return MusicType;
      }({}));

      var SoundManagerClass = /*#__PURE__*/function () {
        function SoundManagerClass() {
          /** 管理定时器 切换游戏时候给停掉 */
          this._soundTimeOutArr = [];
          this.MUSIC_BGM = 'bgm';
          this.AUDIO_TITLE = 'audio_sound';
        }

        var _proto = SoundManagerClass.prototype;

        _proto.start = function start() {};

        SoundManagerClass.getInstance = function getInstance() {
          if (null === this._instance) {
            this._instance = new SoundManagerClass();
          }

          return this._instance;
        }
        /**
         * 播放背景音乐
         * @param soundName 背景音乐文件名
         */
        ;

        _proto.playBGM = function playBGM(clip) {
          if (!clip) {
            return;
          }

          AudioEngine.playMusic(clip, true);
        };

        _proto.removeGameAudio = function removeGameAudio() {
          AudioEngine.releaseAllAudio();
        };

        _proto.stopBGM = function stopBGM() {
          AudioEngine.stopMusic();
        }
        /**
         * 播放题干语音
         *
         * @param {AudioClip} clip 语音clip文件
         * @param {boolean} bLoop 是否循环
         * @param {Function} [endCb=null] 播放结束回调
         * @param {cc.Component} [comp=null] 有传入comp则回调使用组件的scheduleOnce，不依赖cc.audioEngine.setFinishCallback
         * @memberof SoundManagerClass
         */
        ;

        _proto.playAudioTitle = function playAudioTitle(clip, bLoop, endCb, comp) {
          if (bLoop === void 0) {
            bLoop = false;
          }

          if (endCb === void 0) {
            endCb = null;
          }

          if (comp === void 0) {
            comp = null;
          }

          this.playAudio(clip, bLoop, endCb, true, comp);
        };

        _proto.cleanSoundTimeOut = function cleanSoundTimeOut() {
          this._soundTimeOutArr.forEach(function (ele) {
            clearTimeout(ele);
          });

          this._soundTimeOutArr = [];
        }
        /**
         * 播放语音
         *
         * @param {string} clip 语音clip文件
         * @param {boolean} bLoop 是否循环
         * @param {Function} [onFinished=null] 播放结束回调
         * @param {boolean} [isTitleAudio=false] 是否是题干语音
         * @param {cc.Component} [comp=null] 有传入comp则回调使用组件的scheduleOnce，不依赖cc.audioEngine.setFinishCallback
         * @memberof SoundManagerClass
         */
        ;

        _proto.playAudio = function playAudio(clip, bLoop, onFinished, isTitleAudio, comp) {
          if (onFinished === void 0) {
            onFinished = null;
          }

          if (comp === void 0) {
            comp = null;
          } // if (!UIManager.isGameShowing) {
          //     warn(`不要在GamePanel的onLoad和start里播放音频！`);
          //     return;
          // }


          if (!clip) return;
          AudioEngine.playEffect(clip, bLoop);

          var callBack = function callBack() {
            onFinished && onFinished();
          };

          if (comp) {
            comp.scheduleOnce(function () {
              callBack();
            }, clip.getDuration());
          } else {
            AudioEngine.setFinishCallback(clip.name, function () {
              /** 不加延时的话，在回调里接着播放声音会导致下一条声音收不到回调 */
              // TODO: 先去掉测试一下还有没有上述问题
              // let timeOut = setTimeout(() => {
              //     this._soundTimeOutArr.splice(this._soundTimeOutArr.indexOf(timeOut), 1);
              //     callBack();
              // }, 100);
              // this._soundTimeOutArr.push(timeOut);
              callBack();
            });
          }
        }
        /**
         * 播放音效
         *
         * @param {string} clip 音效clip文件
         * @param {boolean} bLoop 是否循环
         * @param {Function} [onFinished=null] 播放结束回调
         * @param {cc.Component} [comp=null] 有传入comp则回调使用组件的scheduleOnce，不依赖cc.audioEngine.setFinishCallback
         * @memberof SoundManagerClass
         */
        ;

        _proto.playEffect = function playEffect(clip, bLoop, onFinished, comp) {
          if (onFinished === void 0) {
            onFinished = null;
          }

          if (comp === void 0) {
            comp = null;
          } // if (!UIManager.isGameShowing) {
          //     warn(`不要在GamePanel的onLoad和start里播放音频！`);
          //     return;
          // }


          if (!clip) return;
          AudioEngine.playEffect(clip, bLoop);

          var callBack = function callBack() {
            onFinished && onFinished();
          };

          if (comp) {
            comp.scheduleOnce(function () {
              callBack();
            }, clip.getDuration());
          } else {
            AudioEngine.setFinishCallback(clip.name, function () {
              // TODO: 先去掉测试一下还有没有上述问题
              // let timeOut = setTimeout(() => {
              //     this._soundTimeOutArr.splice(this._soundTimeOutArr.indexOf(timeOut), 1);
              //     callBack();
              // }, 100);
              // this._soundTimeOutArr.push(timeOut);
              callBack();
            });
          }
        } // 停止正在播放的所有音频
        ;

        _proto.stopAll = function stopAll() {
          AudioEngine.stopAll();
          this.cleanSoundTimeOut();
        } // 某个音效是否正在播放
        ;

        _proto.isPlaying = function isPlaying(clipName) {
          var name = '';

          if (typeof clipName === 'string') {
            name = clipName;
          } else {
            name = clipName.name;
          }

          return AudioEngine.isPlaying(name);
        } //静音
        ;

        _proto.mute = function mute(onlyMuteMusic) {
          return;
        } //取消静音
        ;

        _proto.unmute = function unmute() {
          AudioEngine.setEffectsVolume(1);
          AudioEngine.setMusicVolume(1);
        };

        _proto.playingResidue = function playingResidue(clipName) {
          if (clipName) {
            return AudioEngine.getDuration(clipName) - AudioEngine.getCurrentTime(clipName);
          }

          return 0;
        };

        return SoundManagerClass;
      }();

      SoundManagerClass._instance = null;
      var SoundManager = exports('SoundManager', SoundManagerClass.getInstance());

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/StaticAssetsManager.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './NetWork.ts', './GameBundleManager.ts', './ErrorManager.ts', './Tools.ts', './FrameUIManager.ts', './MainDataManager.ts'], function (exports) {
  var _asyncToGenerator, _regeneratorRuntime, cclegacy, path, assetManager, SpriteFrame, NetWork, EGameCreateType, GameBundleManager, EErrorType, ErrorManager, Tools, FrameUIManager, MainDataManager;

  return {
    setters: [function (module) {
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
      path = module.path;
      assetManager = module.assetManager;
      SpriteFrame = module.SpriteFrame;
    }, function (module) {
      NetWork = module.NetWork;
    }, function (module) {
      EGameCreateType = module.EGameCreateType;
      GameBundleManager = module.GameBundleManager;
    }, function (module) {
      EErrorType = module.EErrorType;
      ErrorManager = module.ErrorManager;
    }, function (module) {
      Tools = module.Tools;
    }, function (module) {
      FrameUIManager = module.FrameUIManager;
    }, function (module) {
      MainDataManager = module.MainDataManager;
    }],
    execute: function () {
      cclegacy._RF.push({}, "0c0a7kXlFlPm5pCn8qLVyKs", "StaticAssetsManager", undefined);
      /**从远端获取和存到远端的资源数据 */

      /**本地存储的资源格式 */

      /**加载状态 */


      var EAssetsLoadState = /*#__PURE__*/function (EAssetsLoadState) {
        EAssetsLoadState[EAssetsLoadState["Loading"] = 0] = "Loading";
        EAssetsLoadState[EAssetsLoadState["Complete"] = 1] = "Complete";
        return EAssetsLoadState;
      }(EAssetsLoadState || {});
      /**
       * 加载结果
       */


      var ELoadResult = /*#__PURE__*/function (ELoadResult) {
        ELoadResult[ELoadResult["success"] = 0] = "success";
        ELoadResult[ELoadResult["fail"] = 1] = "fail";
        ELoadResult[ELoadResult["pause"] = 2] = "pause";
        return ELoadResult;
      }(ELoadResult || {});
      /**单个文件加载完成的数据 */

      /**游戏静态资源 文件资源+json资源 */


      var StaticAssetsManagerClass = /*#__PURE__*/function () {
        function StaticAssetsManagerClass() {
          /** key->url   存储所有加载过的资源， 每次加载之前先增加引用计数，失败再减一次，为0就销毁 */
          this.fileAssetsMap = new Map();
          /**key: gameId   */

          this.completeAllAssetsMap = new Map();
          /**key: gameId   */

          this.loadingAssetsMap = new Map();
          this.curLoadAssetsData = null;
          /**completeAssetsMap最大缓存数量  以gameId为key*/

          this._maxCacheNum = 3;
          /**最大同时下载数量 */

          this._maxLoadingNum = 3;
        }

        StaticAssetsManagerClass.getInstance = function getInstance() {
          if (null === this._instance) {
            this._instance = new StaticAssetsManagerClass();
          }

          return this._instance;
        };

        var _proto = StaticAssetsManagerClass.prototype;
        /**
         * 
         * @param gameId 
         * @param createType 
         * @param callBack 成功
         * @returns 
         */

        _proto.tryCreateNewLoadAssetsTask = /*#__PURE__*/function () {
          var _tryCreateNewLoadAssetsTask = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(gameId, createType, isSuccess) {
            var _this = this;

            var loadingAssetsData, errInfo;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  if (!(NetWork.isOpenTeacherPanel && !gameId)) {
                    _context.next = 3;
                    break;
                  }

                  isSuccess();
                  return _context.abrupt("return");

                case 3:
                  this.curLoadAssetsData = this.completeAllAssetsMap.get(gameId);
                  /**已经加载完成 */

                  if (!this.curLoadAssetsData) {
                    _context.next = 7;
                    break;
                  }

                  isSuccess();
                  return _context.abrupt("return");

                case 7:
                  this.curLoadAssetsData = this.loadingAssetsMap.get(gameId);

                  if (!this.curLoadAssetsData) {
                    _context.next = 10;
                    break;
                  }

                  return _context.abrupt("return");

                case 10:
                  loadingAssetsData = {
                    jsonData: null,
                    gameId: gameId,
                    loadState: EAssetsLoadState.Loading,
                    loadType: createType,
                    completeAssetsUrl: [],
                    completeAssetsMap: new Map()
                  };
                  this.curLoadAssetsData = loadingAssetsData;
                  this.loadingAssetsMap.set(gameId, loadingAssetsData);
                  errInfo = null;
                  /**获取离线json */

                  if (!MainDataManager.staticResUrl) {
                    _context.next = 20;
                    break;
                  }

                  _context.next = 17;
                  return this.getStaicConfigJson(loadingAssetsData.gameId).then(function (data) {
                    if (data && data.json) {
                      loadingAssetsData.jsonData = data.json;
                    }
                  })["catch"](function (err) {
                    errInfo = err;
                  });

                case 17:
                  if (!(loadingAssetsData.gameId != this.curLoadAssetsData.gameId)) {
                    _context.next = 20;
                    break;
                  }

                  this.filesLoadEnd(ELoadResult.pause, loadingAssetsData, isSuccess, errInfo);
                  return _context.abrupt("return");

                case 20:
                  if (loadingAssetsData.jsonData) {
                    _context.next = 23;
                    break;
                  }

                  _context.next = 23;
                  return this.getServeConfigJson(loadingAssetsData.gameId).then(function (json) {
                    if (json) {
                      loadingAssetsData.jsonData = json;
                    } else {
                      errInfo = '获取在线json失败';
                    }
                  })["catch"](function (err) {
                    errInfo = err;
                  });

                case 23:
                  if (!(loadingAssetsData.gameId != this.curLoadAssetsData.gameId)) {
                    _context.next = 28;
                    break;
                  }

                  this.filesLoadEnd(ELoadResult.pause, loadingAssetsData, isSuccess, errInfo);
                  return _context.abrupt("return");

                case 28:
                  if (loadingAssetsData.jsonData) {
                    _context.next = 31;
                    break;
                  }
                  /**加载失败 isPreload*/
                  //this.curLoadAssetsData.loadType


                  this.filesLoadEnd(ELoadResult.fail, loadingAssetsData, isSuccess, errInfo);
                  return _context.abrupt("return");

                case 31:
                  this.startLoadFilesAsset(loadingAssetsData, function (result, err) {
                    _this.filesLoadEnd(result, loadingAssetsData, isSuccess, err);
                  });

                case 32:
                case "end":
                  return _context.stop();
              }
            }, _callee, this);
          }));

          function tryCreateNewLoadAssetsTask(_x, _x2, _x3) {
            return _tryCreateNewLoadAssetsTask.apply(this, arguments);
          }

          return tryCreateNewLoadAssetsTask;
        }()
        /**资源加载结束 */
        ;

        _proto.filesLoadEnd = function filesLoadEnd(result, loadingAssetsData, isSuccess, err) {
          var _this2 = this;

          this.loadingAssetsMap["delete"](this.curLoadAssetsData.gameId);
          this.curLoadAssetsData.loadState = EAssetsLoadState.Complete;
          var errorInfo = {
            type: EErrorType.LOAD_REMOTE_ASSETS_ERROR,
            info: err
          };

          if (result == ELoadResult.success) {
            this.curLoadAssetsData.loadState = EAssetsLoadState.Complete;
            this.completeAllAssetsMap.set(this.curLoadAssetsData.gameId, this.curLoadAssetsData);

            if (this.completeAllAssetsMap.size > this._maxCacheNum) {
              var releaseNum = this.completeAllAssetsMap.size - this._maxCacheNum;
              this.completeAllAssetsMap.forEach(function (assetsInfo, cfgId) {
                if (releaseNum > 0 && _this2.canRelease(cfgId)) {
                  _this2.releaseFileAssetsByArrKey(assetsInfo.completeAssetsUrl);

                  _this2.completeAllAssetsMap["delete"](cfgId);

                  releaseNum--;
                }
              });
            }

            isSuccess();
          } else if (result == ELoadResult.pause) {
            /**加载中被切走 */
            this.releaseFileAssetsByArrKey(loadingAssetsData.completeAssetsUrl);
          } else if (result == ELoadResult.fail) {
            ErrorManager.throwError(errorInfo, EGameCreateType.PRELOAD === this.curLoadAssetsData.loadType);
            /**加载失败 */

            this.releaseFileAssetsByArrKey(loadingAssetsData.completeAssetsUrl);
          }
        };

        _proto.canRelease = function canRelease(gameId) {
          var preloadPanelMap = FrameUIManager.getPreloadPublicPanelMap();

          if (preloadPanelMap.has(gameId)) {
            return false;
          }

          if (GameBundleManager.runGameData && gameId == GameBundleManager.runGameData.gameId || GameBundleManager.nextPageGameData && gameId == GameBundleManager.nextPageGameData.gameId) {
            return false;
          }

          return true;
        };

        _proto.startLoadFilesAsset = function startLoadFilesAsset(loadingAssetsData, callBack) {
          var _this3 = this;

          var serverFilesData = loadingAssetsData.jsonData['upLoadFilesData'];

          if (!serverFilesData || Object.keys(serverFilesData).length == 0) {
            callBack(ELoadResult.success);
            return;
          }
          /**所有需要下载的资源的key */


          var allFilekeys = Object.keys(serverFilesData);
          /**已完成数量 */

          var completeNum = 0;
          /**下载中的 */

          var loadingArr = allFilekeys.slice(0, this._maxLoadingNum);
          /**需要下载的 */

          var preLoadNum = loadingArr.length;
          /**加载暂停、加载出错 */

          var isLoadPause = false,
              isLoadError = false;
          /**每加载成功往队列添加新的加载任务 */

          var addFile = function addFile() {
            /**没有加载完的话 补齐*/
            if (preLoadNum < allFilekeys.length && !isLoadError && !isLoadPause) {
              var addNum = _this3._maxLoadingNum - (preLoadNum - completeNum);
              addNum = addNum < allFilekeys.length ? addNum : allFilekeys.length;
              loadingArr = allFilekeys.slice(preLoadNum, preLoadNum + addNum);
              preLoadNum = preLoadNum + addNum;

              _this3.loadFileGroup(serverFilesData, loadingArr, loadEnd);
            }
          };
          /**检测是否需要暂停 */


          var checkIsPause = function checkIsPause() {
            if (loadingAssetsData.gameId != _this3.curLoadAssetsData.gameId) {
              isLoadPause = true;
            } else {
              isLoadPause = false;
            }
          };

          var loadEnd = function loadEnd(endData, err) {
            if (err === void 0) {
              err = null;
            }

            if (err) {
              isLoadError = true;
            } else {
              if (endData.asset && endData.fileName && endData.asset["name"] == "") {
                var names = endData.fileName.split(".");
                endData.asset.name = names[0];
              }

              loadingAssetsData.completeAssetsMap.set(endData.fileKey, endData);
              loadingAssetsData.completeAssetsUrl.push(endData.url);
              completeNum = completeNum + 1;
            }

            checkIsPause();
            addFile();
            /**加载流程停止 */

            if (completeNum == preLoadNum) {
              if (isLoadPause) {
                callBack(ELoadResult.pause);
              } else if (isLoadError) {
                callBack(ELoadResult.fail, err);
              } else if (completeNum == allFilekeys.length) {
                callBack(ELoadResult.success);
              } // else {
              //     callBack(ELoadResult.fail);
              // }

            }
          };

          this.loadFileGroup(serverFilesData, loadingArr, loadEnd);
        }
        /**没有gameId的情况，本地new的配置里如果有远端资源去下载 */
        ;

        _proto.loadFilesAssetByEditorData = function loadFilesAssetByEditorData(serverFilesData, callBack) {
          var _this4 = this;

          var completeAssetsMap = new Map();

          if (!serverFilesData || Object.keys(serverFilesData).length == 0) {
            callBack(completeAssetsMap);
            return;
          }

          serverFilesData = Tools.deepCopy(serverFilesData);
          /**所有需要下载的资源的key */

          var allFilekeys = Object.keys(serverFilesData);
          /**已完成数量 */

          var completeNum = 0;
          /**下载中的 */

          var loadingArr = allFilekeys.slice(0, this._maxLoadingNum);
          /**需要下载的 */

          var preLoadNum = loadingArr.length;
          /**加载暂停、加载出错 */

          var isLoadError = false;
          /**每加载成功往队列添加新的加载任务 */

          var addFile = function addFile() {
            /**没有加载完的话 补齐*/
            if (preLoadNum < allFilekeys.length && !isLoadError) {
              var addNum = _this4._maxLoadingNum - (preLoadNum - completeNum);
              addNum = addNum < allFilekeys.length ? addNum : allFilekeys.length;
              loadingArr = allFilekeys.slice(preLoadNum, preLoadNum + addNum);
              preLoadNum = preLoadNum + addNum;

              _this4.loadFileGroup(serverFilesData, loadingArr, loadEnd);
            }
          };

          var loadEnd = function loadEnd(endData, err) {
            if (err) {
              isLoadError = true;
            } else {
              completeAssetsMap.set(endData.fileKey, endData.asset);
              completeNum = completeNum + 1;
            }

            addFile();
            /**加载流程停止 */

            if (completeNum == preLoadNum) {
              if (isLoadError) {
                callBack(null);
              } else if (completeNum == allFilekeys.length) {
                callBack(completeAssetsMap);
              }
            }
          };

          this.loadFileGroup(serverFilesData, loadingArr, loadEnd);
        }
        /**分组加载 */
        ;

        _proto.loadFileGroup = function loadFileGroup(serverFilesData, loadingArr, loadEnd) {
          for (var i = 0; i < loadingArr.length; i++) {
            var fileKey = loadingArr[i];
            var loadFileData = {
              fileName: serverFilesData[fileKey].fileName,
              url: serverFilesData[fileKey].url,
              fileKey: fileKey,
              asset: null
            };

            if (MainDataManager.staticResUrl) {
              var fileName = path.basename(loadFileData.url);
              loadFileData.staticUrl = path.join(MainDataManager.staticResUrl, fileName);
            }

            this.loadFile(loadFileData, loadEnd);
          }
        }
        /**加载单个文件 */
        ;

        _proto.loadFile = function loadFile(waitLoadFileData, loadEnd) {
          var _this5 = this;

          var loadAssetData = null;
          /**没有离线地址或者离线加载失败走在线加载 */

          var downLoadFileByUrl = function downLoadFileByUrl(waitLoadFileData) {
            _this5.addAssetFileDataByUrl(waitLoadFileData.url, waitLoadFileData);

            loadAssetData = _this5.fileAssetsMap.get(waitLoadFileData.url);

            _this5.downLoadFileByUrl(loadAssetData).then(function () {
              loadEnd(loadAssetData);
            })["catch"](function (err) {
              _this5.decRef(waitLoadFileData.url);

              loadEnd(loadAssetData, {
                isErr: true,
                err: err
              });
            });
          };

          if (waitLoadFileData.staticUrl) {
            this.addAssetFileDataByUrl(waitLoadFileData.staticUrl, waitLoadFileData);
            loadAssetData = this.fileAssetsMap.get(waitLoadFileData.staticUrl);
            this.downLoadFileByStaticUrl(loadAssetData).then(function () {
              loadEnd(loadAssetData);
            })["catch"](function (err) {
              _this5.decRef(waitLoadFileData.staticUrl);

              downLoadFileByUrl(waitLoadFileData);
            });
          } else {
            downLoadFileByUrl(waitLoadFileData);
          }
        }
        /**通过url添加开始下载的资源到map */
        ;

        _proto.addAssetFileDataByUrl = function addAssetFileDataByUrl(key, waitLoadFileData) {
          if (!this.fileAssetsMap.has(key)) {
            this.fileAssetsMap.set(key, {
              fileName: waitLoadFileData.fileName,
              url: waitLoadFileData.url,
              staticUrl: waitLoadFileData.staticUrl,
              fileKey: waitLoadFileData.fileKey,
              asset: null,
              refcount: 0
            });
          }

          this.addRef(key);
        }
        /**获取离线地址对应的配置文件json */
        ;

        _proto.getStaicConfigJson = /*#__PURE__*/function () {
          var _getStaicConfigJson = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(gameId) {
            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  return _context2.abrupt("return", new Promise(function (resolve, reject) {
                    var jsonPath = path.join(MainDataManager.staticResUrl, gameId, gameId + ".json");
                    assetManager.loadRemote(jsonPath, {
                      maxRetryCount: 0
                    }, function (err, json) {
                      if (!err) {
                        // GameMsg.reportAliLog(AliLogMsgType.staticAssetsLoad, { msg: "配置文件-离线-成功", jsonPath: jsonPath });
                        return resolve(json);
                      } else {
                        // GameMsg.reportAliLog(AliLogMsgType.staticAssetsLoad, { msg: "配置文件-离线-失败", err: err, jsonPath: jsonPath });
                        return resolve(null);
                      }
                    });
                  }));

                case 1:
                case "end":
                  return _context2.stop();
              }
            }, _callee2);
          }));

          function getStaicConfigJson(_x4) {
            return _getStaicConfigJson.apply(this, arguments);
          }

          return getStaicConfigJson;
        }()
        /**通过远端地址获取配置文件 */
        ;

        _proto.getServeConfigJson = /*#__PURE__*/function () {
          var _getServeConfigJson = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(gameId) {
            return _regeneratorRuntime().wrap(function _callee3$(_context3) {
              while (1) switch (_context3.prev = _context3.next) {
                case 0:
                  return _context3.abrupt("return", NetWork.getQuestionData(gameId));

                case 1:
                case "end":
                  return _context3.stop();
              }
            }, _callee3);
          }));

          function getServeConfigJson(_x5) {
            return _getServeConfigJson.apply(this, arguments);
          }

          return getServeConfigJson;
        }()
        /**
         * 下载单个文件
         * @returns 
         */
        ;

        _proto.downLoadFileByUrl = /*#__PURE__*/function () {
          var _downLoadFileByUrl = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(fileData) {
            return _regeneratorRuntime().wrap(function _callee4$(_context4) {
              while (1) switch (_context4.prev = _context4.next) {
                case 0:
                  return _context4.abrupt("return", new Promise(function (resolve, reject) {
                    var fileType = path.extname(fileData.fileName);
                    var isImg = false;

                    if (fileType == '.png' || fileType == '.jpg' || fileType == '.jpeg') {
                      isImg = true;
                    }

                    if (isImg) {
                      assetManager.loadRemote(fileData.url, {
                        maxRetryCount: 2
                      }, function (err, asset) {
                        if (!err) {
                          fileData.asset = SpriteFrame.createWithImage(asset);
                          return resolve(true);
                        } else {
                          return reject(false);
                        }
                      }); // fetch(waitLoadFileData.url)
                      //     .then(response => response.blob())
                      //     .then(blob => {
                      //         const url = URL.createObjectURL(blob);
                      //         assetManager.loadRemote(url, {
                      //             maxRetryCount: 2,
                      //         }, (err, asset: ImageAsset) => {
                      //             if (!err) {
                      //                 waitLoadFileData.asset = asset;
                      //                 return resolve(true);
                      //             }
                      //             else {
                      //                 return reject(false);
                      //             }
                      //         })
                      //         // let img = new Image();
                      //         // img.src = url;
                      //         // img.onload = () => {
                      //         //     const spriteFrame = SpriteFrame.createWithImage(img);
                      //         //     waitLoadFileData.asset = spriteFrame;
                      //         //     return resolve([serverFileData.url, waitLoadFileData]);
                      //         // }
                      //         // img.onerror = (err) => {
                      //         //     return reject(false);
                      //         // }
                      //     }).catch((err) => {
                      //         return reject(err);
                      //     });
                    } else {
                      assetManager.loadRemote(fileData.url, {
                        maxRetryCount: 2
                      }, function (err, asset) {
                        if (!err) {
                          fileData.asset = asset;
                          return resolve(true);
                        } else {
                          return reject(err);
                        }
                      });
                    }
                  }));

                case 1:
                case "end":
                  return _context4.stop();
              }
            }, _callee4);
          }));

          function downLoadFileByUrl(_x6) {
            return _downLoadFileByUrl.apply(this, arguments);
          }

          return downLoadFileByUrl;
        }()
        /**通过离线地址下载文件 */
        ;

        _proto.downLoadFileByStaticUrl = /*#__PURE__*/function () {
          var _downLoadFileByStaticUrl = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(fileData) {
            var fileType, isImg, fileName, fileUrl;
            return _regeneratorRuntime().wrap(function _callee5$(_context5) {
              while (1) switch (_context5.prev = _context5.next) {
                case 0:
                  fileType = path.extname(fileData.url);
                  isImg = false;

                  if (fileType == '.png' || fileType == '.jpg' || fileType == '.jpeg') {
                    isImg = true;
                  }

                  fileName = path.basename(fileData.url);
                  fileUrl = path.join(MainDataManager.staticResUrl, fileName);
                  return _context5.abrupt("return", new Promise(function (resolve, reject) {
                    assetManager.loadRemote(fileUrl, {
                      maxRetryCount: 0
                    }, function (err, asset) {
                      if (!err) {
                        if (isImg) {
                          var spriteFrame = SpriteFrame.createWithImage(asset);
                          fileData.asset = spriteFrame;
                          return resolve(true);
                        } else {
                          fileData.asset = asset;
                          return resolve(true);
                        }
                      } else {
                        return reject(false);
                      }
                    });
                  }));

                case 6:
                case "end":
                  return _context5.stop();
              }
            }, _callee5);
          }));

          function downLoadFileByStaticUrl(_x7) {
            return _downLoadFileByStaticUrl.apply(this, arguments);
          }

          return downLoadFileByStaticUrl;
        }()
        /**
         * 删除资源
         * @param releaseFileArr 需要删除的资源url 
         * @returns 
         */
        ;

        _proto.releaseFileAssetsByArrKey = function releaseFileAssetsByArrKey(releaseFileArr) {
          var _this6 = this;

          if (releaseFileArr === void 0) {
            releaseFileArr = null;
          }

          if (!releaseFileArr || releaseFileArr.length == 0) return;
          releaseFileArr.forEach(function (key) {
            _this6.decRef(key);
          });
        }
        /**
         * 引用计数减1
         * @param key 
         */
        ;

        _proto.decRef = function decRef(key) {
          if (this.fileAssetsMap.has(key)) {
            var fileAsset = this.fileAssetsMap.get(key);
            fileAsset.refcount--;

            if (fileAsset.refcount <= 0) {
              fileAsset.asset && assetManager.releaseAsset(fileAsset.asset);
              fileAsset.asset.destroy;
              this.fileAssetsMap["delete"](key);
            }
          }
        }
        /**
         * 引用计数加1
         * @param key 
         */
        ;

        _proto.addRef = function addRef(key) {
          if (this.fileAssetsMap.has(key)) {
            var fileAsset = this.fileAssetsMap.get(key);
            fileAsset.refcount++;
          }
        }
        /**
         * 获取编辑器数据
         */
        ;

        _proto.getEditorData = function getEditorData(gameId) {
          var data = this.completeAllAssetsMap.get(gameId);

          if (data) {
            return data.jsonData || {};
          }

          return {};
        }
        /**
         * 获取编辑器远端资源
         */
        ;

        _proto.getAssetsMap = function getAssetsMap(gameId) {
          var data = this.completeAllAssetsMap.get(gameId);

          if (data) {
            return data.completeAssetsMap;
          }

          return new Map();
        };

        _proto.getCurGameAssetsMap = function getCurGameAssetsMap() {
          return this.curLoadAssetsData.completeAssetsMap;
        };

        return StaticAssetsManagerClass;
      }();

      StaticAssetsManagerClass._instance = null;
      var StaticAssetsManager = exports('StaticAssetsManager', StaticAssetsManagerClass.getInstance());

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Tools.ts", ['cc', './NetWork.ts'], function (exports) {
  var cclegacy, Vec3, tween;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Vec3 = module.Vec3;
      tween = module.tween;
    }, null],
    execute: function () {
      cclegacy._RF.push({}, "8c9926FhnVH2Z4Gs2ZXOlDV", "Tools", undefined);
      /**美术提供的位移动画参数 */


      var ArtMoveParam = exports('ArtMoveParam',
      /**
      * @param t 时刻，ms
      * @param p 位置
      */
      function ArtMoveParam(t, p) {
        /**时刻，ms */
        this.time = 0;
        /**位置 */

        this.pos = Vec3.ZERO;
        this.time = t;
        this.pos = p;
      });
      var Tools = exports('Tools', /*#__PURE__*/function () {
        function Tools() {}
        /**
         * 播放spine动画
         * @param {*} sp_Skeleton 动画文件
         * @param {*} animName 动作名称
         * @param {*} loop 是否循环
         * @param {*} callback 播放完毕回调
         */


        Tools.playSpine = function playSpine(sp_Skeleton, animName, loop, callback) {
          if (callback === void 0) {
            callback = null;
          } // sp_Skeleton.premultipliedAlpha=false;//这样设置在cocos creator中才能有半透明效果
          // let spine = this.node.getComponent(sp.Skeleton);


          var track = sp_Skeleton.setAnimation(0, animName, loop);

          if (track) {
            // 注册动画的结束回调
            sp_Skeleton.setCompleteListener(function (trackEntry) {
              var name = trackEntry.animation ? trackEntry.animation.name : '';

              if (name === animName && callback) {
                callback(); // 动画结束后执行自己的逻辑
              }
            });
          }
        } //参数获取
        ;

        Tools.getQueryVariable = function getQueryVariable(variable) {
          var query = window.location.href;
          var vars = query.split('?');
          if (vars.length < 2) return false;
          var vars = vars[1].split('&');

          for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');

            if (pair[0] == variable) {
              return pair[1];
            }
          }

          return false;
        }
        /**
         * 使节点直接运行美术提供的位移动画参数，
         * (节点当前位置对应美术参数列表最后一个参数位置，
         * 函数内部会做相对位置的处理)
         * @param node
         * @param params
         * @param endCbk
         */
        ;

        Tools.runArtMoveSequence = function runArtMoveSequence(node, params, endCbk) {
          var _tween;

          if (endCbk === void 0) {
            endCbk = null;
          }

          var nodeOriPos = node.position; //节点实际坐标与美术参数坐标的差

          var gapPos = nodeOriPos.subtract(params[params.length - 1].pos);

          function transArtPosToNodePos(artPos) {
            return artPos.add(gapPos);
          }

          node.setPosition(transArtPosToNodePos(params[0].pos));

          if (params.length <= 1) {
            if (endCbk) endCbk();
            return;
          }

          var tweenArray = [];

          for (var i = 1; i < params.length - 1; i++) {
            var duration = (params[i].time - params[i - 1].time) * 0.001;
            var p = transArtPosToNodePos(params[i].pos);
            tweenArray.push(tween(node).to(duration, {
              position: new Vec3(p.x, p.y, 0)
            }));
          }

          if (endCbk) {
            tweenArray.push(tween(node).call(endCbk));
          }

          (_tween = tween(node)).sequence.apply(_tween, tweenArray).start();
        }
        /**获取当前时间戳，毫秒 */
        ;

        Tools.getNowTimeMS = function getNowTimeMS() {
          return new Date().getTime();
        }
        /**获取当前时间戳，秒 */
        ;

        Tools.getNowTimeS = function getNowTimeS() {
          return Math.floor(new Date().getTime() * 0.001);
        }
        /**
         * 格式化时间， eg: 100 ->  '01:40'
         * @param time 时长，秒
         */
        ;

        Tools.getFormatTime = function getFormatTime(time) {
          var min = Math.floor(time / 60);

          if (min < 10) {
            min = '0' + min;
          }

          var sec = time % 60;

          if (sec < 10) {
            sec = '0' + sec;
          }

          return min + ':' + sec;
        };

        Tools.removeDuplicate = function removeDuplicate(str1, str2) {
          var index = str1.lastIndexOf(str2);
          return index !== -1 ? str1.substring(0, index) : str1;
        }
        /**
         * 
         * @param url1 
         * @param url2 
         * @returns 替换url的域名为url2
         */
        ;

        Tools.replaceCosUrl = function replaceCosUrl(oldUrl, newDomain) {
          var oldDomain = oldUrl.replace(/^https?:\/\/([^/]+).*/, '$1'); // 从原始 URL 中提取域名

          var newUrl = oldUrl.replace(new RegExp("^https?:\\/\\/" + oldDomain, 'i'), "" + newDomain);
          console.log(newUrl);
          return newUrl;
        } //生成随机字符串
        ;

        Tools.randomString = function randomString(len) {
          if (len === void 0) {
            len = 14;
          }

          var baseStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefjhijklmnopqrstuvwxyz1234567890";
          var str = '';

          for (var i = 0; i < len; ++i) {
            str += baseStr.charAt(Math.floor(Math.random() * baseStr.length));
          }

          return str;
        };

        Tools.deepCopy = function deepCopy(obj) {
          if (obj === null || typeof obj !== 'object') {
            return obj;
          }

          if (Array.isArray(obj)) {
            return obj.map(Tools.deepCopy);
          }

          var result = {};

          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              result[key] = Tools.deepCopy(obj[key]);
            }
          }

          return result;
        };

        Tools.deepCopyMap = function deepCopyMap(originalMap) {
          var _this = this;

          var newMap = new Map();
          originalMap.forEach(function (value, key) {
            // 深拷贝键和值
            var copiedKey = _this.deepCopy(key);

            var copiedValue = value instanceof Map ? _this.deepCopyMap(value) : _this.deepCopy(value); // 将拷贝后的键值对添加到新的 Map 对象中

            newMap.set(copiedKey, copiedValue);
          });
          return newMap;
        };

        Tools.arraysEqual = function arraysEqual(a, b) {
          if (a === b) return true;
          if (a == null || b == null) return false;
          if (a.length !== b.length) return false;

          for (var i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
          }

          return true;
        } //获取矫正后的类名
        ;

        Tools.getFixedClassName = function getFixedClassName(className) {
          return className;
        }
        /**
        * 绝对获取节点上的组件，如果不存在就添加一个
        * @param {Node} node 
        * @param {Component} type 
        */
        ;

        Tools.getComponentAbsolutely = function getComponentAbsolutely(node, type) {
          var comp = node.getComponent(type);

          if (!comp) {
            comp = node.addComponent(type);
          }

          return comp;
        };

        return Tools;
      }());

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/UIHelp.ts", ['cc', './FrameMsgType.ts', './FrameListenerManager.ts'], function (exports) {
  var cclegacy, FrameMsgType, FrameListenerManager;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      FrameMsgType = module.FrameMsgType;
    }, function (module) {
      FrameListenerManager = module.FrameListenerManager;
    }],
    execute: function () {
      cclegacy._RF.push({}, "c44e6cLg85JzaIFNvBdsH7x", "UIHelp", undefined);

      var UIHelpClass = /*#__PURE__*/function () {
        function UIHelpClass() {}

        UIHelpClass.getInstance = function getInstance() {
          if (!this._instance) {
            this._instance = new UIHelpClass();
          }

          return this._instance;
        }
        /**
         * 显示加载界面
         */
        ;

        var _proto = UIHelpClass.prototype;

        _proto.showFrameLoadingUI = function showFrameLoadingUI() {
          FrameListenerManager.dispatch(FrameMsgType.UI_FRAME_LOADING, true);
        }
        /**
         * 隐藏加载界面
         */
        ;

        _proto.closeFrameLoadingUI = function closeFrameLoadingUI() {
          FrameListenerManager.dispatch(FrameMsgType.UI_FRAME_LOADING, false);
        }
        /**
         * 显示错误提示界面
         */
        ;

        _proto.showFrameErrorTips = function showFrameErrorTips(desc, title, tips) {
          if (title === void 0) {
            title = '当前出现异常！';
          }

          if (tips === void 0) {
            tips = '给您带来的不便，敬请谅解！';
          }

          FrameListenerManager.dispatch(FrameMsgType.UI_FRAME_ERROR_TIPS, true, desc, title, tips);
        }
        /**
         * 隐藏错误提示界面
         */
        ;

        _proto.closeFrameErrorTips = function closeFrameErrorTips() {
          FrameListenerManager.dispatch(FrameMsgType.UI_FRAME_ERROR_TIPS, false);
        };

        return UIHelpClass;
      }();

      UIHelpClass._instance = null;
      var UIHelp = exports('UIHelp', UIHelpClass.getInstance());

      cclegacy._RF.pop();
    }
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/frame', 'chunks:///_virtual/frame'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});