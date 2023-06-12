import BukaSMS from './index'

describe('Buka SMS', () => {
  it('should be true', async () => {
    const bukaSMS = new BukaSMS({})

    const a = await bukaSMS.to(['66837703379']).send('นิกม์ทำเองหรือใครสั่งให้นิกม์ทำ')

    console.log(a)
  })
})