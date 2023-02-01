"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const router = (0, express_1.Router)();
router.post('/register', user_1.registerUser);
router.post('/login', user_1.loginUser);
router.get('/isLoggedIn', user_1.isLoggedIn);
exports.default = router;
