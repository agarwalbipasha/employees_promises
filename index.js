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
    res.send(`Employees data: ${data}`);
  } catch (error) {
    res.send(`Something went wrong`);
  }
});

function getDatafromIDs(ids, data) {
  const employeesData = JSON.parse(data).employees;
  const employeesID = employeesData.map((element) => element.id);
  const id = ids.filter((id) => !employeesID.includes(id));
  if (id.length != 0) {
    return new Error(`Employee ID ${id} not found`);
  } else {
    const result = employeesData.filter((element) => ids.includes(element.id));
    return result;
  }
}

app.get("/getDataFromID", async (req, res) => {
  try {
    const data = await getData(file);
    const dataFromID = getDatafromIDs([23, 13], data);
    const fileCreate = await writeData("./dataFromIDs.json", dataFromID);
    res.send(dataFromID);
  } catch (error) {
    res.send(`Something went wrong ${error}`);
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
        employeeInCompany = employeeByCompany[company];
        employeeInCompany.push(employee);
      }
      employeeByCompany[company] = employeeInCompany;
      return employeeByCompany;
    },
    {}
  );
  return employeesGroupedByCompany;
}

app.get("/dataByCompany", async (req, res) => {
  try {
    const data = await getData(file);
    const dataGroupedByCompany = dataGroupedByCompanies(data);
    const fileCreate = await writeData("./dataByCompany.json", dataGroupedByCompany);
    res.send(dataGroupedByCompany);
  } catch (error) {
    res.send(`Something went wrong ${error}`);
  }
});

function getDataPowerpuff(data) {
  const employeesData = JSON.parse(data).employees;
  const result = employeesData.filter(employee => employee.company === 'Powerpuff Brigade');
  return result;
}

app.get("/dataPowerpuff", async (req, res) => {
  try {
    const data = await getData(file);
    const dataPowerpuff = getDataPowerpuff(data);
    const fileCreate = await writeData("./dataPowerpuff.json", dataPowerpuff);
    res.send(dataPowerpuff);
  } catch (error) {
    res.send(`Something went wrong ${error}`);
  }
});

function removeID(data, id) {
  const employeesData = JSON.parse(data).employees;
  const result = employeesData.filter(employee => employee.id == parseInt(id));
  return result;
}

app.delete('/delete/:id', async (req, res) => {
  try {
    const data = await getData(file);
    const removeData = removeID(data, req.params.id);
    const fileCreate = await writeData("./removedID.json", removeData);
    res.send(removeData);
  } catch (error) {
    res.send(`Something went wrong ${error}`);
  }
});

function sortedData(data) {
  const groupedByCompany = dataGroupedByCompanies(data);
  const ordered = Object.keys(groupedByCompany).sort().reduce(
    (obj, key) => { 
      obj[key] = groupedByCompany[key]; 
      return obj;
    }, 
    {}
  );
  for (company in ordered) {
    ordered[company] = ordered[company].sort((a, b) => a.id - b.id);
  }
  return ordered;
}

app.get("/sortedData", async (req, res) => {
  try {
    const data = await getData(file);
    const sortedCompanyData = sortedData(data);
    const fileCreate = await writeData("./sortedData.json", sortedCompanyData);
    res.send(sortedCompanyData);
  } catch (error) {
    res.send(`Something went wrong ${error}`);
  }
});

function swapData(id1, id2, data) {
  const employeesData = JSON.parse(data).employees;
  const firstID = employeesData.filter(employee => employee.id == parseInt(id1)); 
  const secondID = employeesData.filter(employee => employee.id == parseInt(id2)); 
  let id1Company = firstID[0]['company'];
  let id2Company = secondID[0]['company'];
  firstID[0]['company'] = id2Company;
  secondID[0]['company'] = id1Company;
  return [firstID, secondID];
}

app.get("/swapData/:id1/:id2", async (req, res) => {
  try {
    const data = await getData(file);
    const swappedData = swapData(req.params.id1, req.params.id2, data);
    const fileCreate = await writeData("./swappedData.json", swappedData);
    res.send(swappedData);
  } catch (error) {
    res.send(`Something went wrong ${error}`);
  }
});

function addBirthday(data) {
  const employeesData = JSON.parse(data).employees;
  const result = employeesData.map(employee => {
    let date = new Date(Date.now());
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let today = date.getDate();
    let birthday = `${today}-${month}-${year}`;
    if (employee.id % 2 === 0) {
      employee['birthday'] = birthday;
    }
    return employee;
  });
  return result;
}

app.get("/addBirthday", async (req, res) => {
  try {
    const data = await getData(file);
    const newData = addBirthday(data);
    const fileCreate = await writeData("./newData.json", newData);
    res.send(newData);
  } catch (error) {
    res.send(`Something went wrong ${error}`);
  }
});
