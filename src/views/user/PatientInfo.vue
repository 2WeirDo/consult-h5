<script setup lang="ts">
import { getPatientList } from '@/api/user'
import type { PatientList } from '@/types/user'
import { onMounted, ref } from 'vue'
// import { showNotify } from 'vant'

// 1. 查询家庭档案-患者列表
// 是数组就可以不用类型断言, 因为它有初始值了
const list = ref<PatientList>([])
const loadList = async () => {
  const res = await getPatientList()
  list.value = res
}

// 2. 新增患者功能
// 控制新增患者弹层显隐
const show = ref(false)
const showPopup = () => {
  show.value = true
}

// 弹层内容展示
const options = [
  // 跟后端返回数据有关, 男代表1
  { label: '男', value: 1 },
  { label: '女', value: 0 }
]
// 存储选中的性别value值
const gender = ref(0)

onMounted(() => {
  loadList()
})
</script>

<template>
  <div class="patient-page">
    <cp-nav-bar title="家庭档案" />
    <!-- 头部选择提示 -->
    <div class="patient-change" v-if="false">
      <h3>请选择患者信息</h3>
      <p>以便医生给出更准确的治疗，信息仅医生可见</p>
    </div>
    <!-- 患者列表 -->
    <div class="patient-list">
      <div class="patient-item" v-for="item in list" :key="item.id">
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <!-- 说明❓：身份证脱敏处理：/^(.{6})(?:\d+)(.{4})$/，显示前6位和后4位，出生日期隐藏
            前六位 => ^(.{6}) => 匹配第一个$1 
            后四位 => (.{4})$ => 匹配第二个$2
           ?:在正则表达式中是一个非捕获组 , 表示要替换显示的部分, 但是实际不替换 => 不作为匹配结果存储
           注意 : 正则别加引号, 正则就是一个对象
          -->
          <span class="id">{{ item.idCard.replace(/^(.{6})(?:\d+)(.{4})$/, '\$1*****\$2') }}</span>
          <span>{{ item.genderValue }}</span>
          <span>{{ item.age }}岁</span>
        </div>
        <div class="icon"><cp-icon name="user-edit" /></div>
        <div class="tag" v-if="item.defaultFlag === 1">默认</div>
      </div>
      <!-- 限制患者数量 -->
      <div class="patient-add" v-if="list.length < 6" @click="showPopup">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip">最多可添加 6 人</div>
    </div>
    <!-- 患者选择下一步 -->
    <div class="patient-next" v-if="false">
      <van-button type="primary" round block>下一步</van-button>
    </div>

    <!-- 新增患者弹层 -->
    <van-popup v-model:show="show" position="top">
      <!-- 点击返回就关闭弹层 -->
      <cp-nav-bar title="添加患者" right-text="保存" :back="() => (show = false)"></cp-nav-bar>
      <!-- 表单 -->
      <cp-radio-btn :options="options" v-model="gender"></cp-radio-btn>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
.patient-page {
  padding: 46px 0 80px;
  ::v-deep() {
    .van-popup {
      width: 100%;
      height: 100%;
      padding-top: 46px;
      box-sizing: border-box;
    }
  }
}

.patient-change {
  padding: 15px;
  > h3 {
    font-weight: normal;
    margin-bottom: 5px;
  }
  > p {
    color: var(--cp-text3);
  }
}
.patient-next {
  padding: 15px;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 80px;
  box-sizing: border-box;
}
.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}
</style>
