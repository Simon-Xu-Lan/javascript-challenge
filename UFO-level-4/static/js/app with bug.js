// Define a global varialbe "tableData", init it by data from data.js
var tableData = data;

// Init the table
buildTable(tableData);

// Init the seleciton
// Creat an array of filter fields
var filterFields = Object.entries(tableData[0]).slice(0, 5);
updateSelection(filterFields, tableData);

// var tableDataCopy = [...tableData];

// Filter data by selction
d3.selectAll('.selData').on('change', () => {
  d3.event.preventDefault();
  console.log('changed');
  var selectedField = d3.event.target.id;
  var selectedValue = d3.event.target.value;
  console.log(selectedField, selectedValue);
  // Update the global varilabe with filtered tableData everytime any select is changed.
  // Therefore the later filter is based on the previous filtered data
  tableData = tableData.filter((row) => row[selectedField] === selectedValue);
  console.log(tableData);
  // updateSelection(filterFields, tableData);
  buildTable(tableData);
});

// // Filter button click event
// d3.select('#filter-btn').on('click', () => {
//   d3.event.preventDefault();
//   var newTableData = filterTableData(filterFields, tableData);
//   buildTable(newTableData);
// });

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

function updateSelection(fields, data) {
  // Build multiple inputs at side
  // Select the ul element
  var ulElement = d3.select('#filters');
  // Clear the html content under <ul>
  ulElement.html('');
  // Build multiple selections
  fields.forEach(([key, value]) => {
    // Insert a <li> under <ul>
    liElement = ulElement.append('li').attr('class', 'filter list-group-item');
    // Insert a <label> under <li>, add "for" attribute and "text" content
    liElement.append('label').attr('for', key).text(key);
    // INsert a <select> under <li>, add key as id and "selData" as class
    var selectEl = liElement.append('select');
    selectEl.attr('id', key).attr('class', 'selData');

    // Insert <option>s under each <select>, using distinct date to iterate
    optionValues = distinctColumnData(data, key);
    optionValues.forEach((eachValue) => {
      selectEl.append('option').attr('value', eachValue).text(eachValue);
    });
  });
}

function distinctColumnData(data, column) {
  // Return an array of sorted distinct column values
  var colData = data.map((row) => row[column]);
  var distinctColData = [...new Set(colData)].sort();
  if (distinctColData.length > 1) {
    return ['All'].concat(distinctColData);
  } else {
    return distinctColData;
  }
  // return distinctColData;
}
