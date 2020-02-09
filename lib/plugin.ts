/* <% if(options.handler) { %>
// @ts-ignore */
import Handler from "<%= options.handler %>"; /*
<% } %> */
import { Plugin } from "@nuxt/types";
// @ts-ignore
import HTTP from "./HTTP.js";

const myPlugin: Plugin = (context, injext) => {
    let ResponseHandler: any;
    /* <% if(options.handler) { %> */
    ResponseHandler = Handler; /*
    <% } %> */
    // typeof Handler === "undefined" ? undefined : Handler;
    injext("http", new HTTP(context, ResponseHandler));
};

export default myPlugin;
