<template>
  <div style="width: 500px" class="p-4">
    <div class="mb-4 rounded-md border-l-[6px] border-solid border-blue-600 bg-blue-100 p-2.5 dark:border-white dark:bg-sky-900">
      今天是 <strong>星期五</strong>，工作再累，也别忘了摸鱼哦，钱是老板的，命是自己的
    </div>
    <div
        class="border-b block w-full rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
      <ul class="w-full">
        <li
            class="w-full border-b-2 border-neutral-100 border-opacity-100 px-4 py-3 dark:border-opacity-50">
          距离下班还有 {{ afterWorkTime.hours }} 小时 {{ afterWorkTime.minutes }} 分钟 {{ afterWorkTime.seconds }} 秒
        </li>
        <li
            class="w-full border-b-2 border-neutral-100 border-opacity-100 px-4 py-3 dark:border-opacity-50">
          距离周末还有 {{ weekendTime.days }} 天 {{ weekendTime.hours }} 小时 {{ weekendTime.minutes }} 分钟 {{ weekendTime.seconds }} 秒
        </li>
        <li
            class="w-full border-b-2 border-neutral-100 border-opacity-100 px-4 py-3 dark:border-opacity-50">
          距离发工资还有 4 天
        </li>
        <li
            class="w-full border-b-2 border-neutral-100 border-opacity-100 px-4 py-3 dark:border-opacity-50">
          距离过年还有 {{ newYearTime }} 天
        </li>
      </ul>
      <div
          class="border-neutral-100 p-4 dark:border-neutral-600 dark:text-neutral-50 flex justify-between items-center">
       <strong>当前时间:  {{ dayjs().format('YYYY-MM-DD HH:mm:ss') }}</strong>
        <button
            type="button"
            class="inline-block rounded border-2 border-primary-100 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:border-primary-accent-100 hover:bg-neutral-500 hover:bg-opacity-10 focus:border-primary-accent-100 focus:outline-none focus:ring-0 active:border-primary-accent-200 dark:text-primary-100 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
            data-te-ripple-init>
          设置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import './styles/index.css'
import 'element-plus/dist/index.css'
import calendar from 'js-calendar-converter'
import {onMounted, ref} from 'vue'
import { ElCard } from 'element-plus'
import {
  Ripple,
  initTE,
} from "tw-elements";
initTE({ Ripple });
import dayjs from 'dayjs'
const targetAfterTime = dayjs('18:00:00', 'HH:mm:ss')
const newYearTime = ref();
const afterWorkTime = ref({})
const weekendTime = ref({})
const lunarDate = ref(null)
const action = () => {
  const extensionId = chrome.runtime.id
  chrome.tabs.create({
    url: `chrome-extension://${extensionId}/tabs/flashSale.html`
  })
}

const calcAfterTime = () => {
  const currentTime = dayjs();
  const diff = targetAfterTime.diff(currentTime);
  afterWorkTime.value = {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes:  Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  }
}

const calcWeekend = () => {
  const closingTimeFriday = dayjs().day(5).set('hour', targetAfterTime.hour()).set('minute', targetAfterTime.minute()).set('second', 0);
  const currentTime = dayjs();

// 如果当前时间已经过了本周五的下班时间，将目标时间设为下周五的下班时间
  if (currentTime.isAfter(closingTimeFriday)) {
    closingTimeFriday.add(7, 'day');
  }

// 计算剩余的天数、小时、分钟和秒数
  const diff = closingTimeFriday.diff(currentTime);
   weekendTime.value = {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes:  Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
    }
  console.log(weekendTime.value);
}

const calcNewYear = () => {
  const currentTime = dayjs();
  newYearTime.value = dayjs(lunarDate.value).diff(currentTime, 'day');
}

onMounted(() => {
  const lYear = calendar.lunar2solar().lYear;
  lunarDate.value = calendar.lunar2solar(lYear,12,30).lunarDate;
  const updateData = () => {
    calcAfterTime();
    calcWeekend();
    calcNewYear();
  };

  updateData(); // 调用一次以确保初始数据正确

  setInterval(updateData, 1000); // 每秒钟更新一次数据
});
</script>
<style>
html {
  margin: 0;
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}
</style>
