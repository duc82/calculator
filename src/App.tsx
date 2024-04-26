import { useEffect, useRef, useState } from "react";

const App = () => {
  const [calculations, setCalculations] = useState<string>("");
  const [result, setResult] = useState<string>("0");
  const [isHaveResult, setIsHaveResult] = useState(false);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const content = e.currentTarget.textContent ?? "";
    const id = e.currentTarget.id;
    const isPrevOperator =
      result === "+" || result === "-" || result === "x" || result === "÷";

    // AC
    if (id === "clear") {
      setCalculations("");
      setResult("0");
      return;
    }

    // Remove
    if (id === "remove") {
      setCalculations((prev) => prev.slice(0, -1));
      setResult((prev) => (!prev.slice(0, -1) ? "0" : prev.slice(0, -1)));

      return;
    }

    // .
    if (id === "decimal") {
      if (!result.includes(".")) {
        setCalculations(
          (prev) => prev + (isPrevOperator || !prev ? "0." : ".")
        );
        setResult((prev) => (isPrevOperator || !prev ? "0." : prev + "."));
      }
      return;
    }

    // + - x /
    if (
      id === "add" ||
      id === "subtract" ||
      id === "multiply" ||
      id === "divide"
    ) {
      setResult(content);

      if (!calculations) {
        setCalculations(content);
        return;
      }

      if (isHaveResult) {
        setCalculations(result + content);
        setIsHaveResult(false);
        return;
      }

      const lastCalculation = calculations[calculations.length - 1];

      if ((!isNaN(+result) || content === "-") && lastCalculation !== ".") {
        if (lastCalculation === "-") return;

        setCalculations((prev) => prev + content);
      } else {
        const startIndexNaN = calculations
          .split("")
          .findIndex((s) => isNaN(+s));
        setCalculations((prev) => prev.slice(0, startIndexNaN) + content);
      }

      return;
    }

    // =
    if (id === "equals") {
      if (!calculations) return;

      const lastCalculations = calculations[calculations.length - 1];

      if (lastCalculations === ".") {
        setCalculations((prev) => prev.slice(0, -1));
      }

      const newCalculations = calculations
        .replace(/x/g, "*")
        .replace(/÷/g, "/");

      const result = eval(newCalculations);
      setCalculations((prev) => prev + `=${result}`);
      setResult(result.toString());
      setIsHaveResult(true);
      return;
    }

    // number
    if (isHaveResult) {
      setCalculations(content);
      setResult(content);
      setIsHaveResult(false);
      return;
    }

    setCalculations((prev) => (prev === "0" ? "0" : prev + content));
    if (!calculations || isPrevOperator) {
      setResult(content);
      return;
    }
    setResult((prev) => (prev === "0" ? "0" : prev + content));
  };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (!bodyRef.current) return;
      const key = e.key;
      const body = bodyRef.current;

      const buttons = [...body.childNodes] as HTMLButtonElement[];

      if (key === "Delete" || key === "Escape") {
        buttons.find((button) => button.id === "clear")?.click();
      } else if (key === "Backspace") {
        buttons.find((button) => button.id === "remove")?.click();
      } else if (key === "/") {
        buttons.find((button) => button.id === "divide")?.click();
      } else if (key === "x") {
        buttons.find((button) => button.id === "multiply")?.click();
      } else if (key === "Enter") {
        buttons.find((button) => button.id === "equals")?.click();
      } else {
        buttons.find((button) => button.textContent === key)?.click();
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  return (
    <div className="container">
      <div id="calculator">
        <div className="header">
          <p className="above">{calculations}</p>
          <p className="below" id="display">
            {result}
          </p>
        </div>
        <div className="body" ref={bodyRef}>
          <button type="button" onClick={handleClick} id="clear">
            AC
          </button>
          <button type="button" onClick={handleClick} id="remove">
            ←
          </button>
          <button
            type="button"
            onClick={handleClick}
            id="divide"
            className="operator"
          >
            ÷
          </button>
          <button
            type="button"
            onClick={handleClick}
            id="multiply"
            className="operator"
          >
            x
          </button>
          <button type="button" onClick={handleClick} id="seven">
            7
          </button>
          <button type="button" onClick={handleClick} id="eight">
            8
          </button>
          <button type="button" onClick={handleClick} id="nine">
            9
          </button>
          <button
            type="button"
            onClick={handleClick}
            id="subtract"
            className="operator"
          >
            -
          </button>
          <button type="button" onClick={handleClick} id="four">
            4
          </button>
          <button type="button" onClick={handleClick} id="five">
            5
          </button>
          <button type="button" onClick={handleClick} id="six">
            6
          </button>
          <button
            type="button"
            onClick={handleClick}
            id="add"
            className="operator"
          >
            +
          </button>
          <button type="button" onClick={handleClick} id="one">
            1
          </button>
          <button type="button" onClick={handleClick} id="two">
            2
          </button>
          <button type="button" onClick={handleClick} id="three">
            3
          </button>
          <button type="button" onClick={handleClick} id="equals">
            =
          </button>
          <button type="button" onClick={handleClick} id="zero">
            0
          </button>
          <button type="button" onClick={handleClick} id="decimal">
            .
          </button>
        </div>
      </div>

      <div className="copyright">
        <p>Designer and Coded By</p>
        <a href="https://github.com/duc82">Duc Dang</a>
      </div>
    </div>
  );
};

export default App;
