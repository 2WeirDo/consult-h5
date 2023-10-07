<script setup lang="ts">
import { getMedicalOrderLogistics } from '@/api/medicine'
import type { Express } from '@/types/medicine'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AMapLoader from '@amap/amap-jsapi-loader'
import carImg from '@/assets/car.png'
import startImg from '@/assets/start.png'
import endImg from '@/assets/end.png'

// 获取物流信息
const express = ref<Express>()
const route = useRoute()
onMounted(async () => {
  const res = await getMedicalOrderLogistics(route.params.id as string)
  express.value = res

  const AMap = await AMapLoader.load({
    key: 'ef947696f75e2cc14a33d742f498eded',
    version: '2.0'
  })
  // 使用 Amap 初始化地图
  const map = new AMap.Map('map', {
    //设置地图容器id
    zoom: 12, //初始化地图级别, 值越大范围越大
    mapStyle: 'amap://styles/macaron' // 设置地图样式
  })
  // 绘制物流轨迹
  // 必须通过插件导入
  AMap.plugin('AMap.Driving', () => {
    var driving = new AMap.Driving({
      map: map, // 指定轨迹显示地图实例
      showTraffic: false, // 关闭交通状态
      hideMarkers: true
    })

    // == 替换真实物流坐标数据 ==
    // 第一个是起始坐标，第二个是终点坐标， 第三个是路途中的经纬度坐标， 第四个规划好了的回调函数
    // 1. 使用经纬度数组中的第一个数据：起始坐标
    const start = express.value?.logisticsInfo.shift()
    // 2. 使用经纬度数组中的最后一个数据：结束坐标
    const end = express.value?.logisticsInfo.pop()
    // 3. 途径点坐标：express.value?.logisticsInfo shift和pop后剩余未途经点坐标，处理成二维数据
    const road = express.value?.logisticsInfo.map((item) => [item.longitude, item.latitude])

    // 四个参数
    driving.search(
      [start?.longitude, start?.latitude],
      [end?.longitude, end?.latitude],
      {
        waypoints: road // 显示途经点坐标(二维数组)
      },
      function (status: string, result: object) {
        // 未出错时，result即是对应的路线规划方案
        // 绘制运输中货车的当前位置
        console.log(status, result)
        const carMarker = new AMap.Marker({
          icon: carImg, // 火车的图片
          position: [
            express.value?.currentLocationInfo.longitude,
            express.value?.currentLocationInfo.latitude
          ],
          anchor: 'center' // 设置基于坐标点显示的位置
        })
        map.add(carMarker)

        // 3s后，定位到货车，放大地图
        setTimeout(() => {
          map.setFitView([carMarker])
          map.setZoom(10)
        }, 3000)
      }
    )
    // 自定义开始结束位置图片
    const startMarker = new AMap.Marker({
      icon: startImg, // 设置自定义图片
      position: [start?.longitude, start?.latitude] // 图片显示的坐标位置
    })
    map.add(startMarker)
    const endMarker = new AMap.Marker({
      icon: endImg,
      position: [end?.longitude, end?.latitude]
    })
    map.add(endMarker)
  })
})

// 绘制高德地图物流轨迹
// 校验密钥
window._AMapSecurityConfig = {
  securityJsCode: '49c6f416f39a1034e21c2f647916be41'
}
</script>

<template>
  <div class="order-logistics-page">
    <!-- 高德地图挂载渲染 -->
    <div id="map">
      <div class="title">
        <van-icon name="arrow-left" @click="$router.back()" />
        <span>{{ express?.statusValue }}</span>
        <van-icon name="service" />
      </div>
      <div class="current">
        <p class="status">{{ express?.statusValue }}——预计{{ express?.estimatedTime }}送达</p>
        <p class="predict">
          <span>{{ express?.name }}</span>
          <span>{{ express?.awbNo }}</span>
        </p>
      </div>
    </div>
    <!-- 物流详情 -->
    <div class="logistics">
      <p class="title">物流详情</p>
      <van-steps direction="vertical" :active="0">
        <van-step v-for="item in express?.list" :key="item.id">
          <p class="status" v-if="item.statusValue">{{ item.statusValue }}</p>
          <p class="content">{{ item.content }}</p>
          <p class="time">{{ item.createTime }}</p>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-logistics-page {
  --van-step-icon-size: 18px;
  --van-step-circle-size: 10px;
}
#map {
  height: 450px;
  background-color: var(--cp-bg);
  overflow: hidden;
  position: relative;
  .title {
    background-color: #fff;
    height: 46px;
    width: 355px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-size: 16px;
    position: absolute;
    left: 10px;
    top: 10px;
    box-sizing: border-box;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;
    > span {
      flex: 1;
      text-align: center;
    }
    .van-icon {
      font-size: 18px;
      color: #666;
      &:last-child {
        color: var(--cp-primary);
      }
    }
  }
  .current {
    height: 80px;
    border-radius: 4px;
    background-color: #fff;
    height: 80px;
    width: 355px;
    box-sizing: border-box;
    padding: 15px;
    position: absolute;
    left: 10px;
    bottom: 10px;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;
    .status {
      font-size: 15px;
      line-height: 26px;
    }
    .predict {
      color: var(--cp-tip);
      font-size: 13px;
      margin-top: 5px;
      > span {
        padding-right: 10px;
      }
    }
  }
}
.logistics {
  padding: 0 10px 20px;
  .title {
    font-size: 16px;
    padding: 15px 5px 5px;
  }
  .van-steps {
    :deep(.van-step) {
      &::after {
        display: none;
      }
    }
    .status {
      font-size: 15px;
      color: var(--cp-text3);
      margin-bottom: 4px;
    }
    .content {
      font-size: 13px;
      color: var(--cp-tip);
      margin-bottom: 4px;
    }
    .time {
      font-size: 13px;
      color: var(--cp-tag);
    }
  }
}
</style>
