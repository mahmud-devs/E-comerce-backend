class apiResponce {
  constructor(success = true, data, messege, error = false) {
    (this.success = success),
      (this.data = data),
      (this.messege = messege),
      (this.error = error);
  }
}
module.exports = { apiResponce };
