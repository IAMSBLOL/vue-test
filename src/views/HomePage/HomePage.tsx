
import { Button, Popover } from 'ant-design-vue'
import { onMounted, ref, defineComponent, watch } from 'vue'
import GlMenu from './GlMenu'
import { useTest } from '../../hooks'
import './HomePage.module.less'

const HomePage = defineComponent({
  name: 'HomePage',
  setup (props, ctx) {
    const obj = ref(0)

    onMounted(
      () => {
        console.log('vue文档是真的FW')
      }
    )
    useTest()
    const handleTest = () => {
      console.log(111)
      obj.value++
    }

    console.log(props, ctx)
    const title = () => {
      return (
        <div>title</div>
      )
    }

    watch(obj, (newValue) => {
      console.log(newValue, 'sync newValue')
      return 'sync newValue'
    }, { flush: 'sync' })

    watch(obj, (newValue) => {
      console.log(newValue, 'pre newValue')
      return 'pre newValue'
    }, { flush: 'pre' })

    watch(obj, (newValue) => {
      console.log(newValue, 'post newValue')
      return 'post newValue'
    }, { flush: 'post' })

    return () => {
      return (
        (
          <div styleName='HomePage' class='container'>
            <Popover title={title()}>
              <Button
                type='primary'
                onClick={handleTest}>
                12311
              </Button>
            </Popover>

            <div class='test p-0'>
              {obj.value}
            </div>
            <GlMenu />
          </div>
        )
      )
    }
  }

})

export default HomePage
