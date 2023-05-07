import { onBeforeMount } from 'vue'
export const useTest = () => {
  onBeforeMount(() => {
    console.log('test')
  })
}
