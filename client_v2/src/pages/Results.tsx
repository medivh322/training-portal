import { useSearchParams } from "react-router-dom";
import { coursesApiHooks } from "../redux/courses/reducer";
import { IResultTest, IResultTestGroup } from "../types/models";
import { Card, Checkbox, Collapse, Flex, Radio } from "antd";
import { useCallback, useEffect, useMemo } from "react";
import { v4 } from "uuid";
import { selectRole } from "../redux/core/selectors";
import { useAppSelector } from "../redux/store";

const Results = () => {
  const [searchParams] = useSearchParams();

  const courseId = searchParams.get("course");
  const studentId = searchParams.get("user");

  const role = useAppSelector(selectRole);

  const { data: resultList = [] } = coursesApiHooks.useGetAllResultsQuery<{
    data: IResultTest[] | IResultTestGroup[];
  }>(
    { courseId, studentId, teacherMode: role === "Teacher" },
    {
      skip: !courseId && !studentId && !role,
    }
  );

  const createFormResult = useCallback(
    (data: IResultTest | IResultTestGroup) => {
      if (role === "Teacher") {
        return (
          <Collapse
            items={(data as IResultTestGroup).results.map((group) => ({
              key: group._id,
              label: group.student,
              children: (
                <>
                  {group.questions.map((question, i) => (
                    <Card
                      key={question._id}
                      title={question.title}
                      bodyStyle={{
                        padding: 0,
                      }}
                    >
                      <Flex vertical>
                        {question.type === "single" ? (
                          <>
                            {question.answers.map((answer, i) => (
                              <div
                                style={{
                                  padding: "15px",
                                  background: answer.isCorrect
                                    ? "#C0FFC0"
                                    : "#FFC0C0",
                                }}
                              >
                                <Radio
                                  checked={answer.isChoose}
                                  key={answer._id}
                                  value={i}
                                >
                                  {answer.text}
                                </Radio>
                              </div>
                            ))}
                          </>
                        ) : (
                          <>
                            {question.answers.map((answer, i) => (
                              <div
                                style={{
                                  padding: "15px",
                                  background: answer.isCorrect
                                    ? "#C0FFC0"
                                    : "#FFC0C0",
                                }}
                              >
                                <Checkbox
                                  checked={answer.isChoose}
                                  key={answer._id}
                                  value={i}
                                >
                                  {answer.text}
                                </Checkbox>
                              </div>
                            ))}
                          </>
                        )}
                      </Flex>
                    </Card>
                  ))}
                </>
              ),
            }))}
          />
        );
      }
      return (
        <div>
          {(data as IResultTest).questions.map((question, i) => (
            <Card
              key={question._id}
              title={question.title}
              bodyStyle={{
                padding: 0,
              }}
            >
              <Flex vertical>
                {question.type === "single" ? (
                  <>
                    {question.answers.map((answer, i) => (
                      <div
                        style={{
                          padding: "15px",
                          background: answer.isChoose
                            ? answer.isCorrect
                              ? "#C0FFC0"
                              : "#FFC0C0"
                            : "none",
                        }}
                      >
                        <Radio
                          checked={answer.isChoose}
                          key={answer._id}
                          value={i}
                        >
                          {answer.text}
                        </Radio>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {question.answers.map((answer, i) => (
                      <div
                        style={{
                          padding: "15px",
                          background: answer.isChoose
                            ? answer.isCorrect
                              ? "#C0FFC0"
                              : "#FFC0C0"
                            : "none",
                        }}
                      >
                        <Checkbox
                          checked={answer.isChoose}
                          key={answer._id}
                          value={i}
                        >
                          {answer.text}
                        </Checkbox>
                      </div>
                    ))}
                  </>
                )}
              </Flex>
            </Card>
          ))}
        </div>
      );
    },
    [role]
  );

  const items = useMemo(
    () =>
      role === "Teacher"
        ? (resultList as IResultTestGroup[]).map((test) => ({
            key: v4(),
            label: test.title,
            children: createFormResult(test),
          }))
        : (resultList as IResultTest[]).map((test) => ({
            key: test._id,
            label: test.title,
            children: createFormResult(test),
          })),
    [createFormResult, resultList, role]
  );

  if (!resultList.length) return <div>результаты не найдены</div>;

  return <Collapse items={items} defaultActiveKey={["1"]} />;
};

export default Results;
