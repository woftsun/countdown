<template>
  <div class="w-[500px] relative" :class="[
    theme === 'spring' 
      ? 'bg-gradient-to-br from-[#BE002F]/98 to-[#E5004F]/95 dark:from-[#8B0020]/98 dark:to-[#BE002F]/95'
      : 'bg-gradient-to-br from-gray-50/95 to-white/80 dark:from-gray-900/95 dark:to-gray-800/90'
  ]">
    <!-- 主界面内容 -->
    <div class="h-full" :class="{'translate-x-[-100%] transition-transform duration-300': saveStatus}">
      <!-- 顶部问候语卡片 -->
      <div class="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span class="flex items-center gap-1">
              {{ dayOfWeekMap[dayjs().locale("zh-cn").format("dddd")] }}
              <span v-if="isWeekend" class="text-xs text-blue-500 dark:text-blue-400">
                (快乐假期!)
              </span>
            </span>
          </span>
          <span class="text-sm font-mono text-gray-600 dark:text-gray-400">
            {{ dayjs().format("YYYY-MM-DD HH:mm:ss") }}
          </span>
        </div>
        <h1 class="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 animate-gradient">
          {{ getMessage }}
        </h1>
      </div>

      <!-- 倒计时卡片区域 -->
      <div class="p-4 pb-16 overflow-auto">
        <div class="space-y-3">
          <!-- 下班倒计时 -->
          <div class="p-4 rounded-xl bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-100 dark:border-gray-700/30 group hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all">
            <div class="flex items-center justify-between">
              <span class="text-[13px] font-medium text-gray-700 dark:text-gray-400 flex items-center gap-2">
                距离下班
                <span class="text-xs text-blue-500/80 dark:text-blue-400/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  (努力工作中...)
                </span>
              </span>
              <div v-if="weekendTime.diff > 0" 
                   class="flex items-center gap-2">
                <div class="flex items-center gap-1">
                  <span class="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 text-blue-600 dark:text-blue-400 rounded-lg font-mono">
                    {{ weekendTime.hours }}
                  </span>
                  <span class="text-[13px] text-gray-600 dark:text-gray-400">时</span>
                  <span class="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 text-blue-600 dark:text-blue-400 rounded-lg font-mono ml-2">
                    {{ weekendTime.minutes }}
                  </span>
                  <span class="text-[13px] text-gray-600 dark:text-gray-400">分</span>
                </div>
              </div>
              <span v-else class="text-green-500 dark:text-green-400 font-medium text-[13px] animate-bounce">
                🎉 已下班
              </span>
            </div>
          </div>

          <!-- 周末倒计时 -->
          <div class="p-4 rounded-xl bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-100 dark:border-gray-700/30 group hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all">
            <div class="flex items-center justify-between">
              <span class="text-[13px] font-medium text-gray-700 dark:text-gray-400 flex items-center gap-2">
                距离周末
                <span class="text-xs text-blue-500/80 dark:text-blue-400/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  (周末愉快!)
                </span>
              </span>
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-1">
                  <span class="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 text-blue-600 dark:text-blue-400 rounded-lg font-mono">
                    {{ weekendTime.days }}
                  </span>
                  <span class="text-[13px] text-gray-600 dark:text-gray-400">天</span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 text-blue-600 dark:text-blue-400 rounded-lg font-mono">
                    {{ weekendTime.hours }}
                  </span>
                  <span class="text-[13px] text-gray-600 dark:text-gray-400">时</span>
                  <span class="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 text-blue-600 dark:text-blue-400 rounded-lg font-mono ml-2">
                    {{ weekendTime.minutes }}
                  </span>
                  <span class="text-[13px] text-gray-600 dark:text-gray-400">分</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 工资倒计时 -->
          <div class="p-4 rounded-xl bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-100 dark:border-gray-700/30 group hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all">
            <div class="flex items-center justify-between">
              <span class="text-[13px] font-medium text-gray-700 dark:text-gray-400 flex items-center gap-2">
                距离发工资
                <span class="text-xs text-blue-500/80 dark:text-blue-400/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  (为生活努力!)
                </span>
              </span>
              <div v-if="daysUntilNextPayDay !== 0" class="flex items-center gap-1">
                <span class="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 text-blue-600 dark:text-blue-400 rounded-lg font-mono">
                  {{ daysUntilNextPayDay }}
                </span>
                <span class="text-[13px] text-gray-600 dark:text-gray-400">天</span>
              </div>
              <span v-else class="text-green-500 dark:text-green-400 font-medium text-[13px] animate-bounce">
                🎉 今天发工资
              </span>
            </div>
          </div>

          <!-- 节假日倒计时 -->
          <template v-for="(days, holiday) in holidayCountdown" :key="holiday">
            <div class="p-4 rounded-xl bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-100 dark:border-gray-700/30 group hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all">
              <div class="flex items-center justify-between">
                <span class="text-[13px] font-medium text-gray-700 dark:text-gray-400 flex items-center gap-2">
                  距离{{ getHolidayName(holiday) }}
                  <span class="text-xs text-blue-500/80 dark:text-blue-400/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    (假期快乐!)
                  </span>
                </span>
                <div class="flex items-center gap-1">
                  <span class="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 text-blue-600 dark:text-blue-400 rounded-lg font-mono">
                    {{ days }}
                  </span>
                  <span class="text-[13px] text-gray-600 dark:text-gray-400">天</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="absolute bottom-0 left-0 right-0 p-2.5 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm border-t border-gray-100 dark:border-gray-700/30">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <el-tooltip content="浅色模式" placement="top" :show-after="100">
              <button @click="toggleTheme('light')" 
                      :class="['theme-button', theme === 'light' && 'active']">
                <el-icon><Sunny /></el-icon>
              </button>
            </el-tooltip>
            
            <el-tooltip content="深色模式" placement="top" :show-after="100">
              <button @click="toggleTheme('dark')" 
                      :class="['theme-button', theme === 'dark' && 'active']">
                <el-icon><Moon /></el-icon>
              </button>
            </el-tooltip>
            
            <el-tooltip content="跟随系统" placement="top" :show-after="100">
              <button @click="toggleTheme('system')" 
                      :class="['theme-button', theme === 'system' && 'active']">
                <el-icon><Monitor /></el-icon>
              </button>
            </el-tooltip>
            
            <el-tooltip content="春节模式" placement="top" :show-after="100">
              <button @click="toggleTheme('spring')" 
                      :class="['theme-button spring-theme-btn', theme === 'spring' && 'active']">
                <el-icon class="text-[#BE002F]"><Present /></el-icon>
              </button>
            </el-tooltip>
          </div>
          <button @click="setTime" 
                  class="px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-[13px] font-medium transition-all">
            设置
          </button>
        </div>
      </div>
    </div>

    <!-- 设置面板样式 -->
    <div class="absolute inset-0 h-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl transition-transform duration-300"
         :class="{'translate-x-[100%]': !saveStatus}">
      <div class="p-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
        <h2 class="text-lg font-medium text-gray-900 dark:text-gray-400">设置</h2>
        <button @click="saveStatus = false"
                class="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
          <el-icon><Close /></el-icon>
        </button>
      </div>
      
      <!-- 设置面板内容区 -->
      <div class="p-4">
        <el-form
          ref="timeRef"
          :model="timeForm"
          :rules="rules"
          label-position="top"
          class="space-y-6">
          <el-form-item prop="time" required label="下班时间">
            <el-time-select
              v-model="timeForm.time"
              class="w-full"
              start="08:30"
              step="00:01"
              end="23:30"
              placeholder="选择下班时间" />
          </el-form-item>
          <el-form-item prop="day" required label="工资发放日">
            <el-select
              v-model="timeForm.day"
              class="w-full"
              placeholder="请选择发薪日">
              <el-option
                v-for="day in 31"
                :key="day"
                :label="`每月 ${day} 号`"
                :value="day" />
            </el-select>
          </el-form-item>
          <el-form-item class="!mb-0">
            <template #label>
              <div class="flex items-center gap-1">
                <el-tooltip
                  content="最多可选择两个节日"
                  placement="top"
                  :show-after="100">
                  <el-icon class="text-gray-400 cursor-help"><Warning /></el-icon>
                </el-tooltip>
                <span class="text-sm text-gray-700 dark:text-gray-400">节假日提醒</span>
              </div>
            </template>
            <el-checkbox-group 
              v-model="timeForm.holidays" 
              :max="2"
              class="grid grid-cols-4 gap-3 min-h-[30px]">
              <el-checkbox label="newyear" class="!mr-0">元旦</el-checkbox>
              <el-checkbox label="spring" class="!mr-0">春节</el-checkbox>
              <el-checkbox label="qingming" class="!mr-0">清明</el-checkbox>
              <el-checkbox label="labor" class="!mr-0">劳动</el-checkbox>
              <el-checkbox label="dragon" class="!mr-0">端午</el-checkbox>
              <el-checkbox label="autumn" class="!mr-0">中秋</el-checkbox>
              <el-checkbox label="national" class="!mr-0">国庆</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item class="!mb-4">
            <template #label>
              <div class="flex items-center gap-1">
                <el-tooltip
                  content="到达下班时间时在桌面右下角发送通知"
                  placement="top"
                  :show-after="100">
                  <el-icon class="text-gray-400 cursor-help"><Warning /></el-icon>
                </el-tooltip>
                <span class="text-sm text-gray-700 dark:text-gray-400">下班通知</span>
              </div>
            </template>
            <el-checkbox v-model="timeForm.enableNotification">启用下班提醒</el-checkbox>
          </el-form-item>
        </el-form>
      </div>

      <!-- 底部按钮区 -->
      <div class="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700/50">
        <div class="flex justify-end gap-2">
          <button
            @click="saveStatus = false"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            取消
          </button>
          <button
            @click="save"
            class="px-4 py-2 rounded-lg bg-blue-500 dark:bg-blue-500 text-white text-sm font-medium transition-all hover:bg-blue-600 dark:hover:bg-blue-600">
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Element Plus 样式现代化 */
.el-select__wrapper,
.el-input__wrapper {
  background-color: transparent !important;
  border: 1px solid rgba(229, 231, 235, 1);
  border-radius: 0.75rem;
  transition: all 0.3s;
  box-shadow: none !important;
}

