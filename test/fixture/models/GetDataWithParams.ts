import { Prop, Model } from '../../../lib/module'
import Result from './ResultData'

@Model({
  request: {
    method: 'get',
    path: 'http://localhost:3000/api/repositories?q=${query}+language:${language}&sort=stars&order=desc'
  }
})

export default class GetWithParams {
  @Prop({ type: Result, path: response => response })
  data!: Result
}
