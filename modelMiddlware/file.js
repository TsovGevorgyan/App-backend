const afterDestroy = (...params) => {
    console.log(params, 'params');
}
module.exports = {afterDestroy};