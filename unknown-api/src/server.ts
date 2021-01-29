import 'dotenv/config';
import App from './app';
import AuthenticationController from './lib/authentication/authentication.controller';
import PostController from './lib/post/post.controller';
import ReportController from './lib/report/report.controller';
import UserController from './lib/user/user.controller';
import validateEnv from './utils/validateEnv';


validateEnv();

const app = new App(
  [
    new PostController(),
    new AuthenticationController(),
    new UserController(),
    new ReportController(),
  ],
);

app.listen();
