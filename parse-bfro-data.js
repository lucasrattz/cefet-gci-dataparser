if (process.argv.length < 4) {
    console.log('Usage: node parse-bfro-data.js [ --parse, --analyze ] <file>');
    process.exit(1);
}

if (process.argv[2] === '--parse') parse(process.argv[3]);
else if (process.argv[2] === '--analyze') analyze(process.argv[3]);
else console.log("Unrecognized argument: " + process.argv[2]);

function parse(filename) {
    var fs = require('fs')
      , filename = process.argv[3];
    fs.readFile(filename, 'utf8', function(err, data) {
      if (err) throw err;

      let output = [];
      const raw = data.split(/\r?\n/);
      raw.forEach(parse = (entry) => {
          try{
          let obj = {
              season: null || entry.split(`"SEASON":`)[1].split(',')[0].replace(/["\s]/g, ''),
              state: null || entry.split(`"STATE":`)[1].split(',')[0].replace(/["\s]/g, '')
          };
          output.push(obj);
          } catch(err) {
          //console.log('Null object identified. Skipping to next object...');
          }
      });

      fs.writeFileSync('parsed_data.json', JSON.stringify(output));
  });
}

function analyze(filename) {
  var fs = require('fs')
  , filename = process.argv[3];
fs.readFile(filename, 'utf8', function(err, data) {
  if (err) throw err;

  let sightingsCount = 0;
  let states = [];
  let seasons = [];

  data = JSON.parse(data);

  data.forEach((entry) => {
    sightingsCount++;
    seasons.push(entry.season);
    states.push(entry.state);
  });

  const stateCount = states.reduce((x,y)=> (x[y]=++x[y]||1,x) ,{});

  const sortedStateCount = Object.fromEntries(
    Object.entries(stateCount).sort(([,x],[,y]) => y-x)
  );

  const seasonCount = seasons.reduce((x,y)=> (x[y]=++x[y]||1,x) ,{});

  const sortedSeasonCount = Object.fromEntries(
    Object.entries(seasonCount).sort(([,x],[,y]) => y-x)
  );

console.log(sortedSeasonCount);
console.log(sortedStateCount);
console.log('\n')

console.log(`Sighting count: ${sightingsCount}`);
console.log(`Most common season: ${Object.keys(sortedSeasonCount)[0]}`);
console.log(`Most common state: ${Object.keys(sortedStateCount)[0]}`);
});

}
