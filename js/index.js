// Outside of Tables
document.getElementById('task-list-adder').addEventListener("click", addTaskList);

// Save lists to local storage, 3 second loop
function saveToLocalStorage() {
  setInterval(() => {
    let saved = localStorage.setItem('task_lists', document.querySelector('#task-list-container').innerHTML);
  }, 3000);
}

function addTaskList() {
  // Adds new table container + table to task-list-container
  document.getElementById('task-list-container').appendChild(createTaskList());
  // Adds event listener to each "-" for each table
  document.querySelectorAll('.delete-table').forEach(button => button.addEventListener("click", removeTaskList));
  document.querySelectorAll('.add-row').forEach(button => button.addEventListener("click", addRowToList));
  document.querySelectorAll('.delete-row').forEach(button => button.addEventListener("click", deleteRowFromList));
  // store newly created task_list data (+ existing data) into localstorage
  let saved = localStorage.setItem('task_lists', document.querySelector('#task-list-container').innerHTML);
  saveToLocalStorage()
}

// Inside of Tables
function createTaskList() {
  // Build the base table structure
  let table_body_container = document.createElement('tbody');
  let table_delete_button = document.createElement('th');
  let table_header_text = document.createElement('th');
  let table_header_container = document.createElement('thead');
  let table = document.createElement('table');
  table_body_container.innerHTML = createRow().outerHTML;
  table_body_container.className = "task-body"
  table_body_container.id = "table-body-" + document.getElementsByClassName('task-list').length;
  table_delete_button.innerHTML = "<button class='delete-table'>-</button>";
  table_header_text.innerHTML = "Table Header";
  table_header_text.contentEditable = "true";
  table_header_text.colSpan = "3";
  table_header_container.innerHTML = table_header_text.outerHTML + table_delete_button.outerHTML;
  table.innerHTML = table_header_container.outerHTML + table_body_container.outerHTML;
  return createTaskContainer(table);
}

function createTaskContainer(table) {
  // Build container, add table into container
  let container = document.createElement('div');
  container.innerHTML = table.outerHTML;
  container.className = "task-list";
  container.id = "table-" + document.getElementsByClassName('task-list').length;
  return container;
}

function removeTaskList(event) {
  // We know that the button is 5 levels deep, so we can just go up 5 and get the table Id to delete
  document.getElementById(event.target.parentNode.parentNode.parentNode.parentNode.parentNode.id).remove();
  regenerateIDofTables();
}

function regenerateIDofTables() {
  // If we delete a table, we want to relabel the IDs of the tables so that the number of tables is maintained logically.
  // If we don't do this, then we might accidently make a table with an already existing table id!
  let list_length = document.querySelectorAll('.task-list').length;
  for (i=0;i<list_length;i++) {
    document.querySelectorAll('.task-list')[i].id = "table-" + i;
  }
  let list_body_length = document.querySelectorAll('.task-body').length;
  for (i=0;i<list_length;i++) {
    document.querySelectorAll('.task-body')[i].id = "table-body-" + i;

    // This updates the row id's so that they aren't any duplicate IDs
    for (j=0;j<document.querySelectorAll('.task-body')[i].children.length;j++) {
      document.querySelectorAll('.task-body')[i].children[j].id = "table-body-" + i + "-row-" + j;
    }
  }
  let saved = localStorage.setItem('task_lists', document.querySelector('#task-list-container').innerHTML);
}

function addRowToList() {
  // Adds a row to an existing list (the + button)
  document.getElementById(event.target.parentNode.parentNode.parentNode.id).appendChild(createRow());
  document.querySelectorAll('.add-row').forEach(button => button.addEventListener("click", addRowToList));
  document.querySelectorAll('.delete-row').forEach(button => button.addEventListener("click", deleteRowFromList));
  let saved = localStorage.setItem('task_lists', document.querySelector('#task-list-container').innerHTML);
}

function deleteRowFromList(event) {
  // If table has one row left, and we're deleting it, delete the table instead
  // Else delete row
  if (event.target.parentNode.parentNode.parentNode.rows.length == 1) {
    document.getElementById(event.target.parentNode.parentNode.parentNode.parentNode.parentNode.id).remove();
  }
  else {
    document.getElementById(event.target.parentNode.parentNode.id).remove();
  }
  regenerateIDofTables();
  let saved = localStorage.setItem('task_lists', document.querySelector('#task-list-container').innerHTML);
}

function createRow() {
  //  Builds the base row structure
  let row = document.createElement('tr');
  let row_data = document.createElement('td');
  let table_checkbox = document.createElement('td');
  let add_row_button = document.createElement('td');
  let delete_row_button = document.createElement('td');
  table_checkbox.innerHTML = "<input type='checkbox' name='rowcomplete' value='complete' />";
  delete_row_button.innerHTML = "<button class='delete-row'>-</button>";
  add_row_button.innerHTML = "<button class='add-row'>+</button>";
  row_data.innerHTML = "New List Item";
  row_data.contentEditable = "true";
  row.innerHTML = table_checkbox.outerHTML + row_data.outerHTML + add_row_button.outerHTML + delete_row_button.outerHTML;
  row.className = "task-body-row";
  if (!event.target.parentNode.parentNode.parentNode.id.includes("table-body")) {
    row.id = "table-body-" + document.getElementsByClassName('task-list').length + "-row-0";
  }
  else {
    row.id = event.target.parentNode.parentNode.parentNode.id + "-row-" + document.getElementById(event.target.parentNode.parentNode.parentNode.id).rows.length;
  }
  return row;
}

window.onload = function() {
  if (localStorage.getItem('task_lists')) {
    // load existing data from user
    document.querySelector('#task-list-container').innerHTML = localStorage.getItem('task_lists');
    // Set eventlisteners after loading back in data
    document.querySelectorAll('.delete-table').forEach(button => button.addEventListener("click", removeTaskList));
    document.querySelectorAll('.add-row').forEach(button => button.addEventListener("click", addRowToList));
    document.querySelectorAll('.delete-row').forEach(button => button.addEventListener("click", deleteRowFromList));
    saveToLocalStorage();
  }
}
