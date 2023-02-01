"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.initDb = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./models/user");
const rssfeed_1 = require("./models/rssfeed");
let dbConnection = null;
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, typeorm_1.createConnection)({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'password',
            database: 'rss-feed-db',
            entities: [user_1.User, rssfeed_1.Rssfeed],
            synchronize: true,
            logging: true,
        });
    });
}
const initDb = () => __awaiter(void 0, void 0, void 0, function* () {
    dbConnection = yield connect();
});
exports.initDb = initDb;
exports.default = dbConnection;
function close() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = (0, typeorm_1.getConnection)();
        yield connection.close();
    });
}
exports.close = close;
