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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const express_session_1 = __importDefault(require("express-session"));
require("reflect-metadata");
const db_1 = require("./db");
const crypto_1 = __importDefault(require("crypto"));
console.log(crypto_1.default.randomBytes(64).toString('hex'));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true
}));
// having issues with cors requests and logout, this fixes it but
// is not safe. only used for dev purposes
app.use(express_1.default.json());
// Use express-session middleware
app.use((0, express_session_1.default)({
    secret: "rssfeedreadersecret",
    resave: false,
    saveUninitialized: false,
    cookie: { expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) }
}));
app.use("/", user_1.default);
const runApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.initDb)();
    app.listen(8000, () => {
        console.log("Server is running on port 8000");
    });
});
runApp();
