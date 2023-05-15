
import { Button, Popover } from 'ant-design-vue'
import { onMounted, reactive, defineComponent } from 'vue'
import GlMenu from './GlMenu'
import { useTest } from '../../hooks'
import './HomePage.module.less'

const HomePage = defineComponent({
  name: 'HomePage',
  setup (props, ctx) {
    const obj = reactive({ count: 0 })
    onMounted(
      () => {
        console.log('vue文档是真的FW')
      }
    )
    useTest()
    const handleTest = () => {
      console.log(111)
      obj.count++
    }

    console.log(props, ctx)
    const title = () => {
      return (
        <div>title</div>
      )
    }

    return () => {
      return (
        (
          <div styleName='HomePage' class='container'>
            <Popover title={title()}>
              <Button
                type='primary'
                onClick={handleTest}>
                1231
              </Button>
            </Popover>

            <div class='test p-0'>
              {obj.count}
            </div>
            <GlMenu />
          </div>
        )
      )
    }
  }

})

export default HomePage
