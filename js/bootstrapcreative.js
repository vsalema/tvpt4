document.addEventListener("DOMContentLoaded", function (event) {
  const htmlString = `
    <div class="speech-row">
      <div class="speech-img">
       <iframe src="http://www.kaltura.com/p/3253003/embedPlaykitJs/uiconf_id/55503492?iframeembed=true&entry_id=1_6jn1czy5" width="100%" height="380" frameborder="0" sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation" allowtransparency="true" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
      </div>
      
    </div>
    <div class="link-row"></div>
    
    <style>
      .speech-row {
        display: flex;
        justify-content: center;
      }
      .link-row {
        margin-bottom: 2rem;
        display: flex;
        justify-content: center;
        gap: 1rem;
        align-items: center;
      }
      .link-row a {
        text-align: center;
      }
      .speech-img {
        align-self: center;
        max-width: 100%;
        height: auto;
      }
      .speech-img img {
        border-radius: 50%;
      }
      .speech-bubble {
        max-width: 300px;
        font-family: sans-serif;
        margin: 1rem;
        padding: 1rem;
        position: relative;
        border: 2px solid #000;
        background: #fff;
        border-radius: .4em;
      }
      .speech-bubble:before,
      .speech-bubble:after {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        width: 0;
        height: 0;
        border: 20px solid transparent;
        border-right-color: #000;
        border-left: 0;
        margin-top: -20px;
        margin-left: -20px;
      }
      .speech-bubble:after {
        border-right-color: #fff;
        margin-left: -18px;
        z-index: 1;
      }
      .code-demo {
        text-align: center;
        color: #ccc;
      }
    </style>
  `;
 
  const div = document.createElement("div");
  div.innerHTML = htmlString;
  document.body.prepend(div);
 });
 