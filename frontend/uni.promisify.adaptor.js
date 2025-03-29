// 在普通浏览器环境中模拟uni API的适配器
// 这个文件用于在webpack环境中模拟基本的uni接口

// 创建全局对象
const globalContext = typeof global !== 'undefined' ? global : (typeof window !== 'undefined' ? window : {});

// 创建uni对象
const uni = {
  // 导航相关
  navigateTo(options) {
    console.log('模拟uni.navigateTo:', options.url);
    if (typeof options.success === 'function') {
      options.success();
    }
  },
  
  redirectTo(options) {
    console.log('模拟uni.redirectTo:', options.url);
    if (typeof globalContext.location !== 'undefined') {
      globalContext.location.hash = options.url.replace(/^\//, '#/');
    }
    if (typeof options.success === 'function') {
      options.success();
    }
  },
  
  reLaunch(options) {
    console.log('模拟uni.reLaunch:', options.url);
    if (typeof globalContext.location !== 'undefined') {
      globalContext.location.hash = options.url.replace(/^\//, '#/');
    }
    if (typeof options.success === 'function') {
      options.success();
    }
  },
  
  // 存储相关
  setStorageSync(key, data) {
    try {
      if (typeof globalContext.localStorage !== 'undefined') {
        globalContext.localStorage.setItem(key, typeof data === 'object' ? JSON.stringify(data) : data);
      } else {
        // APP环境下的存储实现
        console.log('APP环境存储:', key, data);
      }
    } catch (e) {
      console.error('setStorageSync error:', e);
    }
  },
  
  getStorageSync(key) {
    try {
      if (typeof globalContext.localStorage !== 'undefined') {
        const data = globalContext.localStorage.getItem(key);
        if (data) {
          try {
            return JSON.parse(data);
          } catch (e) {
            return data;
          }
        }
      } else {
        // APP环境下的存储实现
        console.log('APP环境获取存储:', key);
      }
      return '';
    } catch (e) {
      console.error('getStorageSync error:', e);
      return '';
    }
  },
  
  removeStorageSync(key) {
    try {
      if (typeof globalContext.localStorage !== 'undefined') {
        globalContext.localStorage.removeItem(key);
      } else {
        // APP环境下的存储实现
        console.log('APP环境删除存储:', key);
      }
    } catch (e) {
      console.error('removeStorageSync error:', e);
    }
  },
  
  // 界面交互
  showToast(options) {
    console.log('模拟uni.showToast:', options.title);
    if (typeof globalContext.alert !== 'undefined') {
      globalContext.alert(options.title);
    }
    if (typeof options.success === 'function') {
      options.success();
    }
  },
  
  showLoading(options) {
    console.log('模拟uni.showLoading:', options.title);
    if (typeof options.success === 'function') {
      options.success();
    }
  },
  
  hideLoading() {
    console.log('模拟uni.hideLoading');
  },
  
  showModal(options) {
    console.log('模拟uni.showModal:', options.title, options.content);
    if (typeof globalContext.confirm !== 'undefined') {
      const result = globalContext.confirm(`${options.title}\n${options.content}`);
      if (typeof options.success === 'function') {
        options.success({
          confirm: result,
          cancel: !result
        });
      }
    }
  },

  // 权限相关
  getSetting(options) {
    console.log('模拟uni.getSetting');
    // 模拟权限设置
    const setting = {
      authSetting: {
        'scope.userInfo': true,
        'scope.userLocation': true,
        'scope.camera': true,
        'scope.record': true,
        'scope.writePhotosAlbum': true
      }
    };
    
    if (typeof options.success === 'function') {
      options.success(setting);
    }
    return Promise.resolve(setting);
  },

  // 文件选择相关
  chooseFile(options) {
    console.log('模拟uni.chooseFile:', options);
    
    // 创建一个隐藏的文件输入框
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    
    // 设置文件类型过滤
    if (options.extension) {
      const accept = options.extension.map(ext => '.' + ext).join(',');
      input.accept = accept;
    }
    
    // 设置多选
    if (options.count > 1) {
      input.multiple = true;
    }
    
    // 监听文件选择事件
    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      const tempFiles = files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }));
      
      const tempFilePaths = files.map(file => URL.createObjectURL(file));
      
      if (typeof options.success === 'function') {
        options.success({
          tempFiles,
          tempFilePaths
        });
      }
    };
    
    // 触发文件选择
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  },

  // 录音相关
  getRecorderManager() {
    console.log('模拟uni.getRecorderManager');
    return {
      onStart: (callback) => {
        console.log('录音开始');
        if (typeof callback === 'function') callback();
      },
      onStop: (callback) => {
        console.log('录音结束');
        if (typeof callback === 'function') {
          callback({
            tempFilePath: 'mock_recording.mp3'
          });
        }
      },
      onError: (callback) => {
        console.log('录音错误');
        if (typeof callback === 'function') {
          callback({
            errMsg: '录音失败'
          });
        }
      },
      start: (options) => {
        console.log('开始录音:', options);
      },
      stop: () => {
        console.log('停止录音');
      }
    };
  },

  // 音频相关
  createInnerAudioContext() {
    console.log('模拟uni.createInnerAudioContext');
    return {
      src: '',
      onPlay: (callback) => {
        if (typeof callback === 'function') callback();
      },
      onEnded: (callback) => {
        if (typeof callback === 'function') callback();
      },
      onError: (callback) => {
        if (typeof callback === 'function') {
          callback({
            errMsg: '播放失败'
          });
        }
      },
      play: () => {
        console.log('播放音频');
      },
      destroy: () => {
        console.log('销毁音频上下文');
      }
    };
  }
};

// 设置uni对象到全局上下文
if (typeof globalContext.uni === 'undefined') {
  globalContext.uni = uni;
}

export default uni;