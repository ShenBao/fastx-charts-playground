import React, { useContext, useEffect, useMemo, useState } from "react";
import { Button, Form, Select, Tag, App } from "antd";

import { chartOptions } from "../constants";
import { FastXChartsPlaygroundContext } from "../context";
import { IFastXChartsPlaygroundContext } from "../context/type";
import { compileCode } from "../utils";

const HeaderConfig: React.FC = () => {
  const { modal } = App.useApp();

  const [form] = Form.useForm();

  const { state, setState } = useContext(FastXChartsPlaygroundContext);

  const [versionMapOptions, setVersionMapOptions] = useState<{
    [key: string]: string[];
  }>({});

  useEffect(() => {
    const init = async () => {
      const res = await fetch("./lib/versions/index.json");
      const data = await res?.json();
      setVersionMapOptions(data || {});
    };
    init();
  }, []);

  const viewVersionOptions = useMemo(() => {
    if (state?.chartName) {
      return versionMapOptions[state?.chartName]?.map((it) => {
        return {
          value: it,
          label: it,
        };
      });
    }
    return [];
  }, [versionMapOptions, state.chartName]);

  useEffect(() => {
    const values = {
      chartName: state.chartName,
      chartVersion: state.chartVersion,
      renderType: state.renderType || "sandbox",
    };
    form.setFieldsValue(values);
  }, [form, state]);

  const handleValuesChange = (
    changedValues: IFastXChartsPlaygroundContext
    // allValues: IFastXChartsPlaygroundContext
  ) => {
    // console.log("allValues:", allValues);

    const isNameChanged = Object.keys(changedValues)?.includes("chartName");

    if (isNameChanged) {
      if (changedValues.chartName === "user_custom") {
        return setState({
          ...state,
          ...changedValues,
          chartVersion: null,
        });
      }
      const version = versionMapOptions[changedValues.chartName]?.[0];
      return setState({
        ...state,
        ...changedValues,
        chartVersion: version,
        scripts: [],
      });
    }

    setState({
      ...state,
      ...changedValues,
    });
  };

  const handleUseCurrentChartExample = () => {
    const config = {
      title: "提示",
      content: <>查看示例将会清空已输入的代码，继续吗？</>,
      centered: true,
      onOk: () => {
        try {
          const curItem = chartOptions?.find(
            (it) => it.value === state.chartName
          );

          setState({
            chartVersion: curItem?.defaultCodeVersion,
            code: curItem?.defaultCode || "",
            compiledCode: compileCode(curItem?.defaultCode || ""),
            codeErrorInfo: "",
          });
        } catch (error) {
          console.log(error);
        }
      },
    };
    modal.confirm(config);
  };

  return (
    <Form
      form={form}
      name="chart_config"
      layout="inline"
      onValuesChange={handleValuesChange}
    >
      <Form.Item label="Chart库" name="chartName">
        <Select
          style={{ minWidth: 260 }}
          options={chartOptions}
          dropdownStyle={{
            width: 300,
          }}
        />
      </Form.Item>

      {state?.chartName !== "user_custom" ? (
        <Form.Item label="版本" name="chartVersion">
          <Select
            style={{ width: 120 }}
            showSearch
            options={viewVersionOptions}
          />
        </Form.Item>
      ) : null}

      <Form.Item label="代码格式" name="codeFormatting">
        <Tag color="blue">
          {state.chartName === "echarts" ? "option" : "完整代码"}
        </Tag>
        {/* <Select
          defaultValue="sandbox"
          style={{ width: 120 }}
          options={[
            { value: "all", label: "完整代码" },
            { value: "option", label: "option" },
          ]}
        /> */}
      </Form.Item>

      <Form.Item
        label="渲染方式"
        tooltip={{
          title: (
            <>
              <div>沙箱: 渲染交互方式会更好</div>
              <div>Iframe：渲染会更安全，原生隔离</div>
            </>
          ),
        }}
        name="renderType"
      >
        <Select
          style={{ width: 140 }}
          options={[
            { value: "sandbox", label: "沙箱(Sandbox)" },
            { value: "iframe", label: "Iframe" },
          ]}
        />
      </Form.Item>

      <Button onClick={handleUseCurrentChartExample}>
        查看当前 Chart 库示例
      </Button>
    </Form>
  );
};

export default HeaderConfig;
