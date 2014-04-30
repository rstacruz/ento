module.exports = function (model) {
  model
    .on('init', function (self) {
      self.is.loading = false;
    })
    .use({
      fetch: function () {
      }
    });
};
