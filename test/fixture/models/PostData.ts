import { Prop, Model } from '../../../lib/module'
import Result from './ResultData'

@Model({
  request: {
    method: 'post',
    path: 'http://localhost:3000/api/foo'
  }
})

export default class PostData {
  @Prop({ type: Result, path: response => response })
  data!: Result
}
