const initializeEvaluation = () => {
  ScormProcessInitialize();
  ScormProcessSetValue("cmi.score.min", minScore);
  ScormProcessSetValue("cmi.score.max", maxScore);
  ScormProcessSetValue("cmi.score.raw", totalScore);
  //ScormProcessSetValue("cmi.max_time_allowed", "20");
  //ScormProcessSetValue("cmi.time_limit_action", "exit");
  //attemps
};


const getQuestionType = (questionInputsArray) => {
  let response = "";
  questionInputsArray.forEach((input) => {
    if (input.classList.contains("multiple-choise-input")) {
      response = "multiple-choise-input";
    }
    if (input.classList.contains("true-false-input")) {
      response = "true-false-input";
    }
    if (input.classList.contains("short-text-input")) {
      response = "short-text-input";
    }
  });
  return response;
};

const evaluateQuestion = (questionType,questionInputsArray,responseExpected) => {
  switch (questionType) {
    case "multiple-choise-input":
      evaluateMCQuestion(questionInputsArray, responseExpected);
      break;
    case "true-false-input":
      evaluateTFQuestion(questionInputsArray, responseExpected);
      break;
    case "short-text-input":
      evaluateShortQuestion(questionInputsArray, responseExpected);
      break;
  }
};

const evaluateMCQuestion = (questionInputsArray, responseExpected) => {
  const { correctAnswer, points } = responseExpected;
  const checketInputValues = getCheckedInputsValues(questionInputsArray);
  let correctMatch = true;

  if (correctAnswer.length !== checketInputValues.length) {correctMatch = false;}
  else {
    correctAnswer.forEach((answer) => {
      if (!checketInputValues.includes(answer)) { correctMatch = false;}
    });}

  if (correctMatch) {increaseTotalPoints(points);} 
  else {increaseIncorrectResponses();}

};

const evaluateTFQuestion = (questionInputsArray, responseExpected) => {
  const { correctAnswer, points } = responseExpected;
  const checkedInput =getCheckedInputs(questionInputsArray);
  const currentResponse = checkedInput[0].value;

  if (correctAnswer[0]===currentResponse){increaseTotalPoints(points);} 
  else {increaseIncorrectResponses();}
};

const evaluateShortQuestion = (questionInputsArray, responseExpected) => {
  const { correctAnswer, points } = responseExpected;
  const currentResponse = questionInputsArray[0].value;

  if (correctAnswer.includes(currentResponse)) {increaseTotalPoints(points);} 
  else {increaseIncorrectResponses();}

};

const increaseTotalPoints = (points) => {totalScore += points;};

const increaseIncorrectResponses = () => {incorrectResponses++;};

const increaseAttemps = () => {totalAttemps++;};

const htmlCollectionToArray = (questionInputs) => {return Array.prototype.slice.call(questionInputs);};

const getCheckedInputs=(questionInputsArray)=>{return questionInputsArray.filter((input) => input.checked === true);}

const RegisterTotalPoints = () => {ScormProcessSetValue("cmi.score.raw", totalScore);};

const getCheckedInputsValues=(questionInputsArray)=>{
    const checkedInputObjects = getCheckedInputs(questionInputsArray);
    return checkedInputObjects.map((input) => input.value);
}


const finishQuiz=()=>{
  RegisterTotalPoints();
  const totalPointsRegistered=ScormProcessGetValue("cmi.score.raw"); 
  if(totalPointsRegistered<51){
    ScormProcessSetValue("cmi.success_status","failed"); 
    ScormProcessSetValue("cmi.completion_status","incomplete");
  }
  else{
    ScormProcessSetValue("cmi.success_status","passed"); 
    ScormProcessSetValue("cmi.completion_status","completed");
  }
  ScormProcessTerminate();
}

const activityEnded=()=>{
  alert(ScormProcessGetValue("cmi.success_status"))
  return ScormProcessGetValue("cmi.success_status")==="passed" || ScormProcessGetValue("cmi.success_status")==="failed"   ;
}

const disableEvaluationBtn=()=>{
  const evaluationBtn=document.getElementById("evaluation-button");
    evaluationBtn.disabled=true;
    evaluationBtn.innerHTML="Terminado";
}

const loadBtnStatus=()=>{
  if(activityEnded()){disableEvaluationBtn()}
}

const setPointsPerQuestion = () => {
  increaseAttemps();

  questionsResponseExpected.forEach((responseExpected) => {
    const questionInputs = document.getElementsByClassName(`question-${responseExpected.number}`);
    const questionInputsArray = htmlCollectionToArray(questionInputs);
    const questionType = getQuestionType(questionInputsArray);
    evaluateQuestion(questionType, questionInputsArray, responseExpected);
  });

  finishQuiz();
  loadBtnStatus();
};


initializeEvaluation();
loadBtnStatus();



















// const setInteractionTypes=()=>{
//   const MCQuestionsCollection=document.getElementsByClassName("multiple-choise-question");
//   const TFQuestionsCollection=document.getElementsByClassName("true-false-question");
//   const STQuestionsCollection=document.getElementsByClassName("short-response-question");

//   const MCQuestionsArray= htmlCollectionToArray(MCQuestionsCollection);
//   const TFQuestionsArray= htmlCollectionToArray(TFQuestionsCollection);
//   const STQuestionsArray= htmlCollectionToArray(STQuestionsCollection);

//   console.log(MCQuestionsArray[0].id)
//   console.log(TFQuestionsArray[0].id)
//   console.log(STQuestionsArray[0].id)

//   ScormProcessSetValue("cmi.interactions.n.id","");
  
// }
// setInteractionTypes()