import { Model, Prop } from '../../../lib/module'

@Model({
  request: {
    method: 'get',
    path: 'http://localhost:3000/api/404'
  }
})

export default class ErrData {
  @Prop({ type: String, path: response => response })
  data!: string
}
