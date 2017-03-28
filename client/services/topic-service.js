import API from '../api';
import * as requestService from './request';

//获取文章列表
export function getTopicsService(tab = 'all', page = 1, size = 30) {
  const uri = `${API.topics}?tab=${tab}&page=${page}&limit=${size}`;
  return requestService.get(uri);
}

//获取文章详情
export function getTopicDetailService(id) {
  const uri = `${API.topic}/${id}`;
  return requestService.get(uri);
}
