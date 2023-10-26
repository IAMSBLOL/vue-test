<template>
  <div class="el-textarea relative cus-mentions-wrap">
    <textarea v-model="state.value"
              @input="onChange"
              @blur="onInputBlur"
              @focus="onInputFocus"
              @keydown="onKeyDown"
              @keyup="onKeyUp"
              ref="textarea"
              placeholder="Please input"
              type="textarea"
              class="el-textarea__inner textarea" />
    <div ref="measure"
         class="mentions—measure el-textarea__inner"
         v-if="state.measuring">
      {{ state.value.slice(0, state.measureLocation) }}
      <el-popover placement="top-end"
                  :width="100"
                  :visible="state.measuring">
        <template #reference>
          <span ref="measureTarget">{{ state.measurePrefix }}</span>
        </template>

        <MentionsSelect :options="options" />
      </el-popover>

      {{ state.value.slice(state.measureLocation + state.measurePrefix.length) }}
    </div>
  </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue'
import MentionsSelect from './MentionsSelect.vue'
import KeyCode from './keyCode'
import type { EventHandler, OptionProps, MentionsContextKey } from './mentionsTypes'
import {
  getBeforeSelectionText,
  getLastMeasureIndex,
  replaceWithMeasure,
  setInputSelection,
  //
  filterOption as defaultFilterOption,
  validateSearch as defaultValidateSearch
} from './util'

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  prefix: {
    type: String
  },
  split: {
    type: String,
    // 空格
    default: ' '
  },
  validateSearch: {
    type: Function,
    default: defaultValidateSearch
  },
  filterOption: {
    type: [Boolean, Function] as PropType<typeof defaultFilterOption | false>,
    default: () => defaultFilterOption
  },
  loading: { type: Boolean, default: false },
  options: {
    type: Array as PropType<OptionProps[]>,
    default: () => [
      {
        value: 'afc163',
        label: 'afc163'
      },
      {
        value: 'zombieJ',
        label: 'zombieJ'
      },
      {
        value: 'yesmeck',
        label: 'yesmeck'
      }
    ]
  }
})

const emit = defineEmits(['change', 'focus', 'blur', 'pressenter', 'search', 'select'])

const focusId = ref()

const textarea = ref<HTMLTextAreaElement | null>(null)

const measure = ref<HTMLDivElement | null>(null)

const measureTarget = ref<HTMLSpanElement | null>(null)

const state = reactive({
  value: props.value || '',
  measuring: false,
  measureLocation: 0,
  measureText: null,
  measurePrefix: '',
  activeIndex: 0,
  isFocus: false
})

watchEffect(() => {
  state.value = props.value
})

const getOptions = (measureText?: string): OptionProps[] => {
  const targetMeasureText = measureText || state.measureText || ''
  const { filterOption } = props
  const list = props.options.filter((option: OptionProps) => {
    /** Return all result if `filterOption` is false. */
    if (!!filterOption === false) {
      return true
    }
    return (filterOption as Function)(targetMeasureText, option)
  })
  return list
}

const options = computed(() => {
  return getOptions()
})

const triggerChange = (val: string) => {
  emit('change', val)
}

const onChange: EventHandler = ({ target: { value, composing }, isComposing }) => {
  if (isComposing || composing) return
  triggerChange(value)
}

const startMeasure = (measureText: string, measurePrefix: string, measureLocation: number) => {
  Object.assign(state, {
    measuring: true,
    measureText,
    measurePrefix,
    measureLocation,
    activeIndex: 0
  })
}
const stopMeasure = (callback?: () => void) => {
  console.log('当前这个要被删了的艾特的位置', state.measureLocation)
  Object.assign(state, {
    measuring: false,
    measureLocation: 0,
    measureText: null
  })
  callback?.()
}

const selectOption = (option: OptionProps) => {
  if (!textarea.value) {
    return
  }
  const { split } = props
  const { value: mentionValue = '' } = option
  console.log(textarea.value.selectionStart, 'textarea.value.selectionStart')
  const { text, selectionLocation } = replaceWithMeasure(state.value, {
    measureLocation: state.measureLocation,
    targetText: mentionValue,
    prefix: state.measurePrefix,
    selectionStart: textarea.value.selectionStart,
    split
  })

  console.log(text, 'text')

  triggerChange(text)
  stopMeasure(() => {
    setInputSelection(textarea.value as HTMLTextAreaElement, selectionLocation)
  })

  emit('select', option, state.measurePrefix)
}