.dark .el-select__wrapper,
.dark .el-input__wrapper {
  border-color: rgba(55, 65, 81, 0.3);
}

.el-select__wrapper:hover,
.el-input__wrapper:hover {
  border-color: rgba(59, 130, 246, 0.5);
}

.dark .el-select__wrapper:hover,
.dark .el-input__wrapper:hover {
  border-color: rgba(96, 165, 250, 0.5);
}

.el-select__wrapper.is-focus,
.el-input__wrapper.is-focus {
  border-color: rgb(59, 130, 246);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.dark .el-select__wrapper.is-focus,
.dark .el-input__wrapper.is-focus {
  border-color: rgb(96, 165, 250);
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.1);
}

.el-checkbox__inner {
  border-radius: 0.5rem;
  border-width: 2px;
  transition: all 0.3s;
}

.el-checkbox__input.is-checked .el-checkbox__inner {
  background-image: linear-gradient(to right, rgb(59, 130, 246), rgb(168, 85, 247));
  border-color: transparent;
}

/* 主题切换按钮 */
.theme-button {
  padding: 0.375rem;
  border-radius: 0.5rem;
  color: rgb(156, 163, 175);
  color: rgb(107, 114, 128);
  transition: all 0.3s;
}

.theme-button:hover {
  background-image: linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1));
  background-image: linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(168, 85, 247, 0.05));
}

