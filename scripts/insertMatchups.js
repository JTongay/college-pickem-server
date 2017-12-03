function insertMatchups() {
  // ---------- Insert information to database -----------------

  const something = {};
  knex('teams').where('abbr_name', game.away.abbrev).andWhere('league', 'NCAA').first().then((awayTeam) => {
    // console.log(awayTeam)
    something.awayTeam = awayTeam;
  })
    .then(() => {
      knex('teams').where('abbr_name', game.home.abbrev).andWhere('league', 'NCAA').first().then((homeTeam) => {
        // console.log(homeTeam)
        something.homeTeam = homeTeam;
      });
    })
    .then(() => {
      console.log(something);

    });
  // console.log(something);
  // knex('matchups')
  //   .insert({
  //     season_id: seasonId,
  //     home_team_id: something.homeTeam.id,
  //     away_team_id: something.awayTeam.id,
  //     week,
  //     match: matchNumber += 1,
  //     location: game.stadium
  //   });

  // Add the matchups
  // knex('teams').where('abbr_name', game.away.abbrev).andWhere('league', 'NCAA').first().then((awayTeam) => {
  //   knex('teams').where('abbr_name', game.home.abbrev).andWhere('league', 'NCAA').first().then((homeTeam) => {
  //     if (!awayTeam || !homeTeam) {
  //       console.log(`problem with ${game.away.abbrev} or ${game.home.abbrev}`);
  //     } else {
  //       knex('matchups')
  //         .insert({
  //           season_id: seasonId,
  //           home_team_id: homeTeam.id,
  //           away_team_id: awayTeam.id,
  //           week,
  //           match: matchNumber += 1,
  //           location: game.stadium
  //         })
  //         .then(res => res)
  //         .catch(mis => mis);
  //     }
  //   });
  // });
}
