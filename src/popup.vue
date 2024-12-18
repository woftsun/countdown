<template>
  <div style="width: 500px; min-height: min-content; max-height: 1000px; overflow: hidden" 
       class="p-4 bg-gray-50 dark:bg-gray-800">
    <div class="mb-4 rounded-lg border-l-[4px] border-solid border-blue-600 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900 dark:to-gray-800 p-3 shadow-sm transition-all hover:shadow-md">
      <div class="flex items-center gap-2">
        <strong class="text-base text-blue-600 dark:text-blue-400">{{ dayOfWeekMap[dayjs().locale("zh-cn").format("dddd")] }}</strong>
        <span class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ getMessage }}</span>
      </div>
    </div>

    <div class="rounded-xl bg-white dark:bg-gray-700 shadow-lg transition-all hover:shadow-xl">
      <ul class="divide-y divide-gray-100 dark:divide-gray-600">
        <li v-if="weekendTime.diff > 0" 
            class="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-[13px]">
          <span class="text-gray-600 dark:text-gray-300">距离下班还有</span>
          <span class="font-medium dark:text-gray-200">
            <strong class="text-blue-600 dark:text-blue-400">{{ weekendTime.hours }}</strong> 小时
            <strong class="text-blue-600 dark:text-blue-400">{{ weekendTime.minutes }}</strong> 分钟
          </span>
        </li>
        <li
          v-else
          class="w-full border-b-2 border-neutral-100 dark:border-neutral-600 border-opacity-100 px-4 py-3 text-red-600 dark:text-red-400 text-[13px]">
          <strong>下班了，快回家吧！</strong>
        </li>
        <li
          class="w-full border-b-2 border-neutral-100 dark:border-neutral-600 border-opacity-100 px-4 py-3 text-[13px] dark:text-gray-200">
          距离周末还有 <strong>{{ weekendTime.days }}</strong> 天
          <strong>{{ weekendTime.hours }}</strong> 小时
          <strong>{{ weekendTime.minutes }}</strong> 分钟
        </li>
        <li
          v-if="daysUntilNextPayDay !== 0"
          class="w-full border-b-2 border-neutral-100 dark:border-neutral-600 border-opacity-100 px-4 py-3 dark:text-gray-200">
          距离发工资还有 <strong>{{ daysUntilNextPayDay }}</strong> 天
        </li>
        <li
          v-else
          class="w-full border-b-2 border-neutral-100 dark:border-neutral-600 border-opacity-100 px-4 py-3 text-red-600 dark:text-red-400">
          <strong>工资发放，就在今天</strong>
        </li>
        <template v-for="(days, holiday) in holidayCountdown" :key="holiday">
          <li class="w-full border-b-2 border-neutral-100 dark:border-neutral-600 border-opacity-100 px-4 py-3 text-[13px] dark:text-gray-200">
            距离{{ getHolidayName(holiday) }}还有 <strong>{{ days }}</strong> 天
          </li>
        </template>
      </ul>

      <div class="border-t border-gray-100 dark:border-gray-600 p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800 rounded-b-xl">
        <strong class="text-gray-700 dark:text-gray-300">{{ dayjs().format("YYYY-MM-DD HH:mm:ss") }}</strong>
        <button
          v-if="!saveStatus"
          @click="setTime"
          class="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-700">
          设置
        </button>
        <button
          v-else
          @click="save"
          type="button"
          class="px-6 py-2 rounded-lg border border-blue-500 text-blue-500 dark:text-blue-400 dark:border-blue-400 text-sm font-medium transition-all hover:bg-blue-50 dark:hover:bg-gray-700">
          保存
        </button>
      </div>
    </div>
    <div v-if="saveStatus"
         class="mt-6 rounded-xl bg-white dark:bg-gray-700 shadow-lg p-6 transition-all">
      <h5 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">设置高光时刻</h5>
      <el-form
        ref="timeRef"
        :model="timeForm"
        :rules="rules"
        label-position="right"
        label-width="100px"
        class="space-y-4">
        <el-form-item prop="time" required label="下班时间:" 
                      class="flex items-center">
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
        <el-form-item class="!mb-2">
          <template #label>
            <div class="flex items-center gap-1">
              <el-tooltip
                content="最多可选择两个节日"
                placement="top"
                effect="light">
                <el-icon class="cursor-help">
                  <Warning />
                </el-icon>
              </el-tooltip>
              假期选择:
            </div>
          </template>
          <el-checkbox-group 
            v-model="timeForm.holidays" 
            :max="2">
            <div class="grid grid-cols-3 gap-2">
              <el-checkbox label="spring" class="!mr-0">过年</el-checkbox>
              <el-checkbox label="qingming" class="!mr-0">清明节</el-checkbox>
              <el-checkbox label="labor" class="!mr-0">五一</el-checkbox>
              <el-checkbox label="dragon" class="!mr-0">端午节</el-checkbox>
              <el-checkbox label="autumn" class="!mr-0">中秋节</el-checkbox>
              <el-checkbox label="national" class="!mr-0">国庆节</el-checkbox>
            </div>
          </el-checkbox-group>
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
    <div class="border-t border-gray-100 dark:border-gray-600 p-2 flex items-center gap-2">
      <button @click="toggleTheme('light')" 
              :class="theme === 'light' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'"
              class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
        <el-icon><Sunny /></el-icon>
      </button>
      <button @click="toggleTheme('dark')" 
              :class="theme === 'dark' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'"
              class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
        <el-icon><Moon /></el-icon>
      </button>
      <button @click="toggleTheme('system')" 
              :class="theme === 'system' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'"
              class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
        <el-icon><Monitor /></el-icon>
      </button>
    </div>
  </div>
