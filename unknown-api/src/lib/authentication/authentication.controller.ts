import * as bcrypt from 'bcrypt';
import AuthFailedException from '../../exceptions/AuthFailedException';
import { Request, Response, NextFunction, Router } from 'express';
import * as jwt from 'jsonwebtoken';
import WrongCredentialsException from '../../exceptions/WrongCredentialsException';
import Controller from '../../interfaces/controller.interface';
import DataStoredInToken from '../../interfaces/dataStoredInToken';
import TokenData from '../../interfaces/tokenData.interface';
import validationMiddleware from '../../middleware/validation.middleware';
import CreateUserDto from '../user/user.dto';
import User from '../user/user.interface';
import userModel from '../user/user.model';
import AuthenticationService from './authentication.service';
import LogInDto from './logIn.dto';
import VerifyTokenDto from './verifytoken.dto';
import ResetPasswordDto from './resetPassword.dto';
import { Guid } from "guid-typescript";
import ResetPasswordFailedException from 'exceptions/ResetPasswordFailed';
import VerifyResetUrlDto from './verifyResetUrl.dto';
import ChangePasswordDto from './changePassword.dto';


class AuthenticationController implements Controller {
  public path = '/auth';
  public router = Router();
  public authenticationService = new AuthenticationService();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
    this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
    this.router.post(`${this.path}/me`, this.verifyToken);
    this.router.post(`${this.path}/reset-password`,validationMiddleware(ResetPasswordDto),this.resetPassword);
    this.router.post(`${this.path}/change-password`,validationMiddleware(ChangePasswordDto),this.changePassword);
    this.router.post(`${this.path}/verify-reset-link`,validationMiddleware(VerifyTokenDto),this.verifyResetLink);
    this.router.post(`${this.path}/logout`, this.loggingOut);
  }

  private registration = async (request: Request, response: Response, next: NextFunction) => {
   console.log("here");
    const userData: CreateUserDto = request.body;
    try {
      const token = await this.authenticationService.register(userData);
      response.setHeader('Set-Cookie', [token.token]);
      response.send(token);
    } catch (error) {
      next(error);
    }
  }

  private loggingIn = async (request: Request, response: Response, next: NextFunction) => {
    const logInData: LogInDto = request.body;
    const user = await this.user.findOne({ email: logInData.email });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        logInData.password,
        user.get('password', null, { getters: false }),
      );
      if (isPasswordMatching) {
        const tokenData = this.createToken(user);
        response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
        response.send(tokenData);
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  }

  private verifyToken = async (request: Request, response: Response, next: NextFunction) => {
    let userToken = request.headers.authorization;
    userToken = userToken.split(" ")[1]; 
    console.log("userToken",userToken);
    const secret = process.env.JWT_SECRET;
    if(userToken) {
    jwt.verify(userToken, secret, (err, verifiedJwt) => {
      if(err){
        console.log("err",err);
        next(new AuthFailedException());
      }else{
        response.send(verifiedJwt)
      }
    });
   } else {
    next(new AuthFailedException());
   }
  }

  private resetPassword = async (request: Request, response: Response, next: NextFunction) => {
    const resetPasswordData: ResetPasswordDto = request.body;
    const user = await this.user.findOne({ email: resetPasswordData.email });
    if (user) {
      let resetToken : Guid = Guid.create();
      this.user.updateOne({_id:user._id},{resetToken:resetToken,resetUpdateTime:new Date()});
      response.send(200);
    } else {
      next(new ResetPasswordFailedException());
    }
  }

  private verifyResetLink = async (request: Request, response: Response, next: NextFunction) => {
    const verifyResetUrlDto: VerifyResetUrlDto = request.body;
    const user = await this.user.findOne({ resetToken: verifyResetUrlDto.token, resetUpdateTime: {$lt:new Date(Date.now() - 15*60 * 1000)}});
    if (user) {
        response.send(200);
    } else {
      next(new ResetPasswordFailedException());
    }
  }

  private changePassword = async (request: Request, response: Response, next: NextFunction) => {
    const changePasswordDto: ChangePasswordDto = request.body;
    const user = await this.user.findOne({ resetToken: changePasswordDto.token, resetUpdateTime: {$lt:new Date(Date.now() - 15*60 * 1000)}});
    if (user) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      this.user.updateOne({_id:user._id},{password:hashedPassword});
      response.send(200);
    } else {
      next(new ResetPasswordFailedException());
    }
  }

  private loggingOut = (request: Request, response: Response) => {
    response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    response.send(200);
  }

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }

  private createToken(user: User): TokenData {
    const expiresIn = 60 * 60; // an hour
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

}

export default AuthenticationController;
