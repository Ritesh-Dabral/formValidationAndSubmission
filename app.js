/*------------------- CONST AND VARS ---------------------------*/

    const express    = require('express');

    const PORT = process.env.PORT || 8085;

    const app = express();

/*------------------- MIDDLEWARES ------------------------------*/
    app.use(express.static('public')); // serving static files from 'public folder'
    app.set('view engine','ejs'); // setting view engine to serve ejs file

/*------------------- ROUTES -----------------------------------*/

    app.get('/', (req,res)=>{
        res.render('index')
    });

    app.get('*' ,(req,res)=>{
        res.redirect('/');
    })

/*------------------- SERVER -----------------------------------*/

    app.listen(PORT, ()=>{
        console.log('Server started @ port: ',PORT);
    });
