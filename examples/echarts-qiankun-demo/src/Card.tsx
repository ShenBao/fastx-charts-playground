import { useEffect, useRef } from "react";
import { loadMicroApp, MicroApp } from "qiankun";

const Card = ({ id }: { id: number }) => {
  console.log(id);

  const domRef = useRef<HTMLDivElement>(null);
  const microAppRef = useRef<MicroApp>(null);

  useEffect(() => {
    if (domRef.current)
      microAppRef.current = loadMicroApp({
        name: "app1" + id,
        entry: `http://192.168.1.9:8089/test${id}.html`,
        container: domRef.current,
      });
  }, []);

  return (
    <div
      style={{
        display: "inline-block",
        width: 600,
        height: 400,
      }}
      className="card-wrapper"
    >
      <div ref={domRef} style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
};

export default Card;
