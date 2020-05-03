import { ImageAdapter } from '../interfaces'
import got, { Got, ExtendOptions } from 'got'
// import LRU from 'quick-lru'
import { getLogger } from '../logger'

export class HttpAdapter implements ImageAdapter {
  private client: Got
  private log = getLogger('adapter:http')

  constructor(gotOptions: ExtendOptions) {
    this.client = got.extend({
      // cache: new LRU({ maxSize: 50 }),
      ...gotOptions,
    })
    this.log(`Using prefixUrl: ${this.getPrefixUrl()}`)
  }

  private getPrefixUrl() {
    return this.client.defaults.options.prefixUrl
  }

  async fetch(url: string): Promise<Buffer | null> {
    url = url.slice(1)
    this.log(`Fetching: ${this.getPrefixUrl()}${url}`)
    try {
      const response = await this.client.get(url, {
        responseType: 'buffer',
      })
      return response.body
    } catch (error) {
      if (error.response?.statusCode === 404) return null

      throw error
    }
  }
}
