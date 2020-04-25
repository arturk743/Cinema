<?php
  try{
    $conStr = sprintf("pgsql:host=localhost;port=5432;dbname=postgres;user=arturkowalczyk;password=artur");

    $pdo = new \PDO($conStr);

    $seat = $_POST["seat"];
    $pin = $_POST["pin"];
    $seance_code = $_POST["kod_seansu"];

    $del = $pdo->query("delete from zarezerwowane_miejsca where pin='{$pin}' and kod_seansu={$seance_code} and numer_miejsca='{$seat}'");
    // echo "delete from zarezerwowane_miejsca where pin='{$pin}' and kod_seansu={$seance_code} and numer_miejsca='{$seat}'";
    $count = $del->rowCount();
    echo $count;

  }catch(Exception $e){
    // echo $e->getMessage();
    echo "null";
  }
  $del->closeCursor();
?>
