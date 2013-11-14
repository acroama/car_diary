
/*
 * app key : 0yi4d0jlmedtjf1
 * app secret : 0o1agnuwp8gb9aq
 */

var items = [];
var saved;

var DROPBOX_APP_KEY = "0yi4d0jlmedtjf1";

var client = new Dropbox.Client({key: DROPBOX_APP_KEY});
var diaryTable;

$(function() {
	client.authenticate({interactive:false}, function (error) {
		if (error) {
			alert("Dropbox 인증 오류 : " + error);
		}
	});

	if (client.isAuthenticated()) {
		client.getDatastoreManager().openDefaultDatastore(function (error, datastore) {
			if (error) {
				alert("datastore 오픈 에러 : " + error);
			}

			diaryTable = datastore.getTable("diary");

			// Populate the initial task list.
			// updateList();
// 
			// Ensure that future changes update the list.
			datastore.recordsChanged.addListener(loadFromDropbox);
		});
	}
});


$(document).on("vclick", "#login .login-button", function() {
		
	client.authenticate();
	
  var name = $("#login #name").val();
  
  $.mobile.changePage("#list", {
    transition:"slide"
  });
});

// 정비 내역 리스트 보여주기
$(document).on("pagebeforecreate", "#list", function() {

	// loadFromLocalStorage();
	loadFromDropbox();
});


// 화면 리스트에 표시 - localStorage
/*
function loadFromLocalStorage()
{
  var template;
  var tbody = $("#list-table tbody");
  tbody.empty();
 
	saved = localStorage.car_diary;		

	if (typeof saved !== "undefined") {
		items = JSON.parse(saved);		
	} 
 
  for (var index = 0; index < items.length; index++) {
		template = $("#list-table-item").html();
		
		template = template.replace("{date}", items[index].date);
		template = template.replace("{items}", items[index].items);
		template = template.replace("{amount}", items[index].amount);
		template = template.replace("{mileage}", items[index].mileage);
		template = template.replace("{shop}", items[index].shop);
		
		tbody.append(template);
  } 	
}
*/

// 화면 리스트에 표시 - dropbox
function loadFromDropbox() {
  var template;
  var tbody = $("#list-table tbody");
  tbody.empty();
  
	var records = diaryTable.query();

	// 정비날짜로 정렬
	records.sort(function (taskA, taskB) {
		if (taskA.get("date") < taskB.get("date")) return -1;
		if (taskA.get("date") > taskB.get("date")) return 1;
		return 0;
	});
	
  for (var index = 0; index < records.length; index++) {
		template = $("#list-table-item").html();
		
		template = template.replace("{date}", records[index].get("date"));
		template = template.replace("{items}", records[index].get("items"));
		template = template.replace("{amount}", records[index].get("amount"));
		template = template.replace("{mileage}", records[index].get("mileage"));
		template = template.replace("{shop}", records[index].get("shop"));
		
		tbody.append(template);
  }
  
	// addListeners();
}

$(document).on("vclick", "#input .input-button", function() {
  
	var item = {
			date: $("#date").val(),
			items: $("#items").val(),
			amount: $("#amount").val(),
			mileage: $("#mileage").val(),
			shop: $("#shop").val()
			};
			
	// localStorage에 저장
	// items.push(item);
	// localStorage.car_diary = JSON.stringify(items);

	// dropbox에 저장
	diaryTable.insert(item);
	
	$("#date").val("");
	$("#items").val("");
	$("#amount").val("");
	$("#mileage").val("");
	$("#shop").val("");
	
	$.mobile.changePage("#list", {
		transition:"slide"
	});
	
});

