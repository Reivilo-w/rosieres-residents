<?php
require dirname(__DIR__) . '/functions.php';

$file = dirname(__DIR__) . '/data/example.xls';

if (!(isset($_GET['method']))) {
    echoError('Aucune méthode donnée.');
    exit;
}

switch ($_GET['method']) {
    case 'recherche':
        require __DIR__ . '/vendor/autoload.php';
        #$_GET['filters']; # ([column => asc, column2 => asc])
        #$_GET['search']; # [column=> valueRecherche]

        #if(isset($_GET['filters']))
        #if(isset($_GET['search']))

        break;
    default:
        echoError('Aucune méthode donnée');
        exit;
}