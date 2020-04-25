<?php
  try{
    $conStr = sprintf("pgsql:host=localhost;port=5432;dbname=postgres;user=arturkowalczyk;password=artur");

    $pdo = new \PDO($conStr);

    $kod_seansu = $_REQUEST["kod_seansu"];
    $stmt = $pdo->query("SELECT numer_miejsca FROM zarezerwowane_miejsca WHERE kod_seansu={$kod_seansu}");
    $json_text= "{\"zarezerwowane_miejsca\":[";
    foreach($stmt as $row)
    {
      $json_text .= "\"".$row['numer_miejsca']."\",";
    }
    if (substr($json_text, -1) == "["){
      $json_text .= "]}";
    } else {
      $json_text = substr($json_text, 0, -1)."]}";
    }
    echo $json_text;
  }catch(Exception $e){
    // echo $e->getMessage();
    echo "null";
  }
  $stmt->closeCursor();
?>
