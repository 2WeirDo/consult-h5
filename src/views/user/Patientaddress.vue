<script setup lang="ts">
import { getPatientList, addPatient, editPatient, delPatient } from '@/api/user'
import type { PatientList, Patient } from '@/types/user'
import { onMounted, ref, computed } from 'vue'
import { showFailToast, showSuccessToast, showConfirmDialog } from 'vant'
import { useRoute } from 'vue-router'

// 这个页面的功能是否是选择地址
const route = useRoute()
// 问号参数通过query拿到, 动态参数通过params拿到
const isChange = computed(() => route.query.isChange === '1')

// 存储点击选中地址ID作为标识
const patientId = ref<string>()
const selectedPatient = (item: Patient) => {
  if (isChange.value) {
    // 如果支持选择功能
    patientId.value = item.id
  }
}

// 1. 查询家庭档案-地址列表
// 是数组就可以不用类型断言, 因为它有初始值了
const list = ref<PatientList>([])


// 2. 新增地址功能
// 控制新增地址弹层显隐
const show = ref(false)
const showPopup = (item?: any) => {
  if (item) {
    // 可以根据是否存在id判断是添加或者编辑操作(所以我们这里多拿取了一个id)
    // 如果点的是编辑，解构出后台需要的数据
    const { id, gender, name, idCard, defaultFlag } = item
    patient.value = { id, gender, name, idCard, defaultFlag }
  } else {
    // 填充默认值
    patient.value = { ...initPatient }
  }
  show.value = true
}

// 存储选中的性别value值
// const gender = ref(0)

// 新增表单
// 准备默认值
const initPatient: Patient = {
  name: '上海',
  idCard: '',
  gender: 1,
  defaultFlag: 0 // 是否为默认地址 1 为默认地址
}
// 克隆一份新数据，要不然是同一个对象。
const patient = ref<Patient>({ ...initPatient })

// 默认值需要转换
const defaultFlag = computed({
  get() {
    return patient.value.defaultFlag === 1 ? true : false
  },
  set(value) {
    patient.value.defaultFlag = value ? 1 : 0
  }
})

// 点击导航栏保存按钮 => 提交
// 身份证校验
const submit = async () => {
  // 1.校验是否输入
  if (!patient.value.name) return showFailToast('请输入城市')
  if (!patient.value.idCard) return showFailToast('请输入小区')

  // 3.添加地址/编辑地址
  try {
    patient.value.id ? await editPatient(patient.value) : await addPatient(patient.value)
    show.value = false
    // 刷新地址列表
    showSuccessToast(patient.value.id ? '编辑成功' : '添加成功')
  } catch (error) {
    console.log(error)
  }
}

// 4.删除地址
const remove = async () => {
  if (patient.value.id) {
    await showConfirmDialog({
      title: '温馨提示',
      message: `您确认要删除 ${patient.value.name} 地址信息吗?`
    })
    await delPatient(patient.value.id)
    show.value = false
    showSuccessToast('删除成功')
  }
}

</script>

<template>
  <div class="patient-page">
    <cp-nav-bar :title="isChange ? '选择地址' : '地址管理'" />
    <!-- 头部选择提示 -->
    <div class="patient-change" v-if="isChange">
      <h3>请选择地址信息</h3>
      <p>以便医生给出更准确的治疗，信息仅医生可见</p>
    </div>
    <!-- 地址列表 -->
    <div class="patient-list">
      <div
        class="patient-item"
        v-for="item in list"
        :key="item.id"
        @click="selectedPatient(item)"
        :class="{ selected: patientId === item.id }"
      >
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <!-- 说明❓：身份证脱敏处理：/^(.{6})(?:\d+)(.{4})$/，显示前6位和后4位，出生日期隐藏
            前六位 => ^(.{6}) => 匹配第一个$1 
            后四位 => (.{4})$ => 匹配第二个$2
           ?:在正则表达式中是一个非捕获组 , 表示要替换显示的部分, 但是实际不替换 => 不作为匹配结果存储
           注意 : 正则别加引号, 正则就是一个对象
          -->
          <span class="id">{{ item.idCard }}</span>
          <span>{{ item.genderValue }}</span>
          <span>{{ item.age }}岁</span>
        </div>
        <!-- 编辑按钮 -->
        <div class="icon" @click="showPopup(item)"><cp-icon name="user-edit" /></div>
        <div class="tag" v-if="item.defaultFlag === 1">默认</div>
      </div>
      <!-- 限制地址数量 -->
      <div class="patient-add" v-if="list.length < 6" @click="showPopup()">
        <cp-icon name="user-add" />
        <p>添加地址</p>
      </div>
      <div class="patient-tip">最多可添加 6 人</div>
    </div>


    <!-- 新增地址弹层 -->
    <van-popup v-model:show="show" position="right">
      <!-- 点击保存执行表单校验 -->
      <!-- 根据是否存在id判断是添加或者编辑操作 -->
      <cp-nav-bar
        :back="() => (show = false)"
        :title="patient.id ? '编辑地址' : '添加地址'"
        @click-right="submit"
        right-text="保存"
      ></cp-nav-bar>
      <!-- 表单 -->
      <van-form autocomplete="off">
        <van-field v-model="patient.name" label="城市" placeholder="请输入城市名称" />
        <van-field v-model="patient.idCard" label="街道/小区" placeholder="请输入街道/小区名称" />
        <van-field label="默认地址">
          <template #input>
            <!-- 说明：直接绑定存储的是boolean值 -->
            <!-- <van-checkbox round v-model="patient.defaultFlag" /> -->
            <!-- 使用计算属性转换 -->
            <!-- 组件需要的是 布尔 类型，需要通过计算属性转换一下 -->
            <van-checkbox round v-model="defaultFlag" />
          </template>
        </van-field>
      </van-form>
      <!-- 在地址弹层中显示删除按钮 -->
      <van-action-bar>
        <van-action-bar-button @click="remove" type="danger" text="删除"></van-action-bar-button>
      </van-action-bar>
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
