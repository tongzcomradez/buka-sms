import BukaSMS from './index'

describe('Buka SMS', () => {
  it('should be true', async () => {
    const bukaSMS = new BukaSMS({})
    await bukaSMS.to(['66871234567']).send('นิกม์ทำเองหรือใครสั่งให้นิกม์ทำ')
  })
})