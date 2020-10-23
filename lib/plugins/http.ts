/* <% if(options.handler) { %>
// @ts-ignore */
import Handler from '<%= options.handler %>' /*
<% } %> */

import type { Plugin } from '@nuxt/types'
import HTTP from '../core/HTTP'

const myPlugin: Plugin = (context, inject) => {
  let ResponseHandler: any = null
  /* <% if(options.handler) { %> */
  ResponseHandler = Handler /*
    <% } %> */
  // typeof Handler === "undefined" ? undefined : Handler;
  inject('http', new HTTP(context, ResponseHandler))
}

export default myPlugin