const onKeyDown = (event: KeyboardEvent) => {
  const { which } = event

  if (!state.measuring) {
    return
  }

  if (which === KeyCode.UP || which === KeyCode.DOWN) {
    const optionLen = options.value.length
    const offset = which === KeyCode.UP ? -1 : 1
    const newActiveIndex = (state.activeIndex + offset + optionLen) % optionLen
    state.activeIndex = newActiveIndex
    event.preventDefault()
  } else if (which === KeyCode.ESC) {
    stopMeasure()
  } else if (which === KeyCode.ENTER) {
    // Measure hit
    event.preventDefault()
    if (!options.value.length) {
      stopMeasure()
      return
    }
    const option = options.value[state.activeIndex]
    console.log(option, 'option')
    selectOption(option as any)
  }
}

const onKeyUp = (event: KeyboardEvent) => {
  const { key, which } = event
  const { measureText: prevMeasureText, measuring } = state
  const { prefix, validateSearch } = props
  const target = event.target as HTMLTextAreaElement
  if ((target as any).composing) {
    return
  }
  const selectionStartText = getBeforeSelectionText(target)
  const { location: measureIndex, prefix: measurePrefix } = getLastMeasureIndex(
    selectionStartText,
    prefix
  )

  if ([KeyCode.ESC, KeyCode.UP, KeyCode.DOWN, KeyCode.ENTER].indexOf(which) !== -1) {
    return
  }

  if (measureIndex !== -1) {
    const measureText = selectionStartText.slice(measureIndex + measurePrefix.length)
    const validateMeasure = validateSearch(measureText, props)

    const matchOption = !!getOptions(measureText).length

    console.log(validateMeasure, 'validateMeasure')
    console.log(measureIndex, 'measureIndex')

    if (validateMeasure) {
      if (
        key === measurePrefix ||
        key === 'Shift' ||
        measuring ||
        (measureText !== prevMeasureText && matchOption)
      ) {
        startMeasure(measureText, measurePrefix, measureIndex)
      }
    } else if (measuring) {
      stopMeasure()
    }

    if (validateMeasure) {
      emit('search', measureText, measurePrefix)
    }
  } else if (measuring) {
    stopMeasure()
  }
}

const onFocus = (event: Event) => {
  clearTimeout(focusId.value)
  const { isFocus } = state
  if (!isFocus && event) {
    emit('focus', event)
  }
  state.isFocus = true
}
const onBlur = (event: Event) => {
  focusId.value = setTimeout(() => {
    state.isFocus = false
    stopMeasure()
    emit('blur', event)
  }, 100)
}

const onInputFocus = (event: Event) => {
  onFocus(event)
}
const onInputBlur = (event: Event) => {
  onBlur(event)
}

const setActiveIndex = (activeIndex: number) => {
  state.activeIndex = activeIndex
}

provide(MentionsContextKey, {
  activeIndex: toRef(state, 'activeIndex'),
  setActiveIndex,
  selectOption,
  onFocus,
  onBlur,
  loading: toRef(props, 'loading')
})

onUpdated(() => {
  nextTick(() => {
    if (state.measuring) {
      if (measure.value && textarea.value) {
        measure.value.scrollTop = textarea.value.scrollTop
      }
    }
  })
})
</script>

<style lang="scss" scoped>
.cus-mentions-wrap {
  box-sizing: border-box;
  white-space: pre-wrap;
  vertical-align: bottom;
  overflow: hidden;
  display: inline-block;
  height: auto;
}

.mentions—measure {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  color: transparent;
  inset-inline-end: 0;
  inset-inline-start: 0;
  pointer-events: none;
  overflow: auto;
  width: 100%;
  height: 100%;

  & > span {
    display: inline-block;
    min-height: 1em;
  }
}

.textarea,
.mentions—measure {
  word-wrap: break-word;
  vertical-align: top;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
