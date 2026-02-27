"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = exports.generateToken = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};
exports.authenticate = authenticate;
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: '24h',
    });
};
exports.generateToken = generateToken;
const hashPassword = async (password) => {
    return bcryptjs_1.default.hash(password, 10);
};
exports.hashPassword = hashPassword;
const comparePassword = async (password, hash) => {
    return bcryptjs_1.default.compare(password, hash);
};
exports.comparePassword = comparePassword;
//# sourceMappingURL=auth.js.map