'use strict';// Source: public/js/app.min.js
/*! 1mil 2014-12-19 */
function muteAudio(){var audio=document.getElementById("audio");audio.muted=!audio.muted;{var icon=document.getElementById("sound-icon");document.getElementById("audioControl")}icon.src=audio.muted===!1?"images/unmuted.png":"images/muted.png"}function setLeaderboard(){var leaderboard=getLeaderboard(),playerArr=[];for(var player in leaderboard)playerArr.push(leaderboard[player]);playerArr.sort(function(a,b){return b.score-a.score});var i,listItem,name,score,position,list=document.createElement("ul");for(i=0;i<playerArr.length;i+=1)position=(i+1).toString(),name=playerArr[i].name,score=playerArr[i].score,listItem=document.createElement("li"),listItem.innerHTML=position+". "+name+" - "+score,list.appendChild(listItem);var targetDiv=document.getElementById("leaderboard-screen");targetDiv.appendChild(list)}function getLeaderboard(){var leaderBoardString=localStorage.getItem(LEADERBOARD_KEY);return JSON.parse(leaderBoardString)}function addScore(score){var name=$("#input-name").val(),currPlayer={name:name,score:score},playerArr=[];playerArr.push(currPlayer);var leaderboard=getLeaderboard();for(var player in leaderboard)playerArr.push(leaderboard[player]);playerArr.sort(function(a,b){return b.score-a.score}),playerArr.pop();var i,newLeaderboard={};for(i=0;5>i;i+=1)newLeaderboard[i]={},newLeaderboard[i].name=playerArr[i].name,newLeaderboard[i].score=playerArr[i].score;localStorage.setItem(LEADERBOARD_KEY,JSON.stringify(newLeaderboard))}angular.module("AddController",["QuestionService"]).controller("AddCtrl",["$scope","Question",function($scope,Question){$scope.add=function(){Question.create({question:$scope.question,answerA:$scope.answerA,answerB:$scope.answerB,answerC:$scope.answerC,answerD:$scope.answerD,correctAnswer:$scope.correctAnswer}).success(function(){console.log("success")})}}]),angular.module("EndGameController",["ui.bootstrap"]).controller("EndGameCtrl",["$scope","$modalInstance","won",function($scope,$modalInstance,won){$scope.won=won,$scope.ok=function(){$modalInstance.close()},$scope.cancel=function(){$modalInstance.dismiss("cancel")}}]),angular.module("IndexController",["PlayerFilter","QuestionService","ui.bootstrap"]).controller("IndexCtrl",["$scope","NameFilter","Question","$modal","$log",function($scope,NameFilter,Question,$modal,$log){function game(){question=questions[$scope.level],$scope.question={question:question.question,answerA:question.answerA,answerB:question.answerB,answerC:question.answerC,answerD:question.answerD}}function launchModal(won){var modalInstance=$modal.open({templateUrl:won?"/views/modal_won.html":"/views/modal_lost.html",controller:"EndGameCtrl",size:"lg",resolve:{won:function(){return won}}});modalInstance.result.then(function(){},function(){$log.info("Modal dismissed at: "+new Date)})}$scope.playerName="",$scope.hideNewGame=!1,$scope.level=0;var question=null,questions=null,available=!1;Question.get16().success(function(_questions){16===_questions.length&&(available=!0),questions=_questions}),$scope.newGame=function(){NameFilter($scope.playerName)&&available&&($scope.hideNewGame=!0,game())},$scope.answer=function(Letter){return available&&question&&-1==$.inArray(Letter,["A","B","C","D"])?!1:void(question["answer"+Letter]==question.correctAnswer?($scope.level++,$scope.level>=16?launchModal(!0):game()):(launchModal(!1),$scope.level=0,$scope.hideNewGame=!1))},$scope.items=["item1","item2","item3"]}]),angular.module("LeaderBoardController",[]).controller("LeaderBoardCtrl",["$scope",function(){console.log("here?")}]),angular.module("PlayerFilter",[]).filter("Name",function(){return function(string){return string?(string=string.trim(),0!==string.length&&""!==string):!1}}),angular.module("QuestionService",[]).factory("Question",["$http",function($http){return{create:function(questionData){return $http.post("/api/question",questionData)},get16:function(){return $http.get("/api/question")}}}]),angular.module("Directives",[]).directive("openModal",function(){return{link:function(scope,element){function openModal(){console.log("here");var $element=angular.element("#myModal");$element.modal("show")}element.bind("click",openModal)}}}),$("#create-btn").click(function(){var question=$("#question").val(),answerA=$("#answerA").val(),answerB=$("#answerB").val(),answerC=$("#answerC").val(),answerD=$("#answerD").val(),description=$("#description").val(),difficulty=$("#diff").find("option:selected").val(),correctAnswer=$("#correct-answer").find("option:selected").val(),questionAsObject={question:question,answerA:answerA,answerB:answerB,answerC:answerC,answerD:answerD,difficulty:difficulty,correctAnswer:correctAnswer,description:description},questionAsJson=JSON.stringify(questionAsObject)+",",url="data:text/json;charset=utf8,"+encodeURIComponent(questionAsJson);window.open(url,"_blank"),window.focus()});var GameEngine=function(){var WIDTH=800,HEIGHT=600,isTimerJokerUsed=!1,isChangeQuestionJokerUsed=!1,stage=new Kinetic.Stage({container:"container",width:WIDTH,height:HEIGHT}),stageForCorrectAnswer=new Kinetic.Stage({container:"answer-state",width:WIDTH,height:HEIGHT}),kineticForCorrectAnswer=new KineticRenderForCorrectAnswer(stageForCorrectAnswer),generator=new QuestionGeneration,arrWithQuestions=generator.getQuestions();console.log(arrWithQuestions[0].question);var kineticRender=new KineticRender(stage),questionNumber=0,question=arrWithQuestions[questionNumber],svgRender=new SvgRender,drawCurrentAnswer=function(question){setTimeout(function(){svgRender.startProgressBar(whenAnswerIsChoosen)},350);var arrayWithAnswer=[];arrayWithAnswer.push(question.answerA),arrayWithAnswer.push(question.answerB),arrayWithAnswer.push(question.answerC),arrayWithAnswer.push(question.answerD),isTimerJokerUsed||kineticRender.drawJoker(602,0,99,40,"images/stop_timer.png",whenTimerIsStopped),isChangeQuestionJokerUsed||kineticRender.drawJoker(701,0,99,40,"images/change_question.png",whenQuestionIsChanged),kineticRender.drawRightPanel(600,40,200,560,15,100,questionNumber+1),kineticRender.drawAnswersBox(10,470,600,150,arrayWithAnswer,whenAnswerIsChoosen),kineticRender.drawQuestionBox(20,120,560,230,question.question)},whenAnswerIsChoosen=function(rectID){rectID==question.correctAnswer?14===questionNumber?(svgRender.clearPaper(),kineticForCorrectAnswer.finalWinScreen(),addScore(calculatePlayerScore(questionNumber))):(kineticForCorrectAnswer.correctAnswer(question.description),questionNumber++,question=arrWithQuestions[questionNumber],svgRender.clearPaper()):(kineticForCorrectAnswer.incorrectAnswer(question.description),svgRender.clearPaper(),addScore(calculatePlayerScore(questionNumber)))},calculatePlayerScore=function(levelNumber){for(var score=0,currentLevel=0|levelNumber,i=1;currentLevel>=i;i++)score+=100*i;return score},whenTimerIsStopped=function(){isTimerJokerUsed=!0,svgRender.pauseTimer()},whenQuestionIsChanged=function(){isChangeQuestionJokerUsed=!0,svgRender.clearPaper(),question=arrWithQuestions[15],drawCurrentAnswer(question)},nextQuestion=function(){drawCurrentAnswer(question)};return{nextQuestion:nextQuestion}},KineticRender=function(stage){var stage=stage,layer=new Kinetic.Layer,drawJoker=function(x,y,width,height,imgSrc,onClickFunc){var timeJokerBackgroundImage=new Image;timeJokerBackgroundImage.onload=function(){stopTimerImage=new Kinetic.Image({x:x,y:y,width:width,height:height}),layer.add(backgroundRectForColor,timerRectangle,timerContainer),layer.draw()},timeJokerBackgroundImage.src=imgSrc;var timerRectangle=new Kinetic.Rect({x:x,y:y,width:width,height:height,fillPatternImage:timeJokerBackgroundImage,stroke:"#004a4d",strokeWidth:3}),backgroundRectForColor=new Kinetic.Rect({x:x,y:y,width:width,height:height,fill:"#1D7074"}),timerContainer=new Kinetic.Rect({x:x,y:y,width:width,height:height,opacity:0});timerContainer.on("click",function(){timerContainer.off("mouseover"),timerContainer.off("mouseout"),timerContainer.off("click"),onClickFunc(),timerRectangle.opacity("0.2"),backgroundRectForColor.fill("#1D7074"),layer.draw()}),timerContainer.on("mouseover",function(){backgroundRectForColor.fill("#CDCC00"),layer.draw()}),timerContainer.on("mouseout",function(){backgroundRectForColor.fill("#1D7074"),layer.draw()})},drawQuestionBox=function(x,y,width,height,strQuestion){void 0===strQuestion&&(strQuestion="Some question?");var bgColor="#ffb473",textColor="#006064",fontsize="28",borderColor="#004a4d",layer=new Kinetic.Layer,questionRect=new Kinetic.Rect({x:x,y:y,width:width,height:height,fill:bgColor,stroke:borderColor,strokeWidth:5,lineWidth:5}),questionText=new Kinetic.Text({x:x,y:y+height/2-40,align:"center",fill:textColor,width:width-20,height:height-20,padding:10,text:strQuestion,fontSize:fontsize,strokeWidth:2});layer.add(questionRect,questionText),stage.add(layer)},drawRightPanel=function(x,y,width,height,rows,startPoints,selectedRow){function isThreshholdRow(rows,i,selectedRow){return(i===Math.floor(rows/3*2)||i===Math.floor(rows/3)||0===i)&&rows-i>selectedRow}function isCurrentRow(rows,i,selectedRow){return selectedRow===rows-i}function isPassedRow(rows,i,selectedRow){return selectedRow>rows-i}for(var singleRowHeight=height/rows,topRowPoints=rows*startPoints,passedTextColor="#01C3CD",selectedTextColor="#006064",passedBackgroundColor="#00939A",selectedBacgroundColor="#CDCC00",passedBorderColor="#00CFC4",specialTextColor="#DAA520",standardTextColor="#01C3CD",standardBackgroundColor="#1D7074",standardBorderColor="#004a4d",layer=new Kinetic.Layer,i=0;rows>i;i++)rows=0|rows,isCurrentRow(rows,i,selectedRow)?drawRightPanelRow(x,y+singleRowHeight*i,width,singleRowHeight,rows-i,topRowPoints-i*startPoints,30,selectedTextColor,selectedBacgroundColor,standardBorderColor,layer):isThreshholdRow(rows,i,selectedRow)?drawRightPanelRow(x,y+singleRowHeight*i,width,singleRowHeight,rows-i,topRowPoints-i*startPoints,30,specialTextColor,standardBackgroundColor,standardBorderColor,layer):isPassedRow(rows,i,selectedRow)?drawRightPanelRow(x,y+singleRowHeight*i,width,singleRowHeight,rows-i,topRowPoints-i*startPoints,30,passedTextColor,passedBackgroundColor,passedBorderColor,layer):drawRightPanelRow(x,y+singleRowHeight*i,width,singleRowHeight,rows-i,topRowPoints-i*startPoints,30,standardTextColor,standardBackgroundColor,standardBorderColor,layer);stage.add(layer)},drawRightPanelRow=function(x,y,width,height,rowNumber,rowPoints,fontSize,textColor,backgroundColor,borderColor,layer){var backgroundRectangle=new Kinetic.Rect({x:x,y:y,width:width,height:height,fill:borderColor}),leftRectWidth=width/3-5,leftRectangle=new Kinetic.Rect({x:x+3,y:y+1,width:leftRectWidth,height:height-2,fill:backgroundColor}),leftTextField=new Kinetic.Text({x:leftRectangle.x(),y:leftRectangle.y()-5,text:rowNumber,fontSize:fontSize,fontFamily:"Calibri",fill:textColor,width:leftRectangle.width()-20,height:leftRectangle.height()-20,padding:5,align:"center"}),rightRectangle=new Kinetic.Rect({x:x+leftRectWidth+6,y:y+1,width:width-(leftRectWidth+8),height:height-2,fill:backgroundColor}),rightTextField=new Kinetic.Text({x:rightRectangle.x(),y:rightRectangle.y()-10,text:rowPoints,fontSize:fontSize,fontFamily:"Calibri",fill:textColor,width:rightRectangle.width()-20,height:rightRectangle.height()-20,padding:10,align:"center"});layer.add(backgroundRectangle,leftRectangle,leftTextField,rightRectangle,rightTextField)},drawAnswersBox=function(x,y,width,height,arrOfStrings,onClickFunc){for(var singleAnswerWidth=width/2-20,singleAnswerHeight=height/2-20,maxStrLength=0,fontSize=10,i=0;4>i;i++)maxStrLength<arrOfStrings[i].length&&(maxStrLength=arrOfStrings[i].length);10>maxStrLength?fontSize=30:15>maxStrLength?fontSize=25:20>maxStrLength?fontSize=20:30>maxStrLength&&(fontSize=18);for(var index=0,i=0;2>i;i++)for(var k=0;2>k;k++)drawAnswer(x+(singleAnswerWidth+10)*i,y+(singleAnswerHeight+10)*k,singleAnswerWidth,singleAnswerHeight,arrOfStrings[index],fontSize,index+1,onClickFunc),index++},drawAnswer=function(x,y,width,height,text,fontSize,rectID,onClickFunc){var rectangle=new Kinetic.Rect({x:x,y:y,width:width,height:height,fill:"#FF9841",stroke:"#226F77",strokeWidth:2}),textField=new Kinetic.Text({x:x,y:y,text:text,fontSize:fontSize,fontFamily:"Arial",fontStyle:"bold",fill:"#226F77",width:rectangle.width()-20,height:rectangle.height()-20,padding:10,align:"center"}),rectangleContainer=new Kinetic.Rect({x:x,y:y,width:width,height:height,id:rectID,opacity:0});rectangleContainer.on("click",function(){rectangle.fill("yellowgreen"),rectangleContainer.off("mouseover"),rectangleContainer.off("mouseout"),layer.draw(),onClickFunc(rectangleContainer.id())}),rectangleContainer.on("mouseover",function(){rectangle.fill("#226F77"),rectangle.stroke("#FF9841"),textField.fill("#FF9841"),layer.draw()}),rectangleContainer.on("mouseout",function(){rectangle.fill("#FF9841"),rectangle.stroke("#226F77"),textField.fill("#226F77"),layer.draw()}),layer.add(rectangle,textField,rectangleContainer),stage.add(layer)};return{drawJoker:drawJoker,drawRightPanel:drawRightPanel,drawAnswersBox:drawAnswersBox,drawQuestionBox:drawQuestionBox}},KineticRenderForCorrectAnswer=function(stage){var stage=stage,layer=new Kinetic.Layer,correctAnswer=function(strCorrectAnswerDescription){layer.clear(),$("#container").fadeOut(1e3),void 0===strCorrectAnswerDescription&&(strCorrectAnswerDescription="Congratulations, you answer correctly.");var corectAnswerBox=new Kinetic.Rect({x:150,y:150,width:500,height:300,fill:"#ff9840",stroke:"#004a4d",strokeWidth:3,opacity:1}),corectAnswerText=new Kinetic.Text({x:150,y:200,text:"Answer Correct!",fontSize:45,fontFamily:"Arial",width:500,align:"center",fill:"#004a4d"}),corectAnswerDescriptionText=new Kinetic.Text({x:150,y:300,text:strCorrectAnswerDescription,fontSize:30,fontFamily:"Arial",width:500,align:"center",fill:"#1D7074"}),nextQuestion=new Kinetic.Rect({x:250,y:500,width:300,height:70,fill:"#004a4d",fontStyle:"bold",stroke:"#004a4d",strokeWidth:5}),nextQuestionText=new Kinetic.Text({x:275,y:510,text:"Next Question",fontSize:26,fontFamily:"Arial",fill:"#ff9840",width:250,padding:10,align:"center"}),nextQuestionInvisible=new Kinetic.Rect({x:250,y:500,width:300,height:70,opacity:0});nextQuestionInvisible.on("click",function(){gameEngine.nextQuestion(),$("#container").fadeIn(1e3)}),nextQuestionInvisible.on("mouseover",function(){nextQuestion.fill("#1D7074"),layer.draw()}),nextQuestionInvisible.on("mouseout",function(){nextQuestion.fill("#004a4d"),layer.draw()}),layer.add(nextQuestion,nextQuestionText,nextQuestionInvisible,corectAnswerBox,corectAnswerText,corectAnswerDescriptionText),stage.add(layer)},incorrectAnswer=function(strIncorrectAnswerDescription){layer.clear(),void 0===strIncorrectAnswerDescription&&(strIncorrectAnswerDescription="You may have more luck next time."),$("#container").fadeOut(1500);var incorectedAnswerBox=new Kinetic.Rect({x:150,y:150,width:500,height:300,fill:"#ff9840",stroke:"#004a4d",strokeWidth:2,align:"center",opacity:1}),incorectAnswerText=new Kinetic.Text({x:150,y:200,text:"Incorrect Answer!",fontSize:45,fontFamily:"Arial",fill:"red",width:500,align:"center"}),incorectAnswerDescriptionText=new Kinetic.Text({x:150,y:300,text:strIncorrectAnswerDescription,fontSize:30,fontFamily:"Arial",width:500,align:"center",fill:"#1D7074"}),nextQuestion=new Kinetic.Rect({x:250,y:500,width:300,height:70,fill:"#004a4d",stroke:"#004a4d",strokeWidth:5}),nextQuestionText=new Kinetic.Text({x:275,y:510,text:"Back to Menu",fontSize:26,fontFamily:"Arial",fill:"#ff9840",fontStyle:"bold",width:250,padding:10,align:"center"}),nextQuestionInvisible=new Kinetic.Rect({x:250,y:500,width:300,height:70,opacity:0});nextQuestionInvisible.on("click",function(){location.reload()}),nextQuestionInvisible.on("mouseover",function(){nextQuestion.fill("#1D7074"),layer.draw()}),nextQuestionInvisible.on("mouseout",function(){nextQuestion.fill("#004a4d"),layer.draw()}),layer.add(nextQuestion,nextQuestionText,nextQuestionInvisible,incorectedAnswerBox,incorectAnswerText,incorectAnswerDescriptionText),stage.add(layer)},finalWinScreen=function(){layer.clear(),$("#container").fadeOut(1500);var nextQuestion=new Kinetic.Rect({x:250,y:500,width:300,height:70,fill:"#004a4d",stroke:"#004a4d",strokeWidth:5}),nextQuestionText=new Kinetic.Text({x:275,y:510,text:"Back to Menu",fontSize:26,fontFamily:"Arial",fill:"#ff9840",fontStyle:"bold",width:250,padding:10,align:"center"}),nextQuestionInvisible=new Kinetic.Rect({x:250,y:500,width:300,height:70,opacity:0});nextQuestionInvisible.on("click",function(){location.reload()}),nextQuestionInvisible.on("mouseover",function(){nextQuestion.fill("#1D7074"),layer.draw()}),nextQuestionInvisible.on("mouseout",function(){nextQuestion.fill("#004a4d"),layer.draw()}),layer.add(nextQuestion,nextQuestionText,nextQuestionInvisible);var imageObj=new Image;imageObj.onload=function(){var image=new Kinetic.Image({x:150,y:120,image:imageObj,width:500,height:333});layer.add(image),layer.draw()},imageObj.src="/images/certificate.png",stage.add(layer)};return{correctAnswer:correctAnswer,incorrectAnswer:incorrectAnswer,finalWinScreen:finalWinScreen}},QuestionGeneration=function(){jQuery.ajaxSetup({async:!1});var arrayWithQuestion=[],getRandomIndexFromArray=function(arrayLength){return Math.random()*arrayLength|0},getQuestionsFromFile=function(filePath,countOfNeededQuestions){var arrayWithChoosenQuestions=[];return $.getJSON(filePath,function(data){for(var arrayWithQuestion=data,i=0;countOfNeededQuestions>i;i++){var dataLength=arrayWithQuestion.length,indexFromArray=getRandomIndexFromArray(dataLength);arrayWithChoosenQuestions.push(arrayWithQuestion[indexFromArray]),arrayWithQuestion.splice(indexFromArray,1)}}),arrayWithChoosenQuestions},getQuestions=function(){var arrWithEasy=getQuestionsFromFile("Questions/Level1.html",5),arrWithMedium=getQuestionsFromFile("Questions/Level2.html",5),arrWithHard=getQuestionsFromFile("Questions/Level3.html",5),bonusQuestion=getQuestionsFromFile("Questions/Level4.html",1);return arrayWithQuestion=arrayWithQuestion.concat(arrWithEasy,arrWithMedium,arrWithHard,bonusQuestion)};return{getQuestions:getQuestions}},renderQuestion=function(containerID,xPos,yPos,width,height,textContent){function getRect(svgNS,svgContainderId,xPos,yPos,width,height,fillColor){var rect=document.createElementNS(svgNS,"rect");return rect.setAttribute("x",xPos),rect.setAttribute("y",yPos),rect.setAttribute("width",width),rect.setAttribute("height",height),rect.setAttribute("fill",fillColor),svgContainderId.appendChild(rect),{x:xPos,y:yPos,width:width,height:height}}function attachText(svgNS,svgContainderId,text,fontSize,rectContainer){var fontSze=16|fontSize,txtElem=document.createElementNS(svgNS,"text"),xPos=rectContainer.x,yPos=rectContainer.y+rectContainer.height/2+textMaxFontSize/2;return txtElem.textContent=text,txtElem.setAttribute("fill",themeColors.textColor),txtElem.setAttribute("x",xPos.toString()),txtElem.setAttribute("y",yPos.toString()),txtElem.setAttribute("font-size",fontSze),svgContainderId.appendChild(txtElem),txtElem}function changeTextSize(txtElement){var nextSize=Number(txtElement.getAttribute("font-size"));txtElement.setAttribute("font-size",(nextSize+1).toString()),textWidthInPixels=txtElement.getComputedTextLength(),nextSize>textMaxFontSize&&clearInterval(animate),textWidthInPixels>=svgParameters.width&&clearInterval(animate)}function animateTextResize(){changeTextSize(txt)}var svgNS="http://www.w3.org/2000/svg",svgContainer=document.getElementById(containerID),textFontSize=1,textMaxFontSize=32,animationSpeedMiliseconds=4,textWidthInPixels=1,themeColors={textColor:"white",background:"#2D8CF0"},svgParameters={width:width,height:height},container=getRect(svgNS,svgContainer,xPos,yPos,width,height,themeColors.background),txt=attachText(svgNS,svgContainer,textContent,textFontSize,container),animate=setInterval(animateTextResize,animationSpeedMiliseconds)};renderQuestion("svg-container",130,110,400,200,"Text Content Text");var SvgRender=function(){function clearPaper(){progressLevel.stop(),paper.remove()}function pauseTimer(){progressLevel.pause()}var progressLevel,progressBar,paper,startProgressBar=function(callback){paper=Raphael(80,370,500,100),progressBar=paper.rect(30,50,399,50,5),paper.setStart();var set=(paper.text(30,40,"30"),paper.text(169,40,"20"),paper.text(302,40,"10"),paper.text(430,40,"0"),paper.setFinish());set.attr({"font-size":"20px"}),progressLevel=paper.rect(31,51,1,48,5),progressLevel.attr({fill:"#23FF2E"}).animate({fill:"#B50000",width:398},3e4,callback);paper.path("M 169 50 L 169 100 M 302 50 L 302 100")};return{startProgressBar:startProgressBar,clearPaper:clearPaper,pauseTimer:pauseTimer}},LEADERBOARD_KEY="key";if(null==localStorage.getItem(LEADERBOARD_KEY)){var leaderboard={0:{name:"unknown",score:0},1:{name:"unknown",score:0},2:{name:"unknown",score:0},3:{name:"unknown",score:0},4:{name:"unknown",score:0}};localStorage.setItem(LEADERBOARD_KEY,JSON.stringify(leaderboard))}setLeaderboard();