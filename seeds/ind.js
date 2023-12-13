// getting-started.js

const mongoose = require('mongoose');
const Lawfirm = require('../models/lawfirm');
const feed = require('./feed');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/lawfirm');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/lawfirm');` if your database has auth enabled
}

const sample = array=> array[Math.floor(Math.random()*array.length)];

const SeedDB = async () => {
    await Lawfirm.deleteMany({});
    for(let i=0; i<10; i++){
        const rand10 = Math.floor(Math.random()*10);
        const firm = new Lawfirm({
          //Your User ID
            author: '6486d418270b18ebb4e449ae',
            location:`${feed[rand10].city}, ${feed[rand10].state}`,
            name: `${feed[rand10].name}`,
            title : `${feed[rand10].title}`,
            // image: `https://source.unsplash.com/random/300×300/?person,${i+1}`,
            images:  [
                {
                  url: 'https://res.cloudinary.com/do1vnjvqq/image/upload/v1686725932/LawFirm/hmaiaijvrmcbq4dor4ko.jpg',
                  filename: 'LawFirm/hmaiaijvrmcbq4dor4ko',                
                },
                {
                  url: 'https://res.cloudinary.com/do1vnjvqq/image/upload/v1686725932/LawFirm/ykie1mvv18brr7jgi4st.jpg',
                  filename: 'LawFirm/ykie1mvv18brr7jgi4st',
                }
              ],
            geometry: { 
              type: 'Point', 
              coordinates: [ 
                feed[rand10].longitude,
                feed[rand10].latitude
              ] 
            }, 
            description: `${feed[rand10].description}`

        })
        await firm.save();
    }
}

SeedDB();

// SeedDB().then(() => {

//     mongoose.connection.close();
// })no