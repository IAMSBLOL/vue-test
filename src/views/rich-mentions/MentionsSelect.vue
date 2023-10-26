<template>
  <div v-loading="(loading as boolean)"
       class="mentions-select-wrap">
    <div class="py-[12px] px-2">
      <div v-for="(item, index) in options"
           :key="index"
           :class="[computedActiveCls(index)]"
           class="">
        <div class="select-item p-2 rounded h-10"
             @click="handleClick(item, index)">
          <div class="user-avatar">
            <el-avatar v-if="item?.avatars && item.avatars['50']"
                       :size="24"
                       :src="item?.avatars && item.avatars['50']" />
            <el-avatar v-else
                       :size="24">
              {{ item.nickname?.slice(0, 1)?.toUpperCase() }}
            </el-avatar>
          </div>
          <div class="text-[#1F2736] truncate flex-1 pl-1 text-xs">
            {{ item?.nickname }}
          </div>
        </div>
      </div>
      <div v-if="showNoData"
           class="py-5 flex items-center justify-center text-[#858D99] text-sm">
        暂无可选择成员
      </div>
    </div>
    <div class="more-btn h-10 text-sm py-[12px] px-2"
         @click="handleOpenDialog()">
      查看更多
    </div>
  </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue'
import type { OptionProps } from './mentionsTypes'
import { MentionsContextKey } from './mentionsTypes'
import * as _ from 'lodash'

interface Options extends Record<string, any>, OptionProps {}

const props = defineProps({
  options: {
    type: Array as PropType<Options[]>,
    default: () => []
  }
})

const { activeIndex, setActiveIndex, selectOption, handleCusClick, loading } = inject(
  MentionsContextKey,
  {
    activeIndex: shallowRef(),
    loading: shallowRef(false)
  }
)

const computedActiveCls = computed(() => (index: number) => {
  if (index === activeIndex.value) {
    return 'select-item-active'
  }
  return ''
})

const showNoData = computed(() => {
  return _.isEmpty(props.options)
})

const handleClick = (item: OptionProps, index: number) => {
  if (setActiveIndex) {
    setActiveIndex(index)
  }

  nextTick(() => {
    if (selectOption) {
      selectOption(item)
    }
  })
}

const handleOpenDialog = () => {
  if (handleCusClick) {
    handleCusClick()
  }
}
</script>

<style  scoped>
.mentions-select-wrap {
  width: 200px;
  background-color: #fff;
  overflow: hidden;
  box-shadow: 0 8px 26px 0 rgba(0, 0, 0, 16%);
  border-radius: 8px;
  z-index: 100;

  .select-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px;
    z-index: 100;
  }

  .select-item-active {
    background-color: #f0f2f5;
  }

  .more-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #377bff;
    border-top: 1px solid #cbd1db;
    cursor: pointer;
  }

  .user-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
