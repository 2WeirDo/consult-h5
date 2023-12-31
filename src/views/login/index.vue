<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'

// 引入toast, Notify
import { showFailToast, showSuccessToast, showNotify, type FormInstance } from 'vant'

import { loginByPassword } from '@/api/user'
import { sendMobileCode } from '@/api/user'
import { loginByMobile } from '@/api/user'
import { useUserStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'

// 什么时候对变量要传递类型呢?  一般基础数据类型不用加类型, 因为可以自己判断, 复杂数据推荐使用断言 as
const code = ref('')
const agree = ref(false)
// 动态切换密码框眼睛图标 => 控制是否显示密码
const isShowPass = ref(false)

// 判断是否密码登录
const isPass = ref(true)

// 表单数据
const mobile = ref('13230000088')
const password = ref('abc12345')

// 表单提交
const store = useUserStore()
const router = useRouter()
const route = useRoute()
const login = async () => {
  if (!agree.value) showFailToast('请勾选已同意')
  else {
    // 验证完毕，进行登录
    const res = isPass.value
      ? await loginByPassword(mobile.value, password.value)
      : await loginByMobile(mobile.value, code.value)
    store.setUser(res)
    // 如果有回跳地址就进行回跳，没有跳转到个人中心
    // 这个路由对象上如果有问号参数需要通过query拿到, 这里通过断言给转换为字符串
    router.push((route.query.returnUrl as string) || '/user')
    showSuccessToast('登录成功')
  }
}

// 发送验证码逻辑
const form = ref<FormInstance>()
const time = ref(0)
let timeId: number
const send = async () => {
  // 已经倒计时time的值大于0，60s内不能重复发送验证码
  if (time.value > 0) return
  // 验证不通过报错，阻止程序继续执行
  // validate通过传入name验证mobile表单(这里为手机号格式是否正确)
  try {
    await form.value?.validate('mobile')
    const res = await sendMobileCode(mobile.value, 'login')
    showSuccessToast('发送成功~~')
    showNotify({ type: 'success', message: `验证码为${res.code}` })
    code.value = res.code
    time.value = 60
    // 倒计时
    timeId = window.setInterval(() => {
      time.value--
      if (time.value <= 0) window.clearInterval(timeId)
    }, 1000)
  } catch (error) {
    console.log(error)
  }
}

// 组件卸载关闭定时器
// 定时器相关函数是 window 去调用
onUnmounted(() => {
  // 避免内存泄漏
  window.clearInterval(timeId)
})
</script>

<template>
  <cp-nav-bar right-text="注册" @click-right="$router.push('/register')"></cp-nav-bar>
  <div class="login">
    <!-- 头部 -->
    <div class="login-head">
      <h3>{{ isPass ? '密码登录' : '短信验证码登录' }}</h3>
      <a href="javascript:;" @click="isPass = !isPass">
        <span>{{ isPass ? '短信验证码登录' : '密码登录' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- == form 表单 == -->
    <!-- 通过@submit提交表单 -->
    <van-form autocomplete="off" @submit="login" ref="form">
      <van-field
        placeholder="请输入手机号"
        type="tel"
        name="mobile"
        v-model="mobile"
        :rules="mobileRules"
      ></van-field>
      <van-field
        v-if="isPass"
        placeholder="请输入密码"
        v-model="password"
        :type="isShowPass ? 'text' : 'password'"
        :rules="passwordRules"
      >
        <template #button>
          <cp-icon
            @click="isShowPass = !isShowPass"
            :name="`login-eye-${isShowPass ? 'on' : 'off'}`"
          ></cp-icon>
        </template>
      </van-field>

      <van-field v-else placeholder="短信验证码" :rules="codeRules" v-model="code">
        <template #button>
          <span @click="send" :class="{ active: time > 0 }">{{
            time > 0 ? `${time}s后再次发送` : '发送验证码'
          }}</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <!-- 通过native-type="submit"设置为提交按钮 -->
        <van-button block round type="primary" native-type="submit">登 录</van-button>
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
.login {
  padding-top: 46px;
  &-head {
    padding: 30px 30px 50px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }
  .van-form {
    padding: 0 14px;
    .active {
      color: palevioletred;
    }

    .cp-cell {
      height: 52px;
      padding: 14px 16px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      .van-checkbox {
        a {
          color: var(--cp-primary);
          padding: 0 5px;
        }
      }
    }
  }
}
</style>
