import type { AxiosError } from 'axios'
import type { HTTP } from '~/../lib/module'

export default function ({ $http }: {$http: HTTP}) {
  $http.installDebugInterceptors()

  $http.onError((error: AxiosError) => {
    console.log('Error:', error)
  })
}
