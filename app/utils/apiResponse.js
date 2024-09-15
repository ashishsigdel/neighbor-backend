/**
 * @class ApiResponse
 * @description Api response class
 * @param {number} status - HTTP status code
 * @param {string} message - Response message
 * @param {object} data - Response data
 * @param {array} errors - Array of errors
 * @returns {ApiResponse} - An instance of ApiResponse
 *
 */

class ApiResponse {
  constructor({
    status = 200,
    message = "Success",
    data = null,
    errors = null,
  }) {
    this.status = status;
    if (data) this.data = data;
    this.message = message;
    if (errors) this.errors = errors;
  }

  send(res) {
    return res.status(this.status).json(this);
  }
}

export default ApiResponse;
