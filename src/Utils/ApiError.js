class apiError {
  constructor(success = false, data, messege, error = true) {
    (this.success = success),
      (this.data = data),
      (this.messege = messege),
      (this.error = error);
  }
}
module.exports = { apiError };
