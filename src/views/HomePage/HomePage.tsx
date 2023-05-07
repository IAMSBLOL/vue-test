import './HomePage.less'
import { Button } from 'ant-design-vue'

const HomePage = () => {
  const handleTest = () => {
    console.log(111)
  }
  return (
    <div class='container'>
      <Button class='test'
        onClick={handleTest}>
        1231
      </Button>
      <div class='test1 p-0'>
        1231
      </div>
    </div>
  )
}
export default HomePage
