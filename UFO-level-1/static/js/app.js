// from data.js
var tableData = data;
buildTable(tableData);
// YOUR CODE HERE!
d3.select('#filter-btn').on('click', (event) => {
  d3.event.preventDefault();
  filterField = d3.select('#datetime').property('name');
  filterValue = d3.select('#datetime').property('value');
  filteredTableData = filterTable(tableData, filterField, filterValue);
  buildTable(filteredTableData);
});

d3.select('#remove-btn').on('click', (event) => {
  d3.event.preventDefault();
  createTable(tableData);
});

function buildTable(data) {
  var tableBodyElement = d3.select('#ufo-table').select('tbody');
  tableBodyElement.html('');
  data.forEach((eachObj) => {
    var row = tableBodyElement.append('tr');
    Object.entries(eachObj).forEach(([key, value]) => {
      row.append('td').text(value);

      // The iteration order for Object.entries:
      // 1. Integer keys in ascending order (and strings like "1" that parse as ints)
      // 2. String keys, in insertion order (ES2015 guarantees this and all browsers comply)
      // 3. Symbol names, in insertion order (ES2015 guarantees this and all browsers comply)
      // https://stackoverflow.com/questions/5525795/does-javascript-guarantee-object-property-order
    });
  });
}

function filterTable(data, filterField, filterValue) {
  return filterValue === ''
    ? data
    : data.filter((eachObj) => eachObj[filterField] === filterValue);
}
