// ########### - Init data and assign to global variables
// Define a global varialbe "tableData", init it by data from data.js
var tableData = data;
// Creat an array of filter fields, assign it the a global variable "filterFieds"
var filterFields = Object.entries(tableData[0]).slice(0, 5);

// ########### - Init webpage
// Init the table
buildTable(tableData);
// Init the seleciton
buildSelection(filterFields, tableData);
updateOptions(filterFields, tableData);

// ########### - Handle filter event
// Filter data by selction
d3.selectAll('.selData').on('change', () => {
  d3.event.preventDefault();
  var selectedField = d3.event.target.id;
  var selectedValue = d3.event.target.value;

  // Get selected filter field and its value. Store them in an object "filters"
  var filters = {};
  filterFields.forEach(([key]) => {
    // use Vanilla JavaScript is easier to get seleted option value than d3
    var sel = document.getElementById(key);
    var value = sel.options[sel.selectedIndex].value;
    if (value !== 'All') {
      filters[key] = value;
    }
  });

  // Use current selected filter data to filter table
  var filteredData = filterTableData(filters, tableData);
  updateOptions(filterFields, filteredData);
  buildTable(filteredData);
});

// ########### - Define functions
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

function filterTableData(filters, data) {
  // Filter "tableData" by 'filters' object
  filteredTableData = data;

  Object.entries(filters).forEach(([key, value]) => {
    filteredTableData = filteredTableData.filter((row) => row[key] === value);
  });

  return filteredTableData;
}

function buildSelection(fields, data) {
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
  });
}

function updateOptions(fields, data) {
  fields.forEach(([key, value]) => {
    optionValues = distinctColumnData(data, key);
    // If optionValues has more than one elements, update <option>s under the <select>, using distinct date to iterate
    // If optionValues has one and only one element, that means this is previous selected filter, no need to update options
    if (optionValues.length > 1) {
      var selectEl = d3.select(`#${key}`);
      selectEl.html(''); // Clear current <select> html content
      optionValues.forEach((eachValue) => {
        // if (eachValue === '') {
        //   selectEl
        //     .append('option')
        //     .attr('value', eachValue)
        //     .text('Please choose an option');
        // } else {
        selectEl.append('option').attr('value', eachValue).text(eachValue);
        // }
      });
    }
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
}
