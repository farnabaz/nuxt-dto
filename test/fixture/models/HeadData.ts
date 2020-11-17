import { Model, Prop } from '../../../lib/module'

@Model({
  request: {
    method: 'head',
    path: 'http://localhost:3000/'
  }
})

export default class HeadData {
  @Prop({ type: Object, path: response => response })
  data!: {}
}
