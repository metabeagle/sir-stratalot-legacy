window.addEventListener("load", function(){
  window.cookieconsent.initialise({
    palette: {
      popup: {
        background: '#e63946',
        text: '#ffffff'
      },
      button: {
        background: '#a8dadc',
        text: '#1d3557'
      }
    },
    theme: 'classic',
    type: 'opt-in',
    // elements: {
    //  messageLink: '<span id="cookieconsent:desc" class="cc-message">{{message}} <a aria-label="learn more about cookies" tabindex="0" class="cc-link" href="{{href}}" target="_self">{{link}}</a></span>'
    // },
    elements: {
            header: '<span class="cc-header">{{header}}</span>&nbsp;',
            message: '<span id="cookieconsent:desc" class="cc-message">{{message}}</span>',
            messagelink: '<span id="cookieconsent:desc" class="cc-message">{{message}} <a aria-label="learn more about cookies" tabindex="0" class="cc-link" href="{{href}}" target="_self">{{link}}</a></span>',
            dismiss: '<a aria-label="dismiss cookie message" tabindex="0" class="cc-btn cc-dismiss">{{dismiss}}</a>',
            allow: '<a aria-label="allow cookies" tabindex="0" class="cc-btn cc-allow">{{allow}}</a>',
            deny: '<a aria-label="deny cookies" tabindex="0" class="cc-btn cc-deny">{{deny}}</a>',
            link: '<a aria-label="learn more about cookies" tabindex="0" class="cc-link" href="{{href}}" target="_blank">{{link}}</a>',
            close: '<span aria-label="dismiss cookie message" tabindex="0" class="cc-close">{{close}}</span>'
    },
    content: {
      message: 'Sir Stratalot uses cookies to make this site work good, and understand how people use the site so we can make it even more good.',
      href: '/cookies'
    },
    cookie: {
      domain: '.sirstratalot.com'
    }
})});