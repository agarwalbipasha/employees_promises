const express = require("express");
const app = express();
const port = 3000;
/* 1. Retrieve data for ids : [2, 13, 23].*/

const fs = require("fs");
const file = "./data.json";

function getData(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf-8", (err, data) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(data);
      }
    });
  });
}

function writeData(file, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, JSON.stringify(data), (err) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(`File created with solution`);
      }
    });
  });
}

app.listen(port, () => console.log("Server started"));

app.get("/", async (req, res) => {
  try {
    const data = await getData(file);
    res.send(`Employees data! ${data}`);
  } catch (error) {
    res.send(`Something went wrong`);
  }
});

function getDatafromIDs(ids, data) {
  return new Promise((resolve, reject) => {
    const employeesData = JSON.parse(data).employees;
    const employeesID = employeesData.map((element) => element.id);
    const id = ids.filter((id) => !employeesID.includes(id));
    if (id.length != 0) {
      return reject(`Employee ID ${id} not found`);
    } else {
      const result = employeesData.filter((element) =>
        ids.includes(element.id)
      );
      return resolve(result);
    }
  });
}

app.get("/getDataFromID", async (req, res) => {
  try {
    const data = await getData(file);
    const dataFromID = await getDatafromIDs([23, 13], data);
    const fileCreate = await writeData("./solution1.json", dataFromID);
    res.send(dataFromID);
  } catch (error) {
    res.send(`Something went wrong`);
  }
});

app.get("/getEmployeeData", async (req, res) => {
  try {
    const data = await getData(file);
    const dataFromID = await getDatafromIDs([2, 13, 23], data);
    const fileCreate = await writeData("./solution1.json", dataFromID);
    res.send(dataFromID);
  } catch (error) {
    res.send(`Something went wrong: ${error}`);
  }
});


/*2. Group data based on companies.
        { "Scooby Doo": [], "Powerpuff Brigade": [], "X-Men": []}
*/

function dataGroupedByCompanies(data) {
  const employeesData = JSON.parse(data).employees;
  const employeesGroupedByCompany = employeesData.reduce(
    (employeeByCompany, employee) => {
      let company = employee.company;
      let employeeInCompany = [];
      if (!employeeByCompany.hasOwnProperty(company)) {
        employeeInCompany = [employee];
      } else {
        employeeInCompany.push(employee);
      }
      employeeByCompany[company] = employeeInCompany;
      return employeeByCompany;
    },
    {}
  );
  return employeesGroupedByCompany;
}

const solution2 = (file) => {
  getData(file, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const dataFromFile = data;

      fs.writeFile(
        "./solution2.json",
        JSON.stringify(employeesGroupedByCompany),
        (err) => {
          if (err) {
            console.error(err);
          }
        }
      );
    }
  });
};

// solution2();
