import './Main.css';
import React, { useEffect } from 'react';

const Main = () => {
  const w3Close = () => {
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("myOverlay").style.display = "none";
    console.log("Close sidebar");
  };

  const w3Open = () => {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("myOverlay").style.display = "block";
    console.log("Open sidebar");
  };

  const myAccFunc = () => {
    var x = document.getElementById("demoAcc");
    if (x.className.indexOf("w3-show") === -1) {
      x.className += " w3-show";
    } else {
      x.className = x.className.replace(" w3-show", "");
    }
  };

  const handleButtonClick = () => {
    window.location.href = '/login';
  };

  useEffect(() => {
    const myBtn = document.getElementById("myBtn");
    if (myBtn) {
      myBtn.click();
    }
  }, []);

  return (
    <>
      <nav
        className="w3-sidebar w3-bar-block w3-white w3-collapse w3-top"
        style={{ zIndex: 3, width: '250px' }}
        id="mySidebar"
      >
        <div className="w3-container w3-display-container w3-padding-16">
          <i
            onClick={w3Close}
            className="fa fa-remove w3-hide-large w3-button w3-display-topright"
          ></i>
          <img src="./logo.jpg" alt="Logo" height="100px" width="100px" />
          <h3 className="w3-wide"><b>THE SHOLA TRUST</b></h3>
        </div>

        <div
          className="w3-padding-64 w3-large w3-text-grey"
          style={{ fontWeight: 'bold' }}
        >
          <button id="login_btn" onClick={handleButtonClick}>Login as Admin</button>
          <a href="/" className="w3-bar-item w3-button">Home</a>
          <a href="https://www.thesholatrust.org/" className="w3-bar-item w3-button">Sholas</a>
          <a href="/form" className="w3-bar-item w3-button">Entry Form</a>
          
        </div>
      </nav>

      <header className="w3-bar w3-top w3-hide-large w3-black w3-xlarge">
        <div className="w3-bar-item w3-padding-24 w3-wide">The Shola Trust</div>
        <a
          href="javascript:void(0)"
          className="w3-bar-item w3-button w3-padding-24 w3-right"
          onClick={w3Open}
        >
          <i className="fa fa-bars"></i>
        </a>
      </header>

      <div
        className="w3-overlay w3-hide-large"
        onClick={w3Close}
        style={{ cursor: 'pointer' }}
        title="close side menu"
        id="myOverlay"
      ></div>

      <div className="w3-main" style={{ marginLeft: '250px' }}>
        <div className="w3-hide-large" style={{ marginTop: '83px' }}></div>

        <header className="w3-container w3-xlarge">
          <p className="w3-left">The Shola Trust</p>
          <p className="w3-right"></p>
        </header>

        <div className="w3-display-container w3-container">
          <img id="body_img" src="./img3.jpg" alt="image" />
          <div
            className="w3-display-topleft w3-text-white"
            style={{ padding: '24px 48px' }}
          >
            <h1 className="w3-jumbo w3-hide-small">The Lantana Project</h1>
            <h1 className="w3-hide-small">Elephants</h1>
            <p></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;

