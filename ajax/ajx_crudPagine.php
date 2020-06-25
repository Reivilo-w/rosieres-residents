<?php

require __DIR__ . '/vendor/autoload.php';
require dirname(__DIR__) . '/functions.php';
$file = dirname(__DIR__) . '/data/example.xls';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

if (!(isset($_GET['method']))) {
    echoError('Aucune méthode donnée.');
}

switch ($_GET['method']) {
    case 'recherche':

        #$_GET['filters']; # ([column => asc, column2 => asc])
        #$_GET['search']; # [column=> valueRecherche]

        #if(isset($_GET['filters']))
        #if(isset($_GET['search']))
        $reader = new \PhpOffice\PhpSpreadsheet\Reader\Xls();
        $spreadsheet = $reader->load($file);

        $sheet = $spreadsheet->getActiveSheet();

        $data = [];
        $iterator = 2;
        foreach ($sheet->getRowIterator() as $row) {
            $prenom = $sheet->getCell('B' . $iterator)->getValue();
            $nom = $sheet->getCell('C' . $iterator)->getValue();
            $genre = $sheet->getCell('D' . $iterator)->getValue();
            $pays = $sheet->getCell('E' . $iterator)->getValue();
            $age = $sheet->getCell('F' . $iterator)->getValue();
            $naissance = $sheet->getCell('G' . $iterator)->getValue();
            $id = $sheet->getCell('H' . $iterator)->getValue();

            # Faire les traitements ici
        }

        echoSuccess('Données récupérées avec succès.', ['data' => $data]);
        break;
    default:
        echoError('Aucune méthode donnée');
}