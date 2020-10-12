import { AxiosError, AxiosResponse } from 'axios'
import consola from 'consola'
// @ts-ignore
import type HTTP from './HTTP'

const logger = consola.withScope('nuxt-dto')

export default function installDebugInterceptors ({ $http }: {$http: HTTP}): void {
  $http.onRequestError((error: AxiosError) => {
    logger.error('Request error:', error)
  })

  $http.onResponseError((error: AxiosError) => {
    logger.error('Response error:', error)
  })

  $http.onResponse((response: AxiosResponse) => {
    logger.info({
      type: response.status + ':' +
      response.config.method!.toUpperCase() + ':' +
      response.config.url,
      message: response.data
    })
    return response
  })
}
