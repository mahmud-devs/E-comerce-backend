class apiResponce {
  constructor(success = true, statusCode, data, messege, error = false) {
    (this.success = success),
      (this.statusCode = statusCode),
      (this.data = data),
      (this.messege = messege),
      (this.error = error);
  }
}
module.exports = { apiResponce };
