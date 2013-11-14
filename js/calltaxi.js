var fetched;					// 전체 호출로 가져온 데이터
var fetchedOnce;			// 한번 호출로 가져온 데이터 (서버 제약이 있어서 한번에 가져올 수 있는 양 제한되어 있음)
var entries;					// 전체 호출로 가져온 데이터 (fetched) 중에 데이터 부분만을 지칭
var totalCount = -1;
var fetchedCount = 0;
var pageCount = 1;

var guList = [];


// 리스트 페이지 처음 만들어질 때, 데이터 유무 판단
$(document).on("pagebeforecreate", "#list", function() {

  if (typeof fetched === "undefined") {
	  var saved = sessionStorage.point2m;
	  if (typeof saved !== "undefined") {
	    fetched = JSON.parse(saved);
	    load();
	  } else {
	    makeAjaxCall();
	    return;
	  }
  }
  
  load();
});   

// 화면 리스트에 표시
function load()
{
  entries = fetched.entry;
  var template;
  var tbody = $("#list-table tbody");
  tbody.empty();
  
  var guItem;
 
  for (var index = 0; index < entries.length; index++) {
    template = $("#list-table-item").html();
    
    template = template.replace("{date}", entries[index].기준년월);
    template = template.replace("{area}", entries[index]["발신지역(시/도)"] + " " + entries[index]["발신지역(시/군/구)"] + " " + entries[index]["발신지역(읍/면/동)"]);
    template = template.replace("{call}", entries[index].통화량);
    tbody.append(template);
    
    guItem = entries[index]["발신지역(시/군/구)"];
  	
  	if (guList.indexOf(guItem) == -1)
  		guList.push(guItem);
  }  
}

// AJAX 호출 끝나면 Session Storage에 저장하고 화면 로드
$(document).ajaxSuccess(function() {
	
	fetchedCount += parseInt(fetchedOnce.count);
	totalCount = fetchedOnce.totalResult;			

	if (typeof fetched === "undefined")
		fetched = fetchedOnce;
	else
		fetched.entry = fetched.entry.concat(fetchedOnce.entry);
	
	if (fetchedCount != totalCount)	{
		makeAjaxCall();
	} else {
		delete fetched.page;
		delete fetched.count;
		sessionStorage.point2m = JSON.stringify(fetched);
		load();
	}
	
});


// AJAX 호출 별로 구별해서 처리해야 할 때
/*
$(document).ajaxComplete(function(event, xhr, settings) {
	if (settings.url === "https://api.bigdatahub.co.kr/v1/datahub/datasets/search.json") {
		
	}
	else if (settings.url === "https://api.bigdatahub.co.kr/v1/datahub/datasets/datainfo.json") {
		
	}
	
  sessionStorage.point2m = JSON.stringify(fetched);
	load();
});
*/


// AJAX 호출을 통해 데이터 가져오기
function makeAjaxCall()
{ 
  $.ajax({
  	type: "GET",
    url: "https://api.bigdatahub.co.kr/v1/datahub/datasets/search.json",
		data: {
			'pid': '1000677',
			'TDCAccessKey': '7d3757d29d8f007e0e296476f7e757b9c080873026ad9960003c26e2590eb733',
			'$page': pageCount++,
			'$count': 500
		},
		dataType: "json",
	    //contentType: "application/json; charset=utf-8",
	    // contentType: "text/plain;charset=utf-8",
	  success: function(json) {
	  	fetchedOnce = json;
	    console.log(fetchedOnce);
	  },
	  error: function(XMLHTTPRequest, textStatus, errorThrown) {
	    console.log("error : " + XMLHttpRequest.responseText);
	  }
  });

}

// 상품 메타 정보 조회
// $.ajax({
	// type : "GET",
	// url : "https://api.bigdatahub.co.kr/v1/datahub/datasets/datainfo.json",         
	// data: {
	  // 'pid' : '1000677',
	  // 'TDCAccessKey': '7d3757d29d8f007e0e296476f7e757b9c080873026ad9960003c26e2590eb733',
	// },
	// dataType : "json",
	// success : function(json) {
	  // console.log(json);
	// },
	// error : function(e) {
	  // alert("error");
	// }
