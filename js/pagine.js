var pageAffichee = 1;
var orderBy = {};
var icons = {
    asc: 'imgs/chevron-up.svg',
    desc: 'imgs/chevron-down.svg',
    none: ''
};

function refreshPagine() {
    pageAffichee = 1;
    var params = {
        search: [], //TODO à finir
        page: pageAffichee,
        filters: orderBy,
        nbItem: 50 //TODO pouvoir choisir
    };
    $.get('./ajax/ajx_crudPagine.php?method=recherche', params, function (result) {
        console.log(result);
        for (k in result.data) {
            var item = result.data[k];
            $('table').append('<tr><td>' + item[1] + '</td><td>' + item[2] + '</td><td>' + item[3] + '</td><td>' + item[4] + '</td><td>' + item[5] + '</td><td>' + item[6] + '</td><td>' + item[7] + '</td></tr>'
                    );
        }
    }, 'json');
}


$(function () {
    refreshPagine();

    $('[data-column]').on('click', function () {
        var column = $(this).data('column');
        var icon = $(this).find('img');
        if (orderBy[column] !== undefined) {
            if (orderBy[column] === 'asc') {
                orderBy[column] = 'desc';
                icon.attr('src', icons.desc);
                $('.orderBy').find('[name="orderBy[' + column + ']"]').val('desc');
            } else if (orderBy[column] === 'desc') {
                delete orderBy[column];
                icon.attr('src', icons.none);
                icon.hide('fast');
                $('.orderBy').find('[name="orderBy[' + column + ']"]').remove();
            }
        } else {
            orderBy[column] = 'asc';
            icon.attr('src', icons.asc);
            icon.show('fast');
            $('.orderBy').append($('<input name="orderBy[' + column + ']" type="hidden" value="asc">'));
        }
    });

    $('[data-action="reintialiser"]').on('click', function () {
        //TODO reset filtres
        refreshPagine()
    });

    $('[data-action="rechercher"]').on('click', function () {
        refreshPagine();
    });

    //TODO au click sur un numéro de page -> changer pageAffichee + refreshPagine()
});