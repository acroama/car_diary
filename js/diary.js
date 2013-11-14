
/* 
 * Dropbox
 * app key : 0yi4d0jlmedtjf1
 * app secret : 0o1agnuwp8gb9aq
 */

/*
 * T developers BasS
 * javascript TDCProjectKey : cb7abc6e-6d46-46fc-bbf5-b95105fba242
 * REST TDCProjectKey : 1759d905-1d25-4490-b0c7-8916a96f64bf
 */

var items = [];
var fetched;

/******************* Dropbox  

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
****************/

// AJAX 호출을 통해 데이터 가져오기
function makeAjaxCall()
{ 
  $.ajax({
  	type: "GET",
    url: "https://apis.sktelecom.com/v1/baas/data/car_diary",
    header: {
    	'TDCProjectKey': 'cb7abc6e-6d46-46fc-bbf5-b95105fba242'
    },
		data: {
			'limit': 1000
		},
		dataType: "json",
	  contentType: "application/json; charset=utf-8",
	    // contentType: "text/plain;charset=utf-8",
	  success: function(json) {
	  	fetched = json;
	    console.log(fetched);
	  },
	  error: function(XMLHTTPRequest, textStatus, errorThrown) {
	    console.log("error : " + XMLHttpRequest.responseText);
	  }
  });
}



$(document).on("vclick", "#login .login-button", function() {
		
	// client.authenticate();			// dropbox
	
  var name = $("#login #name").val();
  
  $.mobile.changePage("#list", {
    transition:"slide"
  });
});

// 정비 내역 리스트 보여주기
$(document).on("pagebeforecreate", "#list", function() {

	load();
	// loadFromDropbox();
});


// 화면 리스트에 표시 - T developers

function load()
{
  var template;
  var tbody = $("#list-table tbody");
  tbody.empty();
 
	// saved = localStorage.car_diary;		

	// if (typeof saved !== "undefined") {
		// items = JSON.parse(saved);		
	// } 
 
 
  for (var index = 0; index < fetched.totalCount; index++) {
		template = $("#list-table-item").html();
		
		template = template.replace("{date}", fetched.results[index].date);
		template = template.replace("{items}", fetched.results[index].items);
		template = template.replace("{amount}", fetched.results[index].amount);
		template = template.replace("{mileage}", fetched.results[index].mileage);
		template = template.replace("{shop}", fetched.results[index].shop);
		
		tbody.append(template);
  } 	
}


// 화면 리스트에 표시 - dropbox
/*
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
*/

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

