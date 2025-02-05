// from data.js
var tableData = data;

// Init the table
buildTable(tableData);

// Build multiple filter fields at sidebar
// Creat an array of filter fields
var filterFields = Object.entries(tableData[0]).slice(0, 5);
buildFilterInputs(filterFields);

// Filter button click event
d3.select('#filter-btn').on('click', () => {
  d3.event.preventDefault();
  var newTableData = filterTableData(filterFields, tableData);
  buildTable(newTableData);
});

// Define functions
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

function filterTableData(fields, data) {
  // Retrieve filter value inputs and put them in an object "filterInputs"
  var filterInputs = {};
  fields.forEach(([key]) => {
    var inputValue = d3.select(`#${key}`).property('value');
    if (inputValue !== '') {
      filterInputs[key] = inputValue;
    }
  });

  console.log('obj:', filterInputs);

  // Filter "tableData" by 'filterInputs
  filteredTableData = data;
  console.log(filteredTableData);

  Object.entries(filterInputs).forEach(([key, value]) => {
    filteredTableData = filteredTableData.filter((row) => row[key] === value);
  });
  console.log(filteredTableData);

  return filteredTableData;
}

function buildFilterInputs(fields) {
  // Build multiple inputs at side
  // Select the ul element
  var ulElement = d3.select('#filters');
  // Clear the form
  ulElement.html('');
  // Build multiple inputs
  fields.forEach(([key, value]) => {
    // Insert a <li> under <ul>
    liElement = ulElement.append('li').attr('class', 'filter list-group-item');
    // Insder a <label> under <li>, add "for" attribute and "text" content
    liElement.append('label').attr('for', key).text(key);
    liElement
      .append('input')
      .attr('class', 'form-control')
      .attr('id', key)
      .attr('type', 'text')
      .attr('placeholder', value);
  });
}
