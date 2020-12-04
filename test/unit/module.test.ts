import { getNuxt, setupTest, url } from '@nuxt/test-utils'
import HTTP from '../../lib/core/HTTP'
import logger from '../../lib/plugins/logger'
import axios from 'axios'
import OurApiResponse from '../fixture/utils/OurApiResponse'
import GetDataWithParams from '../fixture/models/GetDataWithParams'
import PostData from '../fixture/models/PostData'
import PutData from '../fixture/models/PutData'
import ErrorData from '../fixture/models/ErrorData'
import PatchData from '../fixture/models/PatchData'
import DeleteData from '../fixture/models/DeleteData'
import HeadData from '../fixture/models/HeadData'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

mockedAxios.create.mockImplementation(() => axios)
// @ts-ignore
mockedAxios.interceptors.request.use.mockImplementation(() => (
  { use: jest.fn(), eject: jest.fn() }
))
// @ts-ignore
mockedAxios.interceptors.response.use.mockImplementation(() => (
  { use: jest.fn(), eject: jest.fn() }
))

const http = new HTTP({ $axios: axios }, OurApiResponse)

describe('module', () => {
  setupTest({
    fixture: 'fixture',
    build: true,
    server: true,
    configFile: 'nuxt.config.js',
    config: {
      modules: [
        ['../../dist/module', {
          handler: '~/utils/OurApiResponse',
          debug: true
        }],
        '@nuxtjs/axios'
      ]
    }
  })

  const data = {
    data: {
      method: 'method',
      url: 'url'
    }
  }

  test('get', async () => {
    mockedAxios.get.mockImplementationOnce(() => {
      http.onRequest(() => {})
      http.onResponse(() => {})
      return Promise.resolve(data)
    })
    const response = await http.fetch<GetDataWithParams>(GetDataWithParams, {
      params: {
        query: 'nuxt',
        language: 'javascript'
      }
    })
    expect(response).toEqual(data)
  })

  test('$http exists on context', async () => {
    const window = await (getNuxt() as any).server.renderAndGetWindow(url('/'))
    expect(window.$nuxt.$http).toBeDefined()
  })

  test('post', async () => {
    mockedAxios.post.mockImplementationOnce(() => Promise.resolve(data))
    const response = await http.fetch<PostData>(PostData, {
      data
    })
    expect(response).toEqual(data)
  })

  test('put', async () => {
    mockedAxios.put.mockImplementationOnce(() => Promise.resolve(data))
    const response = await http.fetch<PutData>(PutData, {
      data
    })
    expect(response).toEqual(data)
  })

  test('patch', async () => {
    mockedAxios.patch.mockImplementationOnce(() => Promise.resolve(data))
    const response = await http.fetch<PatchData>(PatchData, {
      data
    })
    expect(response).toEqual(data)
  })

  test('delete', async () => {
    mockedAxios.delete.mockImplementationOnce(() => Promise.resolve(data))
    const response = await http.fetch<DeleteData>(DeleteData)
    expect(response).toEqual(data)
  })

  test('head', async () => {
    mockedAxios.head.mockImplementationOnce(() => Promise.resolve(data))
    const response = await http.fetch<HeadData>(HeadData)
    expect(response).toEqual(data)
  })

  test('throw', async () => {
    try {
      mockedAxios.get.mockImplementationOnce(() => {
        http.onError(() => {})
        return Promise.reject(new Error('404'))
      })
      logger({ $http: http })
      await http.fetch<ErrorData>(ErrorData)
    } catch (error) {
      expect(error.message).toBe('404')
    }
  })
})
