import { expressjwt } from "express-jwt";

// handle restrictions based on roles
// revoke permissions if basic user is trying to access admin services
const isRevoked = async (request: any, { payload }: any) => {
  return !payload?.tokenPassword ? true : false;
};

// makes authentication with jwt secure
const authenticationJwt = () => {
  const api = process.env.API_URL;

  return expressjwt({
    secret: process.env.JWT_SECRET ?? "",
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      `${api}/users/token`,
      { url: /\/api\/v1\/users(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] }, // enables access to public/uploads folder
    ], // specificies apis to be excluded with token authorization
  });
};

export default authenticationJwt;
