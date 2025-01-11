const app = getApp()
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
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
      executed: '待发货',
      completed: '已完成'
    },
    statusTypeMap: {
      create: 'primary',
      receive: 'danger',
      producing: 'warning',
      executed: 'primary',
      completed: 'success'
    },
    instance: {},
    loading: false,
    userInfo: null,
    options: null,
    show: false,
    count: 0,
    workOrderProcedureId: null,
    commentShow: false,
    comment: ''
  },

  clickComment() {
    this.setData({ commentShow: true, comment: this.data.instance.remark })
  },

  commentChange(e) {
    this.setData({
      comment: e.detail
    })
  },

  onCommentConfirm() {
    this.update(this.data.instance.id, this.data.comment).then(result => {
      console.log('result >>>>>', result)
      if (result.data.code === '00000') {
        Toast('修改成功')
        // 刷新
        if (this.data.options) this.onLoad(this.data.options)
      } else {
        Toast(result.data.message)
      }
    })
  },

  onCommentClose() {
    this.setData({ commentShow: false, comment: '' })
  },

  update(id, remark) {
    let loading = this.data.loading
    return new Promise((resolve, reject) => {
      app.request({
        url: app.api.UPDATE_REMARK,
        loading: loading,
        data: {
          id,
          remark
        }
      }).then(res => {
        return resolve(res)
      }).catch(err => {
        return reject(err)
      })
    })
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

  queryBelongStage(id) {
    let loading = this.data.loading
    return new Promise((resolve, reject) => {
      app.request({
        url: app.api.CHECK_STAGE,
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

  complete(count, workOrderProcedureId) {
    let loading = this.data.loading
    return new Promise((resolve, reject) => {
      app.request({
        url: app.api.COMPLETE_WORK_ORDER,
        loading: loading,
        data: {
          count,
          workOrderProcedureId
        }
      }).then(res => {
        return resolve(res)
      }).catch(err => {
        return reject(err)
      })
    })
  },

  checkStage(e) {
    this.queryBelongStage(e.currentTarget.dataset.id).then(result => {
      if (result.data.code === '00000') {
        const ins = result.data.data?.[0] || {}
        Dialog.alert({
          title: '所在中转区详情',
          messageAlign: 'left',
          message: `
            中转区编号：${ins.stagingArea.code}\n
            中转区名称：${ins.stagingArea.name}\n
            待提取数量：${ins.count}
          `,
        }).then(() => {
          // on close
        })
      } else {
        Toast(result.data.message)
      }
    })
  },

  extract: function (e) {
    wx.scanCode({
      success: (res) => {
        console.log('QR CODE', res)
        this.queryStageDetail(res.result).then(result => {
          console.log('result >>>>>', result)
          if (result.data.code === '00000') {
            wx.navigateTo({
              url: `/pages/basics/stage/submit/submit?stageCode=${res.result}&stageId=${result.data.data.id}&stageName=${result.data.data.name}&from=detail&workOrderId=${this.data.instance.id}&workOrderName=${this.data.instance.name}&processId=${e.currentTarget.dataset.process}&processName=${e.currentTarget.dataset.processName}&count=${e.currentTarget.dataset.count}`,
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

  scanQRCode: function (e) {
    console.log('e>>>>', e)
    wx.scanCode({
      success: (res) => {
        console.log('QR CODE', res)
        this.queryStageDetail(res.result).then(result => {
          console.log('result >>>>>', result)
          if (result.data.code === '00000') {
            wx.navigateTo({
              url: `/pages/basics/stage/circle/circle?stageCode=${res.result}&stageId=${result.data.data.id}&stageName=${result.data.data.name}&workOrderId=${e.currentTarget.dataset.work}&workOrderCode=${e.currentTarget.dataset.workCode}&workOrderName=${e.currentTarget.dataset.workName}&processId=${e.currentTarget.dataset.process}&processName=${e.currentTarget.dataset.processName}&processCount=${e.currentTarget.dataset.processCount}&type=${e.currentTarget.dataset.type}`,
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

  completeWorkOrder(e) {
    // Toast('完结工单')
    this.setData({ show: true, workOrderProcedureId: e.currentTarget.dataset.process })
  },

  stepperChange(event) {
    this.setData({
      count: event.detail
    })
  },

  onConfirm() {
    this.complete(this.data.count, this.data.workOrderProcedureId).then(result => {
      console.log('result >>>>>', result)
      if (result.data.code === '00000') {
        Toast('操作成功')
        // 刷新
        if (this.data.options) this.onLoad(this.data.options)
      } else {
        Toast(result.data.message)
      }
    })
  },

  onClose() {
    this.setData({ show: false, count: 1 })
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