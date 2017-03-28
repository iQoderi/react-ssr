import fetch from 'isomorphic-fetch';
const timeout = 15000;

function filterJSON(res) {
  try{
    return res.json();
  }catch(e){
    throw new Error('data format error');
  }
}

function filterStatus(res) {
  if (res.ok) {
    return res;
  } else {
    throw new Error('request failed');
  }
}


function timeoutFetch(ms, promise) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("fetch time out"));
    }, ms);
    promise.then(
      (res) => {
        clearTimeout(timer);
        resolve(res);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  })
}

export function request(uri, type = "GET", headers = {}, data = ""){
  let fetchOption = {
    method: type,
    headers: headers
  };

  if(type === "POST"){
    fetchOption.body = data;
  }

  if(__DEV__){
    console.log("fetch data from uri:");
    console.log(uri);
    console.log("type");
    console.log(type);
    console.log("headers:");
    console.log(headers);
    console.log("data:");
    console.log(data);
  }

  return timeoutFetch(timeout, fetch(uri, fetchOption))
    .then(filterStatus)
    .then(filterJSON)
    .catch(function(error) {
      throw error;
    });
}

export function get(uri, headers = {}) {
  return request(uri, "GET", headers);
}

export function post(uri, data = "", headers = {}) {
  if(!headers["Content-type"]){
    headers["Content-type"] = 'application/json';
  }
  return request(uri, "POST", headers, data);
}

export function remove(uri, headers = {}) {
  return request(uri, "DELETE", headers);
}
