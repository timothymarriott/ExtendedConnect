window.MultiChoiceExamController = function() {
    function _class50() {
        _classCallCheck(this, _class50);
        this.initVariables();
        this.initExamData();
    }
    _createClass(_class50, [{
        key: "initVariables",
        value: function initVariables() {
            this.hasSeenPopup = false;
            this.catalog = null;
            this.examData = null;
            this.gameData = null;
            this.userContent = null;
            this.images = null;
            this.compObject = null;
            this.scrollBar = null;
            this.progressManager = null;
            this.currentAnswer = null;
            this.examUid = null;
            this.homeworkUid = null;
            this.graphicObjects = [];
            this.isClicking = false;
            this.currentQuestion = -1;
            if (Util.getURLParameter("examUid") != null) {
                this.examUid = Util.getURLParameter("examUid");
                this.setHistory();
            } else {
                goToNewPage("#/Dashboard");
            }
            if (Util.getURLParameter("homeworkUid") != null) {
                this.homeworkUid = Util.getURLParameter("homeworkUid");
            }
            this.setExtraVariables();
        }
    }, {
        key: "setExtraVariables",
        value: function setExtraVariables() {}
    }, {
        key: "setHistory",
        value: function setHistory() {
            if (window.languagenutHistory == null) {
                window.languagenutHistory = new History();
            }
            window.languagenutHistory.addObject(Util.getInterfaceTranslation(12117), "#/TrueFalseExam?examUid=" + this.examUid, "Word pod");
        }
    }, {
        key: "initExamData",
        value: function initExamData() {
            var _this888 = this;
            this.gameData = new GameData();
            this.gameData.setExamUid(this.examUid);
            this.gameData.setHomeworkUid(this.homeworkUid);
            this.gameData.setGameUid(201);
            this.gameData.setGameType("exam");
            this.gameData.setIsTest(false);
            this.gameData.setToIetf(sessionStorage.getItem("learningLanguage"));
            this.gameData.setFromIetf(sessionStorage.getItem("interfaceLanguage"));
            this.gameData.callback = _asyncToGenerator(_regeneratorRuntime().mark(function _callee311() {
                var gameEnd;
                return _regeneratorRuntime().wrap(function _callee311$(_context312) {
                    while (1)
                        switch (_context312.prev = _context312.next) {
                        case 0:
                            window.renderer.destroyObject(_this888.scrollBar.graphicObject);
                            window.renderer.destroyObject(_this888.background);
                            window.renderer.destroyObject(_this888.examTextBoxObject.controlsObject);
                            window.renderer.destroyObject(_this888.examTextBoxObject.examDataObject);
                            _this888.userContent.destroyButton();
                            if (!window.examGameData.areEndResultsHidden()) {
                                _context312.next = 9;
                                break;
                            }
                            window.examGameData.updateToNext();
                            _context312.next = 13;
                            break;
                        case 9:
                            _context312.next = 11;
                            return new GameEndSummary(_this888.gameData,_this888.compObject,function() {
                                return _this888.reset();
                            }
                            );
                        case 11:
                            gameEnd = _context312.sent;
                            gameEnd.createGameEndSummary();
                        case 13:
                        case "end":
                            return _context312.stop();
                        }
                }, _callee311);
            }));
            this.gameData.init().then(function() {
                _this888.userContent = new UserContent();
                _this888.userContent.setExamUid(_this888.examUid);
                _this888.userContent.setLanguages(sessionStorage.getItem("interfaceLanguage"), _this888.gameData.toIetf);
                _this888.userContent.setUserUid(1);
                _this888.userContent.setGameUid(201);
                _this888.userContent.getContent(function(e, originalData) {
                    _this888.catalog = e;
                    _this888.gameData.setCatalog(_this888.catalog);
                    _this888.examData = originalData;
                    _this888.initImages();
                });
            });
        }
    }, {
        key: "initImages",
        value: function initImages() {
            var _this889 = this;
            this.images = [];
            this.images.push.apply(this.images, ProgressManager.getImages());
            this.images.push({
                filename: "new_design/game_display/backgroundNumber.png"
            });
            this.images.push({
                filename: "new_design/game_display/backgroundTrueFalse.png"
            });
            this.images.push({
                filename: "new_design/game_display/correctNumber.png"
            });
            this.images.push({
                filename: "new_design/game_display/incorrectNumber.png"
            });
            this.images.push({
                filename: "new_design/game_display/questionBackgroundMultiChoice.png"
            });
            this.images.push({
                filename: "new_design/game_display/questionBackgroundMultiChoiceBox.png"
            });
            this.images.push({
                filename: "new_design/game_display/questionIncorrectBackgroundMultiChoiceBox.png"
            });
            this.images.push({
                filename: "new_design/game_display/questionCorrectBackgroundMultiChoiceBox.png"
            });
            this.images.push({
                filename: "new_design/game_display/buttonBackground.png"
            });
            window.renderer.loadSprites([{
                key: "multiChoiceExam",
                filename: "multiChoiceExam.json"
            }]).then(function() {
                window.renderer.loadImages(_this889.images).then(_asyncToGenerator(_regeneratorRuntime().mark(function _callee312() {
                    var xOffset;
                    return _regeneratorRuntime().wrap(function _callee312$(_context313) {
                        while (1)
                            switch (_context313.prev = _context313.next) {
                            case 0:
                                _this889.compObject = new CompositeGraphicsObject();
                                xOffset = -40;
                                if (window.renderer.isDesktop) {
                                    xOffset = 40;
                                }
                                _this889.compObject.setPosition(xOffset, -30);
                                _this889.buildObjects();
                                _context313.next = 7;
                                return _this889.startGame();
                            case 7:
                                window.languagenutFrame.buildFrame().then(function() {
                                    window.languagenutFrame.buildTimer();
                                    _this889.userContent.createButton(true);
                                    _this889.userContent.buildPrintablesButton("31");
                                    window.renderer.drawScreen();
                                });
                            case 8:
                            case "end":
                                return _context313.stop();
                            }
                    }, _callee312);
                })));
            });
        }
    }, {
        key: "buildExamTextBox",
        value: function buildExamTextBox() {
            var _this890 = this;
            new ExamTextBox(this.examData.title,this.examData.text).build().then(function(_ref49) {
                var _ref50 = _slicedToArray(_ref49, 3)
                  , scrollbar = _ref50[0]
                  , background = _ref50[1]
                  , examTextBox = _ref50[2];
                _this890.scrollBar = scrollbar;
                _this890.background = background;
                _this890.examTextBoxObject = examTextBox;
                if (!_this890.hasSeenPopup) {
                    _this890.showPopup().catch(console.error);
                }
            });
        }
    }, {
        key: "buildObjects",
        value: function buildObjects() {
            this.buildExamTextBox();
            var questionBackground = new ImageGraphicsObject();
            questionBackground.setPosition(window.renderer.baseWidth / 2 + 300, 150);
            questionBackground.setImage("new_design/game_display/questionBackgroundMultiChoice.png");
            questionBackground.setAlignment("center");
            var numberBackground = new ImageGraphicsObject();
            numberBackground.setPosition(window.renderer.baseWidth / 2 + 130, 210);
            numberBackground.setImage("new_design/game_display/backgroundNumber.png");
            numberBackground.setAlignment("center");
            var numberText = new TextGraphicsObject();
            numberText.setPosition(window.renderer.baseWidth / 2 + 130, 226);
            numberText.setText("5");
            numberText.setStyle({
                font: "Poppins",
                fontSize: 30,
                fill: 0xffffff,
                variant: 400,
                align: "center"
            });
            numberText.setWordwrap(true, window.renderer.baseWidth * 0.34);
            numberText.setMaxHeight(100);
            numberText.setAlignment("center");
            var questionText = new TextGraphicsObject();
            questionText.setPosition(window.renderer.baseWidth / 2 + 330, 245);
            questionText.setText("");
            questionText.setStyle({
                font: "Poppins",
                fontSize: 30,
                fill: 0xffffff,
                strokeThickness: 1,
                stroke: 0xffffff,
                variant: 400,
                align: "center"
            });
            questionText.setWordwrap(true, 300);
            questionText.setMaxHeight(100);
            questionText.setAlignment("vcenter");
            var box1 = this.buildChoice();
            var box2 = this.buildChoice();
            var box3 = this.buildChoice();
            var box4 = this.buildChoice();
            this.setBoxPosition(box1, box2, box3, box4);
            var particleAContainer = new CompositeGraphicsObject();
            particleAContainer.setPosition(window.renderer.baseWidth / 2 + 130, 240);
            particleAContainer.setIsVisible(false);
            var particleBContainer = new CompositeGraphicsObject();
            particleBContainer.setPosition(1170, box1.y + 35);
            particleBContainer.setIsVisible(false);
            this.graphicObjects["questionBackground"] = questionBackground;
            this.graphicObjects["numberBackground"] = numberBackground;
            this.graphicObjects["numberText"] = numberText;
            this.graphicObjects["questionText"] = questionText;
            this.graphicObjects["box1"] = box1;
            this.graphicObjects["box2"] = box2;
            this.graphicObjects["box3"] = box3;
            this.graphicObjects["box4"] = box4;
            this.graphicObjects["particleAContainer"] = particleAContainer;
            this.graphicObjects["particleBContainer"] = particleBContainer;
        }
    }, {
        key: "showPopup",
        value: function() {
            var _showPopup12 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee313() {
                var popup, callback;
                return _regeneratorRuntime().wrap(function _callee313$(_context314) {
                    while (1)
                        switch (_context314.prev = _context314.next) {
                        case 0:
                            this.hasSeenPopup = true;
                            popup = new PopUpUI();
                            callback = function callback() {
                                popup.toggle();
                                window.renderer.refreshScreen();
                            }
                            ;
                            popup.setTitle(Util.getInterfaceTranslation(12117));
                            popup.setText(Util.getInterfaceTranslation(191720));
                            popup.setButton("".concat(Util.getInterfaceTranslation(233), "!"), callback);
                            popup.setExitEvent(callback);
                            _context314.next = 9;
                            return popup.build();
                        case 9:
                        case "end":
                            return _context314.stop();
                        }
                }, _callee313, this);
            }));
            function showPopup() {
                return _showPopup12.apply(this, arguments);
            }
            return showPopup;
        }()
    }, {
        key: "getTotalHeight",
        value: function getTotalHeight(examText) {
            window.renderer.addObjectToScreen(examText);
            var totalHeight = examText.graphicsObject.height + examText.y;
            window.renderer.destroyObject(examText);
            return totalHeight;
        }
    }, {
        key: "buildChoice",
        value: function buildChoice() {
            var _this891 = this;
            var box = new CompositeGraphicsObject();
            box.setClickEvent(function() {
                return _this891.submitAnswer(box);
            });
            var boxBackground = new ImageGraphicsObject(0,0);
            boxBackground.setPosition(0, 0);
            boxBackground.setImage("new_design/game_display/questionBackgroundMultiChoiceBox.png");
            var boxText = new TextGraphicsObject();
            boxText.setPosition(30, 30);
            boxText.setText("Test");
            boxText.setStyle({
                font: "Poppins",
                fontSize: 22,
                fill: 0xffffff,
                variant: 400,
                align: "left"
            });
            boxText.setWordwrap(true, 360);
            boxText.setMaxHeight(52);
            boxText.setAlignment("vleft");
            if (this.userContent.fromIetf == "ar") {
                boxText.arabicForce = true;
            }
            box.addChildren([boxBackground, boxText]);
            return box;
        }
    }, {
        key: "reset",
        value: function() {
            var _reset3 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee314() {
                var xOffset;
                return _regeneratorRuntime().wrap(function _callee314$(_context315) {
                    while (1)
                        switch (_context315.prev = _context315.next) {
                        case 0:
                            this.userContent.createButton(true);
                            this.compObject = new CompositeGraphicsObject();
                            this.compObject.setPosition(1500, -30);
                            this.buildObjects();
                            this.gameData.reset();
                            _context315.next = 7;
                            return this.startGame();
                        case 7:
                            xOffset = -40;
                            if (window.renderer.isDesktop) {
                                xOffset = 40;
                            }
                            new TWEEN.Tween(this.compObject).to({
                                x: xOffset
                            }, 1000).easing(TWEEN.Easing.Back.Out).onUpdate(Util.updateTweenDefault).start();
                            window.renderer.refreshScreen();
                        case 11:
                        case "end":
                            return _context315.stop();
                        }
                }, _callee314, this);
            }));
            function reset() {
                return _reset3.apply(this, arguments);
            }
            return reset;
        }()
    }, {
        key: "startGame",
        value: function() {
            var _startGame = _asyncToGenerator(_regeneratorRuntime().mark(function _callee315() {
                var _this892 = this;
                var particleA, particleB;
                return _regeneratorRuntime().wrap(function _callee315$(_context316) {
                    while (1)
                        switch (_context316.prev = _context316.next) {
                        case 0:
                            Object.values(this.graphicObjects).forEach(function(graphicObject) {
                                return _this892.compObject.addChild(graphicObject);
                            });
                            this.progressManager = new ProgressManager();
                            this.progressManager.setCatalog(this.catalog);
                            _context316.next = 5;
                            return this.progressManager.setNewQuestionCallback(function(id, content) {
                                return _this892.newQuestion(id, content);
                            });
                        case 5:
                            this.progressManager.setGameData(this.gameData);
                            this.progressManager.setOffsets(0, 30);
                            this.progressManager.setOptions({
                                maxAttempts: 1,
                                noSecondRun: true
                            });
                            this.progressManager.build();
                            particleA = new ParticleObject();
                            particleA.setPosition(0, 0);
                            particleA.setSizeModifier(0.1);
                            particleA.setSpeedModifier(2.0);
                            particleA.setType("ringStar");
                            particleA.setImage("star.png");
                            particleA.setParent(this.graphicObjects["particleAContainer"]);
                            particleB = new ParticleObject();
                            particleB.setPosition(0, 0);
                            particleB.setSizeModifier(0.1);
                            particleB.setSpeedModifier(0.5);
                            particleB.setType("ringStar");
                            particleB.setImage("star.png");
                            particleB.setParent(this.graphicObjects["particleBContainer"]);
                            this.compObject.addChildren(this.progressManager.graphicObjects);
                            window.renderer.addObjectToScreen(this.compObject);
                            window.renderer.refreshScreen();
                            window.renderer.addParticle(particleA);
                            window.renderer.addParticle(particleB);
                        case 28:
                        case "end":
                            return _context316.stop();
                        }
                }, _callee315, this);
            }));
            function startGame() {
                return _startGame.apply(this, arguments);
            }
            return startGame;
        }()
    }, {
        key: "newQuestion",
        value: function newQuestion(questionIdx, questionVocab) {
            var questionNumber = (this.progressManager.questionManager.currentQuestion + 1).toString();
            if (this.progressManager.questionManager.isSecondRun == true) {
                questionNumber = (this.progressManager.questionManager.currentSecondRunQuestion + 1).toString();
            }
            this.graphicObjects["numberText"].setText(questionNumber);
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(questionVocab.otherData, "text/xml");
            this.graphicObjects["questionText"].setText(xmlDoc.getElementsByTagName("question")[0].childNodes[0].nodeValue);
            this.currentAnswer = xmlDoc.getElementsByTagName("correct")[0].childNodes[0].nodeValue;
            var indexCA = xmlDoc.getElementsByTagName("correct")[0].getAttribute("index");
            var isShuffled = true;
            var others = ["", "", "", ""];
            if (indexCA != null) {
                isShuffled = false;
                others[parseInt(indexCA)] = this.currentAnswer;
            } else {
                others[0] = this.currentAnswer;
            }
            var currentIndexCounter = 0;
            for (var _i542 = 0; _i542 < xmlDoc.getElementsByTagName("incorrect").length && currentIndexCounter < 3; _i542++) {
                var nodeValue = xmlDoc.getElementsByTagName("incorrect")[_i542].childNodes[0].nodeValue;
                if (nodeValue != "" && nodeValue != this.currentAnswer) {
                    currentIndexCounter++;
                    var index = xmlDoc.getElementsByTagName("incorrect")[_i542].getAttribute("index");
                    if (index != null) {
                        isShuffled = false;
                        others[parseInt(index)] = nodeValue;
                    } else {
                        others[currentIndexCounter] = nodeValue;
                    }
                }
            }
            this.skip1 = this.processNode(xmlDoc.getElementsByTagName("time1")[0]);
            this.skip2 = this.processNode(xmlDoc.getElementsByTagName("time2")[0]);
            if (isShuffled) {
                others = Util.shuffle(others);
            }
            if (this.currentQuestion != questionNumber) {
                this.currentQuestion = questionNumber;
                others = others.filter(function(e) {
                    return e != "";
                });
                for (var _i543 = 0; _i543 < others.length; _i543++) {
                    var num = _i543 + 1;
                    var boxNum = "box" + num;
                    this.graphicObjects[boxNum].children[1].setText(others[_i543]);
                    this.graphicObjects[boxNum].children[0].setImage("new_design/game_display/questionBackgroundMultiChoiceBox.png");
                }
                others.length < 4 ? this.graphicObjects["box4"].setIsVisible(false) : this.graphicObjects["box4"].setIsVisible(true);
                this.graphicObjects["box1"].children[0].setImage("new_design/game_display/questionBackgroundMultiChoiceBox.png");
                this.graphicObjects["box2"].children[0].setImage("new_design/game_display/questionBackgroundMultiChoiceBox.png");
                this.graphicObjects["box3"].children[0].setImage("new_design/game_display/questionBackgroundMultiChoiceBox.png");
                if (!this.graphicObjects["box4"]) {
                    this.graphicObjects["box4"].children[0].setImage("new_design/game_display/questionBackgroundMultiChoiceBox.png");
                }
            }
            questionVocab.interfaceWord = xmlDoc.getElementsByTagName("question")[0].childNodes[0].nodeValue;
            questionVocab.learningWord = xmlDoc.getElementsByTagName("correct")[0].childNodes[0].nodeValue;
            window.renderer.refreshScreen();
        }
    }, {
        key: "processNode",
        value: function processNode(value) {
            if (value == null || value.childNodes[0] == null) {
                return "";
            }
            return value.childNodes[0].nodeValue;
        }
    }, {
        key: "submitAnswer",
        value: function submitAnswer(button) {
            var _this893 = this;
            if (this.isClicking) {
                return;
            }
            this.isClicking = true;
            var isCorrect = this.currentAnswer == button.children[1].text;
            if (!window.examGameData.areMinorResultsHidden()) {
                if (isCorrect) {
                    button.children[0].setImage("new_design/game_display/questionCorrectBackgroundMultiChoiceBox.png");
                } else {
                    button.children[0].setImage("new_design/game_display/questionIncorrectBackgroundMultiChoiceBox.png");
                }
                this.graphicObjects["numberText"].setIsVisible(false);
                if (isCorrect) {
                    this.graphicObjects["numberBackground"].setImage("new_design/game_display/correctNumber.png");
                    this.graphicObjects["particleAContainer"].setIsVisible(true);
                    this.graphicObjects["particleBContainer"].setIsVisible(true);
                    this.graphicObjects["particleBContainer"].setPosition(button.x + 420, button.y + 35);
                } else {
                    this.graphicObjects["numberBackground"].setImage("new_design/game_display/incorrectNumber.png");
                    if (this.progressManager.isLastTry()) {
                        if (this.currentAnswer == this.graphicObjects["box1"].children[1].text) {
                            this.graphicObjects["box1"].children[0].setImage("new_design/game_display/questionCorrectBackgroundMultiChoiceBox.png");
                        } else if (this.currentAnswer == this.graphicObjects["box2"].children[1].text) {
                            this.graphicObjects["box2"].children[0].setImage("new_design/game_display/questionCorrectBackgroundMultiChoiceBox.png");
                        } else if (this.currentAnswer == this.graphicObjects["box3"].children[1].text) {
                            this.graphicObjects["box3"].children[0].setImage("new_design/game_display/questionCorrectBackgroundMultiChoiceBox.png");
                        } else {
                            this.graphicObjects["box4"].children[0].setImage("new_design/game_display/questionCorrectBackgroundMultiChoiceBox.png");
                        }
                    }
                }
            } else {
                button.children[0].setTint(0xbababa);
            }
            window.renderer.refreshScreen();
            setTimeout(function() {
                _this893.graphicObjects["particleAContainer"].setIsVisible(false);
                _this893.graphicObjects["particleBContainer"].setIsVisible(false);
                _this893.graphicObjects["numberText"].setIsVisible(true);
                _this893.graphicObjects["numberBackground"].setImage("new_design/game_display/backgroundNumber.png");
                _this893.isClicking = false;
                button.children[0].setTint(null);
                window.renderer.refreshScreen();
                _this893.progressManager.setAnswer(isCorrect);
            }, 1000);
        }
    }, {
        key: "setBoxPosition",
        value: function setBoxPosition(box1, box2, box3, box4) {
            box1.setPosition(760, 350);
            box2.setPosition(760, 420);
            box3.setPosition(760, 490);
            box4.setPosition(760, 560);
        }
    }]);
    return _class50;
}();