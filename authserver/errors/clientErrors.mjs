class MyClientError extends Error {
    constructor(error,statusCode = 400) {
      super(error.message); 
   
      this.data = { error };
      this.statusCode = statusCode;
    }
  }

export const  ErrorResponse = {
  myClientError : (error)=> {return new MyClientError(error,400) },
  UnAutherized : (error)=> {return new MyClientError(error,401) },//401
  Forbidden:  (error)=> {return new MyClientError(error,403) },//403
  NotFound: (error)=> {return new MyClientError(error,404) }//404
}
