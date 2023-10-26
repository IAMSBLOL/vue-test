<template>
  <div class="mentions-select-wrap"
       v-loading="(loading as boolean)">
    <div v-for="(item, index) in options"
         class="select-item h-10"
         :class="[computedActiveCls(index)]"
         :key="index"
         @click="handleClick(item, index)">
      user:{{ item.label }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { PropType } from 'vue'
import { OptionProps, MentionsContextKey } from './mentionsTypes'

defineProps({
  options: {
    type: Array as PropType<OptionProps[]>,
    default: () => []
  }
})

const {
  activeIndex,
  setActiveIndex,
  selectOption,

  loading
} = inject(MentionsContextKey, {
  activeIndex: shallowRef(),
  loading: shallowRef(false)
})

const computedActiveCls = computed(() => {
  return (index: number) => {
    if (index === activeIndex.value) {
      return 'select-item-active'
    }
    return ''
  }
})

const handleClick = (item: OptionProps, index: number) => {
  setActiveIndex && setActiveIndex(index)
  nextTick(() => {
    selectOption && selectOption(item)
  })
}
</script>

<style lang="scss" scoped>
.mentions-select-wrap {
	width: 100%;

	.select-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.select-item-active {
		background-color: aquamarine;
	}
}
</style>
