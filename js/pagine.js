var pageAffichee = 1;
var orderBy = {};

function refreshPagine() {
    var params = {
        search: {},
        page: pageAffichee,
        filters: orderBy,
        nbItem: $('[name=nbItem]').val()
    };

    $('tbody').html('<tr><td colspan="100%">Chargement...</td></tr>');

    $('th[data-column]').each(function (index) {
        var val = '';
        if ($(this).find('input.recherche').length > 0) {
            val = $(this).find('input.recherche').val();
        } else {
            val = $(this).find('option:selected').val();
        }
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
                $('tbody').append('<tr><td>' + item.prenom + '</td><td>' + item.nom + '</td><td>' + item.genre + '</td><td><img title="' + item.pays + '" src="imgs/pays/' + item.drapeau + '.svg" style="width: 30px;"></td><td>' + item.age + '</td><td>' + item.naissance + '</td><td><a target="_blank" href="https://www.commune-rosieres10.fr/Recherche?id_article=' + item.id + '">' + item.id + '</a></td></tr>');
            }
        }
        $("#pages").pxpaginate({
            currentpage: params.page,
            totalPageCount: Math.ceil(result.total / params.nbItem)
        });
    }, 'json');
}


$(function () {
    $('span.up').hide();
    $('span.down').hide();
    $('[name="pays"]').wSelect();
    $('input[name="dates"]').daterangepicker({
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY',
            cancelLabel: 'Vider',
            applyLabel: 'Appliquer'
        }
    });

    $('input[name="dates"]').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
        refreshPagine();
    });

    $('input[name="dates"]').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
        refreshPagine();
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
        if (orderBy[column] !== undefined) {
            if (orderBy[column] === 'asc') {
                orderBy[column] = 'desc';
                $(this).find('span.down').show('fast');
                $(this).find('span.up').hide('fast');
                $('.orderBy').find('[name="orderBy[' + column + ']"]').val('desc');
            } else if (orderBy[column] === 'desc') {
                delete orderBy[column];
                $('.orderBy').find('[name="orderBy[' + column + ']"]').remove();
                $(this).find('span.up').hide('fast');
                $(this).find('span.down').hide('fast');
            }
        } else {
            orderBy[column] = 'asc';
            $(this).find('span.up').show('fast');
            $(this).find('span.down').hide('fast');
            $('.orderBy').append($('<input name="orderBy[' + column + ']" type="hidden" value="asc">'));
        }
        refreshPagine();
    });

    $('[data-action="reintialiser"]').on('click', function () {
        $('input.recherche').val('');
        $('[name="pays"]').val('').change();
        $('.is-sortable').find('span.up,span.down').hide('fast');
        orderBy = {};
        refreshPagine();
    });

    $.fn.enterKey = function (fnc) {
        return this.each(function () {
            $(this).keypress(function (ev) {
                var keycode = (ev.keyCode ? ev.keyCode : ev.which);
                if (keycode == '13') {
                    fnc.call(this, ev);
                }
            })
        })
    }

    $('[data-column] input').enterKey(function () {
        refreshPagine();
    });

    $('[name="pays"]').on('change', function () {
        refreshPagine();
    });

    $('[name="nbItem"]').bind('keyup mouseup', function () {
        refreshPagine();
    });
});