// });



var options = {
  chart: {
    type: "column",
    borderWidth: 1
  },
  title: {
    text: "콜택시 - 대리운전 이용 분석"
  },
  xAxis: {
    title: {
      text: "주소(읍면동)"
    },
    labels: {
    	rotation: -50,
    	align: "right",
    	style: {
    		fontSize: "12px",
    		fontFamily: "Malgun Gothic"	// Dotum, DotumChe, Gulim, Batang, Gungsuh, New Gulim, Malgun Gothic, NanumGothic, Lucida Grande, Segoe UI, Arial, AppleGothic, Sans-serif
    	},
    	y: 10,
    	x: 5
    },
    categories: []
  },
  yAxis: {
    title: {
      text: "통화량"
    }
  },
  tooltip: {
  	formatter: function() {
  		return "<b>" + this.series.name + " " + this.point.category + " : " + this.point.y + "건";
  	}
  },  
  plotOptions: {
		pie: {
			dataLabels: {
				formatter: function() {
					return this.point.name + ":" + this.point.y + "건";
				}
			}
		}
  },
  series: [{
  	data: [],
   	showInLegend: false
  }]
};

// 차트 페이지 맨 처음 뜰 때 구 리스트 만들고 첫번째 구로 차트 그리기
$(document).on("pagebeforecreate", "#chart", function () { 
	var guComboBox = $("#chat #gu");
	guComboBox.empty();
	
	for (var index = 0; index < guList.length; index++)
		$("#chart #gu").append("<option value=\"" + guList[index] + "\">" + guList[index] + "</option>");

	onGuChanged(guList[0]);	
});

// 선택된 구에 해당하는 동별 차트 그리기
function onGuChanged(selected) {

	var guIndex = 0;
	// guSelected = selected;

  load();

  entries = fetched.entry;

  var callList = [];
  for (var index = 0; index < entries.length; index++) {

  	if (entries[index]["발신지역(시/군/구)"] === selected) {
	    options.xAxis.categories[guIndex] = entries[index]["발신지역(읍/면/동)"];
	    callList[guIndex] = parseInt(entries[index].통화량);
	    guIndex++;
		}
	}
	  
	options.series[0].data = callList;
	options.series[0].name = selected;
	
	// pie 차트의 경우
	if (options.chart.type === "pie") {
		var pieCall = [];
		for (var i = 0; i < options.series[0].data.length; i++) 
	  	pieCall.push([options.xAxis.categories[i], options.series[0].data[i]]);
	  
	  options.series[0].data = pieCall;
  }
	
  $("#chart #container").highcharts(options);     
}

// 사용자가 "구"를 선택하면...
$(document).on("change", "#chart #gu", function(){
	onGuChanged($("#chart #gu option:selected").val());
});

// line 차트 구현
$(document).on("vclick", "#chart #chart-line", function() {
  options.chart.type = "line";

  $("#chart #container").highcharts(options);
});

// column 차트 구현
$(document).on("vclick", "#chart #chart-column", function() {
  options.chart.type = "column";
  
  $("#chart #container").highcharts(options);
});

// pie 차트 구현
$(document).on("vclick", "#chart #chart-pie", function() {
  options.chart.type = "pie";
  
	onGuChanged($("#chart #gu option:selected").val());
});
  
// stacked bar 차트 구현
// $(document).on("vclick", "#chart #chart-stack", function() {
  // options.chart.type = "bar";
  // options.plotOptions.series.stacking = "normal";  
//  
  // $("#chart #container").highcharts(options);
// });


// google map
$(document).one("pageshow", "#map", function() {
  var myLatLng = new google.maps.LatLng(37.509687810964515, 126.84324145317078);
  var myOptions = {
    zoom: 16,
    center: myLatLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map($("#google-map").get(0), myOptions);
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map
   });
});
