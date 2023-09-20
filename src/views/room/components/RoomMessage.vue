<script setup lang="ts">
// 评价医生
import EvaluateCard from './EvaluateCard.vue'
</script>

<template>
  <!-- 消息列表 -->
  <template v-for="item in 2" :key="item">
    <!-- 1. 病情描述 -->
    <div class="msg msg-illness" v-if="true">
      <div class="patient van-hairline--bottom">
        <p>李富贵 男 31岁</p>
        <p>一周内 | 未去医院就诊</p>
      </div>
      <van-row>
        <van-col span="6">病情描述</van-col>
        <van-col span="18">头痛、头晕、恶心</van-col>
        <van-col span="6">图片</van-col>
        <van-col span="18">点击查看</van-col>
      </van-row>
    </div>
    <!-- 2. 温馨提示 -->
    <div class="msg msg-tip" v-if="true">
      <div class="content">
        <span class="green">温馨提示：</span>
        <span>在线咨询不能代替面诊，医护人员建议仅供参考</span>
      </div>
    </div>
    <!-- 3. 通用通知 -->
    <div class="msg msg-tip" v-if="true">
      <div class="content">
        <span>医护人员正在赶来，请耐心等候</span>
      </div>
    </div>
     <!-- 4. 发送文字 -->
     <div class="msg msg-to" v-if="false">
      <div class="content">
        <div class="time">20:12</div>
        <div class="pao">大夫你好？</div>
      </div>
      <van-image src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg" />
    </div>
    <!-- 5. 接收文字 -->
    <div class="msg msg-from" v-if="false">
      <van-image src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg" />
      <div class="content">
        <div class="time">20:12</div>
        <div class="pao">哪里不舒服</div>
      </div>
    </div>
    <!-- 6. 发送图片 -->
    <div class="msg msg-to" v-if="false">
      <div class="content">
        <div class="time">20:12</div>
        <van-image
          fit="contain"
          src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg"
        />
      </div>
      <van-image src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg" />
    </div>
    <!-- 7. 接收图片 -->
    <div class="msg msg-from" v-if="false">
      <van-image src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg" />
      <div class="content">
        <div class="time">20:12</div>
        <van-image
          fit="contain"
          src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg"
        />
      </div>
    </div>
    <!-- 8. 处方消息 -->
    <div class="msg msg-recipe" v-if="false">
      <div class="content">
        <div class="head van-hairline--bottom">
          <div class="head-tit">
            <h3>电子处方</h3>
            <p>原始处方 <van-icon name="arrow"></van-icon></p>
          </div>
          <p>李富贵 男 31岁 血管性头痛</p>
          <p>开方时间：2022-01-15 14:21:42</p>
        </div>
        <div class="body">
          <div class="body-item" v-for="i in 2" :key="i">
            <div class="durg">
              <p>优赛明 维生素E乳</p>
              <p>口服，每次1袋，每天3次，用药3天</p>
            </div>
            <div class="num">x1</div>
          </div>
        </div>
        <div class="foot"><span>购买药品</span></div>
      </div>
    </div>
    <!-- 9. 订单取消 -->
    <div class="msg msg-tip msg-tip-cancel" v-if="false">
      <div class="content">
        <span>订单取消</span>
      </div>
    </div>
    <!-- 10. 医生评价 -->
    <div class="msg" v-if="false">
      <evaluate-card></evaluate-card>
    </div>
  </template>
</template>

<style lang="scss" scoped>
.msg {
  display: flex;
  padding: 15px;
  // 医生消息+图片
  &-from {
    .content {
      max-width: 240px;
      min-width: 52px;
      .time {
        color: var(--cp-tip);
        margin-bottom: 5px;
      }
      .pao {
        padding: 15px;
        background-color: #fff;
        color: var(--cp-text3);
        font-size: 15px;
        border-radius: 8px;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          left: -13px;
          top: 10px;
          width: 13px;
          height: 16px;
          background: #fff;
          border-top-left-radius: 13px 3px;
        }
        &::after {
          content: '';
          position: absolute;
          left: -13px;
          top: 13px;
          width: 13px;
          height: 13px;
          background: var(--cp-bg);
          border-top-right-radius: 13px 13px;
        }
      }
      .van-image {
        max-height: 160px;
        max-width: 160px;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid var(--cp-line);
      }
    }
    > .van-image {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 13px;
    }
  }
  // 患者消息+图片
  &-to {
    justify-content: flex-end;
    .content {
      max-width: 240px;
      min-width: 52px;
      .time {
        color: var(--cp-tip);
        margin-bottom: 5px;
        text-align: right;
      }
      .pao {
        padding: 15px;
        background-color: var(--cp-primary);
        color: #fff;
        font-size: 15px;
        border-radius: 8px;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          right: -13px;
          top: 10px;
          width: 13px;
          height: 16px;
          background: var(--cp-primary);
          border-top-right-radius: 13px 3px;
        }
        &::after {
          content: '';
          position: absolute;
          right: -13px;
          top: 13px;
          width: 13px;
          height: 13px;
          background: var(--cp-bg);
          border-top-left-radius: 13px 13px;
        }
      }
      .van-image {
        max-height: 160px;
        max-width: 160px;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid var(--cp-line);
      }
    }
    > .van-image {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      overflow: hidden;
      margin-left: 13px;
    }
  }
  &-tip {
    justify-content: center;
    font-size: 12px;
    .content {
      height: 34px;
      line-height: 34px;
      background-color: #fff;
      color: var(--cp-tip);
      font-size: 12px;
      border-radius: 17px;
      padding: 0 16px;
      max-width: 100%;
      .green {
        color: var(--cp-primary);
      }
    }
    &-cancel {
      .content {
        background-color: #ededed;
      }
    }
  }
  &-illness {
    display: block;
    background-color: #fff;
    margin: 15px;
    border-radius: 8px;
    font-size: 12px;
    .patient {
      padding-bottom: 15px;
      margin-bottom: 15px;
      > p {
        &:first-child {
          font-size: 16px;
        }
        &:last-child {
          margin-top: 5px;
          color: var(--cp-tip);
        }
      }
    }
    .van-col {
      &:nth-child(-n + 2) {
        margin-bottom: 5px;
      }
      &:nth-child(2n) {
        color: var(--cp-tip);
      }
    }
  }
  &-recipe {
    padding: 15px;
    .content {
      background-color: #fff;
      border-radius: 8px;
      color: var(--cp-tip);
      font-size: 12px;
      flex: 1;
      .head {
        padding: 15px;
        .head-tit {
          display: flex;
          justify-content: space-between;
          > h3 {
            font-weight: normal;
            font-size: 16px;
            color: var(--cp-text1);
          }
        }
        p {
          margin-top: 5px;
        }
      }
      .body {
        padding: 15px 15px 0 15px;
        &-item {
          display: flex;
          margin-bottom: 15px;
          .durg {
            flex: 1;
            > p {
              &:first-child {
                font-size: 14px;
                color: var(--cp-text1);
                margin-bottom: 5px;
              }
            }
          }
          .num {
            color: var(--cp-text1);
          }
        }
      }
      .foot {
        background-color: var(--cp-plain);
        color: var(--cp-primary);
        font-size: 16px;
        text-align: center;
        height: 42px;
        line-height: 42px;
      }
    }
  }
}
</style>
