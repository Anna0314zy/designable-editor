import { Models } from '@rematch/core'
import task  from './task'
import page from './page'
import auth from './auth'
import global from './global'
export interface RootModel extends Models<RootModel> {
  task: typeof task
  page: typeof page
  auth: typeof auth
  global: typeof global
}

export const models: RootModel = {
  task,
  page,
  auth,
  global
}
