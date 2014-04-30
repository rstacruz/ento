module.exports = function (model) {
  model
    .on('init', function () {
      this.is.loading = false;
    })
    .use({
      fetch: function () {
        this.is.fetching = true;
      }
    });
};
