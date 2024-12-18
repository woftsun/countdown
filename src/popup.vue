<template>
  <div style="width: 500px" class="p-4 bg-gray-50">
    <div class="mb-4 rounded-lg border-l-[4px] border-solid border-blue-600 bg-gradient-to-r from-blue-50 to-white p-3 shadow-sm transition-all hover:shadow-md">
      <div class="flex items-center gap-2">
        <strong class="text-base text-blue-600">{{ dayOfWeekMap[dayjs().locale("zh-cn").format("dddd")] }}</strong>
        <span class="text-sm font-bold text-gray-900">{{ getMessage }}</span>
      </div>
    </div>
    <div class="rounded-xl bg-white shadow-lg transition-all hover:shadow-xl">
      <ul class="divide-y divide-gray-100">
        <li v-if="weekendTime.diff > 0" 
            class="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-[13px]">
          <span class="text-gray-600">距离下班还有</span>
          <span class="font-medium">
            <strong class="text-blue-600">{{ weekendTime.hours }}</strong> 小时
            <strong class="text-blue-600">{{ weekendTime.minutes }}</strong> 分钟
          </span>
        </li>
        <li
          v-else
          class="w-full border-b-2 border-neutral-100 border-opacity-100 px-4 py-3 text-red-600 text-[13px]">
          <strong>下班了，快回家吧！</strong>
        </li>
        <li
          class="w-full border-b-2 border-neutral-100 border-opacity-100 px-4 py-3 text-[13px]">
          距离周末还有 <strong>{{ weekendTime.days }}</strong> 天
          <strong>{{ weekendTime.hours }}</strong> 小时
          <strong>{{ weekendTime.minutes }}</strong> 分钟
        </li>
        <li
          v-if="daysUntilNextPayDay !== 0"
          class="w-full border-b-2 border-neutral-100 border-opacity-100 px-4 py-3">
          距离发工资还有 <strong>{{ daysUntilNextPayDay }}</strong> 天
        </li>
        <li
          v-else
          class="w-full border-b-2 border-neutral-100 border-opacity-100 px-4 py-3 text-red-600">
          <strong>工资发放，就在今天</strong>
        </li>
        <li
          class="w-full border-b-2 border-neutral-100 border-opacity-100 px-4 py-3">
          距离过年还有 <strong>{{ newYearTime }}</strong> 天
        </li>
      </ul>

      <div class="border-t border-gray-100 p-4 flex justify-between items-center bg-gray-50 rounded-b-xl">
        <strong class="text-gray-700">{{ dayjs().format("YYYY-MM-DD HH:mm:ss") }}</strong>
        <button
          v-if="!saveStatus"
          @click="setTime"
          class="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium transition-all hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          设置
        </button>
        <button
          v-else
          @click="save"
          type="button"
          class="inline-block rounded border-2 border-primary-100 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:border-primary-accent-100 hover:bg-neutral-500 hover:bg-opacity-10 focus:border-primary-accent-100 focus:outline-none focus:ring-0 active:border-primary-accent-200"
          data-te-ripple-init>
          保存
        </button>
      </div>
    </div>
    <div v-if="saveStatus"
         class="mt-6 rounded-xl bg-white shadow-lg p-6 transition-all">
      <h5 class="text-xl font-semibold text-gray-800 mb-6">设置高光时刻</h5>
      <el-form
        ref="timeRef"
        :model="timeForm"
        :rules="rules"
        class="space-y-4">
        <el-form-item prop="time" required label="下班时间:" 
                      class="flex items-center gap-4">
          <el-time-select
            v-model="timeForm.time"
            class="flex-1 max-w-[240px]"
            start="08:30"
            step="00:15"
            end="23:30"
            placeholder="请选择" />
        </el-form-item>
        <el-form-item prop="day" required label="工资时间:">
          <el-select
            style="width: 60%"
            v-model="timeForm.day"
            placeholder="请选择">
            <el-option
              v-for="day in 31"
              :key="day"
              :label="day.toString()"
              :value="day" />
          </el-select>
        </el-form-item>
      </el-form>
      <p class="font-bold text-neutral-500 text-right">
        中午吃什么功能敬请期待！
        <span style="color: #08b2eb; cursor: pointer" @click="showImg"
          >获取最新版</span
        >
      </p>
    </div>
    <el-dialog
      v-model="imgStatus"
      title="关注公众号获取最新更新"
      class="rounded-xl"
      width="400px">
      <div class="flex flex-col items-center">
        <el-image
          style="width: 240px"
          class="rounded-lg shadow-md"
          src="https://ai.woftsun.cn/qrcode.jpg" />
        <p class="mt-4 text-gray-600">扫码关注，第一时间获取更新提醒</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import "./styles/index.css"
import "element-plus/dist/index.css"

import dayjs from "dayjs"
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElImage,
  ElOption,
  ElSelect,
  ElTimeSelect
} from "element-plus"
import calendar from "js-calendar-converter"
import { Ripple, initTE } from "tw-elements"
import { computed, onMounted, ref, toRaw } from "vue"

import { Storage } from "@plasmohq/storage"

const storage = new Storage()

const rules = {
  time: [
    {
      required: true,
      message: "请选择下班时间",
      trigger: "blur"
    }
  ],
  day: [
    {
      required: true,
      message: "请选择发工资日期",
      trigger: "blur"
    }
  ]
}

