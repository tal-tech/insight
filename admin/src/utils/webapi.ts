import Axios, { AxiosRequestConfig, Method } from 'axios';

const hostname = window.location.host;
const isLocal = !!hostname.match(/:/);

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  contentType?: 'application/json' | 'multipart/form-data' | 'text/plain';
}
// 创建axios实例
const axios = Axios.create({
  baseURL: isLocal ? 'api/' : process.env.REACT_API_DOMAIN, // api的base_url
  timeout: 60000, // 请求超时时间
  withCredentials: false
});

// request拦截器
export const interceptorsRequest = axios.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    config.headers['X-User-Id'] = 1234;
    return config;
  },
  error => {
    console.log(error); // for debug
  }
);
export const interceptorsResponseFulfilled = (response: any) => {
  return response.data;
};
export const interceptorsResponseRejected = (error: any) => {
  const res = error.response || {};

  const data = res.data || {};
  const status = res.status;
  const code = data.code || 404;

  return {
    code,
    message: error.message
  };
};

// respone拦截器
export const interceptorsResponse = axios.interceptors.response.use(
  interceptorsResponseFulfilled,
  interceptorsResponseRejected
);

export interface WebReq {
  params?: { [index: string]: any };
  forms?: any;
}

/**
 * 解析路由参数responseType
 *
 */
const reg = /:[a-z|A-Z]+/g;
function parseParams(url: string) {
  const ps = url.match(reg);

  if (!ps) {
    return [];
  }

  return ps.map(k => k.replace(/:/, ''));
}

/**
 * 按照url和params生成相应的url
 * @param url
 * @param params
 */
function genUrl(url: string, params: WebReq['params']) {
  if (!params) {
    return url;
  }

  const ps = parseParams(url);
  ps.forEach(k => {
    const reg = new RegExp(':' + k);
    url = url.replace(reg, params[k]);
  });

  const path: string[] = [];
  for (const key of Object.keys(params)) {
    if (!ps.find(k => k === key)) {
      path.push(key + '=' + params[key]);
    }
  }

  return url + (path.length > 0 ? '?' + path.join('&') : '');
}

interface Response<T> {
  code: number;
  data: T;
}
export function Api<T>(url: string, method: Method, req: WebReq): Promise<Response<T>> {
  if (url.match(/:/) || method.match(/get|delete/i)) {
    // 如果路由是带挂参的，先看params再看forms
    url = genUrl(url, req.params || req.forms);
  }
  switch (method) {
    case 'get':
      return axios.get(url);
    case 'delete':
      return axios.delete(url);
    case 'post':
      return axios.post(url, req.forms || req.params);
    case 'put':
      return axios.put(url, req.forms || req.params);
    case 'patch':
      return axios.patch(url, req.forms || req.params);
    default:
      return axios.get(url);
  }
}

export function get<T>(url: string, params?: WebReq['params'], forms?: any): Promise<Response<T>> {
  return Api<T>(url, 'get', {
    params,
    forms
  });
}

export function deletes<T>(url: string, params?: WebReq['params'], forms?: any): Promise<Response<T>> {
  return Api<T>(url, 'delete', {
    params,
    forms
  });
}

export function post<T>(url: string, params?: WebReq['params'], forms?: any): Promise<Response<T>> {
  return Api<T>(url, 'post', {
    forms,
    params
  });
}

export function put<T>(url: string, params?: WebReq['params'], forms?: any): Promise<Response<T>> {
  return Api<T>(url, 'put', {
    forms,
    params
  });
}

export function patch<T>(url: string, params?: WebReq['params'], forms?: any): Promise<Response<T>> {
  return Api<T>(url, 'patch', {
    forms,
    params
  });
}

// 给 goctl 生成的 .ts 文件使用
export const webapi = {
  get,
  delete: deletes,
  put,
  patch,
  post
};
// 当需要给 webapi 添加拦截器时，需要在 axios 中添加
export default axios;
