// pages/basics/dispatch/detail/detail.js
const app = getApp()
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    instance: {},
    loading: false,
    userInfo: null,
    options: null,
    user: '',
    count: 1,
    commentShow: false,
    comment: '',
    index: -1,
    userShow: false,
    userList: []
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

  showPopup(e) {
    this.setData({ userShow: true, index: e.currentTarget.dataset.index });
  },
  onClose() {
    this.setData({ userShow: false, index: -1 });
  },
  onChange(event) {
    const { picker, value, index } = event.detail;
    // Toast(`当前值：${value}, 当前索引：${index}`);
  },
  onConfirm(event) {
    const { picker, value, index } = event.detail;
    this.data.instance.procedureList[this.data.index].dispatchUserId = value.id
    this.data.instance.procedureList[this.data.index].dispatchUserName = value.userName
    this.setData({
      instance: this.data.instance
    })
    this.onClose()
  },
  onCancel() {
    this.onClose()
    // Toast('取消');
  },

  stepperChange(event) {
    const index = event.currentTarget.dataset.index
    this.data.instance.procedureList[index].dispatchCount = event.detail
    this.setData({
      instance: this.data.instance
    })
  },

  dispatchWorkOrder() {
    this.setData({
      btnLoading: true
    })
    this.save().then(res => {
      if (res.data.code === '00000') {
        wx.navigateBack()
        Toast('操作成功')
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
        url: app.api.ALLOCATE_WORK_ORDER,
        loading: loading,
        data: {
          workOrderId: this.data.instance.id,
          orderProcedureList: this.data.instance.procedureList.map(n => {
            return {
              workOrderProcedureId: n.id,
              userId: n.dispatchUserId,
              count: n.dispatchCount
            }
          }).filter(n => n.userId && n.count > 0) // 过滤掉未分配的
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
  
  queryAllUser() {
    return new Promise((resolve, reject) => {
      app.request({
        url: app.api.ALL_USER_LIST,
        loading: false,
        data: {}
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
    console.log('on load >>>>>', options.id)
    this.queryAllUser().then(res => {
      this.setData({
        userList: res.data.data
      })
      console.log(this.data.userList)
    })
    this.queryDetail(options.id).then(res => {
      res.data.data.procedureList.forEach(n => {
        n.dispatchUserId = ''
        n.dispatchUserName = ''
        n.dispatchCount = 0
      })
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
    console.log("onPullDownRefresh >>>>>")
    if (this.data.options) {
      this.onLoad(this.data.options)
      wx.showToast({
        title: '刷新成功',
        icon: 'none',
        duration: 2000
      })
      wx.stopPullDownRefresh({})
    }
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