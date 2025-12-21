import { HttpInterceptorFn } from '@angular/common/http';

export const jwtinterceeptInterceptor: HttpInterceptorFn = (req, next) => {
  let islogged = false;
  const token = localStorage.getItem("token")
  const newReq = req.clone({
    setHeaders:{
    Authorization: `Bearer ${token}`
    }
  })
  console.log(newReq)
  return next(newReq);
  
};
