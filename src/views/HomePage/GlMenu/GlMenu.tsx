
import { Button } from 'ant-design-vue'
import { onMounted, reactive, defineComponent } from 'vue'
import type { PropType } from 'vue'
import api from '@api'
import './GlMenu.module.less'

type Test = '123' | '456'
const GlMenu = defineComponent({
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
      console.log(api)
      obj.count++
    }

    console.log(props, ctx)

    return () => {
      return (
        (
          <div styleName='GlMenu'>
            <Button class='test'
              type='primary'
              onClick={handleTest}>
              1231
            </Button>
            <div class='test p-0'>
              {obj.count}
            </div>
          </div>
        )
      )
    }
  }

})

export default GlMenu
