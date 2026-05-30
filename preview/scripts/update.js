/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios');
const packageConfig = require('../package.json')
const rawArgv = process.argv.slice(2)
const args = require('minimist')(rawArgv)
const env = args.mode || 'test'
const { prefix, baseUrl } = require('./publish.config.json')[env]
const { v4: uuidv4 } = require('uuid');
const http = axios.create({
  baseURL: baseUrl
});
// 设置POST请求的body参数
const postData = {
  packageResourceType: 'common',
  customIdentityId: 'slidePreview',
  version: packageConfig.version,
  packOssPath: prefix + '/' + packageConfig.version
};
// 设置请求的配置，包括URL和请求头部等
const config = {
  method: 'post',
  url: '/classroom-slides/package-resources/create',
  headers: { 
    'Content-Type': 'application/json',
    online_trace_id: `slides_${uuidv4()}`
    // 如果需要的话，你可以在这里添加其他的请求头，比如认证令牌等
  },
  data: postData
};

// 发送POST请求
// 调用上传接口
http(config)
  .then(response => {
    console.log(response.data, '返回结果')
    if(response.data.code === 200) {
      const { id } = response.data.data
      const buildConfig = {
        method: 'post',
        url: `/classroom-slides/package-resources/${id}/pack`,
        headers: { 
          'Content-Type': 'application/json',
          online_trace_id: `slides_${uuidv4()}`
          // 如果需要的话，你可以在这里添加其他的请求头，比如认证令牌等
        },
      }
      // 调用打包接口
      http(buildConfig).then(response => {
        console.log(response.data)
      })
    }
    
  })
  .catch(function (error) {
    console.log(error);
  });