const messages = [
  "工作再累，也别忘了摸鱼哦，钱是老板的，命是己的",
  "漫长的岁月 竟没有一天适合上班",
  "多站起来走走，别老在工位上",
  "人的终极目标是闲情逸致 而不是工作",
  "虚情假意上班，真心实意下班",
  "枯藤老树昏鸦，上班摸鱼下班回家",
  "我虽然上班总迟到 但我下班很准时鸭",
  "上班的我风都吹得倒，下班的我狗都追不到"
]

initTE({ Ripple })
const timeRef = ref(null)
const imgStatus = ref(false)
const timeForm = ref({})
const newYearTime = ref()
const afterWorkTime = ref({})
const weekendTime = ref({})
const lunarDate = ref(null)
let targetAfterTime = dayjs("18:00", "HH:mm")
const daysUntilNextPayDay = ref(0)
const saveStatus = ref(false)

const calcAfterTime = () => {
  const tempTime = dayjs(
    JSON.parse(JSON.stringify(timeForm.value.time)),
    "HH:mm"
  )
  const currentTime = dayjs()
  let diff = tempTime.diff(currentTime)

  afterWorkTime.value = {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    diff
  }

  // 如果当前时间超过下班时间，但还在今天，则设置 diff 为 0
  if (diff < 0 && currentTime.isSame(tempTime, "day")) {
    afterWorkTime.value.diff = 0
  }
}

const showImg = () => {
  imgStatus.value = true
}

const dayOfWeekMap = {
  Sunday: "星期日",
  Monday: "星期一",
  Tuesday: "星期二",
  Wednesday: "星期三",
  Thursday: "星期四",
  Friday: "星期五",
  Saturday: "星期六"
}

const getMessage = computed(() => {
  const randomIndex = Math.floor(Math.random() * messages.length)
  return messages[randomIndex]
})

const calcWeekend = () => {
  const currentDate = dayjs().format("YYYY-MM-DD")
  const fullDateTime = `${currentDate} ${timeForm.value.time}`

  const tempTime = dayjs(fullDateTime, "YYYY-MM-DD HH:mm")
  let closingTimeFriday = dayjs()
    .day(5)
    .set("hour", tempTime.hour())
    .set("minute", tempTime.minute())
    .set("second", 0)

  const currentTime = dayjs()
  // 如果当前时间已经过了本周五的下��时间���将目标时间设为下周五的下班时间
  if (currentTime.isAfter(closingTimeFriday)) {
    closingTimeFriday = closingTimeFriday.add(7, "day")
  }

  // 计算剩余的天数、小时、分钟和秒数
  const diff = closingTimeFriday.diff(currentTime)
  const duration = {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    diff
  }

  const specificDateTime = currentTime
    .set("hour", Number(timeForm.value.time.split(":")[0]))
    .set("minute", Number(timeForm.value.time.split(":")[1]))

  if (currentTime.isAfter(specificDateTime) && currentTime.hour() < 23)
    duration.diff = 0

  weekendTime.value = duration
}

const calcPay = () => {
  // 获取当前年份和月份
  const currentYear = dayjs().year()
  const currentMonth = dayjs().month() + 1 // 月份从 0 开始，所以要加 1

  // 获取当前日期和时间
  const currentDate = dayjs()

  // 获取选择的支付日和时间
  const selectedPayDay = timeForm.value.day
  const selectedPayTime = dayjs(
    `${currentYear}-${currentMonth}-${selectedPayDay}`
  )
  // 计算下次发工资的日期和时间
  let nextPayDateTime
  if (selectedPayTime.isBefore(currentDate)) {
    // 如果选择的支付日已经过去，则下次发工资为下个月的选择支付日
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear
    nextPayDateTime = dayjs(`${nextYear}-${nextMonth}-${selectedPayDay}`)
  } else {
    // 如果选择的支付日在当前日期之后，则下次发工资为本月的选择支付日
    nextPayDateTime = selectedPayTime
  }

  // 计算距离下次发工资的时间差（以小时为单位）
  const hoursUntilNextPayDay = nextPayDateTime.diff(currentDate, "hour")
  // 如果需要返回天数而不是小时，可以使用以下代码

  daysUntilNextPayDay.value =
    dayjs(nextPayDateTime).date() === currentDate.date()
      ? 0
      : Math.ceil(hoursUntilNextPayDay / 24)
}

const calcNewYear = () => {
  const currentTime = dayjs()
  console.log(lunarDate.value)
  newYearTime.value = dayjs(lunarDate.value).diff(currentTime, "day")
}

const setTime = () => {
  saveStatus.value = true
}

const save = async () => {
  const result = await timeRef.value.validate()
  if (result) {
    saveStatus.value = false
    await storage.set("time", timeForm.value)
  }
}

const updateData = () => {
  calcAfterTime()
  calcWeekend()
  calcPay()
  calcNewYear()
}

onMounted(async () => {
  const lYear = calendar.lunar2solar().lYear
  lunarDate.value = calendar.lunar2solar(lYear, 12, 29).date
  console.log(calendar.lunar2solar(lYear, 12, 29))

  const initTime = await storage.get("time") // { color: "red" }
  if (initTime && Object.keys(initTime)?.length) {
    timeForm.value.day = initTime.day
    timeForm.value.time = initTime.time
  } else {
    timeForm.value.day = 5
    timeForm.value.time = "18:00"
  }

  updateData() // 调用一次以确保初始数据确

  setInterval(updateData, 1000) // 每秒钟更新一次数据
})
</script>
<style scoped>
/* 添加一些过渡动画 */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

/* 优化 Element Plus 组件样式 */
:deep(.el-select),
:deep(.el-time-select) {
  width: 100%;
}

:deep(.el-input__wrapper) {
  border-radius: 0.5rem;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #374151;
}
</style>
