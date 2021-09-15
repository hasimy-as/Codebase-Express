const sinon = require('sinon');
const assert = require('assert');

const { CODE } = require('../../../../../../src/helpers/lib/httpCode');
const Model = require('../../../../../../src/api/controllers/users/models/User');
const user = require('../../../../../../src/api/controllers/users/query/domain');

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

const resultAllUser = {
  success: true,
  data: [
    {
      userId: '466c4317-bde6-4ba4-92a5-b9d103e77c66',
      _id: '6141a23598a7fb07a6ed9db9',
      name: 'Hasimy Md',
      email: 'test@email.com',
      address: 'Indonesia',
      password: '$2b$10$GY213bYPiydrnkv2lfwYee6MqKf9wmjhyYCMPD.yjzJUQwjjZDzSi',
      __v: 0
    },
    {
      userId: '8ad3ea2b-92d8-42d4-920e-f4f628ae5aa6',
      _id: '6141b21dfcfc2d1d5c6fcf07',
      name: 'Foo Bar',
      email: 'test@express.com',
      address: 'Indonesia',
      password: '$2b$10$GY213bYPiydrnkv2lfwYee6MqKf9wmjhyYCMPD.yjzJUQwjjZDzSi',
      __v: 0
    },
  ],
  message: 'User successfully fetched',
  code: 200
};

describe('users-query-domain.js', () => {
  describe('#getUsers', () => {
    it('Should error if internal error', async () => {
      sinon.stub(Model, 'find').resolves(false);

      res = {
        status: function (code) {
          assert.equal(code, CODE.INTERNAL_ERROR);
          return this;
        },
        json: function (data) {
          assert.equal(data.message, 'Failed to fetch users');
        }
      };

      await user.getUsers(req, res);
      Model.find.restore();
    });

    it('Should success get users', async () => {
      sinon.stub(Model, 'find').resolves(resultAllUser);

      res = {
        status: function (code) {
          assert.equal(code, CODE.SUCCESS);
          return this;
        },
        json: function (data) {
          assert.equal(data.message, 'Users successfully fetched');
        }
      };

      await user.getUsers(req, res);
      Model.find.restore();
    });
  });

  describe('#getUserById', () => {
    req = {
      params: {
        userId: '466c4317-bde6-4ba4-92a5-b9d103e77c66'
      }
    };

    it('Should error if userId not found', async () => {
      sinon.stub(Model, 'findOne').resolves(false);

      res = {
        status: function (code) {
          assert.equal(code, CODE.NOT_FOUND);
          return this;
        },
        json: function (data) {
          assert.equal(data.message, 'User data not found!');
        }
      };

      await user.getUserById(req, res);
      Model.findOne.restore();
    });

    it('Should success get user by userId', async () => {
      sinon.stub(Model, 'findOne').resolves(resultUser);

      res = {
        status: function (code) {
          assert.equal(code, CODE.SUCCESS);
          return this;
        },
        json: function (data) {
          assert.equal(data.message, 'User successfully fetched');
        }
      };

      await user.getUserById(req, res);
      Model.findOne.restore();
    });
  });
});
