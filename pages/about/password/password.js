// pages/about/password/password.js
const app = getApp()
Page({

//旧密码
  old_onChange(event) {
    // event.detail 为当前输入的值
    this.setData({oldPass:event.detail})
    // console.log(event.detail);
    if(this.data.oldMessage){
      this.setData({oldMessage:''})
    }
  },
  //新密码
  new_onChange(event) {
    // event.detail 为当前输入的值
    this.setData({newPass:event.detail})
    if(this.data.newMessage){
      this.setData({newMessage:''})
    }
    // console.log(event.detail);
  },
  //确认密码
  com_onChange(event) {
    // event.detail 为当前输入的值
    this.setData({comPass:event.detail})
    if(this.data.errorMessage){
      this.setData({errorMessage:''})
    }
    // console.log(event.detail);
  },
  //更新密码
  updatePassword(){
    const that = this
    // console.log(this.data)
    if(!this.data.oldPass){
      this.setData({oldMessage:'请输入密码'})
    }
    if(!this.data.newPass){
      this.setData({newMessage:"请输入新密码"})
    }else if(this.data.newPass.length<2){
      this.setData({newMessage:"密码长度需要为2-20个字符"})
    }
    if(!this.data.comPass){
      this.setData({errorMessage:"请输入确认密码"})
    }else if(this.data.comPass!=this.data.newPass){
      this.setData({errorMessage:"与新密码不一致，请重新填写确认"})
    }
    if(this.data.comPass==this.data.newPass&&this.data.newPass.length>=2){
      app.request({
        toShow:true,
        url:app.api.CHANGE_PASSWORD,
        data:{
          oldPassword:this.data.oldPass,
          newPassword:this.data.newPass
        }
      }).then(res =>{
        if(res.data.code == '1'){
          wx.showModal({
            // title: '提示',
            content: "密码修改成功",
            showCancel: false,
            success(res) {
              if (res.confirm) {
                // return wx.navigateBack({delta:1})
                return wx.redirectTo({
                  url: '/pages/login/home',
                })
              }
            }
          })
        }else if(res.data.code == 0){
          wx.showModal({
            // title: '提示',
            content: "原密码错误,请重新填写",
            showCancel: false,
            success(res) {
              if (res.confirm) {
                that.setData({
                  oldPass:'',
                  oldMessage:'请重新填写原密码',
                  oldFocus:true
                })
              }
            }
          })
        }else{
          wx.showModal({
            // title: '提示',
            content: "出现其他错误，请重新登录",
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/login/home',
                })
              }
            }
          })
        }
      })
    }
  },


  /**
   * 页面的初始数据
   */
  data: {
    errorMessage:'',
    newMessage:'',
    oldMessage:'',
    nickname:'',
    account:'',
    oldPass:'',
    newPass:'',
    comPass:'',
    oldFocus:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.user_info){
      this.setData({nickname:app.globalData.user_info.userName,account:app.globalData.user_info.userAccount})
    }
    // console.log(app.globalData.user_info)
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
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})