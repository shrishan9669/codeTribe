import { type JwtPayload, type SignOptions } from "jsonwebtoken";
export declare function signJwt(payload: JwtPayload | object, expiresIn?: SignOptions["expiresIn"]): string;
export declare function verifyJwt<T = JwtPayload>(token: string): T;
//# sourceMappingURL=jwt.d.ts.map