.theme-button.active {
  background-image: linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(168, 85, 247, 0.2));
  color: rgb(37, 99, 235);
  color: rgb(147, 197, 253);
}

/* 春节主题按钮 */
.spring-theme-btn {
  position: relative;
  overflow: hidden;
}

.spring-theme-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(to right, rgba(190, 0, 47, 0.2), rgba(255, 182, 30, 0.2));
  opacity: 0;
  transition: opacity 0.3s;
}

.spring-theme-btn:hover::before {
  opacity: 1;
}

.spring-theme-btn.active {
  background-image: linear-gradient(to right, rgba(190, 0, 47, 0.3), rgba(255, 182, 30, 0.3));
  color: #BE002F;
}

/* 暗黑模式下未选中的图标 */
.dark .theme-button:not(.active) {
  color: rgb(156, 163, 175);
}

.dark .theme-button:not(.active):hover {
  color: rgb(209, 213, 219);
}

.dark .spring-theme-btn:not(.active) {
  color: #E5004F;
}

.dark .spring-theme-btn:not(.active):hover {
  color: #FFB61E;
}

/* 动画效果 */
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient {
  animation: gradient 6s ease infinite;
  background-size: 200% 200%;
}

/* 下拉菜单样式 */
.el-select__popper,
.el-time-select__popper {
  background-color: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(229, 231, 235, 1);
  border-radius: 0.75rem;
  margin-bottom: 8px !important;
}

