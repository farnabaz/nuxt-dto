import { Prop, Model } from '../../lib/module'
import Repository from './Repository'

@Model({
  request: {
    method: 'get',
    path: 'https://api.github.com/search/repositories?q=${query}+language:${language}&sort=stars&order=desc'
  }
})

export default class SearchRepositoriess {
    @Prop({ type: Number, path: 'total_count' })
    totalCount!: number;

    @Prop({ type: Boolean, path: 'incomplete_results' })
    incompleteResults!: boolean;

    @Prop({ type: [Repository], path: 'items' })
    items!: Repository[];
}
