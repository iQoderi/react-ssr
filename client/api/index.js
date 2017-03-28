const baseUrl = 'https://cnodejs.org/api/v1';
const makeUrl = (path)=>{
  return `${baseUrl}/${path}`
}

export default {
  topics:makeUrl('topics'),
  topic:makeUrl('/topic')
}
