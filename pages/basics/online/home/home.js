const app = getApp()
Page({

  filterViewMove() {
    return true
  },

  showModal(e){
    // console.log(e.currentTarget.dataset)
    this.data.active = e.currentTarget.dataset.active
    this.setData({
      modalName:'show',
      item:this.data.onlineList[e.currentTarget.dataset.item][e.currentTarget.dataset.id],
      // active:e.currentTarget.dataset.active
    })
  },
  hideModal(){
    this.setData({
      modalName:null
    })
  },
  toSearch(){
    wx.navigateTo({
      url: '../search/search',
    })
  },
  
  onCha(e) {
    this.setData({
      timeData: e.detail,
    });
  },

  refresh(){
    if(this.data.showFresh){
      const countDown = this.selectComponent('.control-count-down');
      // console.log(countDown)
      // countDown.reset();
      // this.queryList(1,this.data.page>=2?(this.data.page-1)*this.data.limit:null)
      this.queryList(1)
      .then(res => {
        this.setData({
          ['onlineList[0]']: res.data.data,
        })
        app.request({
          url: app.api.ONLINE_DETAIL + this.data.active,
          loading:false
        }).then(res => {
          this.setData({
            detail:res.data.data,
          })
        })
      })
      .then(()=>{
          wx.showToast({
            title: '自动刷新成功',
            duration:2000,
            icon:'none'
          })
        countDown.reset();
      })
    }
  },
  queryList(page,limit=this.data.limit){
    let loading = this.data.loading
    return new Promise(function (resolve, reject) {
      const that = this
      app.request({
        url: app.api.ONLINE_DATA,
        loading:loading,
        data: {
          limit: limit,
          page: page,
          param:{}
        }
      }).then(res => {
        // console.log(res)
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
    onlineList: null,
    page: 2,
    active:'',
    max: 1,
    doneList: false,
    detail:{},
    loading:true,
    time:60000,
    showFresh:true,
    timeData:{},
    limit:500
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryList(1)
      .then(res => {
        this.setData({
          ['onlineList[0]']: res.data.data,
          max: Math.ceil(res.data.count / this.data.limit),
        })
        console.log(this.data.onlineList)
        this.setData({doneList: this.data.max >= this.data.page})
      })
      .then(()=>{
        this.data.loading = false
        // this.setData({time:60 * 1000})
      })
      .catch(err => {
        console.log(err)
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const countDown = this.selectComponent('.control-count-down')
    countDown.reset()
    this.data.showFresh = true
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.data.showFresh = false
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.page = 2
    const countDown = this.selectComponent('.control-count-down');
    this.queryList(1)
    .then((res) => {
      this.data.onlineList.splice(1,this.data.onlineList.length-1)
      this.setData({
        onlineList: this.data.onlineList,
        max: Math.ceil(res.data.count / this.data.limit),
      })
      this.setData({
        ['onlineList[0]']: res.data.data,
      })
      this.setData({doneList: this.data.max >= this.data.page})
        // app.request({
        //   url: app.api.ONLINE_DETAIL + this.data.active,
        //   loading:false
        // }).then(res => {
        //   this.setData({
        //     detail:res.data.data,
        //     activeName: this.data.active
        //   })
        // })
    })
    .then(()=>{
      wx.showToast({
        title: '刷新成功',
        duration:2000,
        icon:'none'
      })
      countDown.reset()
    })
    .then(()=>{
      wx.stopPullDownRefresh({}) 
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.doneList) {
      this.queryList(this.data.page)
        .then(res => {
          this.setData({
            ["onlineList[" + (this.data.page-1) + "]"]:res.data.data,
          })
          this.data.page++
          this.setData({doneList: this.data.max >= this.data.page})
        })
        .catch(err => {})
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})