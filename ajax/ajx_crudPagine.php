<?php

require dirname(__DIR__) . '/vendor/autoload.php';
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
        #$_GET['page'];
        #20 items par page

        #if(isset($_GET['filters']))
        #if(isset($_GET['search']))
        $reader = new \PhpOffice\PhpSpreadsheet\Reader\Xls();
        $spreadsheet = $reader->load($file);

        $sheet = $spreadsheet->getActiveSheet();

        $data = [];

        $xls = $sheet->toArray();
        array_shift($xls);

        $formated = [];
        foreach ($xls as $value) {
            $formated[] = [
                'prenom' => $value[1],
                'nom' => $value[2],
                'genre' => $value[3],
                'pays' => $value[4],
                'age' => $value[5],
                'naissance' => $value[6],
                'id' => $value[7],
                'drapeau' => ($value[4] === 'France' ? 'fr-fr' : (($value[4] === 'Great Britain') ? 'en-en' : 'en-us'))
            ];
        }

        $authorized_column = ['prenom', 'nom', 'genre', 'pays', 'age', 'naissance', 'id'];

        # Gestion des filtres
        if (isset($_GET['filters']) && is_array($_GET['filters'])) {
            $args = [];
            foreach ($_GET['filters'] as $filter => $sort) {
                if (!in_array($filter, $authorized_column)) {
                    echoError('Le filtre "' . $filter . '" est invalide.');
                }
                $args[] = array_column($formated, $filter);
                $args[] = ($sort === 'asc') ? SORT_ASC : SORT_DESC;
            }

            $args[] = &$formated;
            call_user_func_array('array_multisort', $args);
            //var_dump($formated);
            //array_multisort(array_column($formated, 'id'), SORT_DESC, $formated);
        }
        //array_multisort($formated,array_column($formated,'cle'),SORT_ASC);


        # Gestion des recherches
        if (isset($_GET['search']) && is_array($_GET['search']) && count($_GET['search']) > 0) {
            $finded = [];
            foreach ($formated as $element) {
                $trouve = 0;
                foreach ($_GET['search'] as $column => $value) {
                    if (!in_array($column, $authorized_column)) {
                        echoError('Le champ "' . $column . '" est invalide.');
                    }

                    if (isset($element[$column])) {
                        if (strpos(strtolower($element[$column]), strtolower($value)) !== false) {
                            $trouve++;
                        }
                    }
                }

                if ($trouve === count($_GET['search'])) {
                    $finded[] = $element;
                }
            }

            $formated = $finded;
        }

        # Gestion de la pagination
        $nbItems = $_GET['nbItem'] ?? 20;
        $page = $_GET['page'] ?? 1;

        $start = ($page - 1) * $nbItems;
        $end = $page * $nbItems;
        for ($i = $start; $i < $end; $i++) {
            if (isset($formated[$i])) {
                $data[] = $formated[$i];
            }
        }

        /*foreach ($sheet->getRowIterator() as $row) {
            $prenom = $sheet->getCell('B' . $iterator)->getValue();
            $nom = $sheet->getCell('C' . $iterator)->getValue();
            $genre = $sheet->getCell('D' . $iterator)->getValue();
            $pays = $sheet->getCell('E' . $iterator)->getValue();
            $age = $sheet->getCell('F' . $iterator)->getValue();
            $naissance = $sheet->getCell('G' . $iterator)->getValue();
            $id = $sheet->getCell('H' . $iterator)->getValue();

            # Faire les traitements ici


            $data[] = [
                'prenom' => $prenom,
                'nom' => $nom,
                'genre' => $genre,
                'pays' => $pays,
                'age' => $age,
                'naissance' => $naissance,
                'id' => $id,
            ];
            $iterator++;
        }*/

        echoSuccess('Données récupérées avec succès.', ['data' => $data, 'total' => count($formated)]);
        break;
    default:
        echoError('Aucune méthode donnée');
}