</template>

<style>
/* Element Plus 暗色主题覆盖 */
html.dark {
  --el-bg-color: #1f2937;
  --el-bg-color-overlay: #374151;
  --el-text-color-primary: #e5e7eb;
  --el-text-color-regular: #d1d5db;
  --el-text-color-secondary: #9ca3af;
  --el-border-color: #4b5563;
  --el-border-color-light: #374151;
  --el-fill-color-blank: #1f2937;
  --el-fill-color-light: #374151;
  --el-mask-color: rgba(0, 0, 0, 0.8);
}

.dark .el-input__wrapper {
  background-color: #374151 !important;
  box-shadow: 0 0 0 1px #4b5563 inset !important;
}

.dark .el-input__wrapper:hover {
  box-shadow: 0 0 0 1px #6b7280 inset !important;
}

.dark .el-select__popper,
.dark .el-time-select__popper {
  background-color: #374151 !important;
  border-color: #4b5563 !important;
}

.dark .el-select-dropdown__item:hover {
  background-color: #4b5563 !important;
}

.dark .el-select-dropdown__item.selected {
  background-color: #3b82f6 !important;
  color: white !important;
}

.dark .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #3b82f6 !important;
  border-color: #3b82f6 !important;
}

.dark .el-checkbox__inner {
  background-color: #374151 !important;
  border-color: #6b7280 !important;
}

.dark .el-checkbox__inner:hover {
  border-color: #3b82f6 !important;
}

.dark .el-dialog {
  background-color: #1f2937 !important;
}

.dark .el-dialog__title {
  color: #e5e7eb !important;
}

.dark .el-tooltip__trigger {
  color: #9ca3af;
}
</style>

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
  ElTimeSelect,
  ElCheckbox,
  ElCheckboxGroup,
  ElTooltip,
  ElIcon
} from "element-plus"
import calendar from "js-calendar-converter"
import { Ripple, initTE } from "tw-elements"
import { computed, onMounted, ref, toRaw, watch } from "vue"

