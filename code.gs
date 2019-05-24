/*
Project created by Lang Faith 
Last Modified: 05/23/2019
*This software no longer uses Keys as Google Forms can do that already.
lol also trying to fix the tie message 

Source Code: 
https://github.com/cartland/instant-runoff

*/

/* Settings */ 

var VOTE_SHEET_NAME = "FILLER"; // replace FILLER with the title of your Google Sheets file
var BASE_ROW = 2; // set this to the first row that contains a response
var BASE_COLUMN = 2; // set this to the first column that contains a response

/* End Settings */


/* Global variables */

var NUM_COLUMNS;

/* End global variables */


/* Creates new sheets if they do not exist. */
function setup_instant_runoff() {
  var active_spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  active_spreadsheet.getSheets()[0].setName(VOTE_SHEET_NAME);
  create_menu_items();

    /* Determine number of voting columns */
  check_error(); // check for illegitimate response
}

//If a response picks the same candidate for two or more different choices, their time stamp will be flagged red. 
function check_error() {
  var active_spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var row1_range = active_spreadsheet.getSheetByName(VOTE_SHEET_NAME).getRange("A1:1");
  var NUM_COLUMNS = get_num_columns_with_values(row1_range) - BASE_COLUMN + 1;
  var results_range = get_range_with_values(VOTE_SHEET_NAME, BASE_ROW, BASE_COLUMN, NUM_COLUMNS);
  var wholesheet = new_get_range_with_values(VOTE_SHEET_NAME, BASE_ROW, NUM_COLUMNS);
  wholesheet.setBackground("#eeeeee");
  var candidates = get_all_candidates(results_range);
  var response = [];

  var num_rows = results_range.getNumRows();
  var num_columns = results_range.getNumColumns();
  for (var row = num_rows; row >= 1; row--) {
    var first_is_blank = results_range.getCell(row, 1).isBlank();
    if (first_is_blank) {
      continue;
    }

    for (var column = 1; column <= num_columns; column++) {
      
      var cell = results_range.getCell(row, column);
      var highlight = wholesheet.getCell(row, 1);
      if (cell.isBlank()) {
        continue;
      }
      var cell_value = cell.getValue();
      if (!include(response, cell_value)) {
        response.push(cell_value);
      } else {
        highlight.setBackground('#ff0000');
        break;
      }
    
    }
  response = [];
  }
}

function create_menu_items() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var menuEntries = [{name: "Setup", functionName: "setup_instant_runoff"},
                        {name: "Run", functionName: "run_instant_runoff"}]
    ss.addMenu("Instant Runoff", menuEntries);
}

/* Create menus */
function onOpen() {
    setup_instant_runoff();
}

/* Create menus when installed */
function onInstall() {
    onOpen();
}

function run_instant_runoff() {
  
  /* Determine number of voting columns */
  var active_spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var row1_range = active_spreadsheet.getSheetByName(VOTE_SHEET_NAME).getRange("A1:1");
  NUM_COLUMNS = get_num_columns_with_values(row1_range) - BASE_COLUMN + 1;

  /* Begin */
  clear_background_color();
  
  var results_range = get_range_with_values(VOTE_SHEET_NAME, BASE_ROW, BASE_COLUMN, NUM_COLUMNS);
  
  
  if (results_range == null) {
    Browser.msgBox("No votes. Looking for sheet: " + VOTE_SHEET_NAME);
    return;
  }
  
  /* candidates is a list of names (strings) */
  var candidates = get_all_candidates(results_range);
  
  /* votes is an object mapping candidate names -> number of votes */
  var votes = get_votes(results_range, candidates);
  
  /* winner is candidate name (string) or null */
  var winner = get_winner(votes, candidates);


  while (winner == null) {
    /* Modify candidates to only include remaining candidates */
    get_remaining_candidates(votes, candidates);
    if (candidates.length == 0) {
      Browser.msgBox("There is a tie!");
      return;
    }
    votes = get_votes(results_range, candidates);
    winner = get_winner(votes, candidates);
  }
  
  var winner_message = "Winner: " + winner + ".\nDate and time: " +  Utilities.formatDate(new Date(), "PST", "yyyy-MM-dd HH:mm:ss");
  Browser.msgBox(winner_message);
}


function get_range_with_values(sheet_string, base_row, base_column, num_columns) {
  var results_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_string);
  if (results_sheet == null) {
    return null;
  }
  var a1string = String.fromCharCode(65 + base_column - 1) +
      base_row + ':' + 
      String.fromCharCode(65 + base_column + num_columns - 2);
  var results_range = results_sheet.getRange(a1string); 
  //TODO
  // results_range contains the whole columns all the way to
  // the bottom of the spreadsheet. We only want the rows
  // with votes in them, so we're going to count how many
  // there are and then just return those.
  var num_rows = get_num_rows_with_values(results_range);
  if (num_rows == 0) {
    return null;
  }
  results_range = results_sheet.getRange(base_row, base_column, num_rows, num_columns);
  return results_range;
}

