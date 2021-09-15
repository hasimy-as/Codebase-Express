const sinon = require('sinon');
const assert = require('assert');

const Crypt = require('../../../../../../src/helpers/utils/crypt');
const { CODE } = require('../../../../../../src/helpers/lib/httpCode');
const Model = require('../../../../../../src/api/controllers/users/models/User');
const user = require('../../../../../../src/api/controllers/users/command/domain');

let req;
let res;
const resultUser = {
  success: true,
  data: {
    userId: '466c4317-bde6-4ba4-92a5-b9d103e77c66',
    _id: '6141a23598a7fb07a6ed9db9',
    name: 'Hasimy Md',
    email: 'test@email.com',
    address: 'Indonesia',
    password: '$2b$10$GY213bYPiydrnkv2lfwYee6MqKf9wmjhyYCMPD.yjzJUQwjjZDzSi',
    __v: 0
  },
  message: 'User successfully fetched',
  code: 200
};

const resultMongo = {
  _doc: {
    userId: '466c4317-bde6-4ba4-92a5-b9d103e77c66',
    _id: '6141a23598a7fb07a6ed9db9',
    name: 'Hasimy Md',
    email: 'test@email.com',
    address: 'Indonesia',
    password: '$2b$10$GY213bYPiydrnkv2lfwYee6MqKf9wmjhyYCMPD.yjzJUQwjjZDzSi',
    __v: 0
  }
};

describe('users-command-domain.js', () => {
  describe('#createUsers', () => {
    req = {
      body: {
        name: 'Hasimy Md',
        address: 'Indonesia',
        email: 'TEST@email.com',
        password: 'test123'
      }
    };

    it('Should error if email already registered', async () => {
      sinon.stub(Model, 'findOne').resolves(resultUser.data);

      res = {
        status: function (code) {
          assert.equal(code, CODE.BAD_REQUEST);
          return this;
        },
        json: function (data) {
          assert.equal(data.message, 'Email already registered!');
        }
      };

      await user.createUsers(req, res);
      Model.findOne.restore();
    });

    it('Should success create user', async () => {
      sinon.stub(Model, 'findOne').resolves(false);
      sinon.stub(Crypt, 'hash').resolves(true);
      sinon.stub(Model, 'create').resolves(resultUser.data);

      res = {
        status: function (code) {
          assert.equal(code, CODE.SUCCESS);
          return this;
        },
        json: function (data) {
          assert.equal(data.message, 'User created successfully!');
        }
      };

      await user.createUsers(req, res);
      Model.findOne.restore();
      Crypt.hash.restore();
      Model.create.restore();
    });
  });

  describe('#loginUsers', () => {
    req = {
      body: {
        email: 'test@email.com',
        password: 'test123'
      }
    };

    it('Should error if email not found', async () => {
      sinon.stub(Model, 'findOne').resolves(null);

      res = {
        status: function (code) {
          assert.equal(code, CODE.NOT_FOUND);
          return this;
        },
        json: function (data) {
          assert.equal(data.message, 'Email not found!');
        }
      };

      await user.loginUsers(req, res);
      Model.findOne.restore();
    });

    it('Should success login user', async () => {
      sinon.stub(Model, 'findOne').resolves(resultMongo);
      sinon.stub(Crypt, 'signToken').resolves(true);

      res = {
        status: function (code) {
          assert.equal(code, CODE.SUCCESS);
          return this;
        },
        json: function (data) {
          assert.equal(data.message, 'You have logged in!');
        }
      };

      await user.loginUsers(req, res);
      Model.findOne.restore();
      Crypt.signToken.restore();
    });
  });

  describe('#updateUsers', () => {
    req = {
      params: {
        userId: '466c4317-bde6-4ba4-92a5-b9d103e77c66'
      },
      body: {
        email: 'email@test.com'
      }
    };

    it('Should error if userId not found', async () => {
      sinon.stub(Model, 'findOne').resolves(null);

      res = {
        status: function (code) {
          assert.equal(code, CODE.NOT_FOUND);
          return this;
        },
        json: function (data) {
          assert.equal(data.message, 'User not found!');
        }
      };

      await user.updateUsers(req, res);
      Model.findOne.restore();
    });

    it('Should error to update user', async () => {
      sinon.stub(Model, 'findOne').resolves(resultUser.data);
      sinon.stub(Model, 'updateOne').resolves(false);

      res = {
        status: function (code) {
          assert.equal(code, CODE.INTERNAL_ERROR);
          return this;
        },
        json: function (data) {
          assert.equal(data.message, 'Failed to update user data!');
        }
      };

      await user.updateUsers(req, res);
      Model.findOne.restore();
      Model.updateOne.restore();
    });

    it('Should success to update user', async () => {
      sinon.stub(Model, 'findOne').resolves(resultUser.data);
      sinon.stub(Model, 'updateOne').resolves(req);

      res = {
        status: function (code) {
          assert.equal(code, CODE.SUCCESS);
          return this;
        },
        json: function (data) {
          assert.equal(data.message, 'User updated successfully!');
        }
      };

      await user.updateUsers(req, res);
      Model.findOne.restore();
      Model.updateOne.restore();
    });
  });

  describe('#deleteUsers', () => {
    req = {
      params: {
        userId: '466c4317-bde6-4ba4-92a5-b9d103e77c66'
      }
    };

    it('Should error if userId not found', async () => {
      sinon.stub(Model, 'findOne').resolves(null);

      res = {
        status: function (code) {
          assert.equal(code, CODE.NOT_FOUND);
          return this;
        },
        json: function (data) {
          assert.equal(data.message, 'User not found!');
        }
      };

      await user.deleteUsers(req, res);
      Model.findOne.restore();
    });

    it('Should error to delete user', async () => {
      sinon.stub(Model, 'findOne').resolves(resultUser.data);
      sinon.stub(Model, 'deleteOne').resolves(false);

      res = {
        status: function (code) {
          assert.equal(code, CODE.INTERNAL_ERROR);
          return this;
        },
        json: function (data) {
          assert.equal(data.message, 'Failed to delete user!');
        }
      };

      await user.deleteUsers(req, res);
      Model.findOne.restore();
      Model.deleteOne.restore();
    });

    it('Should success to delete user', async () => {
      sinon.stub(Model, 'findOne').resolves(resultUser.data);
      sinon.stub(Model, 'deleteOne').resolves(req);

      res = {
        status: function (code) {
          assert.equal(code, CODE.SUCCESS);
          return this;
        },
        json: function (data) {
          assert.equal(data.message, 'User deleted successfully!');
        }
      };

      await user.deleteUsers(req, res);
      Model.findOne.restore();
      Model.deleteOne.restore();
    });
  });
});
