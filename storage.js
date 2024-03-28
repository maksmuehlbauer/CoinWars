

// wandelt das Array "names & phoneNumbers" in Text um es anschließend im Localstorage zu speichern
// wie ein dict in Python mit Key und Value
function save() {
    let leaderboard = JSON.stringify(highScore);
    localStorage.setItem("leaderboard", leaderboard);

  }
  
  //lädt den value anhand des Keys aus dem local storage, JSON.parse wandelt den Text in ein Array um
  function load() {
    let leaderboard = localStorage.getItem("leaderboard");
    // mit dem if statement wird überpruft ob im local storage schon das highscores vorhanden sind
    // wenn nicht da evt. noch nichts gespeichert wurde wird das if statement nicht ausgeführt und auf die vorhandenen variablen zugegriffen
    if (leaderboard) {
        highScore = JSON.parse(leaderboard);
    }
  }