.dark .el-select__popper,
.dark .el-time-select__popper {
  background-color: rgba(31, 41, 55, 0.95) !important;
  border-color: rgba(55, 65, 81, 0.3);
}

.el-select-dropdown__item {
  border-radius: 0.5rem;
  margin: 0 0.25rem;
}

.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-image: linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1));
  background-image: linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(168, 85, 247, 0.05));
}

.el-select-dropdown__item.selected {
  background-image: linear-gradient(to right, rgb(59, 130, 246), rgb(168, 85, 247));
  color: white;
}

/* 调整卡片背景色 */
.spring-theme .bg-white\/60 {
  background-color: rgba(190, 0, 47, 0.08) !important; /* 春节模式卡片背景 */
}

.spring-theme.dark .bg-white\/60 {
  background-color: rgba(139, 0, 32, 0.15) !important;
}

/* 移除设置里选择框的背景色 */
.spring-theme .el-select__wrapper,
.spring-theme .el-input__wrapper {
  background-color: transparent !important;
  border-color: rgba(190, 0, 47, 0.3) !important;
}

/* 确保非春节模式的背景色正确 */
.bg-white\/60 {
  background-color: rgba(255, 255, 255, 0.6) !important;
}

.dark .bg-white\/60 {
  background-color: rgba(31, 41, 55, 0.4) !important;
}

/* 春节模式的渐变背景和卡片样式 */
.spring-theme .from-blue-500\/10,
.spring-theme .to-purple-500\/10,
.spring-theme .from-blue-500\/5,
.spring-theme .to-purple-500\/5 {
  background-image: linear-gradient(to right, 
    rgba(190, 0, 47, 0.2),  /* 增加红色透明度 */
    rgba(255, 182, 30, 0.2)  /* 增加金色透明度 */
  ) !important;
}

/* 文字渐变色加深 */
.spring-theme .bg-gradient-to-r {
  background-image: linear-gradient(to right, 
    #D10034,  /* 更鲜艳的红色 */
    #FF1A1A   /* 更鲜艳的红色 */
  ) !important;
}

/* 卡片背景色 */
.spring-theme .bg-white\/60 {
  background-color: rgba(190, 0, 47, 0.08) !important;
}

.spring-theme.dark .bg-white\/60 {
  background-color: rgba(139, 0, 32, 0.15) !important;
}

/* 数字显示背景 */
.spring-theme .from-blue-500\/10 {
  background-image: linear-gradient(to right, 
    rgba(190, 0, 47, 0.1), 
    rgba(255, 182, 30, 0.1)
  ) !important;
}

/* 移除设置里选择框的背景色 */
.spring-theme .el-select__wrapper,
.spring-theme .el-input__wrapper {
  background-color: transparent !important;
  border-color: rgba(190, 0, 47, 0.3) !important;
}

