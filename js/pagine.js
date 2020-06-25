var pageAffichee = 1;
var orderBy = {};
var icons = {
    asc: 'expand_less',
    desc: 'expand_more',
    none: ''
};

function refreshPagine() {
    //{page: pageAffichee, column: orderBy.column, order: orderBy.order}
    //URL, selecteur css du contenu, selecteur css des pages, nbItemsParPage
    console.log("TODO afficher le contenu du pagine en fonction des paramètres de filtrages")
}


$(function () {
    refreshPagine();

    $('[data-column]').on('click', function () {
        var column = $(this).data('column');
        var icon = $(this).find('i');
        if (orderBy[column] !== undefined) {
            if (orderBy[column] === 'ASC') {
                orderBy[column] = 'DESC';
                icon.html(icons.desc);
                $('.orderBy').find('[name="orderBy[' + column + ']"]').val('DESC');
            } else if (orderBy[column] === 'DESC') {
                delete orderBy[column];
                icon.html(icons.none);
                icon.hide('fast');
                $('.orderBy').find('[name="orderBy[' + column + ']"]').remove();
            }
        } else {
            orderBy[column] = 'ASC';
            icon.html(icons.asc);
            icon.show('fast');
            $('.orderBy').append($('<input name="orderBy[' + column + ']" type="hidden" value="ASC">'));
        }
        pageAffichee = 1;
        refreshPagine();
    });

    //TODO au click sur "Rechercher" -> refreshPagine()

    //TODO au click sur "Réintialiser" -> reset filtres + refreshPagine()

    //TODO au click sur un numéro de page -> changer pageAffichee + refreshPagine()
});