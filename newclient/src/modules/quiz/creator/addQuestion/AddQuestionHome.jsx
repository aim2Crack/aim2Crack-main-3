import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft, faPenToSquare, faCopy, faGear, faCalendar } from '@fortawesome/free-solid-svg-icons';
import './AddQuestionHome.css';
import AddQuestion from './AddQuestion';

const QuestionGet = ({ questionGet, handleEditQuestion, handleDeleteQuestion }) => {
  const { question, answer, explanation, options, mark, questionLevel, questionType } = questionGet;

  return (
    <div>
      <h3>Question: {question}</h3>
      <p>Answer: {answer}</p>
      <p>Explanation: {explanation}</p>
      <p>Marks: {mark}</p>
      <p>Level: {questionLevel}</p>
      <p>Type: {questionType}</p>
      {questionType === "single" && (
        <div>
          <p>Options:</p>
          {options.map((option, index) => {
            const parsedOption = JSON.parse(option);
            const isCorrectAnswer = parsedOption.isCorrect;
            return (
              <div key={index}>
                <input
                  type="radio"
                  name={`answer-${index}`} // Use a unique name for each question
                  value={parsedOption.value}
                  checked={isCorrectAnswer} // Only the correct answer will be checked
                  disabled // Disable the radio button
                />
                <label>{parsedOption.value}</label>
              </div>
            );
          })}
        </div>
      )}
      {questionType === "multiple" && (
        <div>
          <p>Options:</p>
          {options.map((option, index) => {
            const parsedOption = JSON.parse(option);
            return (
              <div key={index}>
                <input
                  type="checkbox"
                  name={`answer-${index}`}
                  value={parsedOption.value}
                  checked={parsedOption.isCorrect}
                />
                <label>{parsedOption.value}</label>
              </div>
            );
          })}
        </div>
      )}
      {questionType === "numerical" && (
        <div>
          <p>Answer: </p>
          {/* <input type="text" name="answer" /> */}
        </div>
      )}
      <button onClick={() => handleEditQuestion(questionGet)}>Edit</button>
      <button onClick={() => handleDeleteQuestion(questionGet)}>Delete</button>
    </div>
  );
};

export const AddQuestionHome = () => {
  const [addQuestion, setAddQuestion] = useState(false);
  const [quiz, setQuiz] = useState();
  const { code } = useParams();
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [showAddQuestionButton, setShowAddQuestionButton] = useState(true);
  const [editQuestionData, setEditQuestionData] = useState(null);

  // Fetching individual quiz questions
  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:7000/quizquestion/${code}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setQuizQuestions(data.data);
        } else {
          console.error('Failed to fetch quiz questions:', response.status);
        }
      } catch (error) {
        console.error('Error fetching quiz questions:', error);
      }
    };

    fetchQuizQuestions();
  }, [code]);

  /// Fetching quiz name
  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await fetch(`http://localhost:7000/quizzes/${code}`);

        if (response.ok) {
          const data = await response.json();
          setQuiz(data.data);
        } else {
          console.error('Failed to fetch quiz details:', response.status);
        }
      } catch (error) {
        console.error('Error fetching quiz details:', error);
      }
    };

    fetchQuizDetails();
  }, [code]);

  const addQuestionHandler = () => {
    setEditQuestionData(null);
    setAddQuestion(true);
  };

  const handleCopyLink = async () => {
    const currentURL = window.location.href;

    try {
      await navigator.clipboard.writeText(currentURL);
      console.log('URL copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleEditQuestion = (question) => {
    setEditQuestionData(question);
    setAddQuestion(true);
  };

  const handleDeleteQuestion = async (question) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:7000/quizquestion/${code}/${question.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedQuestions = quizQuestions.filter((q) => q.id !== question.id);
        setQuizQuestions(updatedQuestions);
      } else {
        console.error('Failed to delete question:', response.status);
      }
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  return (
    <div className="container">
      <div className="left-button-center">
        <Link to="/createQuiz" className="go_back">
          <FontAwesomeIcon icon={faCircleArrowLeft} />
        </Link>
      </div>
      <div className="bottom-left-button">
        <Link to={'/quiz/' + `${code}` + '/addinstruction'} className="instructions">
          <FontAwesomeIcon icon={faPenToSquare} />
          <p> Add Instruction</p>
          <p className="instructive_text2">These instructions will be shown to the student before the start of the exam.</p>
        </Link>
      </div>
      <div className="center-area">
        <div className="topic-box">
          <h1 className="topic">{quiz?.quizName}</h1>
        </div>
        {!addQuestion ? (
          <div className="question_box">
            {showAddQuestionButton && (
              <div onClick={addQuestionHandler} className="add-question">
                Add Question
              </div>
            )}
          </div>
        ) : (
          <AddQuestion editQuestionData={editQuestionData} />
        )}
        {/* Display quiz questions */}
        {quizQuestions.map((questionGet) => (
          <QuestionGet
            key={questionGet.id}
            questionGet={questionGet}
            handleEditQuestion={handleEditQuestion}
            handleDeleteQuestion={handleDeleteQuestion}
          />
        ))}
      </div>
      <div className="icon-bar">
        <button className="icon-bar-menu icon-1" onClick={handleCopyLink}>
          <FontAwesomeIcon icon={faCopy} />
        </button>
        <div className="copy_link">Copy Link</div>
        <Link to="" className="icon-bar-menu icon-2">
          <FontAwesomeIcon icon={faGear} />
        </Link>
        <div id="settings">Setting</div>
        <Link to="" className="icon-bar-menu icon-3">
          <FontAwesomeIcon icon={faCalendar} />
        </Link>
        <div id="result">Result</div>
        <Link to={'/quiz/' + `${code}` + '/addinstruction'} className="icon-bar-menu icon-4">
          <FontAwesomeIcon icon={faPenToSquare} />
          {/* <p> Add Instruction</p> */}
          <div id="instructions"></div>
          {/* /<p className="instructive_text2">These instructions will be shown to the student before the start of the exam.</p> */}
        </Link>
      </div>
    </div>
  );
};

export default AddQuestionHome;
