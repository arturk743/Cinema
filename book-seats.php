<?php
  try{
    $conStr = sprintf("pgsql:host=localhost;port=5432;dbname=postgres;user=arturkowalczyk;password=artur");

    $pdo = new \PDO($conStr);

    $kod_seansu = $_REQUEST["kod_seansu"];
    $name = $_POST["imie"];
    $surname = $_POST["nazwisko"];
    $phone = $_POST["telefon"];
    $email = $_POST["email"];
    $selected_seats = explode(',', $_POST["wybrane_miejsca"]);
    $client_id;


    $query1 = "SELECT klient_id FROM klienci WHERE imie='{$name}' and nazwisko='{$surname}' and nr_telefonu='{$phone}' and \"e-mail\"='{$email}'";
    // echo $query1;
    $pdo->beginTransaction();

    $stmt = $pdo->query($query1)-> fetch();
    // echo $stmt["klient_id"];

      if(!is_null($stmt["klient_id"])){
        $client_id= $stmt["klient_id"];
        // echo "tak";
      } else{
        $query2 = "INSERT INTO klienci (imie, nazwisko, nr_telefonu, \"e-mail\") VALUES ('{$name}','{$surname}','{$phone}','{$email}')";
        // echo $query2;
        $pdo->query($query2);
        $stmt2 = $pdo->query($query1)-> fetch();
        if(is_null($stmt2["klient_id"])){
          throw new Exception('Błędne dane.');
        }
        $client_id= $stmt2["klient_id"];

      }

      $pin = rand(1000,9999);



      foreach($selected_seats as $seat){
         $temp = $pdo->query("INSERT INTO zarezerwowane_miejsca (kod_seansu,numer_miejsca,klient_id,pin) VALUES({$kod_seansu},'{$seat}',{$client_id},{$pin})");
         if($temp->rowCount() != 1){
           throw new Exception('Zajete miejsce.');
         }
      }
      echo "Udało się ".$pin;
      $pdo->commit();



  }catch(PDOException $e){
    // echo $e->getMessage();
    echo "Błąd";
  } catch(Exception $e){
    echo $e->getMessage();
  }
  // $stmt->closeCursor();
?>
