<template>
  <div class="about">
    <Ass />
    <RichMentions />
  </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue'
import { Input } from 'ant-design-vue'
import RichMentions from './rich-mentions/RichMentions.vue'
const input:any = ref(null)
const handleOnChange = (e:any) => {
  console.log(e.target.value, 'value')
  const inputValue = e.target.value
  const atIndex = inputValue.indexOf('@')

  const selection :any = window.getSelection()

  console.log('Cursor Position:', input.value.selectionStart)
  if (atIndex !== -1) {
    const range = document.createRange()
    console.log(input.value, 'input.value')
    console.log(atIndex, 'atIndex')
    const textNode = document.createTextNode(input.value)
    console.log(textNode, 'textNode')
    range.setStart(textNode, atIndex)
    range.setEnd(textNode, atIndex + 1)
    const rect = range.getBoundingClientRect()

    console.log('Left:', rect.left)
    console.log('Top:', rect.top)
  }
}
const Ass = () => {
  return (
    <div class='ass text-[120px]'>
      <input ref={input} onInput={handleOnChange} type='text'/>

    </div>
  )
}
</script>

<style>
.ass {
  background-color: aqua;
}
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
