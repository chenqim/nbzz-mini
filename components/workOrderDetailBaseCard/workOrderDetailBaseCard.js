// components/workOrderDetailBaseCard.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    instance: {
      type: Object,
      value: {},
    },
    from: {
      type: String,
      value: 'work' // work：我的工单 today：工单池 situation：工单进度 dispatch：派单
    }
  },

  /**
   * 组件的初始数据
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
      produce: '新刀',
      maintenance: '维修'
    },
    typeColorMap: {
      produce: '#0a0a0a',
      maintenance: '#ff7051'
    },
    typeTextColorMap: {
      produce: '#bfa075',
      maintenance: '#ffffff'
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
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickComment() {
      this.triggerEvent('clickcomment')
    }
  }
})