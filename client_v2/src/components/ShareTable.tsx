import React, { Key, useEffect, useState } from "react";
import { Input, Table, Button, Typography, Row, Col } from "antd";
import { coursesApiHooks } from "../redux/courses/reducer";

const ShareTable: React.FC<{ courseId: string }> = ({ courseId }) => {
  const [search, { isLoading, data: searchMembersList, reset }] =
    coursesApiHooks.useSearchMembersMutation();
  const [set, { isSuccess: successSetMember, isLoading: settingMember }] =
    coursesApiHooks.useSetMembersMutation();
  const { data: confirmMembersList, isLoading: fetchMember } =
    coursesApiHooks.useGetMembersQuery({ courseId }, { skip: !courseId });

  const [membersIds, setMembersIds] = useState<Key[]>([]);
  useEffect(() => {
    if (successSetMember) reset();
  }, [reset, successSetMember]);

  return (
    <Row gutter={24} style={{ marginTop: 20 }}>
      <Col span={12}>
        <Input.Search
          placeholder="поиск участников"
          onSearch={(query) => search({ courseId, query })}
        />
        <Table
          rowSelection={{
            type: "checkbox",
            onChange: (selectedRowKeys) => setMembersIds(selectedRowKeys),
          }}
          loading={isLoading}
          showHeader={false}
          dataSource={searchMembersList}
          pagination={false}
          columns={[
            {
              dataIndex: "name",
            },
          ]}
        />
        <Button
          type="primary"
          onClick={() =>
            membersIds.length && set({ membersArray: membersIds, courseId })
          }
          disabled={settingMember || !membersIds.length}
        >
          Установить
        </Button>
      </Col>
      <Col span={12}>
        <Table
          loading={fetchMember}
          title={() => (
            <Typography.Text style={{ textAlign: "center", display: "block" }}>
              Добавленные пользователи
            </Typography.Text>
          )}
          showHeader={false}
          dataSource={confirmMembersList}
          pagination={false}
          columns={[
            {
              dataIndex: "name",
            },
          ]}
        />
      </Col>
    </Row>
  );
};

export default ShareTable;
