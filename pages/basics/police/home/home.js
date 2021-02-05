const app = getApp()
Page({
  showModal(e){
    // console.log(e.currentTarget.dataset)
    this.setData({
      modalName:'show',
      item:this.data.policeList[e.currentTarget.dataset.item][e.currentTarget.dataset.id]
    })
  },
  // 释放数组
  hideModal(){
    this.setData({
      modalName:null,
    })
  },


  /**
   * 节流
   */

  onPageScroll: app.throttle(function(e){
      if (e.scrollTop > 500) {
        this.setData({
          floorstatus: true,
          modalName:null
        });
      } else {
        this.setData({
          floorstatus: false
        })
      }
  },70),

  gotop: function (e) { // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 800
      })
    } else {
      wx.showModal({
        title: '提示',
        confirmColor: '#0081ff',
        content: '当前微信版本过低，请升级到最新微信版本后重试。'
      })
    }
  },
  queryList(page){
    let loading = this.data.loading
    return new Promise(function (resolve, reject) {
      const that = this
      app.request({
        url: app.api.POLICE_LIST,
        loading:loading,
        data: {
          limit: 15,
          page: page
        }
      }).then(res => {
        return resolve(res)
      }).catch(err => {
        return reject(err)
      })
    })
  },


  /**
   * 页面的初始数据
   */
  data: {
    policeList: null,
    page: 2,
    max: 1,
    loading:true,
    doneList: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryList(1)
      .then(res => {
        this.setData({
          ['policeList[0]']: res.data.data,
          max: Math.ceil(res.data.count / 15)
        })
        this.setData({doneList: this.data.max >= this.data.page})
      })
      .then(()=>{
        this.data.loading = false
      })
      .catch(err => {
        // console.log(err)
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function (e) {
    this.data.page = 2
    this.queryList(1)
      .then(res => {
        this.data.policeList.splice(1,this.data.policeList.length-1)
        this.setData({
          policeList:this.data.policeList,
          max: Math.ceil(res.data.count / 15)
        })
        this.setData({
          ['policeList[0]']: res.data.data,
        })
        wx.showToast({
          title: '刷新成功',
          icon:'none',
          duration:2000
        })
        .then(res=>{
          this.setData({
            doneList: this.data.max >= this.data.page
          })
        })
        wx.stopPullDownRefresh({})
      })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    if (this.data.doneList) {
      this.queryList(this.data.page)
        .then(res => {
          this.setData({
            ["policeList[" + (this.data.page-1) + "]"]:res.data.data,
          })
        })
        .then(()=>{
          this.data.page = this.data.page+1
          this.setData({doneList: this.data.max >= this.data.page})
        })
        .catch(err => {
          console.log(err)
        })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})