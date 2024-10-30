class apiError {
  constructor(success = false, statusCode, data, messege, error = true) {
    (this.success = success),
      (this.statusCode = statusCode),
      (this.data = data),
      (this.messege = messege),
      (this.error = error);
  }
}
module.exports = { apiError };
