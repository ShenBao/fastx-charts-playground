import { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";

const ScriptsModal = ({
  open,
  scripts,
  onOk,
  onCancel,
}: {
  open: boolean;
  scripts: string[];
  onOk: (list: string[]) => void;
  onCancel: () => void;
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      scripts,
    });
  }, []);

  const handleOk = async () => {
    try {
      await form.validateFields();
      const scripts = form.getFieldValue("scripts");
      onOk(scripts);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      title="第三方脚本"
      maskClosable={false}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form
        form={form}
        name="scripts__form"
        style={{
          padding: "30px 0 10px",
        }}
      >
        <Form.List name="scripts">
          {(fields, { add, remove }) => (
            <div className="scripts-list">
              {fields.map((field, index) => (
                <div key={field.key}>
                  <Form.Item
                    {...field}
                    key={field.key}
                    label={`脚本${index + 1}`}
                  >
                    <div>
                      <Form.Item
                        {...field}
                        key={field.key}
                        validateTrigger={["onChange", "onBlur"]}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: "请输入脚本地址",
                          },
                        ]}
                        noStyle
                      >
                        <Input
                          placeholder="请输入脚本地址"
                          style={{ width: "92%" }}
                        />
                      </Form.Item>
                      <MinusCircleOutlined
                        className="delete-button"
                        onClick={() => remove(field.name)}
                      />
                    </div>
                  </Form.Item>
                </div>
              ))}
              <Form.Item className="add-script">
                <Button type="dashed" onClick={() => add()} block>
                  新增脚本
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default ScriptsModal;
