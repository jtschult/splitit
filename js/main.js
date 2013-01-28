$(document).ready(function() {
	$(".receipt_row").each(function(index, row) {
		$(row).click(function() {
			clickRow(this);
		});
	});
});

function clickRow(obj) {
	var val = $(obj).children(".receipt_price").html();
	val = parseFloat(val.substring(1));
	if (obj.classList.contains("selected")) {
		deselectRow(obj);
		val = val * -1;
	} else {
		selectRow(obj);
	}
	adjustTotal(val);
}
function selectRow(obj) {
	obj.classList.add("selected");
}
function deselectRow(obj) {
	obj.classList.remove("selected");
}
var total = 25.00;
var tax = 2.5;

function adjustTotal(val) {
	var items = parseInt($("#diner_items").html());
	var prevTotal = $("#diner_total").html();
	prevTotal = parseFloat(prevTotal.substring(1));
	var count = (val < 0) ? -1 + items : 1 + items;
	
	if (count == 0) {
		$("#doneLink").addClass("inactive");
	} else {
		$("#doneLink").removeClass("inactive");
	}
	
	$("#diner_items").html(count);
	var newTotal = (Math.round((prevTotal + val)*100)/100) + "";
	if (newTotal == "0") {
		newTotal = "0.";
	}
	for (var i = newTotal.length - (newTotal.lastIndexOf(".")+1); i < 2; i++) {
		newTotal = newTotal + "0";
	}
	$("#diner_total").html("$" + newTotal);
	var newTax = (Math.round((newTotal/total * tax)*100)/100) + "";
	if (newTax == "0") {
		newTax = "0.";
	}
	for (var i = newTax.length - (newTax.lastIndexOf(".")+1); i < 2; i++) {
		newTax = newTax + "0";
	}
	$("#diner_tax").html("$" + newTax);
}
function resetBill() {
	$("#diner_tax").html("$0.00");
	$("#diner_total").html("$0.00");
	$("#diner_items").html("0");
	$("#doneLink").addClass("inactive");
}
function dinerDone() {
	$(".receipt_row.selected").each(function(index, row) {
		$(row).animate({
			"height":0,
			"opacity":0
		},function(){
			$(this).addClass("totaled");
			resetBill();
		});
	});
}