const urlParams = new URLSearchParams(window.location.search);
let sort = 'alpha';
let order = '1';
try {
	if (!urlParams.has('sort') || !urlParams.has('order'))
		throw new Error('no keys');

	sort = urlParams.get('sort');
	order = urlParams.get('order');
	console.log('sort:', sort);
	console.log('order:', order);

	if (!['alpha', 'popularity', 'random'].includes(sort))
		throw new Error('invalid key');
	if (!['1', '-1', 1, -1].includes(order))
		throw new Error('invalid key');

	const sorting = document.getElementById("sorting-container");
	sorting.focus();
	sorting.scrollIntoView({
		behavior: 'smooth',
		block: 'start'
	});
	console.log('try');
} catch (err) {
	console.error(err);

	try {
		if (!localStorage.getItem('sort-by') || !localStorage.getItem('sort-order'))
			throw new Error('no keys');

		sort = localStorage.getItem('sort-by');
		order = localStorage.getItem('sort-order');
		if (!['alpha', 'popularity', 'random'].includes(sort))
			throw new Error('invalid key');
		if (!['1', '-1', 1, -1].includes(order))
			throw new Error('invalid key');
		console.log('local');
	} catch (err) {
		sort = 'alpha';
		order = '1';
		console.log('catch');
	}
} finally {
	console.log('FINALLY');
	handleSorting(sort, order);
}


$('.switch-sort').on('click', function (event) {
	event.preventDefault();
	let sort = this.dataset.sort;
	let order = this.dataset.order === '1' ? '-1' : '1';

	handleSorting(sort, order);
	setTimeout(() => {
		location.href = `/browse?sort=${sort}&order=${order}`;
	}, 500);
});

$('.sort-options').on('click', function(event) {
	event.preventDefault();
	let item = $(`${this.dataset.sortby}`)[0];
	let sort = item.dataset.sort;
	let order = item.dataset.order === '1' ? '-1' : '1';

	handleSorting(sort, order);
	setTimeout(() => {
		location.href = `/browse?sort=${sort}&order=${order}`;
	}, 1500);
});

function handleSorting(sort, order) {
	$('.switch-sort').hide();
	$('.sort-title').hide();
	order = order.toString();

	let item = $(`.sort-${sort}`);
	$(item).removeClass($(item).data('asc'));
	$(item).removeClass($(item).data('desc'));
	$(item).show();
	$(item).attr('data-order', order);

	if (order == '1')
		$(item).addClass($(item).data('asc'));
	else
		$(item).addClass($(item).data('desc'));

	$(`.sort-title.${sort}-title.title-${order}`).show();
	localStorage.setItem('sort-by', sort);
	localStorage.setItem('sort-order', order);
}