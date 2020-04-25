;(function(window) {

	'use strict';
	var lastTime = 0;
	var prefixes = 'webkit moz ms o'.split(' ');
	// get unprefixed rAF and cAF, if present
	var requestAnimationFrame = window.requestAnimationFrame;
	var cancelAnimationFrame = window.cancelAnimationFrame;
	// loop through vendor prefixes and get prefixed rAF and cAF
	var prefix;
	const price = 15.99;
	var testArray = [];

		var plan = document.querySelector('.plan'),
		planseats,
    kod_seansu,

		// if the following is changed, the CSS values also need to be adjusted (and vice-versa)
		// distance from first row to the screen
		row_front_gap = 800,
		// distance between rows
		row_back = 100,
		// the gap of seats in the middle of the room (equivalent to two columns of seats)
		row_gap_amount = 2,
		// perspective value
		perspective = 2000,
		// transition settings for the room animations (moving camera to seat)
		transitionOpts = {'speed' : 1000, 'easing' : 'cubic-bezier(.7,0,.3,1)'};




	function init() {
		// bind events
		sessionStorage.clear();
		createRoom();
	}

	function createRoom(){

		var url_string = window.location.href;
		var url = new URL(url_string);
		kod_seansu = url.searchParams.get("kod_seansu");
		console.log(kod_seansu);

		var url="http://localhost/get-reservation-seats.php?kod_seansu="+kod_seansu;

		var zarezerwowane_miejsca, obj;


		var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(zarezerwowane_miejsca) {
      if (this.readyState == 4 && this.status == 200) {
				// console.log(this.responseText);
				obj = JSON.parse(this.responseText);
        console.log(obj.zarezerwowane_miejsca);
				zarezerwowane_miejsca = obj.zarezerwowane_miejsca;
				createSeats(zarezerwowane_miejsca);
				planseats = [].slice.call(plan.querySelectorAll('.row__seat'));
				initEvents();
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
	}

	function createRow(element){
		// this == zarezerwowane_miejsca
		var i, row;
		// console.log(this);
		// console.log(element);
		var rows__mini = document.querySelector('.rows');
		row = document.createElement('div');
		row.setAttribute('class', 'row');

		rows__mini.appendChild(row);

		for (i = 1; i < 19; i++) {
			var row__seat = document.createElement('div');

			var index = this.findIndex(elementInReservedSeats, element+i);
			// console.log(index);
			if (index == -1){
				row__seat.setAttribute('class', 'row__seat tooltip');
				row__seat.setAttribute('data-tooltip', element+i);
			} else {
				this.splice(index, 1);
				// console.log(this);
				row__seat.setAttribute('class', 'row__seat row__seat--reserved');
			}
	    row.appendChild(row__seat);
	  }
	}

	function createSeats(zarezerwowane_miejsca){
		var row="ABCDEFGHIJKLMNOPQR";
		// console.log(row.split(""));
		row.split("").forEach(createRow, zarezerwowane_miejsca);
	}

	function elementInReservedSeats(element, index, array){
		// console.log(word.localeCompare(item)==0, item, word);
		return element.localeCompare(this) == 0;
	}


	function initEvents() {
		// select a seat
		var onSeatSelect = function(ev) { selectSeat(ev.target); };
		planseats.forEach(function(planseat) {
			planseat.addEventListener('click', onSeatSelect);
		});

	}

	// select a seat on the seat plan
	function selectSeat(planseat) {
		if( classie.has(planseat, 'row__seat--reserved') ) {
			return false;
		}
		if( classie.has(planseat, 'row__seat--selected') ) {
			classie.remove(planseat, 'row__seat--selected');
			deleteRowInTicketTable(planseat.getAttribute("data-tooltip"));
			return false;
		}
		// add selected class
		classie.add(planseat, 'row__seat--selected');

		// the real seat
		// var seat = seats[planseats.indexOf(planseat)];
		addSelectedSeatToTicketTable(planseat);

    return true;

	}

	function addSelectedSeatToTicketTable(planseat){
		var table;
		try{
			addRowToTable(planseat);
		}
		catch(err){
			createTable();
			addRowToTable(planseat);
		}
	}

	function deleteRowInTicketTable(filter_data) {
  var table, tr, td1, td2, i, row, seatNumber, spanSummary;

  table = document.querySelector('.ticket-table');
	spanSummary = document.getElementById("summaty_span");
  tr = table.getElementsByTagName("tr");
	row = filter_data.substr(0,1);
	seatNumber = filter_data.substr(1,3);

  for (i = 0; i < tr.length; i++) {

    td1 = tr[i].getElementsByTagName("td")[0];
		td1 = td1.innerHTML;
		td2 = tr[i].getElementsByTagName("td")[1];
		td2 = td2.innerHTML;

    if (td1.localeCompare("Rząd: "+row) == 0 & td2.localeCompare("Miejsce: "+seatNumber) == 0) {
				table.deleteRow(i);
				spanSummary.innerHTML = "Suma: "+((tr.length) * price);
				break;
    }
  }

	if(table.getElementsByTagName("tr").length == 0){
		deleteTicketTable();

	}
}

function createTable(){
	var table, naglowek_tabeli, span_naglowek, podsumowanie, span_podsumowanie, button, span_button;

	span_naglowek = document.createElement('span');
	span_naglowek.innerHTML="Wybrane bilety";


	naglowek_tabeli = document.createElement('div');
	naglowek_tabeli.setAttribute('class', 'naglowek_tabeli');
	naglowek_tabeli.appendChild(span_naglowek);
	document.getElementById("selected-tickets").appendChild(naglowek_tabeli);

	table = document.createElement('table');
	table.setAttribute('class', 'ticket-table');
	document.getElementById("selected-tickets").appendChild(table);




	span_podsumowanie = document.createElement('span');
	span_podsumowanie.setAttribute('id','summaty_span');



	podsumowanie = document.createElement('div');
	podsumowanie.setAttribute('class', 'summary');
	podsumowanie.appendChild(span_podsumowanie);
	document.getElementById("selected-tickets").appendChild(podsumowanie);

	span_button = document.createElement('span');
	span_button.innerHTML = "Dalej";


	button = document.createElement('a');
	button.appendChild(span_button);
	button.setAttribute('href','index2.html?kod_seansu='+kod_seansu);
	button.setAttribute('class','button');
	button.setAttribute('style','vertical-align:middle');
	// button.setAttribute('onclick','myFunction(this)');
	button.addEventListener("click", myFunction);
	document.getElementById("selected-tickets").appendChild(button);
}

function deleteTicketTable(){
	const node = document.getElementById("selected-tickets");
	while(node.firstChild){
		node.removeChild(node.firstChild);
	}
}

function addRowToTable(planseat){
	var table = document.querySelector('.ticket-table');
	var spanSummary = document.getElementById("summaty_span");

	var rowInTable = table.insertRow(0);
	var rowCell = rowInTable.insertCell(0);
	var seatNumberCell = rowInTable.insertCell(1);
	var priceCell = rowInTable.insertCell(2);

	var row = planseat.getAttribute("data-tooltip").substr(0,1);
	var seatNumber = planseat.getAttribute("data-tooltip").substr(1,3);

	rowCell.innerHTML = "Rząd: "+row;
	seatNumberCell.innerHTML = "Miejsce: "+seatNumber;
	priceCell.innerHTML = "Cena: "+price+" zł";
	spanSummary.innerHTML = "Suma: "+(table.getElementsByTagName("tr").length * price);
}

function myFunction(){
	storeSelectedSeats();
}

function storeSelectedSeats(){
	var table, tr, td1, td2, i;
	table = document.querySelector('.ticket-table');
	tr = table.getElementsByTagName("tr");

	for (i = 0; i < tr.length; i++) {

    td1 = tr[i].getElementsByTagName("td")[0];
		td1 = td1.innerHTML;
		td2 = tr[i].getElementsByTagName("td")[1];
		td2 = td2.innerHTML;

		testArray.push(td1.substr("Rząd: ".length)+td2.substr("Miejsce: ".length))
  }
	console.log(testArray);
	sessionStorage.setItem('testArray', testArray);
}


	init();

})(window);
