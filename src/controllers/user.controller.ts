// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-todo-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {authenticate, TokenService} from '@loopback/authentication';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings,
  User,
  UserRepository,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {NewUserRequest} from '../models/user.model';
import {repository} from '@loopback/repository';
import {get, post, requestBody, SchemaObject} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @post('/auth/login')
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }

  @authenticate('jwt')
  @get('/who')
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<User> {
    const userId = currentUserProfile.id;
    const foundUser = await this.userRepository.findById(userId);

    return foundUser;
  }

  @post('/auth/register')
  async signUp(
    @requestBody()
    newUserRequest: NewUserRequest,
  ) {
    const {email, password, confirmPassword} = newUserRequest;
    const [username] = email.split('@');

    const filter = {
      where: {
        email: email,
      },
    };

    const foundUser = await this.userRepository.findOne(filter);

    if (foundUser) {
      return {
        status: 'error',
        message: `${email} is already registered`,
      };
    }

    if (password !== confirmPassword) {
      return {
        status: 'error',
        message: `Passwords do not match.`,
      };
    }

    const hashedPw = await hash(password, await genSalt());
    const savedUser = await this.userRepository.create({
      ...newUserRequest,
      username,
      password: undefined,
      confirmPassword: undefined,
    });

    await this.userRepository
      .userCredentials(savedUser.id)
      .create({password: hashedPw});

    return savedUser;
  }
}
