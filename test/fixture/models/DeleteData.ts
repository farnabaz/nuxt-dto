import { Prop, Model } from '../../../lib/module'
import Result from './ResultData'

@Model({
  request: {
    method: 'delete',
    path: 'http://localhost:3000/api/foo'
  }
})

export default class DeleteData {
  @Prop({ type: Result, path: response => response })
  data!: Result
}
