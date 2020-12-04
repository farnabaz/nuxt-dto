import { setupTest, expectModuleNotToBeCalledWith, getNuxt, expectModuleToBeCalledWith } from '@nuxt/test-utils'

describe('http', () => {
  setupTest({
    fixture: 'fixture',
    configFile: 'nuxt.config.js',
    config: {
      modules: [
        ['../../dist/module', {
          handler: '../fixture/utils/OurApiResponse'
        }]
      ]
    }
  })

  test('handler', () => {
    expectModuleToBeCalledWith('addPlugin', {
      src: expect.stringContaining('http.js'),
      fileName: 'nuxt-dto/plugins/http.js',
      options: getNuxt().options.modules[0][1]
    })
    expect(getNuxt().options.modules[0][1].debug).toBeUndefined()
    expect(getNuxt().options.modules[0][1].handler).toBe('../fixture/utils/OurApiResponse')
  })

  test('without logger', () => {
    expectModuleNotToBeCalledWith('addPlugin', {
      src: expect.stringContaining('nuxt-dto/logger.js'),
      fileName: 'nuxt-dto/plugins/logger.js',
      options: getNuxt().options.modules[0][1]
    })
    expect(getNuxt().options.modules[0][1].debug).toBeFalsy()
    expect(getNuxt().options.modules[0][1].handler).toBe('../fixture/utils/OurApiResponse')
  })

  test('addTemplate', () => {
    const plugin = getNuxt().moduleContainer.addTemplate.mock.calls
      .flatMap(args => args).find(arg => arg.options && arg.src.includes('plugins/http.js'))
    expect(plugin.options.handler).toBe('../fixture/utils/OurApiResponse')
    expect(plugin.options.debug).toBeFalsy()
  })
})

describe('logger', () => {
  setupTest({
    fixture: 'fixture',
    configFile: 'nuxt.config.js',
    config: {
      modules: [
        ['../../dist/module', {
          handler: '../fixture/utils/OurApiResponse',
          debug: true
        }]
      ]
    }
  })

  test('debug mode', () => {
    expectModuleToBeCalledWith('addPlugin', {
      src: expect.stringContaining('plugins/logger.js'),
      fileName: 'nuxt-dto/plugins/logger.js',
      options: getNuxt().options.modules[0][1]
    })
    expect(getNuxt().options.modules[0][1].debug).toBeTruthy()
  })

  test('addTemplate', () => {
    const plugin = getNuxt().moduleContainer.addTemplate.mock.calls
      .flatMap(args => args).find(arg => arg.options && arg.src.includes('plugins/http.js'))

    expect(plugin.options.handler).toBe('../fixture/utils/OurApiResponse')
    expect(plugin.options.debug).toBeTruthy()
  })
})