/* 确保非春节模式的背景色正确 */
.bg-white\/60 {
  background-color: rgba(255, 255, 255, 0.6) !important;
}

.dark .bg-white\/60 {
  background-color: rgba(31, 41, 55, 0.4) !important;
}

/* 春节模式下的文字颜色 */
.spring-theme .text-blue-500,
.spring-theme .text-blue-600,
.spring-theme .text-blue-400 {
  color: #BE002F !important;
}

.spring-theme.dark .text-blue-500,
.spring-theme.dark .text-blue-600,
.spring-theme.dark .text-blue-400 {
  color: #E5004F !important;
}

/* 春节主题按钮样式 */
.spring-theme-btn {
  position: relative;
  overflow: hidden;
}

.spring-theme-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(to right, rgba(190, 0, 47, 0.2), rgba(255, 182, 30, 0.2));
  opacity: 0;
  transition: opacity 0.3s;
}

.spring-theme-btn:hover::before {
  opacity: 1;
}

.spring-theme-btn.active {
  background-image: linear-gradient(to right, rgba(190, 0, 47, 0.3), rgba(255, 182, 30, 0.3));
  color: #BE002F;
}

/* 暗黑模式下未选中的图标 */
.dark .spring-theme-btn:not(.active) {
  color: #E5004F;
}

.dark .spring-theme-btn:not(.active):hover {
  color: #FFB61E;
}

/* 调整设置按钮颜色 */
.spring-theme button.bg-gradient-to-r {
  background-image: linear-gradient(to right, 
    rgba(190, 0, 47, 0.7),  /* 更浅的红色 */
    rgba(229, 0, 79, 0.7)   /* 更浅的红色 */
  ) !important;
}

.spring-theme button.bg-gradient-to-r:hover {
  background-image: linear-gradient(to right, 
    rgba(190, 0, 47, 0.8),
    rgba(229, 0, 79, 0.8)
  ) !important;
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
import { Warning, Sunny, Moon, Monitor, Close, Present } from '@element-plus/icons-vue'

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
  "工作再累，也别忘了摸鱼哦，钱是老板的，命是自己的",
  "漫长的岁月 竟没有一适合上班",
  "多起来走走，别老在工位上",
  "人的终极目标是闲情逸致 而不是工作",
  "虚假意上班，真心实意下班",
  "枯藤老树昏鸦，上班摸鱼下班回家",
  "我虽然上班总迟到，但我下班准时鸭",
  "上班的我风都吹得倒，下班的我狗都追不上",
  "上班不摸鱼，和咸鱼有什么区别",
  "早安，打工人！今天也要元气满满地摸鱼哦",
  "摸鱼才是本职工作，上班只是副业",
  "假装很忙，实则在摸鱼，这才是职场精英",
  "上班时间不摸鱼，对不起这份工资",
  "摸鱼使我快乐，上班使我疲惫",
  "上班就是一场修行，摸鱼就是得道",
  "打工人的意志就是要一边摸鱼一边完成工作",
  "生命在于摸鱼，工作在于划水",
  "摸鱼才是人生赢家，忙碌只是看起来很厉害"
]

initTE({ Ripple })
const timeRef = ref(null)
const imgStatus = ref(false)
const timeForm = ref({
  time: "",
  day: null,
  holidays: [],
  enableNotification: true
})
const newYearTime = ref()
const afterWorkTime = ref({})
const weekendTime = ref({})
const lunarDate = ref(null)
let targetAfterTime = dayjs("18:00", "HH:mm")
const daysUntilNextPayDay = ref(0)
const saveStatus = ref(false)
const holidayCountdown = ref({})
const hasNotified = ref(false)
const lastNotificationDate = ref('')

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
  // 如果当前时间已经过了本周五的下时间将目标时间设下周五的下班时间
  if (currentTime.isAfter(closingTimeFriday)) {
    closingTimeFriday = closingTimeFriday.add(7, "day")
  }

  // 计算剩���天数、小时、分和秒数
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
  // 获取当前年份和份
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

