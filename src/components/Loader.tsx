const Loader = () => {
  return (
    <div className="grid grow place-content-center text-center gap-5">
      <h1>Loading</h1>
      <div className="flex justify-center items-center space-x-2 spinner-container mt-30">
        <div
          className="spinner-grow inline-block w-8 h-4 bg-current rounded-full opacity-0 text-origins-blue"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <div
          className="
      spinner-grow inline-block w-8 h-4 bg-current rounded-full opacity-0
        text-origins-darker-orange
      "
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <div
          className="
      spinner-grow inline-block w-8 h-4 bg-current rounded-full opacity-0
        text-origins-light-orange
      "
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <div
          className="spinner-grow inline-block w-8 h-4 bg-current rounded-full opacity-0 text-origins-black"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <div
          className="
      spinner-grow inline-block w-8 h-4 bg-current rounded-full opacity-0
        text-origins-med-orange
      "
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <div
          className="spinner-grow inline-block w-8 h-4 bg-current rounded-full opacity-0 text-origins-dark-orange"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <div
          className="spinner-grow inline-block w-8 h-4 bg-current rounded-full opacity-0 text-origins-blue"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
