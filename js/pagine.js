var pageAffichee = 1;
var orderBy = {};
var icons = {
    asc: 'imgs/chevron-up.svg',
    desc: 'imgs/chevron-down.svg',
    none: ''
};

function refreshPagine() {
    var params = {
        search: {},
        page: pageAffichee,
        filters: orderBy,
        nbItem: $('[name=nbItem]').val()
    };

    $('tbody').html('<tr><td colspan="100%">Chargement...</td></tr>');

    $('th[data-column]').each(function (index) {
        var val = $(this).find('input.recherche').val();
        if (val !== '') {
            params.search[$(this).data('column')] = val;
        }
    });

    $.get('./ajax/ajx_crudPagine.php?method=recherche', params, function (result) {
        $('tbody').html('');
        if (result.data.length === 0) {
            pageAffichee = 1;
            $('tbody').append('<tr><td colspan="100">Aucun résultat</td></tr>');
        } else {
            for (var k in result.data) {
                var item = result.data[k];
                $('tbody').append('<tr data-id="' + item.id + '"><td>' + item.prenom + '</td><td>' + item.nom + '</td><td>' + item.genre + '</td><td><img src="imgs/pays/' + item.drapeau + '.svg" style="width: 30px;"></td><td>' + item.age + '</td><td>' + item.naissance + '</td></tr>');
            }
        }
        $("#pages").pxpaginate({
            currentpage: params.page,
            totalPageCount: Math.ceil(result.total / params.nbItem)
        });
    }, 'json');
}


$(function () {
    $('input[name="dates"]').daterangepicker({
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY',
            cancelLabel: 'Clear'
        }
    });

    $('input[name="dates"]').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    });

    $('input[name="dates"]').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });

    $("#pages").pxpaginate({
        callback: function (pagenumber) {
            pageAffichee = pagenumber;
            refreshPagine();
        }
    });
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
});