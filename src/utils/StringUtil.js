let index = 1;
export const uniqueId = function () {
	let string = "";
	string = new Date().getUTCMilliseconds();
	index++;
	return index + "-" + string;
}

export function beautifyNominal(val) {
	if (val == "" || val == null) return "0";
	let nominal = "" + val;
	let result = "";
	if (nominal.length > 3) {
		let zero = 0;
		for (let i = nominal.length - 1; i > 0; i--) {
			zero++;
			result = nominal[i] + result;
			if (zero == 3) {
				result = "." + result;
				zero = 0;
			}

		}
		result = nominal[0] + result;
	} else {
		result = val;
	}
	return result;
}

export const getMaxSales = (list) => {
	let result = 0;
	for (let i = 0; i < list.length; i++) {
		const element = list[i];
		if (element.sales > result)
			result = element.sales;
	}
	return result;
}

export const isNonNullArray = function (array) {
	return array != null && array.length > 0;
}

export const isNonNullArrayWithIndex = function (array, i) {
	return array != null && array.length > 0 && array[i] != null;
}

const months = [
	"January", "Ferbuary", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"
]

export const monthYearString = function (m, y) {
	if (m == null || y == null) {
		return "...";
	}
	return months[m - 1] + " " + y;
}

export const dateInputVal = function (dd, mm, yyyy) {
 
	let month = +mm < 10 ? "0" + mm : mm;
	let day = +dd < 10 ? "0" + dd : dd;

	return yyyy + "-" + month + "-" + day;
}