const fs = require('fs');

exports.deleteFile = (filePath, next) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            // there was an error
            console.log(err.toString() || `There was an error deleting file: ${filePath}`);
        } else {
            // file deleted
            console.log("DELETE OPERATION ON FILE SUCCESSFUL: ", filePath);
        }
    })
}
//custom error handler
exports.onError = (message, statusCode, errorData, isAsync, next) => {
    const error = new Error(message);
    error.data = errorData == null || !errorData ? [] : errorData.array();

    error.statusCode = statusCode ? statusCode : 500;

    if (isAsync) {
        return next(error);
    }

    throw error;
}