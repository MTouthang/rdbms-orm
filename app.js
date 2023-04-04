const express = require("express");
const mysql = require("mysql2");

const app = express();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "toor",
  database: "mysql_demo",
});

/* create a connection - */
connection.connect((err) => {
  if (err) {
    // throw err;
    console.log(`MySql error - ${err}`);
  } else {
    console.log("mysql database connected ...");
  }
});

/* middleware */
app.use(express.json());

/* routes */
// create todo -
app.post("/todos", (req, res) => {
  // input validation
  if (!req.body.title) {
    return res.status(400).json({
      success: false,
      message: "Todo title name is required!",
    });
  }

  // mysql query -
  const queryString = "insert into todo_demo (title) values (?)";

  // execute query with callback function
  connection.query(queryString, req.body.title, (error) => {
    if (error) {
      // error response -
      return res.status(404).json({
        success: false,
        message: "Not able to add todo",
      });
    }
    // success response
    return res.status(200).json({
      success: true,
      message: "Todo Added",
    });
  });
});

// read - fetch all the todos
app.get("/todos", (req, res) => {
  // mysql query string -
  const queryString = "select * from todo_demo";

  // execute query with callback function -
  connection.query(queryString, (error, results) => {
    // handle error -
    if (error) {
      res.status(404).json({
        success: false,
        message: "Todo's not able to fetch",
      });
    }
    // handle success -
    res.status(200).json({
      success: true,
      message: "Todo's fetch successfully",
      todos: results,
    });
  });
});

// get todo by id
app.get("/todos/:id", (req, res) => {
  // mysql query string
  const queryString = "select * from todo_demo where id = ?";

  // execute mysql query -
  connection.query(queryString, req.params.id, (error, results) => {
    if (error) {
      // handle error -
      res.status(400).json({
        success: false,
        message: "Not able to fetch user withe given id",
      });
    }
    // handle success -
    res.status(200).json({
      success: true,
      message: "Data fetch successfully",
      data: results,
    });
  });
});

// update -
app.put("/todos/:id", (req, res) => {
  // Validate title and id input -
  if (!req.body.title || !req.params.id) {
    return res.status(400).json({
      success: false,
      message: "Invalid id or title input",
    });
  }

  // mysql query string -
  const queryString = "update todo_demo set title=? where id = ?";

  // execute mysql query string with callback function
  connection.query(
    queryString,
    [req.body.title, req.params.id],
    (error, results) => {
      //handle error -
      if (error) {
        return res.status(404).json({
          success: false,
          message: "Not able update todo",
        });
      }

      // handle id data not available
      if (results.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Todo with provided Id not found!",
        });
      }

      // handle success -
      return res.status(200).json({
        success: true,
        message: "todo updated successfully!",
        data: results,
      });
    }
  );
});

// delete todo -
app.delete("/todos/:id", (req, res) => {
  // handle input values -
  if (!req.params.id) {
    return res.status(400).json({
      success: false,
      message: "Invalid Id input value",
    });
  }

  // mySql query string -
  const queryString = "delete from todo_demo where id = ?";

  // execute query
  connection.query(queryString, req.params.id, (error, results) => {
    if (error) {
      return res.status(404).json({
        success: false,
        message: "Not able to perform delete",
      });
    }

    // handle id data not available
    if (results.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Todo with provided Id not found!",
      });
    }

    // handling success
    return res.status(200).json({
      success: true,
      message: "Todo data deleted",
    });
  });
});

// server start -
app.listen("3000", () => {
  console.log(`Server up and running`);
});
