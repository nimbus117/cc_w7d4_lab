const RequestHelper = require('../helpers/request_helper.js');
const PubSub = require('../helpers/pub_sub.js');

const Munros = function () {
  this.data = [];
}

Munros.prototype.getData = function () {
  request = new RequestHelper('https://munroapi.herokuapp.com/api/munros');
  request.get(data => {
    this.data = data;
    const regions = this.returnRegions()
    // console.log(data);
  })
}

Munros.prototype.bindEvent = function () {
  PubSub.subscribe('FilterView:region', e => {
    PubSub.publish('Munros:all-ready', this.filterMunros(e.detail));
    // console.log(this.filterMunros(e.detail));
  })
}

Munros.prototype.returnRegions = function () {
  const munroRegions = this.data
    .map(munros => munros.region)
    .filter((region, index, regions) => regions.indexOf(region) === index)
    .sort();
  // console.log(munroRegions);
  PubSub.publish('Munros:regions', munroRegions);
}

Munros.prototype.filterMunros = function (region) {
  return this.data.filter(munro => munro.region === region)
}

module.exports = Munros;
