
import { Button } from 'ant-design-vue'
import { onMounted, reactive, defineComponent } from 'vue'
import type { PropType } from 'vue'
import HomePage from '../HomePage'
import './MusicMask.module.less'

type Test = '123' | '456'
const MusicMask = defineComponent({
  props: {
    test: {
      type: String as PropType<Test>
    }
  },
  name: 'GlMenu',
  setup (props, ctx) {
    const obj = reactive({ count: 0 })
    onMounted(
      () => {
        console.log('vue文档是真的FW')
      }
    )
    const handleTest = () => {
      obj.count++
    }

    console.log(props, ctx)

    return () => {
      return (
        (
          <div styleName='MusicMask'>
            <Button class='test'
              type='primary'
              onClick={handleTest}>
              1231
            </Button>
            <div class='test p-0'>
              {obj.count}
            </div>
            <HomePage />
          </div>
        )
      )
    }
  }

})

export default MusicMask
