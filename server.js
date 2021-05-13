const express = require("express");
const sql = require('mysql');

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const config = {
  user: "root",
  password: "root",
  host: "localhost",
  database: "test"
};

const con = sql.createConnection(config);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/image/:id", (req, res) => {
  const { id }=req.params;
  const query = "Select file_data From file Where id = ?";
  con.query(query, [id], (err, result) => {
    if (err) {
      console.log(err);
    }
    // console.log(Buffer.from(result[0].file_data).toString())
    res.render("imageView", { name: result[0].file_data });
  })
});

app.post("/store", (req, res) => {
  const { image, fileName } = req.body;
  const query = "Insert Into file(file_name, file_data, created_by, created_on) Values(?,?,?,CURRENT_TIMESTAMP)";
  con.query(query, [fileName, image, 'Program'], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ msg:'SERVER_ERROR' });
    }
    res.status(200).send({ id:result.insertId });
  })
});

app.listen(3000, () => {
  console.log("Running on 3000");
});
