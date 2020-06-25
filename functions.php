<?php
function echoJson(array $content)
{
    echo json_encode($content);
}

function echoError(string $message)
{
    echoJson(['etat' => 'error', 'message' => $message]);
    exit;
}

function echoSuccess(string $message, array $moreData = [])
{
    echoJson(array_merge(['etat' => 'success', 'message' => $message], $moreData));
    exit;
}