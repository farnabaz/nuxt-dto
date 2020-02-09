import { Prop, Model } from "../../lib/module"


export default class Repository {

    @Prop({ type: String, path: 'full_name' })
    name: string;

    @Prop({ type: String, path: 'html_url' })
    url: string;
}