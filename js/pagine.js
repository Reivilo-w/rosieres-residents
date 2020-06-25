var pageAffichee = 1;
var nbItem = 20;
var orderBy = {};
var icons = {
    asc: 'imgs/chevron-up.svg',
    desc: 'imgs/chevron-down.svg',
    none: ''
};

function refreshPagine() {
    pageAffichee = 1;
    var params = {
        search: {},
        page: pageAffichee,
        filters: orderBy,
        nbItem: nbItem
    };

    $('tbody').html('<tr><td colspan="100%">Chargement...</td></tr>');

    $('th[data-column]').each(function (index) {
        var val = $(this).find('input.recherche').val();
        if (val !== '') {
            console.log($(this).data('column'), val)
            params.search[$(this).data('column')] = val;
        }
    });

    $.get('./ajax/ajx_crudPagine.php?method=recherche', params, function (result) {
        $('tbody').html('');
        for (k in result.data) {
            var item = result.data[k];
            $('tbody').append('<tr data-id="' + item.id + '"><td>' + item.prenom + '</td><td>' + item.nom + '</td><td>' + item.genre + '</td><td><img src="imgs/pays/' + item.drapeau + '.svg" style="width: 30px;"></td><td>' + item.age + '</td><td>' + item.naissance + '</td></tr>');
        }
    }, 'json');
}


$(function () {
    $('[name=nbItem]').val(nbItem);
    refreshPagine();

    $('.is-sortable').on('click', function () {
        var column = $(this).closest('[data-column]').data('column');
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
        $('input.recherche').val('');
        $('.is-sortable img').attr('src', '').hide('fast');
        orderBy = {};
        refreshPagine();
    });

    $('[data-action="rechercher"]').on('click', function () {
        refreshPagine();
    });

    $('[name=nbItem]').on('blur', function () {
        nbItem = $(this).val();
    });

    //TODO au click sur un numéro de page -> changer pageAffichee + refreshPagine()
});