import { IFormTest, ITests } from "../types/models";

export const Converter = (values: IFormTest, courseId: string) =>
  values.testObj.map((test) => ({
    _id: test._id,
    title: test.test_name,
    course: courseId,
    questions: test.test_list.map((question) => ({
      title: question.question_name,
      type: question.answer_type,
      answers: question.answersList.map((answer, i) => {
        const correctAnswers =
          question.answer_type === "single"
            ? question.answersList[0].singleAnswer === i
            : question.answersList[0].multipleAnswers?.includes(i);
        return {
          text: answer.valueInput,
          isCorrect: correctAnswers as boolean,
        };
      }),
    })),
  }));
