import Koa from 'koa'
import json from 'koa-json'
import logger from 'koa-logger'

const app = new Koa()

app.use(json())
app.use(logger())

export default app
