if (window.location.pathname.indexOf('/produkt/') === 0 && $('.js-attribute')[0]) {
	function updatePrice() {
		$('.js-attribute').attr('onchange', 'updatePrice()');
		var attributeSum = 0;
		$('.js-attribute :selected').each(function() {
			attributeSum += $(this).data('price');
		});
		var mainPrice = findMainProductPrice();
		var price = mainPrice + attributeSum;
		price = priceToString(price);
		$('article.product .price__display').html(price);
	}
	updatePrice();

} else if (window.location.pathname.indexOf('/produkt/') === 0 && $('optgroup')[0]) {
	function onOptionChange() {
		var mainPrice = findMainProductPrice();
		$('.product__attribute__control').attr('onchange', 'onOptionChange()');
		var option = $('optgroup :selected');
		var parentOption = option.parent().attr('label');
		var childOption = option.text();
        var fullPrice = mainPrice + optVal(parentOption) + optVal(childOption);
        var childPrice = mainPrice + optVal(childOption);
        var parentPrice = mainPrice + optVal(parentOption);

        switch (true) {
            case isNaN(parentPrice) && isNaN(childPrice):
                $('.price__display').html(priceToString(mainPrice));
                break;
            case isNaN(parentPrice):
                $('.price__display').html(priceToString(childPrice));
                break;
            case isNaN(childPrice):
                $('.price__display').html(priceToString(parentPrice));
                break;
            default:
                $('.price__display').html(priceToString(fullPrice));
        }
	}
	onOptionChange();
}

function optionNumber (opt) {
	opt = opt.slice(2);
	opt = opt.replace(',', '.');
	opt = opt.replace(/\s/g, '');
	return opt;
}

function optVal (optV) {
	var isPlus = optV.match(/\s\+\s[0-9]/);
	var isMinus = optV.match(/\s\-\s[0-9]/);

    switch (isPlus || isMinus) {
        case isPlus:
            var optionSlicePlus = optV.lastIndexOf('+');
            var optionPlus = optV.slice(optionSlicePlus);
            optionPlus = Number(optionNumber(optionPlus));
            return optionPlus;

        case isMinus:
            var optionSliceMinus = optV.lastIndexOf('-');
            var optionMinus = optV.slice(optionSliceMinus);
            optionMinus = -Math.abs(Number(optionNumber(optionMinus)));
            return optionMinus;
    }
}

function priceToString(price) {
	price = price.toFixed(2);
	price = price.replace('.', ',');

	if(price.length > 6){
		var thpos = -6;
		var strNum = price.slice(0, price.length+thpos);
		var strgspace = (' ' + price.slice(thpos));
		price = strNum + strgspace;
	}
	return price;
}

function findMainProductPrice() {
	var metaPrice = document.getElementsByTagName("meta");

	for (var i = 0; i < metaPrice.length; i++) {
		if(metaPrice[i].getAttribute('itemprop') === 'price') {
			return parseInt(metaPrice[i].getAttribute('content'));
		}
	}
}