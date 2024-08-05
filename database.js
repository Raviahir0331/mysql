const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'myuser',
  password: 'mypassword',
  database: 'mydatabase',
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

app.post('/register', (req, res) => {
  const {name, email, pass } = req.body;
  const sql = 'INSERT INTO user(name, email,pass ) VALUES (?, ?, ?)';
  db.query(sql, [name, email,pass ], (err, result) => {
    if (err) {
      console.error('Error:', err);
      res.status(500).json({ message: 'Error registering user' });
    } else {
      res.status(200).json({ message: 'User registered successfully' });
    }
  });
});
app.get('/login',async (req,res)=>{
    const {name,pass} = req.query;
    const select = 'SELECT * FROM user WHERE name = ?'
    db.query(select,[name],(err,result)=>{
        if(err){
            res.status(400).json({message:'Erro login'});
        }
        if(result.length==0){
            res.status(404).json({message:'invalid username or password'})
        }
        const user = result[0];
        if(user.pass !== pass){
            res.status(404).json({message:'invalid password'})
        }
        else{
            res.status(200).send({message:'Login succsess'})
        }
    })
})
app.put('/update/:id',async (req,res)=>{
  const { id } = req.params;
  try{
    const update = 'UPDATE  user SET name = "Dhaval"  WHERE id = ?'
    db.query(update,[id],(err,result)=>{
      if(err){
        res.status(400).json({message:'something went wrong',err})
      }
      const resultdata = result[0];
      res.status(200).json({message:'update data sucsessfully',resultdata})
    })
  }
  catch(error){
    res.status(500).json({message:'internal error'})
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
