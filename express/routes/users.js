module.exports = app => {
  // users in DB
  const users = [
    { name: 'Vasya', age: 21, id: 1 },
    { name: 'Petya', age: 28, id: 2 },
    { name: 'Oksana', age: 24, id: 3 }
  ];

  function getNextUserId() {
    const lastUserId = users.reduce((lastId, user) => {
      if (user.id > lastId) {
        return user.id;
      }
    }, 0);

    return lastUserId + 1;
  }

  // get all users
  app.get('/api/users', (req, res, next) => {
    res.json(users);
  });

  // get user by id
  app.get('/api/user/:id', (req, res, next) => {
    const id = req.params.id;
    const index = users.findIndex(user => user.id == id);

    if (index >= 0) {
      res.json(users[index]);
    } else {
      res.status(404).send('User does not exist');
    }
  });

  // add user
  app.post('/api/user', (req, res, next) => {
    const user = req.body;
    const isValidUser = isValidUserToCreate(user);

    if (isValidUser) {
      const insertedUser = {
        name: user.name,
        age: user.age,
        id: getNextUserId()
      };

      users.push(insertedUser);
      res.json(insertedUser);
    } else {
      res.status('400').send('"name" is required and must be a string.\n"age" is required and must be a number');
    }
  });

  // edit user
  app.patch('/api/user/:id', (req, res, next) => {
    const userId = req.params.id;
    const userData = req.body;
    const index = users.findIndex(u => u.id == userId);

    if (index == -1) {
      res.status(404).send('User not found');
      return;
    }

    if (userData.name && typeof userData.name === 'string') {
      users[index].name = userData.name;
    }

    if (userData.age && typeof userData.age === 'number') {
      users[index].age = userData.age;
    }

    res.json(users[index]);
  });

  // remove user
  app.delete('/api/user/:id', (req, res, next) => {
    const userId = req.params.id;
    const index = users.findIndex(u => u.id == userId);

    if (index == -1) {
      res.status(404).send('User not found');
    } else {
      const user = users.splice(index, 1);
      res.json(user);
    }
  });

  // remove all users
  app.delete('/api/users', (req, res, next) => {
    const allUsers = users.splice(0);
    res.json(allUsers);
  });
}

function isValidUserToCreate(user) {
  const nameExists = 'name' in user;
  const ageExists = 'age' in user;
  const isNameString = typeof user.name === 'string';
  const isAgeNumber = typeof user.age === 'number';

  return nameExists && ageExists && isNameString && isAgeNumber;
}
