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
        .then((answers) => {

            const sql = `INSERT INTO departments (name) VALUES (?)`;
            const params = [answers.dept_input];

            connection.query(sql, params, (err, result) => {
                if (params) {
                    result;
                    console.log(`${params} have been added to the department list!`)
                    ask();
                }
                console.log(err)
                return;
            })
        })
};

function addRoleFun() {

    inquirer
        .prompt([
            {
                type: 'input',
                name: 'role_title',
                message: "What is the title of the role you would like to add?",
            },
            {
                type: 'input',
                name: 'role_salary',
                message: "What is the role's salary?",
            },
            {
                type: 'input',
                name: 'role_department',
                message: "What is the name of the department the role belongs to?",
            }
        ])
        .then((answers) => {

            const sql = `BEGIN;
            INSERT INTO departments (name) VALUES (?);
            INSERT INTO roles (title, salary, department_id) VALUES (?,?,?);
            COMMIT;`
            const params = [answers.role_title, answers.role_salary, answers.role_department, ?];

            connection.query(sql, params, (err, result) => {
                if (params) {
                    result;
                    console.log(`The role ${answers.role_title} has been added to the department ${answers.role_department} for a salary of ${answers.role_salary}!`)
                    ask();
                }
                console.log(err)
                return;
            })
        })
};