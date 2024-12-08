const app = getApp()
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gradeMap: {
      middle: '普通',
      high: '紧急'
    },
    gradeTypeMap: {
      middle: 'success',
      high: 'danger'
    },
    typeMap: {
      produce: '制造',
      maintenance: '维修'
    },
    statusMap: {
      create: '已创建',
      receive: '已认领',
      producing: '生产中',
      completed: '已完成'
    },
    statusTypeMap: {
      create: 'primary',
      receive: 'danger',
      producing: 'warning',
      completed: 'success'
    },
    instance: {},
    loading: false,
    userInfo: null,
    options: null
  },

  queryDetail(id) {
    let loading = this.data.loading
    return new Promise((resolve, reject) => {
      app.request({
        url: app.api.WORK_ORDER_DETAIL,
        loading: loading,
        data: {
          id
        }
      }).then(res => {
        return resolve(res)
      }).catch(err => {
        return reject(err)
      })
    })
  },

  queryStageDetail(code) {
    let loading = this.data.loading
    return new Promise((resolve, reject) => {
      app.request({
        url: app.api.STAGE_DETAIL,
        loading: loading,
        data: {
          code
        }
      }).then(res => {
        return resolve(res)
      }).catch(err => {
        return reject(err)
      })
    })
  },

  scanQRCode: function (e) {
    console.log('e>>>>', e)
    wx.scanCode({
      success: (res) => {
        console.log('QR CODE', res)
        this.queryStageDetail(res.result).then(result => {
          console.log('result >>>>>', result)
          if (result.data.code === '00000') {
            wx.navigateTo({
              url: `/pages/basics/stage/circle/circle?stageCode=${res.result}&stageId=${result.data.data.id}&stageName=${result.data.data.name}&workOrderId=${e.currentTarget.dataset.work}&workOrderName=${e.currentTarget.dataset.workName}&processId=${e.currentTarget.dataset.process}&processName=${e.currentTarget.dataset.processName}&processCount=${e.currentTarget.dataset.processCount}&type=${e.currentTarget.dataset.type}`,
            })
          } else {
            Toast(result.data.message)
          }
        })
        .then(() => {
          this.data.loading = false
        })
        .catch(err => {})
      }
    })
  },

  completeWorkOrder() {
    Toast('完结工单')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('on load >>>>>', options.id)
    this.queryDetail(options.id).then(res => {
      this.setData({
        instance: res.data.data,
        userInfo: app.globalData.user_info || null,
        options
      })
    })
    .then(() => {
      this.data.loading = false
    })
    .catch(err => {})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log("on show >>>>>")
    if (this.data.options) this.onLoad(this.data.options)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})