const getHolidayName = (holiday) => ({
  newyear: '元旦',
  spring: '春节',
  qingming: '清明节',
  labor: '劳动节',
  dragon: '端午节',
  autumn: '中秋节',
  national: '国庆节'
})[holiday]

const getHolidayDate = (year) => ({
  newyear: `${year}-01-01`, // 元旦
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
  
  // 检查是否到达下班时间
  if (afterWorkTime.value.diff === 0) {
    sendOffWorkNotification()
  }
  
  // 计算节假日倒计时
  const currentDate = dayjs()
  const currentYear = currentDate.year()
  const holidays = getHolidayDate(currentYear)
  
  holidayCountdown.value = {}
  timeForm.value.holidays.forEach(holiday => {
    let targetDate = dayjs(holidays[holiday])
    
    // 如果当前日期已过节，则计算下一年期
    if (currentDate.isAfter(targetDate)) {
      const nextYear = currentYear + 1
      const nextHolidays = getHolidayDate(nextYear)
      targetDate = dayjs(nextHolidays[holiday])
    }
    
    const diff = targetDate.diff(currentDate, 'day')
    holidayCountdown.value[holiday] = diff
  })
}

// 主题相关
const theme = ref('system')
const isDark = ref(false)

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

const updateTheme = () => {
  // 先移除 spring-theme 类
  document.documentElement.classList.remove('spring-theme')
  
  if (theme.value === 'system') {
    isDark.value = mediaQuery.matches
  } else if (theme.value === 'spring') {
    isDark.value = false
    // 这里可以添加春节主题的特殊处理
    document.documentElement.classList.add('spring-theme')
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

// 添加判断是否为周末的计算属性
const isWeekend = computed(() => {
  const day = dayjs().day()
  return day === 0 || day === 6
})

// 检查是否有通知权限
const checkNotificationPermission = async () => {
  if (Notification.permission !== "granted") {
    await Notification.requestPermission()
  }
}

// 修改发送通知逻辑
const sendOffWorkNotification = async () => {
  const today = dayjs().format('YYYY-MM-DD')
  
  // 检查今天是否已经提醒过
  if (!lastNotificationDate.value) {
    lastNotificationDate.value = await storage.get('lastNotificationDate') || ''
  }
  
  if (Notification.permission === "granted" 
      && timeForm.value.enableNotification 
      && lastNotificationDate.value !== today) {
    new Notification("下班提醒", {
      body: "亲爱的打工人，到下班时间啦！收拾东西准备回家吧 🎉",
      icon: "icon-48.png"
    })
    
    // 更新并保存最后通知日期
    lastNotificationDate.value = today
    await storage.set('lastNotificationDate', today)
  }
}

onMounted(async () => {
  const lYear = calendar.lunar2solar().lYear
  lunarDate.value = calendar.lunar2solar(lYear, 12, 29).date
  console.log(calendar.lunar2solar(lYear, 12, 29))

  const initTime = await storage.get("time")
  if (initTime && Object.keys(initTime)?.length) {
    timeForm.value.day = initTime.day
    timeForm.value.time = initTime.time
    timeForm.value.holidays = initTime.holidays || ['spring']
    timeForm.value.enableNotification = initTime.enableNotification ?? true
  } else {
    timeForm.value.day = 5
    timeForm.value.time = "18:00"
    timeForm.value.holidays = ['spring']
    timeForm.value.enableNotification = true
  }

  updateData() // 调用一次以保初始数据确

  setInterval(updateData, 1000) // 秒钟更新一次数据

  // 初始化主题
  const savedTheme = await storage.get('theme')
  if (savedTheme) {
    theme.value = savedTheme
  }
  updateTheme()

  // 请求通知权限
  await checkNotificationPermission()

  // 初始化最后通知日期
  lastNotificationDate.value = await storage.get('lastNotificationDate') || ''
})
</script>
