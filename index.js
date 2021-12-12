//NPM Links
const inquirer = require('inquirer');
const consoletable = require('console.table');
const connection = require('./db/connection');


//Starting Question
const startQuestion = [
    {
        type: 'list',
        name: 'start_choice',
        message: "Hello. What would you like to do?",
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role']
    },
];

//Original Ask Function
function ask() {
    inquirer.prompt(startQuestion).then((answers) => {
        if (answers.start_choice === 'View All Departments') {
            viewDeptFun();
        } else if (answers.start_choice === 'View All Roles') {
            viewRoleFun();
        } else if (answers.start_choice === 'View All Employees') {
            viewEEFun();
        } else if (answers.start_choice === 'Add A Department') {
            addDeptFun();
        } else if (answers.start_choice === 'Add A Role') {
            addRoleFun();
        } else if (answers.start_choice === 'Add An Employee') {
            addEEFun();
        } else {
            updateEERoleFun();
        }
    });
}

ask();

function viewEEFun() {
    const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name, roles.salary, roles.department_id, CONCAT (manager.first_name, ' ', manager.last_name) AS manager
    FROM employees
    INNER JOIN roles ON roles.id = employees.role_id
    INNER JOIN departments ON departments.id = roles.department_id
    LEFT JOIN employees manager ON manager.id = employees.manager_id
    ORDER BY employees.id;`

    connection.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            return;
        }
        console.table(result)
        ask();
    })
};

function viewDeptFun() {
    const sql = `SELECT departments.id, departments.name
    FROM departments;`

    connection.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            return;
        }
        console.table(result)
        ask();
    })
};

function viewRoleFun() {
    const sql = `SELECT roles.id, roles.title, roles.salary, departments.name
    FROM roles
    INNER JOIN departments ON departments.id = roles.department_id;`

    connection.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            return;
        }
        console.table(result)
        ask();
    })
};

function addDeptFun() {

    inquirer
        .prompt([
            {
                type: 'input',
                name: 'dept_input',
                message: "What is the name of the department you would like to add?",
            }
        ])

    let newDept = answers.dept_input;
    
    const sql = `INSERT INTO departments (name)
    VALUES (${newDept});`

    connection.query(sql, (err, result) => {
        if (newDept) {
            result;
            ask();
        }
        console.log(err)
        return;
    })
};
    
    

