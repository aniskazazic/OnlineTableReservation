import {MyAuthInfo} from "./my-auth-info";

export interface LoginTokenDto {
  AccessToken: string;
  RefreshToken:string;
  myAuthInfo:MyAuthInfo;
}