function new_get_range_with_values(sheet_string, base_row, num_columns) {
  var new_num_columns = num_columns + 1;
  var results_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_string);
  if (results_sheet == null) {
    return null;
  }
  var a1string = String.fromCharCode(65) +
      base_row + ':' + 
      String.fromCharCode(65 + 1 + new_num_columns - 2);
  var results_range = results_sheet.getRange(a1string); 
  // results_range contains the whole columns all the way to
  // the bottom of the spreadsheet. We only want the rows
  // with votes in them, so we're going to count how many
  // there are and then just return those.
  var num_rows = get_num_rows_with_values(results_range);
  if (num_rows == 0) {
    return null;
  }
  results_range = results_sheet.getRange(base_row, 1, num_rows, num_columns);
  return results_range;
}


function range_to_array(results_range) {
  results_range.setBackground("#eeeeee");
  
  var candidates = [];
  var num_rows = results_range.getNumRows();
  var num_columns = results_range.getNumColumns();
  for (var row = num_rows; row >= 1; row--) {
    var first_is_blank = results_range.getCell(row, 1).isBlank();
    if (first_is_blank) {
      continue;
    }
    for (var column = 1; column <= num_columns; column++) {
      var cell = results_range.getCell(row, column);
      if (cell.isBlank()) {
        break;
      }
      var cell_value = cell.getValue();
      cell.setBackground("#ffff00");
      if (!include(candidates, cell_value)) {
        candidates.push(cell_value);
      }
    }
  }
  return candidates;
}


function get_all_candidates(results_range) {
  results_range.setBackground("#eeeeee");
  
  var candidates = [];
  var num_rows = results_range.getNumRows();
  var num_columns = results_range.getNumColumns();
  for (var row = num_rows; row >= 1; row--) {
    var first_is_blank = results_range.getCell(row, 1).isBlank();
    if (first_is_blank) {
      continue;
    }
    for (var column = 1; column <= num_columns; column++) {
      var cell = results_range.getCell(row, column);
      if (cell.isBlank()) {
        break;
      }
      var cell_value = cell.getValue();
      cell.setBackground("#ffff00");
      if (!include(candidates, cell_value)) {
        candidates.push(cell_value);
      }
    }
  }
  return candidates;
}


function get_votes(results_range, candidates) {
  var votes = {};
  
  for (var c = 0; c < candidates.length; c++) {
    votes[candidates[c]] = 0;
  }
  
  var num_rows = results_range.getNumRows();
  var num_columns = results_range.getNumColumns();
  for (var row = num_rows; row >= 1; row--) {
    var first_is_blank = results_range.getCell(row, 1).isBlank();
    if (first_is_blank) {
      break;
    }
        
    for (var column = 1; column <= num_columns; column++) {
      var cell = results_range.getCell(row, column);
      if (cell.isBlank()) {
        break;
      }
      
      var cell_value = cell.getValue();
      if (include(candidates, cell_value)) {
        votes[cell_value] += 1;
        cell.setBackground("#aaffaa");
        break;
      }
      cell.setBackground("#aaaaaa");
    }
  }
  
  return votes;
}

function get_winner(votes, candidates) {
  var total = 0;
  var winning = null;
  var max = 0;
  for (var c = 0; c < candidates.length; c++) {
    var name = candidates[c];
    var count = votes[name];
    total += count;
    if (count > max) {
      winning = name;
      max = count;
    }
  }
  
  if (max * 2 > total) {
    return winning;
  }
  return null;
}


function get_remaining_candidates(votes, candidates) {
  var min = -1;
  for (var c = 0; c < candidates.length; c++) {
    var name = candidates[c];
    var count = votes[name];
    if (count < min || min == -1) {
      min = count;
    }
  }
  
  var c = 0;
  while (c < candidates.length) {
    var name = candidates[c];
    var count = votes[name];
    if (count == min) {
      candidates.splice(c, 1);
    } else {
      c++;
    }
  }
  return candidates;
}
  
/*
http://stackoverflow.com/questions/143847/best-way-to-find-an-item-in-a-javascript-array
*/
function include(arr,obj) {
    return (arr.indexOf(obj) != -1);
}


/*
Returns the number of consecutive rows that do not have blank values in the first column.
http://stackoverflow.com/questions/4169914/selecting-the-last-value-of-a-column
*/
function get_num_rows_with_values(results_range) {
  var num_rows_with_votes = 0;
  var num_rows = results_range.getNumRows();
  for (var row = 1; row <= num_rows; row++) {
    var first_is_blank = results_range.getCell(row, 1).isBlank();
    if (first_is_blank) {
      break;
    }
    num_rows_with_votes += 1;
  }
  return num_rows_with_votes;
}


/*
Returns the number of consecutive columns that do not have blank values in the first row.
http://stackoverflow.com/questions/4169914/selecting-the-last-value-of-a-column
*/
function get_num_columns_with_values(results_range) {
  var num_columns_with_values = 0;
  var num_columns = results_range.getNumColumns();
  for (var col = 1; col <= num_columns; col++) {
    var first_is_blank = results_range.getCell(1, col).isBlank();
    if (first_is_blank) {
      break;
    }
    num_columns_with_values += 1;
  }
  return num_columns_with_values;
}


function clear_background_color() {
  var results_range = get_range_with_values(VOTE_SHEET_NAME, BASE_ROW, BASE_COLUMN, NUM_COLUMNS);
  if (results_range == null) {
    return;
  }
  results_range.setBackground('#eeeeee');
  
}
