const uuid = (seed)=>{
  const now = Date.now();
  const random_str = `daddwadawluilidawdidoawdhuykhwioddawdhawdlhqdohwad321oihwdawdawd79312dadadadadaddawd`;
  const str_len = random_str.length;
  const random_arr = new Array(str_len).fill('native').map((v)=>{
    return v = random_str.substr(Math.ceil(Math.random()*str_len),Math.ceil(Math.random()*10));
  });
  return random_arr[Math.ceil(Math.random()*random_arr.length)]+seed+now;
}

export default  uuid;
