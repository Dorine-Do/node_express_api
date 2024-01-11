const express = require('express');
const fs = require('node:fs');

const app = express();

app.get('/', (req, res) => {
    res.send('hello word')
});

app.get('/openlibrary/:keyword',async  (req, res) => {
    const keyword = req.params.keyword
    try {
        const result = await fetch('https://openlibrary.org/search.json?q=' + keyword);
        const json = await result.json();

        let books_resume = [];

        for (let i = 0; i < 100 ; i++) {
            books_resume.push(
                {
                    'title' : json['docs'][i]['title'] ,
                    'first_publish_year' : json['docs'][i]['first_publish_year'],
                    'author_name' : json['docs'][i]['author_name'][0]
                }
            )
        }
        books_resume = JSON.stringify(books_resume);

        fs.writeFile(__dirname + '/book.json', books_resume, err => {
            if (err) {
                console.error(err);
            }else{
                console.log('file written successfully');
            }
        });

        res.status(200).send(json);
      } catch(ex) {
        console.log(ex);
        res.status(500).send(ex.message);
      }

      
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log('server run!')
});