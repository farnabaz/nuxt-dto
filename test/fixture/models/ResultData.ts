import { Prop } from '../../../lib/module'

class Data {
    @Prop({ type: String, path: 'title' })
    title!: string

    @Prop({ type: String, path: 'body' })
    body!: string
}

export default class Result {
    @Prop({ type: Data, path: 'body_data' })
    body!: Data[]

    @Prop({ type: String, path: 'method' })
    method!: string

    @Prop({ type: String, path: 'url' })
    url!: string
}
