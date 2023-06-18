import 'dotenv/config'
import md5 from 'md5'
import axios from 'axios'

export interface BukaConfig {
  appId?: string
  appSecret?: string
  apiKey?: string
  baseUrl?: string
  senderId?: string
}

class BukaSMS {
  private readonly appId: string = process.env.BUKA_APP_ID || undefined
  private readonly appSecret: string = process.env.BUKA_APP_SECRET || undefined
  private readonly apiKey: string = process.env.BUKA_API_KEY || undefined
  private readonly senderId: string = process.env.BUKA_SENDER_ID || ''
  private readonly baseUrl: string = process.env.BUKA_BASE_URL || 'https://api.onbuka.com/v3/sendSms'

  private readonly MAXIMUM_NUMBERS_PER_REQUEST = 100

  private numbersToSend: string[] = []

  constructor(config?: BukaConfig) {
    if (config?.appId) {
      this.appId = config.appId
    }

    if (config?.appSecret) {
      this.appSecret = config.appSecret
    }

    if (config?.apiKey) {
      this.apiKey = config.apiKey
    }

    if (config?.senderId) {
      this.senderId = config.senderId
    }

    if (config?.baseUrl) {
      this.baseUrl = config.baseUrl
    }
  }

  private makeSignature(timestamp: number): string {
    return md5(`${this.apiKey}${this.appSecret}${timestamp}`)
  }

  to(numbers: string[]): this {
    if (numbers.length > this.MAXIMUM_NUMBERS_PER_REQUEST) {
      throw new Error(`Maximum numbers per request is ${this.MAXIMUM_NUMBERS_PER_REQUEST}`)
    }

    this.numbersToSend = numbers
    return this
  }

  async send(content: string): Promise<void> {
    if (this.numbersToSend.length === 0) {
      throw new Error('You must set the number to send first')
    }

    const timestamp = Math.ceil(new Date().getTime() / 1000)
    const signature = this.makeSignature(timestamp)

    const headers = {
      'Api-Key': this.apiKey,
      'Content-Type': 'application/json;charset=UTF-8',
      Timestamp: timestamp,
      Sign: signature,
    }

    return axios.post(this.baseUrl, {
      senderId: this.senderId,
      appId: this.appId,
      numbers: this.numbersToSend.join(','),
      content,
    }, { headers })
  }
}

export default BukaSMS