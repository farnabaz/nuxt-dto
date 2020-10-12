import { AxiosError, AxiosResponse } from 'axios'
// @ts-ignore
import type HTTP from './HTTP'

export default function installDebugInterceptors ({ $http }: {$http: HTTP}): void {
  $http.onRequestError((error: AxiosError) => {
    console.info('Request error:', error)
  })

  $http.onResponseError((error: AxiosError) => {
    console.info('Response error:', error)
  })

  $http.onResponse((response: AxiosResponse) => {
    console.info(
      response.status + ':' +
          response.config.method!.toUpperCase() + ':' +
          response.config.url
    )
    console.log(response.data)
    return response
  })
}
