<?php
  try{
    $conStr = sprintf("pgsql:host=localhost;port=5432;dbname=postgres;user=arturkowalczyk;password=artur");

    $pdo = new \PDO($conStr);

    $email = $_POST["email"];
    $pin = $_POST["pin"];
    $stmt = $pdo->query("select z.numer_miejsca, s.data, s.czas_rozpoczecia, f.tytul, s.kod_seansu
from zarezerwowane_miejsca z
inner join seans s using(kod_seansu)
inner join film f using(kod_filmu)
inner join klienci k on k.\"e-mail\"='{$email}' and k.klient_id=z.klient_id
where z.pin='{$pin}'");

    $json_text="";
    $first_row = $stmt->fetch();
    if(is_null($first_row["data"]) == true){
      echo "{\"OK\": \"1\"}";
    } else {
    $title = $first_row["tytul"];
    $date = $first_row["data"];
    $start = $first_row["czas_rozpoczecia"];
    $booked_seat = $first_row["numer_miejsca"];
    $seance_code = $first_row["kod_seansu"];

    $json_text = "{\"OK\": \"0\", \"tytul\": \"{$title}\", \"data\": \"{$date}\", \"czas_rozpoczecia\": \"{$start}\", \"kod_seansu\": \"{$seance_code}\", \"zarezerwowane_miejsca\": [\"{$booked_seat}\"";
    foreach($stmt as $row)
    {

      $json_text .= ",\"{$row["numer_miejsca"]}\"";
    }
    $json_text .="]}";

    echo $json_text;
  }
  }catch(Exception $e){
    // echo $e->getMessage();
    echo "null";
  }
  $stmt->closeCursor();
?>
