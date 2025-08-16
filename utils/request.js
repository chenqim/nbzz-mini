import api from './api'
import {
  apiPrefix
} from './config'
const app = getApp()

/**
 * edit by puppetsheep:
 * 封装 wx 原生请求方法，统一打印响应日志
 */
function request(opts = {}) {
  return new Promise(function (resolve, reject) {
    const that = this
    const {
      loading = true
    } = opts
    const {
      toShow = false
    } = opts
    const {
      method = 'POST'
    } = opts
    const {
      url,
      data
    } = handleRestful(opts.url, opts.data)
    const token = wx.getStorageSync('token')
    if(loading){
      wx.showLoading({
        mask: true,
        title: '拼命加载中....'
      })
    }
    // console.log(loading)

    wx.request({
      url: apiPrefix + url,
      data,
      method,
      header: {
        "Auth-Token": `${token}`,
      },
      success: res => {
        // console.log(`请求【${method} ${url}】成功，响应数据：%o`, res)
        if(res.statusCode!=200){
          // 增加 token 过期自动续接逻辑
          if (res.data.code === 'A0230') {
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/index/index',
              })
            }, 1000)
            initialization(toShow,loading)
            return resolve(res)
          } else {
            if(loading){
              wx.showToast({
                title: "电波无法到达，请稍后再试~",
                icon: 'none',
                duration: 2000
              })
            }
            initialization(toShow,loading)
            return resolve(res)
          }
        }
        console.log('request.js === ', res);
        if(res.header["Auth-Token"] && res.header["Auth-Token"]!=token){
          wx.setStorageSync('token', res.header["Auth-Token"])
        }
        if (res.data.code == '00000') {
          initialization(toShow,loading)
          return resolve(res)
        } else {
          if (res.data.code == '0'||res.data.code == '-1') {
            if(toShow){
              initialization(toShow,loading)
              return resolve(res)
            }else{
              initialization(toShow,loading)
              return wx.showToast({
                title: res.data.message + '',
                icon: 'none',
                duration: 2000
              })
            }
          } else if(res.data.code == '-2'||res.data.code == '-4'){
            if(toShow){
              initialization(toShow,loading)
               return resolve(res)
            }else{
              initialization(toShow,loading)
            return wx.showModal({
              title: '提示',
              content: res.data.message+'',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  return wx.redirectTo({
                    url: '/pages/login/home'
                  })
                }
              }
            })
          }
          }else if(res.data.code == '-3'){
            initialization(toShow,loading)
            return wx.showModal({
              title: '提示',
              content: res.data.message+'',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  // return wx.navigateBack({delta:1})
                }
              }
            })
          }else{
            initialization(toShow,loading)
             return wx.showToast({
              title: res.data.message + '',
              icon: 'none',
              duration: 2000
            })
          }
        }
       return initialization(toShow,loading)
      },
      fail: err => {
        console.log(`请求【${opts.method} ${url}】失败，响应数据：%o`, err)
        // wx.hideLoading();
        if(loading){
          wx.showToast({
            title: "网络开小差了，请稍后再试",
            icon: 'none',
            duration: 2000
          })
        }
        setTimeout(()=>{
          initialization(toShow,loading)
        },2000)
        return reject(err)
      }
    })
  })
}

/**
 * edit by puppetsheep
 * 在return之前初始化预设值
 * 
 */
function initialization(toShow,loading,toast){
  toShow = false
  if(loading){
    wx.hideLoading({
      fail:function(err){
        console.log(err)
      }
    });
  }
  loading = true
}

function uploadFile(filePath, url) {
  return new Promise(function (resolve, reject) {
    wx.uploadFile({
      filePath: filePath,
      name: 'file',
      url: url,
      header: {
        "Auth-Token": wx.getStorageSync('token'),
        'content-type': 'multipart/form-data'
      },
      success(res) {
        res = JSON.parse(res.data)
        console.log(res)
        if (res.code == 1) {
          return resolve(res)
        } else {
          if (res.code == '0'||res.code == '-1') {
              return wx.showToast({
                title: res.msg + '',
                icon: 'none',
                duration: 2000
              })
          } else if(res.code == '-2'||res.code == '-4'){
            return wx.showModal({
              title: '提示',
              content: res.msg+'',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  return wx.redirectTo({
                    url: '/pages/login/home'
                  })
                }
              }
            })
          }else if(res.code == '-3'){
            return wx.showModal({
              title: '提示',
              content: res.msg+'',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  // return wx.navigateBack({delta:1})
                }
              }
            })
          }
        }
        return resolve(res)
      },
      fail(err) {
        err = JSON.parse(err.data)
        // wx.hideLoading();
          wx.showToast({
            title: "网络开小差了，请稍后再试",
            icon: 'none',
            duration: 2000
          })
        return reject(err)
      }
    }).onProgressUpdate((res) => {
      wx.showLoading({
        title: '正在上传 '+ res.progress + '%',
        mask:true,
        duration:2000
      })
      console.log('上传进度', res.progress)
    })
  })
}

/**
 * edit by dkvirus:
 * 处理 restful 接口，示例：/user/{id}/stop/{xx}       参数为 { id: '1': xx: '2' }
 * 处理之后返回值    /user/1/stop/2
 */
function handleRestful(url, data = {}, isRemove = false) {
  for (const i in data) {
    if (url.indexOf(`{${i}}`) !== -1) {
      url = url.replace(`{${i}}`, data[i])
      if (isRemove === true) {
        delete data[i]
      }
    }
  }
  return {
    url,
    data
  }
}



module.exports = {
  request,
  uploadFile
}