import "./../../scss/components/register/register.scss";

const Register = () => {
  return (
    <div className="Page">
      <div className="Window">
        <div className="Title">
          <h1>Huush</h1>
          <span>Nobody has to know bout' your messages</span>
          <div className="start">
            <input type="text" placeholder="phone number" />
            <button>start Huushing</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
