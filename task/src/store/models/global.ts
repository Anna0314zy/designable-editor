
import { createModel } from '@rematch/core'
import { RootModel } from '.'
import { VIEWPORT_RATIO, VIEWPORT_PERCENTAGE } from '@/types/constant'
export interface GlobalState {
  viewportRatio: number;
  viewportPercentage:number
}

export default createModel<RootModel>()({
  state: {
    viewportRatio:VIEWPORT_RATIO,
    viewportPercentage:VIEWPORT_PERCENTAGE
  } as GlobalState ,
  reducers: {
    updateData(state, payload: Partial<GlobalState>) {
      return {
        ...state,
        ...payload
      }
    }
  },

})
