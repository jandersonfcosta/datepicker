// cria e insere do componente na tela
(function() {
	var datepicker = document.createElement("div");
	datepicker.id = "datepicker";
	datepicker.className = "datepicker";
	document.body.appendChild(datepicker);
})();

function datepicker(args) {
	var dp = document.getElementById("datepicker"),
		html = document.body.parentNode,
		field = args.field,
		date,
		blockHide = true;


	// EXECUÇÃO

	args.format = args.format || "dd/mm/yyyy";

	if (args.format == "dd/mm/yyyy" && isDate(field.value)) {
		date = field.value.split("/");
		date = new Date(Number(date[2]), Number(date[1]) - 1, Number(date[0]));
	} else {
		date = new Date();
	}

	show();
	setCalendar(date);


	// FUNÇÕES

	function show() {
		// exibe o datepicker para o campo vinculado

		// posição
		field.parentNode.appendChild(dp);

		// exibe
		dp.style.display = "block";

		// evento - fechar
		// element.removeEventListener("mousedown", functionName); // não suportado no IE7
		// element.addEventListener("mousedown", functionName); // não suportado no IE7
		// ---------------------------------------------------------------------------------
		html.onmouseup = null;
		html.onmouseup = function() {
			if (!blockHide)
				hide();
			else
				blockHide = false;
		};
		dp.onmousedown = null;
		dp.onmousedown = function() {
			blockHide = true;
		};
		// ---------------------------------------------------------------------------------

		// callback
		if (args.onShow)
			args.onShow();
	}

	function hide(selectedDate) {
		// oculta o datepicker ao clicar fora ou selecionar um dia

		var hide = false;

		if (selectedDate)
			hide = true;
		else if (event.target != field) // click fora
			hide = true;

		if (hide && dp.style.display.match(/block/i)) {
			dp.style.display = "none";

			// callback
			if (selectedDate && args.onSelect)
				args.onSelect(selectedDate);

			// callback
			if (args.onHide)
				args.onHide();
		}
	}

	function setCalendar(date) {
		// configura o calendário

		// retorna o calendário em html para data especificada
		dp.innerHTML = getCalendar(date);

		// botões anterior/próximo mês
		var buttonPrev = document.getElementById("datepicker-navbar-left"),
			buttonNext = document.getElementById("datepicker-navbar-right");

		// evento - botão anterior
		buttonPrev.onclick = function() {
			setCalendar(new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()));
		};

		// evento - botão próximo
		buttonNext.onclick = function() {
			setCalendar(new Date(date.getFullYear(), date.getMonth() + 1, date.getDate()));
		};

		// evento - dias
		var days = dp.getElementsByTagName("div");

		for (var i = 0; i < days.length; i++) {
			var day = days[i];

			if (day.className.match("day"))
				day.onclick = selectDate;
		}

		function selectDate() {
			var d = this.getAttribute("day"),
				m = this.getAttribute("month"),
				y = this.getAttribute("year");

			// formato
			if (args.format === "dd/mm/yyyy")
				date = d + "/" + m + "/" + y;

			field.value = date;
			hide(date);
		}
	}

	function getCalendar(date) {
		// retorna o calendário em html para a data espefificada

		if (typeof(date) == "undefined")
			date = new Date();

		var months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
			weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
			day = date.getDate(),
			month = date.getMonth(),
			year = date.getFullYear(),
			_day,
			_month,
			_year,
			_class,
			lastMonth = new Date(year, month - 1, 1),
			thisMonth = new Date(year, month, 1),
			nextMonth = new Date(year, month + 1, 1),
			firstWeekDay = thisMonth.getDay(),
			lastMonthDays = Math.round((thisMonth.getTime() - lastMonth.getTime()) / (1000 * 60 * 60 * 24)),
			monthDays = Math.round((nextMonth.getTime() - thisMonth.getTime()) / (1000 * 60 * 60 * 24)),
			html = '<table>';

		// < mês, ano >
		html +=
		'<tr class="datepicker-navbar">' +
			'<td id="datepicker-navbar-left"><a>&#10094;</a></td>' +
			'<td class="datepicker-navbar-center" colspan="5"><b>' + months[month] + '</b>, ' + year + '</td>' +
			'<td id="datepicker-navbar-right"><a>&#10095;</a></td>' +
		'</tr>';

		// dias da semana
		html += '<tr class="datepicker-week">';

		for (var i in weekDays)
			html += '<td>' + weekDays[i] + '</td>';

		html += '</tr><tr>';

		// mês anterior
		for (i = 1; i < firstWeekDay + 1; i++) {
			_day = lastMonthDays - firstWeekDay + i;
			_month = lastMonth.getMonth() + 1;
			_year = lastMonth.getFullYear();

			html +=
			'<td class="gray">' +
				'<div class="datepicker-day" day="' + _day + '" month="'+ _month +'" year="' + _year + '">' + _day  + '</div>' +
			'</td>';
		}

		// mês atual
		for (j = 1; j <= monthDays; j++) {
			firstWeekDay %= 7;
			_class = "datepicker-day";

			if (firstWeekDay === 0)
				html += '</tr><tr>';

			// dia selecionado
			if (day == j)
				_class += " datepicker-day-selected";

			_day = j;
			_month = thisMonth.getMonth() + 1;
			_year = thisMonth.getFullYear();

			html +=
			'<td>' +
				'<div class="' + _class + '" day="' + _day + '" month="'+ _month +'" year="' + _year + '">' + _day + '</div>' +
			'</td>';

			firstWeekDay++;
		}

		// mês posterior
		for (k = 0; k < 7 - firstWeekDay; k++) {
			_day = k + 1;
			_month = nextMonth.getMonth() + 1;
			_year = nextMonth.getFullYear();
			html +=
			'<td class="gray">' +
				'<div class="datepicker-day" day="' + _day + '" month="'+ _month +'" year="' + _year + '">' + _day + '</div>' +
			'</td>';
		}

		html += '</tr>';
		html += '</table>';

		return html;
	}

	function isDate(date) {
		// valida o formato da data - 1/1/2000 ou 01/01/2016

		try {
			return date.match(/^([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4})$/);
		} catch(ex) {
			return false;
		}
	}
}
