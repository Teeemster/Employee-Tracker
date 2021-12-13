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
                type: 'list',
                name: 'role_department',
                message: 'What is the name of the department the role belongs to?',
                choices: ['Hosts', 'Service', 'Bar Staff', 'Parking', 'Leadership'],
            }
        ])
        .then((answers) => {

            const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?);`
            
            let roleDept = answers.role_department;

            if (roleDept === 'Hosts') {
                roleDept = 1
            } else if (roleDept === 'Service') {
                roleDept = 2
            } else if (roleDept === 'Bar Staff') {
                roleDept = 3
            } else if (roleDept === 'Parking') {
                roleDept = 4
            } else {
                roleDept = 5
            };
            
            const params = [answers.role_title, answers.role_salary, roleDept];

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

function addEEFun() {

    inquirer
        .prompt([
            {
                type: 'input',
                name: 'ee_firstname',
                message: "What is the first name of the employee?",
            },
            {
                type: 'input',
                name: 'ee_lastname',
                message: "What is the last name of the employee?",
            },
            {
                type: 'list',
                name: 'ee_role',
                message: 'What role does the employee belong to?',
                choices: ['Lead Hostess', 'Server', 'Bartender', 'Valet', 'Manager'],
            },
            {
                type: 'list',
                name: 'ee_mgr',
                message: 'Who is the manager of the employee?',
                choices: ['Rupert Giles', 'Willow Rosenberg', 'Jay Beach', 'Xander Harris', 'Buffy Summers'],
            }
        ])
        .then((answers) => {

            let eeRole = answers.ee_role;

            if (eeRole === 'Lead Hostess') {
                eeRole = 1
            } else if (eeRole === 'Server') {
                eeRole = 2
            } else if (eeRole === 'Bartender') {
                eeRole = 3
            } else if (eeRole === 'Valet') {
                eeRole = 4
            } else {
                eeRole = 5
            };

            let eeMGR = answers.ee_mgr;

            if (eeMGR === 'Rupert Giles') {
                eeMGR = 1
            } else if (eeMGR === 'Willow Rosenberg') {
                eeMGR = 2
            } else if (eeMGR === 'Jay Beach') {
                eeMGR = 3
            } else if (eeMGR === 'Xander Harris') {
                eeMGR = 4
            } else {
                eeMGR = 5
            };

            const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
            const params = [answers.ee_firstname, answers.ee_lastname, eeRole, eeMGR];

            connection.query(sql, params, (err, result) => {
                if (params) {
                    result;
                    console.log(`${answers.ee_firstname + ' ' + answers.ee_lastname} has been added with a role of ${answers.ee_role} and a manager of ${answers.ee_mgr}!`)
                    ask();
                }
                console.log(err)
                return;
            })
        })
};

