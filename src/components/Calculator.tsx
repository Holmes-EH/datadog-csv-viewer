import "./calculator.css";
const Calculator = () => {
  return (
    <div className="absolute w-screen h-screen z-10 bg-slate-50/75">
      <div className="gears-container flex-grow">
        <div className="gear-rotate"></div>
        <div className="gear-rotate-left"></div>
      </div>
    </div>
  );
};

export default Calculator;
