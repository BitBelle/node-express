// exports.area = function (width) {
//   return width * width;
// };

// exports.perimeter = function (width) {
//   return 4 * width;
// };

//to export the complete object instead of one at a time
module.exports = {
  area(width) {
    return width * width;
  },

  perimeter(width) {
    return 4 * width;
  },
};
