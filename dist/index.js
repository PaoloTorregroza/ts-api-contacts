"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var express_1 = __importDefault(require("express"));
var bodyParser = __importStar(require("body-parser"));
var Phone_1 = require("./entities/Phone");
var User_1 = require("./entities/User");
var jwt = __importStar(require("jsonwebtoken"));
var config_1 = require("./configs/config");
typeorm_1.createConnection({
    type: "postgres",
    host: "127.0.0.1",
    port: 5432,
    username: "dev",
    password: "",
    database: "tscrud",
    entities: [Phone_1.Phone, User_1.User],
    synchronize: true,
    logging: false
}).then(function (connection) { return __awaiter(void 0, void 0, void 0, function () {
    var userRepository, phoneRepository, app;
    return __generator(this, function (_a) {
        userRepository = connection.getRepository(User_1.User);
        phoneRepository = connection.getRepository(Phone_1.Phone);
        app = express_1.default();
        app.use(bodyParser.json());
        // JWT config
        app.set("key", config_1.key);
        app.use(bodyParser.urlencoded({ extended: true }));
        app.post("/auth", function (req, res) {
            if (req.body.user === "asfo" && req.body.password === "123456") {
                var payload = {
                    check: true
                };
                var token = jwt.sign(payload, app.get("key"), {
                    expiresIn: 1440
                });
                res.json({
                    message: "Succesfull auth",
                    toke: token
                });
            }
            else {
                res.json({ message: "Wrong user or password" });
            }
        });
        app.get('/', function (req, res) {
            res.send("Root route");
        });
        // User index
        app.get("/users", function (req, res) {
            return __awaiter(this, void 0, void 0, function () {
                var users;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, userRepository.find()];
                        case 1:
                            users = _a.sent();
                            res.json(users);
                            return [2 /*return*/];
                    }
                });
            });
        });
        app.get("/users/:id", function (req, res) {
            return __awaiter(this, void 0, void 0, function () {
                var results;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, userRepository.findOne(req.params.id)];
                        case 1:
                            results = _a.sent();
                            return [2 /*return*/, res.send(results)];
                    }
                });
            });
        });
        app.post("/users", function (req, res) {
            return __awaiter(this, void 0, void 0, function () {
                var user, results;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, userRepository.create(req.body)];
                        case 1:
                            user = _a.sent();
                            return [4 /*yield*/, userRepository.save(user)];
                        case 2:
                            results = _a.sent();
                            return [2 /*return*/, res.send(results)];
                    }
                });
            });
        });
        app.put("/users/:id", function (req, res) {
            return __awaiter(this, void 0, void 0, function () {
                var user, results;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, userRepository.findOne(req.params.id)];
                        case 1:
                            user = _a.sent();
                            if (!(user != undefined)) return [3 /*break*/, 3];
                            userRepository.merge(user, req.body);
                            return [4 /*yield*/, userRepository.save(user)];
                        case 2:
                            results = _a.sent();
                            return [2 /*return*/, res.send(results)];
                        case 3: return [2 /*return*/, res.send("User don't exists")];
                    }
                });
            });
        });
        app.delete("/users/:id", function (req, res) {
            return __awaiter(this, void 0, void 0, function () {
                var results;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, userRepository.delete(req.params.id)];
                        case 1:
                            results = _a.sent();
                            return [2 /*return*/, res.send(results)];
                    }
                });
            });
        });
        app.post("/add-phone", function (req, res) {
            return __awaiter(this, void 0, void 0, function () {
                var phone, results;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, phoneRepository.create(req.body)];
                        case 1:
                            phone = _a.sent();
                            return [4 /*yield*/, phoneRepository.save(phone)];
                        case 2:
                            results = _a.sent();
                            return [2 /*return*/, res.send(results)];
                    }
                });
            });
        });
        // Phone index
        // start express server
        app.listen(4000, function () { return console.log("Server at localhost:4000"); });
        return [2 /*return*/];
    });
}); }).catch(function (error) { return console.log(error); });
