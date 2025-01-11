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
    // radio: '1',
    workOrderId: '',
    workOrderName: '',
    processId: '',
    processName: '',
    count: 1,
    workOrderShow: false,
    workOrderList: [],
    processShow: false,
    processList: [],
    cacheProcessList: [],
    btnLoading: false,
    loading: false
  },

  // onChange(event) {
  //   this.setData({
  //     radio: event.detail,
  //   });
  // },

  // onClick(event) {
  //   const { name } = event.currentTarget.dataset;
  //   this.setData({
  //     radio: name,
  //   });
  // },

  showPopup1() {
    this.setData({ workOrderShow: true });
  },

  onClose1() {
    this.setData({ workOrderShow: false });
  },

  onChange1(event) {
    const { picker, value, index } = event.detail;
    // Toast(`当前值：${value}, 当前索引：${index}`);
  },

  onConfirm1(event) {
    const { picker, value, index } = event.detail;
    // 根据可选工单晒出可选工序
    const processList = this.data.cacheProcessList.filter(n => n.workOrder.id === value.id)
    this.setData({
      workOrderId: value.id,
      workOrderName: value.text,
      processList: processList.map(n => ({ text: n.workingProcedureName, id: n.workOrderProcedure.id, count: n.workOrderProcedure.count })),
      processId: '',
      processName: ''
    })
    this.onClose1()
  },

  onCancel1() {
    this.onClose1()
    // Toast('取消');
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
      processId: value.id,
      processName: value.text,
      count: value.count
    })
    this.onClose2()
  },

  onCancel2() {
    this.onClose2()
    // Toast('取消');
  },

  stepperChange(event) {
    this.setData({
      count: event.detail
    })
  },

  queryStageInventory(code) {
    let loading = this.data.loading
    return new Promise((resolve, reject) => {
      app.request({
        url: app.api.STAGE_INVENTORY,
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

  readArt() {
    if (!this.data.workOrderId) {
      Toast('请选择工单')
      return
    }
    if (!this.data.processId) {
      Toast('请选择工序')
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
        url: app.api.READ_ART,
        loading: loading,
        data: {
          count: this.data.count,
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      stageId: options.stageId,
      stageCode: options.stageCode,
      stageName: options.stageName
    })
    this.queryStageInventory(options.stageCode).then(res => {
      const list = res.data.data
      // 处理可选工单
      const workOrderList = []
      const workOrderKey = []
      list.forEach(n => {
        if (workOrderKey.indexOf(n.workOrder.id) === -1) {
          workOrderKey.push(n.workOrder.id)
          workOrderList.push({
            text: n.workOrder.name,
            id: n.workOrder.id
          })
        }
      })
      this.setData({
        workOrderList,
        cacheProcessList: list
      })
      console.log('res >>>', res)
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