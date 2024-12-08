const app = getApp()
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stageId: '',
    stageCode: '',
    stageName: '',
    workOrderId: '',
    workOrderName: '',
    processId: '',
    processName: '',
    type: '',
    loading: true,
    btnLoading: false,
    workOrderDetail: {},
    nextProcessName: '',
    prevProcessId: '',
    prevProcessName: '',
    processShow: false,
    prevProcessList: []
  },

  showPopup2() {
    this.setData({ processShow: true });
  },

  onClose2() {
    this.setData({ processShow: false });
  },

  onChange2(event) {
    const { picker, value, index } = event.detail;
    // Toast(`当前值：${value}, 当前索引：${index}`);
  },

  onConfirm2(event) {
    const { picker, value, index } = event.detail;
    // Toast(`当前值：${value}, 当前索引：${index}`);
    this.setData({
      prevProcessId: value.id,
      prevProcessName: value.text
    })
    this.onClose2()
  },

  onCancel2() {
    this.onClose2()
    Toast('取消');
  },

  writeArt() {
    if (!this.data.prevProcessId) {
      Toast('请选择返工工序')
      return
    }
    this.setData({
      btnLoading: true
    })
    this.save().then(res => {
      if (res.data.code === '00000') {
        wx.navigateBack()
      } else {
        Toast(res.data.message)
      }
    })
    .then(() => {
      this.data.loading = false
      this.setData({
        btnLoading: false
      })
    })
    .catch(err => {})
  },

  save() {
    let loading = this.data.loading
    return new Promise((resolve, reject) => {
      app.request({
        url: app.api.WRITE_ATR,
        loading: loading,
        data: {
          count: this.data.count,
          nextWorkingProcedureId: this.data.type === 'rework' ? this.data.prevProcessId : undefined,
          operateType: this.data.type,
          stagingAreaId: this.data.stageId,
          workOrderProcedureId: this.data.processId
        }
      }).then(res => {
        return resolve(res)
      }).catch(err => {
        return reject(err)
      })
    })
  },

  queryWorkOrderDetail(id) {
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.setData({
      stageId: options.stageId,
      stageCode: options.stageCode,
      stageName: options.stageName,
      workOrderId: options.workOrderId,
      workOrderName: options.workOrderName,
      processId: options.processId,
      processName: options.processName,
      type: options.type,
      count: options.processCount || 1
    })
    this.queryWorkOrderDetail(options.workOrderId).then(res => {
      const workOrderDetail = res.data.data
      const list = workOrderDetail.procedureList
      const current = list.findIndex(n => n.id === this.data.processId)
      const nextProcess = list?.[current + 1] || {}
      const prevProcessList = []
      list.splice(0, current).forEach(n => {
        prevProcessList.push({
          text: n.workingProcedure.name,
          id: n.id
        })
      })
      this.setData({
        workOrderDetail,
        prevProcessList,
        nextProcessName: nextProcess?.workingProcedure?.name || ''
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