import { Storage } from "@plasmohq/storage"
import { Warning, Sunny, Moon, Monitor } from '@element-plus/icons-vue'

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
  "漫长的岁月 竟没有一适合上班",
  "多站起来走走，别老在工位上",
  "人的终极目标是闲情逸致 而不是工作",
  "虚假意上班，真心实意下班",
  "枯藤老树昏鸦，上班摸鱼下班回家",
  "我虽然上班总迟到 但我下班很准时鸭",
  "上班的我风都吹得倒，下班的我狗都追不到"
]

initTE({ Ripple })
const timeRef = ref(null)
const imgStatus = ref(false)
const timeForm = ref({
  time: "",
  day: null,
  holidays: []
})
const newYearTime = ref()
const afterWorkTime = ref({})
const weekendTime = ref({})
const lunarDate = ref(null)
let targetAfterTime = dayjs("18:00", "HH:mm")
const daysUntilNextPayDay = ref(0)
const saveStatus = ref(false)
const holidayCountdown = ref({})

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

  // 如果当前时间已经过了下班时间，但还在今天，则设置 diff 为 0
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
  // 如果当前时间已经过了本周五的下时间将目标时间设为下周五的下班时间
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
  // 计算下次工资的日期和时间
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

const getHolidayDate = (year) => ({
  spring: calendar.lunar2solar(year, 1, 1).date, // 春节
  qingming: `${year}-04-05`, // 清明节
  labor: `${year}-05-01`, // 劳动节
  dragon: calendar.lunar2solar(year, 5, 5).date, // 端午节
  autumn: calendar.lunar2solar(year, 8, 15).date, // 中秋节
  national: `${year}-10-01` // 国庆节
})

const updateData = () => {
  calcAfterTime()
  calcWeekend()
  calcPay()
  calcNewYear()
  
  // 计算节假日倒计时
  const currentDate = dayjs()
  const currentYear = currentDate.year()
  const holidays = getHolidayDate(currentYear)
  
  holidayCountdown.value = {}
  timeForm.value.holidays.forEach(holiday => {
    let targetDate = dayjs(holidays[holiday])
    
    // 如果当前日期已过节，则计算下一年的日期
    if (currentDate.isAfter(targetDate)) {
      const nextYear = currentYear + 1
      const nextHolidays = getHolidayDate(nextYear)
      targetDate = dayjs(nextHolidays[holiday])
    }
    
    const diff = targetDate.diff(currentDate, 'day')
    holidayCountdown.value[holiday] = diff
  })
}

const getHolidayName = (holiday) => ({
  spring: '过年',
  qingming: '清明节',
  labor: '五一',
  dragon: '端午节',
  autumn: '中秋节',
  national: '国庆节'
})[holiday]

// 主题相关
const theme = ref('system')
const isDark = ref(false)

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

const updateTheme = () => {
  if (theme.value === 'system') {
    isDark.value = mediaQuery.matches
  } else {
    isDark.value = theme.value === 'dark'
  }
  
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  
  storage.set('theme', theme.value)
}

const toggleTheme = (newTheme) => {
  theme.value = newTheme
  updateTheme()
}

// 监听系统主题变化
mediaQuery.addEventListener('change', (e) => {
  if (theme.value === 'system') {
    isDark.value = e.matches
    updateTheme()
  }
})

onMounted(async () => {
  const lYear = calendar.lunar2solar().lYear
  lunarDate.value = calendar.lunar2solar(lYear, 12, 29).date
  console.log(calendar.lunar2solar(lYear, 12, 29))

  const initTime = await storage.get("time")
  if (initTime && Object.keys(initTime)?.length) {
    timeForm.value.day = initTime.day
    timeForm.value.time = initTime.time
    timeForm.value.holidays = initTime.holidays || ['spring']
  } else {
    timeForm.value.day = 5
    timeForm.value.time = "18:00"
    timeForm.value.holidays = ['spring']
  }

  updateData() // 调用一次以确保初始数据确

  setInterval(updateData, 1000) // 每秒钟更新一次数据

  // 初始化主题
  const savedTheme = await storage.get('theme')
  if (savedTheme) {
    theme.value = savedTheme
  }
  updateTheme()
})
</script>
