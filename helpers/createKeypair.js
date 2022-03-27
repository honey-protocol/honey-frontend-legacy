const fs = require('fs');
var async = require('async');
const anchor = require('@project-serum/anchor');

const keypairs = ['honeyMintAuthority', ]
const account = anchor.web3.Keypair.generate()

fs.writeFileSync('./keypair.json', JSON.stringify(account));

async.each(
  ['a', 'b', 'c', 'd'],
  function (file, callback) {
    const account = anchor.web3.Keypair.generate()

    fs.writeFile(
      'helpers/privatekeys/' + file + '.json',
      JSON.stringify(account, null, 4),
      function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log(file + '.json was updated.');
        }

        callback();
      }
    );
  },
  function (err) {
    if (err) {
      // One of the iterations produced an error.
      // All processing will now stop.
      console.log('A keypair failed to process');
    } else {
      console.log('All keypairs have been processed successfully');
    }
  }
);
